import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  Eye,
  Check,
  X as XIcon,
  Download,
  Filter,
  MessageSquare,
  Clock,
  Truck,
  PackageCheck,
  Ban,
  ShoppingCart,
  CircleCheck,
  Star,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '../../context/ToastContext';
import {
  ORDER_STATUS_FLOW,
  canTransition,
  formatOrderStamp,
  formatOrderStatus,
  getOrderStatusSteps,
  getStatusClasses,
  hasOrderRating,
} from '../../data/orders';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProductStatCard } from './dashboard/ProductStatCard';
import { patchAdminOrderStatus } from '../../services/adminService';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function normalizeAdminOrder(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const first = items[0] || {};
  const names = items.map((item) => item.name).filter(Boolean);
  const productName =
    names.length > 1 ? names.join(', ') : first.name || order.product?.name || '';
  const customer = order.customer || {};
  const payment = order.payment || {};

  return {
    ...order,
    total: order.totals?.total ?? order.total ?? 0,
      product: {
      id: first.productId ?? order.product?.id ?? '',
      name: productName,
      price: first.unitPrice ?? order.product?.price ?? 0,
      quantity: first.quantity ?? order.quantity ?? 1,
      image: first.image || order.product?.image || '',
    },
      customer: {
      ...customer,
      id: customer.id || '',
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      location: customer.location || '',
      avatar: customer.avatar || '',
      },
      payment: {
      ...payment,
      bank: payment.bank || '',
      screenshot: payment.screenshot || '',
      reference: payment.reference || '',
    },
  };
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function OrdersManagement({
  onMessageCustomer,
  orders,
  onOrdersChange,
  initialStatus = 'all',
}) {
  const { showToast } = useToast();
  const setOrders = onOrdersChange;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialStatus || 'all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [confirm, setConfirm] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setFilterStatus(initialStatus || 'all');
  }, [initialStatus]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const approved = orders.filter((o) => o.status === 'approved').length;
    const shipped = orders.filter((o) => o.status === 'shipped').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const completed = orders.filter((o) => o.status === 'completed').length;
    const rejected = orders.filter((o) => o.status === 'rejected').length;
    const revenue = orders
      .filter((o) => o.status !== 'rejected')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      total,
      pending,
      approved,
      shipped,
      delivered,
      completed,
      rejected,
      revenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = orders.filter((order) => {
    const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        (order.customer?.name || '').toLowerCase().includes(query) ||
        (order.customer?.email || '').toLowerCase().includes(query) ||
        (order.customer?.phone || '').toLowerCase().includes(query) ||
        (order.product?.name || '').toLowerCase().includes(query) ||
        (order.payment?.bank || '').toLowerCase().includes(query) ||
        (order.payment?.reference || '').toLowerCase().includes(query);

      const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return String(a.date || '').localeCompare(String(b.date || ''));
        case 'total-asc':
          return a.total - b.total;
        case 'total-desc':
          return b.total - a.total;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date-desc':
        default:
          return String(b.date || '').localeCompare(String(a.date || ''));
      }
    });

    return list;
  }, [orders, searchQuery, filterStatus, sortBy]);

  const applyOrder = (next) => {
    const normalized = normalizeAdminOrder(next);
    setOrders((prev) =>
      prev.map((item) =>
        String(item.id) === String(normalized.id) ? normalized : item
      )
    );
    setSelectedOrder((current) =>
      current && String(current.id) === String(normalized.id) ? normalized : current
    );
    return normalized;
  };

  const updateOrderStatus = async (orderId, nextStatus, successToast) => {
    const current = orders.find((item) => item.id === orderId);
    if (!current || !canTransition(current.status, nextStatus)) return;

    try {
      const saved = await patchAdminOrderStatus(orderId, nextStatus);
      applyOrder(saved);
      if (successToast) showToast(successToast);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Status update failed',
        message: err.message || 'Please try again.',
      });
    } finally {
      setConfirm(null);
    }
  };

  const handleApprove = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setConfirm({
      title: 'Approve order?',
      message: `Approve ${orderId} for ${order?.customer?.name || 'this customer'}? Payment will be marked as verified.`,
      confirmLabel: 'Approve',
      onConfirm: () =>
        updateOrderStatus(orderId, 'approved', {
          type: 'success',
          title: 'Order approved',
          message: `${orderId} for ${order?.customer?.name || 'customer'} was approved.`,
        }),
    });
  };

  const handleReject = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setConfirm({
      title: 'Reject order?',
      message: `Reject ${orderId}? The customer will need to place a new order or resubmit payment.`,
      confirmLabel: 'Reject',
      onConfirm: () =>
        updateOrderStatus(orderId, 'rejected', {
          type: 'success',
          title: 'Order rejected',
          message: `${orderId} for ${order?.customer?.name || 'customer'} was rejected.`,
        }),
    });
  };

  const handleShip = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setConfirm({
      title: 'Mark as shipped?',
      message: `Mark ${orderId} as shipped to ${order?.customer?.name || 'the customer'}?`,
      confirmLabel: 'Mark shipped',
      onConfirm: () =>
        updateOrderStatus(orderId, 'shipped', {
          type: 'success',
          title: 'Order marked as shipped',
          message: `${orderId} for ${order?.customer?.name || 'customer'} is now shipped.`,
        }),
    });
  };

  const handleDeliver = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !canTransition(order.status, 'delivered')) return;
    setConfirm({
      title: 'Confirm delivery?',
      message: `Confirm that ${orderId} reached ${order?.customer?.name || 'the customer'}?`,
      confirmLabel: 'Confirm',
      onConfirm: () =>
        updateOrderStatus(orderId, 'delivered', {
          type: 'success',
          title: 'Destination confirmed',
          message: `${orderId} is marked as delivered. Waiting for the customer to accept.`,
        }),
    });
  };

  const handleMessageCustomer = () => {
    if (!selectedOrder || !onMessageCustomer) return;
    onMessageCustomer({
      customerId: selectedOrder.customer.id,
      customerName: selectedOrder.customer.name,
      customerEmail: selectedOrder.customer.email,
      customerAvatar: selectedOrder.customer.avatar,
      orderId: selectedOrder.id,
      productId: selectedOrder.product.id,
      productName: selectedOrder.product.name,
      productPrice: selectedOrder.product.price,
      productImage: selectedOrder.product.image,
    });
    setSelectedOrder(null);
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      showToast({
        type: 'success',
        title: 'Nothing to export',
        message: 'No orders match the current search or filter.',
      });
      return;
    }

    const rows = filteredOrders.map((order) => ({
      'Order ID': order.id,
      Date: order.date,
      'Last Updated': order.updatedAt || order.date,
      Status: order.status,
      'Customer Name': order.customer.name,
      'Customer Email': order.customer.email,
      'Customer Phone': order.customer.phone,
      'Delivery Location': order.customer.location,
      Product: order.product.name,
      'Unit Price': order.product.price,
      Quantity: order.product.quantity,
      Total: order.total,
      'Payment Bank': order.payment.bank,
      'Payment Reference': order.payment.reference || '',
      'Destination Confirmed': order.destinationConfirmedAt || '',
      'Customer Received': order.customerReceivedAt || '',
      Rating: order.rating || '',
      Review: order.review || '',
      Notes: order.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 12 },
      { wch: 18 },
      { wch: 24 },
      { wch: 16 },
      { wch: 28 },
      { wch: 20 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 18 },
      { wch: 16 },
      { wch: 20 },
      { wch: 18 },
      { wch: 8 },
      { wch: 28 },
      { wch: 32 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    const stamp = todayStamp();
    const filename = `shewacraft-orders-${stamp}.xls`;
    XLSX.writeFile(workbook, filename, { bookType: 'xls' });

    showToast({
      type: 'success',
      title: 'Export ready',
      message: `Downloaded ${filteredOrders.length} order${
        filteredOrders.length === 1 ? '' : 's'
      } as ${filename}.`,
    });
  };

  const statusSteps = selectedOrder
    ? getOrderStatusSteps(selectedOrder.status)
    : ORDER_STATUS_FLOW;

  const entrance = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <MotionDiv
      className="lg:pt-0 pt-16"
      {...entrance}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
  <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">
              Review payments, fulfill orders, and follow delivery progress
            </p>
      </div>
          <button
            type="button"
            onClick={handleExport}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
          >
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>
    </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <ProductStatCard
            label="Total orders"
            value={stats.total}
            icon={ShoppingCart}
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          />
          <ProductStatCard
            label="Pending"
            value={stats.pending}
            icon={Clock}
            active={filterStatus === 'pending'}
            onClick={() => setFilterStatus('pending')}
          />
          <ProductStatCard
            label="Approved"
            value={stats.approved}
            active={filterStatus === 'approved'}
            onClick={() => setFilterStatus('approved')}
          />
          <ProductStatCard
            label="Shipped"
            value={stats.shipped}
            icon={Truck}
            active={filterStatus === 'shipped'}
            onClick={() => setFilterStatus('shipped')}
          />
          <ProductStatCard
            label="Delivered"
            value={stats.delivered}
            icon={PackageCheck}
            active={filterStatus === 'delivered'}
            onClick={() => setFilterStatus('delivered')}
          />
          <ProductStatCard
            label="Completed"
            value={stats.completed}
            icon={CircleCheck}
            active={filterStatus === 'completed'}
            onClick={() => setFilterStatus('completed')}
          />
          <ProductStatCard
            label="Active revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            active={filterStatus === 'rejected'}
            className="col-span-2 xl:col-span-1"
          >
            {stats.rejected > 0 ? (
              <button
                type="button"
                onClick={() => setFilterStatus('rejected')}
                className={`mt-1 text-xs text-rose-700 inline-flex items-center gap-1 hover:text-rose-800 transition duration-200 ${focusRing}`}
              >
                <Ban className="w-3.5 h-3.5" aria-hidden />
                {stats.rejected} rejected
              </button>
            ) : null}
          </ProductStatCard>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
            <Filter className="w-4 h-4" />
            Search & filters
  </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
                type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID, customer, product, bank, or reference..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search orders"
          />
        </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by status"
          >
              <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Sort orders"
            >
              <option value="date-desc">Sort: Newest first</option>
              <option value="date-asc">Sort: Oldest first</option>
              <option value="total-desc">Sort: Total high–low</option>
              <option value="total-asc">Sort: Total low–high</option>
              <option value="status">Sort: Status</option>
            </select>
        </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="text-gray-900 font-medium">
                {filteredOrders.length}
              </span>{' '}
              of {orders.length} orders
            </p>
            {(filterStatus !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
                className={`text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2 transition duration-200 ${focusRing}`}
              >
                Clear filters
              </button>
            )}
      </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">No orders found</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Try a different search term or clear the status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
                className={`mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
              >
                Clear filters
              </button>
    </div>
          ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
                <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.payment.reference || order.payment.bank}
                        </p>
                </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={order.customer.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {order.customer.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {order.customer.email}
                            </p>
                          </div>
                        </div>
                </td>
                <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={order.product.image}
                            alt=""
                            className="w-12 h-12 object-cover border border-gray-200 rounded-md shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-900 truncate">
                              {order.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty {order.product.quantity}
                            </p>
                    </div>
                  </div>
                </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums">
                        ${Number(order.total).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs border rounded-sm ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {formatOrderStatus(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                          type="button"
                    onClick={() => setSelectedOrder(order)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200 ${focusRing}`}
                          aria-label={`View order ${order.id}`}
                  >
                          <Eye className="w-4 h-4" />
                          View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          )}
        </section>
  </div>

  {selectedOrder && (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full my-8 max-h-[92vh] overflow-y-auto border border-gray-200 rounded-xl">
            <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl text-gray-900">
                  Order {selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Placed {selectedOrder.date}
                  {selectedOrder.updatedAt &&
                    selectedOrder.updatedAt !== selectedOrder.date &&
                    ` · Updated ${selectedOrder.updatedAt}`}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)}>
            <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Fulfillment progress
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusSteps.map((step) => {
                    const active = selectedOrder.status === step;
                    const passed =
                      selectedOrder.status !== 'rejected' &&
                      ORDER_STATUS_FLOW.indexOf(selectedOrder.status) >
                        ORDER_STATUS_FLOW.indexOf(step);
                    return (
                      <span
                        key={step}
                        className={`px-3 py-1.5 text-xs border rounded-sm capitalize ${
                          active
                            ? getStatusClasses(step)
                            : passed
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        {step}
                      </span>
                    );
                  })}
                </div>
              </div>

              {['shipped', 'delivered', 'completed'].includes(
                selectedOrder.status
              ) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Destination check
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
                    {selectedOrder.status === 'shipped' && (
                      <p className="text-gray-700">
                        Awaiting destination confirmation. Confirm when the
                        shipment has reached the customer.
                      </p>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <>
                        <p className="text-gray-900 font-medium">
                          Reached destination
                          {selectedOrder.destinationConfirmedAt
                            ? ` · ${formatOrderStamp(selectedOrder.destinationConfirmedAt)}`
                            : ''}
                        </p>
                        <p className="text-gray-600">
                          Awaiting customer acceptance.
                        </p>
                      </>
                    )}
                    {selectedOrder.status === 'completed' && (
                      <>
                        <p className="text-gray-900 font-medium">
                          Customer accepted
                          {selectedOrder.customerReceivedAt
                            ? ` · ${formatOrderStamp(selectedOrder.customerReceivedAt)}`
                            : ''}
                        </p>
                        {selectedOrder.destinationConfirmedAt && (
                          <p className="text-gray-600">
                            Destination confirmed{' '}
                            {formatOrderStamp(selectedOrder.destinationConfirmedAt)}
                          </p>
                        )}
                        {hasOrderRating(selectedOrder) ? (
                          <div className="pt-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= selectedOrder.rating
                                      ? 'fill-gray-900 text-gray-900'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-gray-700 ml-1">
                                {selectedOrder.rating}/5
                              </span>
                            </div>
                            {selectedOrder.review ? (
                              <p className="text-gray-700 mt-1">
                                {selectedOrder.review}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            Customer has not rated this product yet.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

          <div>
                <h3 className="text-lg text-gray-900 mb-3">Customer</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedOrder.customer.avatar}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    />
                    <div className="space-y-1 text-sm min-w-0">
                      <p className="text-base font-medium text-gray-900">
                        {selectedOrder.customer.name}
                      </p>
                      <p className="text-gray-600">
                        ID: {selectedOrder.customer.id}
                      </p>
                      <p className="text-gray-600">{selectedOrder.customer.email}</p>
                      <p className="text-gray-600">{selectedOrder.customer.phone}</p>
                      <p className="text-gray-600">
                        {selectedOrder.customer.location}
                      </p>
                    </div>
                  </div>
            </div>
          </div>

          <div>
                <h3 className="text-lg text-gray-900 mb-3">Product</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={selectedOrder.product.image}
                    alt={selectedOrder.product.name}
                      className="w-full sm:w-40 h-36 object-cover border border-gray-200 rounded-md"
                    />
                    <div className="space-y-2 text-sm">
                      <p className="text-base font-medium text-gray-900">
                        {selectedOrder.product.name}
                      </p>
                      <p className="text-gray-600">
                        Unit price: $
                        {Number(selectedOrder.product.price).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        Quantity: {selectedOrder.product.quantity}
                      </p>
                      <p className="text-lg text-gray-900">
                        Total: ${Number(selectedOrder.total).toLocaleString()}
                      </p>
                    </div>
                </div>
              </div>
          </div>

              <div>
                <h3 className="text-lg text-gray-900 mb-3">Payment</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p>
                      <span className="font-medium text-gray-900">Bank:</span>{' '}
                      <span className="text-gray-600">
                        {selectedOrder.payment.bank}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Reference:</span>{' '}
                      <span className="text-gray-600">
                        {selectedOrder.payment.reference || '—'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Payment proof
                    </p>
                <img 
                  src={selectedOrder.payment.screenshot} 
                  alt="Payment proof" 
                      className="w-full max-w-md border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

              {selectedOrder.notes && (
          <div>
                  <h3 className="text-lg text-gray-900 mb-3">Internal notes</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                    {selectedOrder.notes}
          </div>
        </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handleMessageCustomer}
                className="flex items-center gap-2 px-5 py-2 border border-gray-900 rounded-md text-gray-900 hover:bg-gray-50 transition"
              >
                <MessageSquare className="w-5 h-5" />
                Message customer
              </button>

          {selectedOrder.status === 'pending' && (
            <>
              <button
                    type="button"
                onClick={() => handleReject(selectedOrder.id)}
                    className="flex items-center gap-2 px-5 py-2 border border-rose-300 rounded-md text-rose-700 hover:bg-rose-50 transition"
              >
                <XIcon className="w-5 h-5" />
                Reject
              </button>
              <button
                    type="button"
                onClick={() => handleApprove(selectedOrder.id)}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
              >
                <Check className="w-5 h-5" />
                    Approve order
              </button>
            </>
          )}
          {selectedOrder.status === 'approved' && (
            <button
                  type="button"
              onClick={() => handleShip(selectedOrder.id)}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                >
                  <Truck className="w-5 h-5" />
                  Mark as shipped
                </button>
              )}
              {selectedOrder.status === 'shipped' && (
                <button
                  type="button"
                  onClick={() => handleDeliver(selectedOrder.id)}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                >
                  <PackageCheck className="w-5 h-5" />
                  Confirm destination reached
            </button>
          )}
              {(selectedOrder.status === 'delivered' ||
                selectedOrder.status === 'completed' ||
                selectedOrder.status === 'rejected') && (
            <button
                  type="button"
              onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        onCancel={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
      />
    </MotionDiv>
  );
}
