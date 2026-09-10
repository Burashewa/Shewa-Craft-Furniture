import { Order } from '../models/Order.js';
import { findOrderByParam } from './orderController.js';
import { publicOrder } from '../services/orderSerializer.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readSearch } from '../utils/readSearch.js';

const ORDER_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'shipped',
  'delivered',
  'completed',
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const USER_POPULATE = { path: 'user', select: 'avatar fullName email' };

export const listAdminOrders = asyncHandler(async (req, res) => {
  const filter = {};
  const status = String(req.query.status || '').trim().toLowerCase();
  if (status && status !== 'all' && ORDER_STATUSES.includes(status)) {
    filter.status = status;
  }

  const search = readSearch(req.query.search);
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { publicId: pattern },
      { 'customer.name': pattern },
      { 'customer.email': pattern },
      { 'items.name': pattern },
      { 'payment.bank': pattern },
      { 'payment.reference': pattern },
    ];
  }

  const rows = await Order.find(filter)
    .populate(USER_POPULATE)
    .sort({ date: -1, createdAt: -1 });

  res.json({ orders: rows.map(publicOrder) });
});

export const getAdminOrder = asyncHandler(async (req, res) => {
  const order = await findOrderByParam(req.params.id);
  await order.populate(USER_POPULATE);
  res.json({ order: publicOrder(order) });
});
