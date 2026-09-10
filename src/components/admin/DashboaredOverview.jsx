import { motion, useReducedMotion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatOrderStatus, getStatusClasses } from '../../data/orders';
import { AttentionList } from './dashboard/AttentionList';
import { OrderPipeline } from './dashboard/OrderPipeline';
import { StatCard } from './dashboard/StatCard';
import { WeeklyRevenueChart } from './dashboard/WeeklyRevenueChart';
import { deriveDashboard } from './dashboard/deriveDashboard';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function DashboardOverview({
  orders = [],
  products = [],
  customers = [],
  conversations = [],
  onNavigate,
}) {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const firstName = user?.fullName?.split(' ')[0] || 'Admin';
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const dashboard = deriveDashboard({
    orders,
    products,
    customers,
    conversations,
  });

  const go = (view, focus) => {
    if (onNavigate) onNavigate(view, focus);
  };

  const entrance = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      };

  const maxSold = Math.max(1, ...dashboard.topProducts.map((product) => product.sold));

  return (
    <MotionDiv
      className="lg:pt-0 pt-16"
      {...entrance}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
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
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 transition duration-200 ${focusRing}`}
            >
              Review orders
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => go('messages')}
              className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-800 text-sm hover:bg-gray-50 transition duration-200 ${focusRing}`}
            >
              Messages
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Revenue (30 days)"
            value={`$${dashboard.stats.revenueLast30.toLocaleString()}`}
            change={dashboard.stats.revenueChange}
            hint={
              dashboard.stats.pending
                ? `${dashboard.stats.pending} pending review`
                : 'All orders reviewed'
            }
            icon={DollarSign}
            variant="navy"
            onClick={() => go('orders')}
          />
          <StatCard
            label="Orders"
            value={String(dashboard.stats.orders)}
            change={dashboard.stats.ordersChange}
            hint={
              dashboard.stats.pending
                ? `${dashboard.stats.pending} pending review`
                : 'No pending orders'
            }
            icon={ShoppingCart}
            onClick={() => go('orders')}
          />
          <StatCard
            label="Products"
            value={String(dashboard.stats.products)}
            change={{ label: '—', trend: null }}
            hint={
              dashboard.stats.lowStock
                ? `${dashboard.stats.lowStock} low stock`
                : 'Stock levels healthy'
            }
            icon={Package}
            onClick={() => go('products')}
          />
          <StatCard
            label="Customers"
            value={String(dashboard.stats.customers)}
            change={{ label: '—', trend: null }}
            hint={
              dashboard.stats.blocked
                ? `${dashboard.stats.blocked} blocked account${
                    dashboard.stats.blocked === 1 ? '' : 's'
                  }`
                : 'No blocked accounts'
            }
            icon={Users}
            onClick={() => go('customers')}
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <WeeklyRevenueChart
            weekly={dashboard.weekly}
            peakRevenue={dashboard.peakRevenue}
            hasRevenue={dashboard.weekHasRevenue}
          />
          <OrderPipeline
            pipeline={dashboard.pipeline}
            total={dashboard.pipelineTotal}
            onSelect={(status) => go('orders', { status })}
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg text-gray-900">Needs attention</h2>
              <p className="text-sm text-gray-500">Prioritize these before other work</p>
            </div>
          </div>
          <AttentionList items={dashboard.attention} onNavigate={go} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <article className="xl:col-span-3 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900">Recent orders</h2>
                <p className="text-sm text-gray-500">Latest customer purchases</p>
              </div>
              <button
                type="button"
                onClick={() => go('orders')}
                className={`text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1 transition duration-200 ${focusRing}`}
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {dashboard.recentOrders.length === 0 ? (
              <p className="px-6 py-10 text-sm text-gray-600">No orders yet.</p>
            ) : (
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
                    {dashboard.recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/80 cursor-pointer transition duration-200"
                        onClick={() => go('orders', { status: order.status })}
                      >
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">{order.id}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {order.customer?.name || 'Customer'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {order.product?.name || '—'}
                          {Number(order.product?.quantity) > 1
                            ? ` ×${order.product.quantity}`
                            : ''}
                        </td>
                        <td className="px-6 py-4 text-gray-900 tabular-nums">
                          ${Number(order.total || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs border rounded-sm ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {formatOrderStatus(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="xl:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900">Top products</h2>
                <p className="text-sm text-gray-500">By units sold</p>
              </div>
              <button
                type="button"
                onClick={() => go('products')}
                className={`text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1 transition duration-200 ${focusRing}`}
              >
                Manage
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {dashboard.topProducts.length === 0 ? (
              <p className="px-6 py-10 text-sm text-gray-600">
                No fulfilled sales yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {dashboard.topProducts.map((product, index) => {
                  const lowStock = product.stock <= 5;
                  return (
                    <li key={`${product.id}-${product.name}`} className="px-6 py-4 flex items-start gap-3">
                      <span className="text-sm text-gray-400 w-5 tabular-nums pt-0.5">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-gray-900 font-medium truncate">
                            {product.name}
                          </p>
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
                              width: `${Math.min(100, (product.sold / maxSold) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4 text-gray-500" aria-hidden />
              Aim to restock items under 5 units before weekend demand.
            </div>
          </article>
        </section>
      </div>
    </MotionDiv>
  );
}
