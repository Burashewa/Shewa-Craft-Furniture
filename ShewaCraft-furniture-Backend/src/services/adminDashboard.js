import { Conversation } from '../models/Conversation.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { dateOnly } from './orderSerializer.js';

const PIPELINE_STEPS = [
  { status: 'pending', label: 'Pending', color: 'bg-amber-500' },
  { status: 'approved', label: 'Approved', color: 'bg-emerald-600' },
  { status: 'shipped', label: 'Shipped', color: 'bg-sky-600' },
  { status: 'delivered', label: 'Delivered', color: 'bg-violet-600' },
  { status: 'completed', label: 'Completed', color: 'bg-gray-900' },
  { status: 'rejected', label: 'Rejected', color: 'bg-rose-500' },
];

function isLowStock(product) {
  return (
    product.inStock &&
    Number(product.stockCount) > 0 &&
    Number(product.stockCount) <= 5
  );
}

function parseDate(value) {
  if (!value) return null;
  const parts = String(value).slice(0, 10).split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function dayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function latestOrderDate(orders) {
  return orders.reduce((latest, order) => {
    const date = parseDate(order.date || order.updatedAt);
    if (!date) return latest;
    return !latest || date > latest ? date : latest;
  }, null);
}

function inRange(order, start, end) {
  const date = parseDate(order.date);
  if (!date) return false;
  const time = startOfDay(date).getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function changeChip(current, previous) {
  if (previous <= 0) {
    return { label: '—', trend: null };
  }
  const pct = ((current - previous) / previous) * 100;
  if (pct === 0) {
    return { label: '0.0%', trend: null };
  }
  return {
    label: `${pct > 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`,
    trend: pct > 0 ? 'up' : 'down',
  };
}

function normalizeOrder(order) {
  const items = order.items || [];
  const first = items[0] || {};
  const names = items.map((item) => item.name).filter(Boolean);
  return {
    id: order.publicId,
    status: order.status,
    date: dateOnly(order.date) || dateOnly(order.createdAt),
    updatedAt: dateOnly(order.updatedAt),
    total: order.totals?.total ?? 0,
    product: {
      id: first.product ? String(first.product) : first.name,
      name: names.length > 1 ? names.join(', ') : first.name || 'Unknown product',
      quantity: first.quantity || 1,
    },
  };
}

export function deriveAdminDashboard({
  orders = [],
  products = [],
  customers = [],
  unread = 0,
}) {
  const paidOrders = orders.filter((order) => order.status !== 'rejected');
  const revenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );
  const pending = orders.filter((order) => order.status === 'pending').length;
  const lowStock = products.filter(isLowStock).length;
  const blocked = customers.filter(
    (customer) => customer.status === 'blocked'
  ).length;

  const anchor = startOfDay(latestOrderDate(orders) || new Date());
  const last30Start = addDays(anchor, -29);
  const prev30End = addDays(last30Start, -1);
  const prev30Start = addDays(prev30End, -29);

  const revenueLast30 = orders
    .filter((order) => order.status !== 'rejected' && inRange(order, last30Start, anchor))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const revenuePrev30 = orders
    .filter(
      (order) => order.status !== 'rejected' && inRange(order, prev30Start, prev30End)
    )
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const ordersLast30 = orders.filter((order) =>
    inRange(order, last30Start, anchor)
  ).length;
  const ordersPrev30 = orders.filter((order) =>
    inRange(order, prev30Start, prev30End)
  ).length;

  const weekly = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = addDays(anchor, -offset);
    const key = dayKey(date);
    const amount = orders
      .filter(
        (order) =>
          order.status !== 'rejected' &&
          parseDate(order.date) &&
          dayKey(parseDate(order.date)) === key
      )
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
    weekly.push({
      key,
      day: date.toLocaleDateString(undefined, { weekday: 'short' }),
      amount,
    });
  }

  const pipeline = PIPELINE_STEPS.map((step) => ({
    ...step,
    count: orders.filter((order) => order.status === step.status).length,
  }));

  const recentOrders = [...orders]
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 5);

  const salesByProduct = new Map();
  paidOrders.forEach((order) => {
    const productId = order.product?.id ?? order.product?.name;
    if (!productId) return;
    const current = salesByProduct.get(productId) || {
      id: productId,
      name: order.product?.name || 'Unknown product',
      sold: 0,
      revenue: 0,
    };
    current.sold += Number(order.product?.quantity || 1);
    current.revenue += Number(order.total || 0);
    salesByProduct.set(productId, current);
  });

  const topProducts = [...salesByProduct.values()]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4)
    .map((row) => {
      const catalog = products.find(
        (product) => String(product.id || product._id) === String(row.id) || product.name === row.name
      );
      return {
        ...row,
        stock: catalog ? Number(catalog.stockCount || 0) : 0,
      };
    });

  return {
    stats: {
      revenue,
      revenueLast30,
      orders: orders.length,
      products: products.length,
      customers: customers.length,
      pending,
      lowStock,
      blocked,
      unread,
      revenueChange: changeChip(revenueLast30, revenuePrev30),
      ordersChange: changeChip(ordersLast30, ordersPrev30),
    },
    weekly,
    weekHasRevenue: weekly.some((day) => day.amount > 0),
    peakRevenue: Math.max(0, ...weekly.map((day) => day.amount)),
    pipeline,
    pipelineTotal: orders.length,
    recentOrders,
    topProducts,
  };
}

export async function loadAdminDashboard() {
  const [orderDocs, products, customers, unread] = await Promise.all([
    Order.find().sort({ date: -1, createdAt: -1 }),
    Product.find(),
    User.find({ role: 'customer' }),
    Conversation.countDocuments({ adminUnread: true }),
  ]);

  return deriveAdminDashboard({
    orders: orderDocs.map(normalizeOrder),
    products,
    customers,
    unread,
  });
}
