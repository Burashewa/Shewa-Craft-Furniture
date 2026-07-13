import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATS = [
  {
    label: 'Revenue (30 days)',
    value: '$48,574',
    change: '+12.5%',
    trend: 'up',
    hint: 'vs previous 30 days',
    icon: DollarSign,
  },
  {
    label: 'Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    hint: '12 pending review',
    icon: ShoppingCart,
  },
  {
    label: 'Products',
    value: '48',
    change: '+2',
    trend: 'up',
    hint: '3 low stock',
    icon: Package,
  },
  {
    label: 'Customers',
    value: '1,234',
    change: '+15.3%',
    trend: 'up',
    hint: '4 blocked accounts',
    icon: Users,
  },
];

const WEEKLY_REVENUE = [
  { day: 'Mon', amount: 4200 },
  { day: 'Tue', amount: 5100 },
  { day: 'Wed', amount: 3800 },
  { day: 'Thu', amount: 6400 },
  { day: 'Fri', amount: 7200 },
  { day: 'Sat', amount: 5900 },
  { day: 'Sun', amount: 4500 },
];

const ORDER_PIPELINE = [
  { label: 'Pending', count: 12, color: 'bg-amber-500', view: 'orders' },
  { label: 'Approved', count: 28, color: 'bg-emerald-600', view: 'orders' },
  { label: 'Shipped', count: 19, color: 'bg-sky-600', view: 'orders' },
  { label: 'Delivered', count: 86, color: 'bg-violet-600', view: 'orders' },
  { label: 'Rejected', count: 11, color: 'bg-rose-500', view: 'orders' },
];

const RECENT_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    product: 'Modern Sofa',
    amount: 1299,
    status: 'pending',
    date: 'Today · 10:42 AM',
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    product: 'Dining Table Set',
    amount: 899,
    status: 'approved',
    date: 'Today · 9:15 AM',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Brown',
    product: 'Office Chair ×2',
    amount: 698,
    status: 'pending',
    date: 'Yesterday',
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    product: 'Bookshelf',
    amount: 459,
    status: 'shipped',
    date: 'Yesterday',
  },
  {
    id: 'ORD-005',
    customer: 'David Wilson',
    product: 'Coffee Table',
    amount: 299,
    status: 'delivered',
    date: 'Feb 10',
  },
];

const ATTENTION_ITEMS = [
  {
    id: 'orders',
    title: '12 orders awaiting approval',
    description: 'Payment screenshots need review before fulfillment.',
    icon: Clock,
    tone: 'amber',
    action: 'Review orders',
    view: 'orders',
  },
  {
    id: 'messages',
    title: '8 unread customer messages',
    description: 'Customers are waiting for a response.',
    icon: MessageSquare,
    tone: 'stone',
    action: 'Open messages',
    view: 'messages',
  },
  {
    id: 'stock',
    title: '3 products low on stock',
    description: 'Restock before listings sell out.',
    icon: Package,
    tone: 'rose',
    action: 'Check inventory',
    view: 'products',
  },
];

const TOP_PRODUCTS = [
  { name: 'Modern Sofa', sold: 34, revenue: 44166, stock: 8 },
  { name: 'Dining Table Set', sold: 28, revenue: 25172, stock: 5 },
  { name: 'Office Chair', sold: 41, revenue: 14309, stock: 2 },
  { name: 'Bookshelf', sold: 19, revenue: 8721, stock: 12 },
];

function statusStyles(status) {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'approved':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'shipped':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'delivered':
      return 'bg-violet-50 text-violet-800 border-violet-200';
    case 'rejected':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function toneStyles(tone) {
  switch (tone) {
    case 'amber':
      return {
        wrap: 'border-amber-200 bg-amber-50/60',
        icon: 'bg-amber-100 text-amber-800',
      };
    case 'rose':
      return {
        wrap: 'border-rose-200 bg-rose-50/60',
        icon: 'bg-rose-100 text-rose-800',
      };
    default:
      return {
        wrap: 'border-gray-200 bg-white',
        icon: 'bg-gray-100 text-gray-800',
      };
  }
}

export function DashboardOverview({ onNavigate }) {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] || 'Admin';
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const maxRevenue = Math.max(...WEEKLY_REVENUE.map((d) => d.amount));
  const pipelineTotal = ORDER_PIPELINE.reduce((sum, step) => sum + step.count, 0);

  const go = (view) => {
    if (onNavigate) onNavigate(view);
  };

  return (
    <div className="lg:pt-0 pt-16">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">{todayLabel}</p>
            <h1 className="text-3xl text-gray-900 mt-1">Welcome back, {firstName}</h1>
            <p className="text-gray-600 mt-1 max-w-xl">
              A snapshot of store health — revenue, fulfillment, and items that need attention.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => go('orders')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
            >
              Review orders
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => go('messages')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-800 text-sm hover:bg-gray-50 transition"
            >
              Messages
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === 'up';
            return (
              <article
                key={stat.label}
                className="bg-white border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 bg-gray-100 text-gray-800">
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      isUp ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" aria-hidden />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-3xl text-gray-900 tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-900">{stat.label}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.hint}</p>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <article className="xl:col-span-2 bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg text-gray-900">Weekly revenue</h2>
                <p className="text-sm text-gray-500">Last 7 days performance</p>
              </div>
              <p className="text-sm text-gray-600">
                Peak{' '}
                <span className="text-gray-900 font-medium">
                  ${Math.max(...WEEKLY_REVENUE.map((d) => d.amount)).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="p-6">
              <div
                className="flex items-end justify-between gap-3 h-44"
                role="img"
                aria-label="Bar chart of weekly revenue"
              >
                {WEEKLY_REVENUE.map((day) => {
                  const height = Math.max(12, Math.round((day.amount / maxRevenue) * 100));
                  return (
                    <div
                      key={day.day}
                      className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
                    >
                      <span className="text-[11px] text-gray-500">
                        ${(day.amount / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-full max-w-12 bg-gray-900/90 hover:bg-gray-900 transition"
                        style={{ height: `${height}%` }}
                        title={`$${day.amount.toLocaleString()}`}
                      />
                      <span className="text-xs text-gray-600">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg text-gray-900">Order pipeline</h2>
              <p className="text-sm text-gray-500">{pipelineTotal} orders in system</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex h-3 w-full overflow-hidden bg-gray-100">
                {ORDER_PIPELINE.map((step) => (
                  <div
                    key={step.label}
                    className={`${step.color}`}
                    style={{ width: `${(step.count / pipelineTotal) * 100}%` }}
                    title={`${step.label}: ${step.count}`}
                  />
                ))}
              </div>
              <ul className="space-y-3">
                {ORDER_PIPELINE.map((step) => (
                  <li key={step.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 shrink-0 ${step.color}`} />
                      <span className="text-sm text-gray-700 truncate">{step.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 tabular-nums">
                      {step.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg text-gray-900">Needs attention</h2>
              <p className="text-sm text-gray-500">Prioritize these before other work</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ATTENTION_ITEMS.map((item) => {
              const Icon = item.icon;
              const tones = toneStyles(item.tone);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.view)}
                  className={`text-left border p-5 transition hover:border-gray-400 ${tones.wrap}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${tones.icon}`}>
                      <Icon className="w-5 h-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 font-medium leading-snug">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm text-gray-900">
                        {item.action}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <article className="xl:col-span-3 bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900">Recent orders</h2>
                <p className="text-sm text-gray-500">Latest customer purchases</p>
              </div>
              <button
                type="button"
                onClick={() => go('orders')}
                className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-500">Order</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Product</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80">
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{order.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-800">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-600">{order.product}</td>
                      <td className="px-6 py-4 text-gray-900 tabular-nums">
                        ${order.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs border ${statusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="xl:col-span-2 bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900">Top products</h2>
                <p className="text-sm text-gray-500">By units sold</p>
              </div>
              <button
                type="button"
                onClick={() => go('products')}
                className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1"
              >
                Manage
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <ul className="divide-y divide-gray-100">
              {TOP_PRODUCTS.map((product, index) => {
                const lowStock = product.stock <= 5;
                return (
                  <li key={product.name} className="px-6 py-4 flex items-start gap-3">
                    <span className="text-sm text-gray-400 w-5 tabular-nums pt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-gray-900 font-medium truncate">{product.name}</p>
                        <p className="text-sm text-gray-900 tabular-nums shrink-0">
                          ${product.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                        <span>{product.sold} sold</span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            lowStock ? 'text-rose-700' : 'text-gray-500'
                          }`}
                        >
                          {lowStock ? (
                            <AlertCircle className="w-3.5 h-3.5" aria-hidden />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                          )}
                          {product.stock} in stock
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-100">
                        <div
                          className="h-full bg-gray-900"
                          style={{
                            width: `${Math.min(
                              100,
                              (product.sold /
                                Math.max(...TOP_PRODUCTS.map((p) => p.sold))) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-gray-500" aria-hidden />
              Aim to restock items under 5 units before weekend demand.
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
