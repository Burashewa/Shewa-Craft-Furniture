import { useMemo, useState } from 'react';
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
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '../../context/ToastContext';

const STATUS_FLOW = ['pending', 'approved', 'shipped', 'delivered'];

const INITIAL_ORDERS = [
  {
    id: 'ORD-001',
    customer: {
      id: 'cust-001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      location: '123 Main St, New York, NY 10001',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    product: {
      id: 1,
      name: 'Modern Sofa',
      price: 1299,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop',
    },
    payment: {
      bank: 'Bank of America',
      reference: 'TXN-884201',
      screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    },
    status: 'pending',
    date: '2024-02-10',
    updatedAt: '2024-02-10',
    notes: 'Customer asked to confirm Navy fabric before shipping.',
    total: 1299,
  },
  {
    id: 'ORD-002',
    customer: {
      id: 'cust-002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567891',
      location: '456 Oak Ave, Brooklyn, NY 11201',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    product: {
      id: 2,
      name: 'Dining Table Set',
      price: 899,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?w=200&h=200&fit=crop',
    },
    payment: {
      bank: 'Chase Bank',
      reference: 'TXN-771904',
      screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    },
    status: 'approved',
    date: '2024-02-09',
    updatedAt: '2024-02-09',
    notes: 'Payment verified. Ready for warehouse packing.',
    total: 899,
  },
  {
    id: 'ORD-003',
    customer: {
      id: 'cust-003',
      name: 'Mike Brown',
      email: 'mike@example.com',
      phone: '+1234567892',
      location: '789 Pine Rd, Queens, NY 11375',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    product: {
      id: 3,
      name: 'Office Chair',
      price: 349,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1637762646936-29b68cd6670d?w=200&h=200&fit=crop',
    },
    payment: {
      bank: 'Wells Fargo',
      reference: 'TXN-660112',
      screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    },
    status: 'pending',
    date: '2024-02-08',
    updatedAt: '2024-02-08',
    notes: 'Verify quantity — customer paid for 2 chairs.',
    total: 698,
  },
  {
    id: 'ORD-004',
    customer: {
      id: 'cust-005',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1234567894',
      location: '901 Cedar Blvd, Newark, NJ 07102',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    product: {
      id: 4,
      name: 'Bookshelf',
      price: 459,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&h=200&fit=crop',
    },
    payment: {
      bank: 'Bank transfer',
      reference: 'TXN-552830',
      screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    },
    status: 'shipped',
    date: '2024-02-06',
    updatedAt: '2024-02-07',
    notes: 'Carrier: Express Freight · tracking pending customer confirmation.',
    total: 459,
  },
  {
    id: 'ORD-005',
    customer: {
      id: 'cust-002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567891',
      location: '456 Oak Ave, Brooklyn, NY 11201',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    product: {
      id: 5,
      name: 'Coffee Table',
      price: 299,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1642657547271-722df15ce6d6?w=200&h=200&fit=crop',
    },
    payment: {
      bank: 'Chase Bank',
      reference: 'TXN-441220',
      screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    },
    status: 'delivered',
    date: '2024-02-01',
    updatedAt: '2024-02-04',
    notes: 'Delivered successfully. No issues reported.',
    total: 299,
  },
  {
    id: 'ORD-006',
    customer: {
      id: 'cust-004',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1234567893',
      location: '22 Maple Lane, Jersey City, NJ 07302',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    product: {
      id: 6,
      name: 'Side Table',
      price: 220,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=200&h=200&fit=crop',
    },
    payment: {
      bank: 'Bank of America',
      reference: 'TXN-330118',
      screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    },
    status: 'rejected',
    date: '2024-01-20',
    updatedAt: '2024-01-21',
    notes: 'Payment screenshot unclear — customer asked to resubmit.',
    total: 220,
  },
];

function statusStyles(status) {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'approved':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'rejected':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'shipped':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'delivered':
      return 'bg-violet-50 text-violet-800 border-violet-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function OrdersManagement({ onMessageCustomer }) {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const approved = orders.filter((o) => o.status === 'approved').length;
    const shipped = orders.filter((o) => o.status === 'shipped').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const rejected = orders.filter((o) => o.status === 'rejected').length;
    const revenue = orders
      .filter((o) => o.status !== 'rejected')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { total, pending, approved, shipped, delivered, rejected, revenue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query) ||
        order.customer.phone.toLowerCase().includes(query) ||
        order.product.name.toLowerCase().includes(query) ||
        order.payment.bank.toLowerCase().includes(query) ||
        (order.payment.reference || '').toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'all' || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'total-asc':
          return a.total - b.total;
        case 'total-desc':
          return b.total - a.total;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date-desc':
        default:
          return b.date.localeCompare(a.date);
      }
    });

    return list;
  }, [orders, searchQuery, filterStatus, sortBy]);

  const updateOrderStatus = (orderId, nextStatus) => {
    const stamp = todayStamp();
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? { ...item, status: nextStatus, updatedAt: stamp }
          : item
      )
    );
    setSelectedOrder((current) =>
      current?.id === orderId
        ? { ...current, status: nextStatus, updatedAt: stamp }
        : current
    );
  };

  const handleApprove = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (
      !window.confirm(
        `Approve ${orderId} for ${order?.customer?.name || 'this customer'}? Payment will be marked as verified.`
      )
    ) {
      return;
    }
    updateOrderStatus(orderId, 'approved');
    showToast({
      type: 'success',
      title: 'Order approved',
      message: `${orderId} for ${order?.customer?.name || 'customer'} was approved.`,
    });
  };

  const handleReject = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (
      !window.confirm(
        `Reject ${orderId}? The customer will need to place a new order or resubmit payment.`
      )
    ) {
      return;
    }
    updateOrderStatus(orderId, 'rejected');
    showToast({
      type: 'success',
      title: 'Order rejected',
      message: `${orderId} for ${order?.customer?.name || 'customer'} was rejected.`,
    });
  };

  const handleShip = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (
      !window.confirm(
        `Mark ${orderId} as shipped to ${order?.customer?.name || 'the customer'}?`
      )
    ) {
      return;
    }
    updateOrderStatus(orderId, 'shipped');
    showToast({
      type: 'success',
      title: 'Order marked as shipped',
      message: `${orderId} for ${order?.customer?.name || 'customer'} is now shipped.`,
    });
  };

  const handleDeliver = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (
      !window.confirm(
        `Confirm delivery of ${orderId} to ${order?.customer?.name || 'the customer'}?`
      )
    ) {
      return;
    }
    updateOrderStatus(orderId, 'delivered');
    showToast({
      type: 'success',
      title: 'Order marked as delivered',
      message: `${orderId} for ${order?.customer?.name || 'customer'} is now delivered.`,
    });
  };

  const handleMessageCustomer = () => {
    if (!selectedOrder || !onMessageCustomer) return;
    onMessageCustomer({
      customerId: selectedOrder.customer.id,
      customerName: selectedOrder.customer.name,
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

  const statusSteps =
    selectedOrder?.status === 'rejected'
      ? ['pending', 'rejected']
      : STATUS_FLOW;

  return (
    <div className="lg:pt-0 pt-16">
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <ShoppingCart className="w-3.5 h-3.5" />
              Total orders
            </div>
            <p className="text-2xl text-gray-900">{stats.total}</p>
          </div>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className="text-left bg-white border border-gray-200 p-4 hover:border-gray-400 transition"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </div>
            <p className="text-2xl text-gray-900">{stats.pending}</p>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className="text-left bg-white border border-gray-200 p-4 hover:border-gray-400 transition"
          >
            <p className="text-xs text-gray-500 mb-1">Approved</p>
            <p className="text-2xl text-gray-900">{stats.approved}</p>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('shipped')}
            className="text-left bg-white border border-gray-200 p-4 hover:border-gray-400 transition"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Truck className="w-3.5 h-3.5" />
              Shipped
            </div>
            <p className="text-2xl text-gray-900">{stats.shipped}</p>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('delivered')}
            className="text-left bg-white border border-gray-200 p-4 hover:border-gray-400 transition"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <PackageCheck className="w-3.5 h-3.5" />
              Delivered
            </div>
            <p className="text-2xl text-gray-900">{stats.delivered}</p>
          </button>
          <div className="bg-white border border-gray-200 p-4 col-span-2 xl:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Active revenue</p>
            <p className="text-2xl text-gray-900">
              ${stats.revenue.toLocaleString()}
            </p>
            {stats.rejected > 0 && (
              <p className="text-xs text-rose-700 mt-1 inline-flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" />
                {stats.rejected} rejected
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-gray-200 p-4 md:p-5">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search orders"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        <section className="bg-white border border-gray-200 overflow-hidden">
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
                className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
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
                            className="w-12 h-12 object-cover border border-gray-200 shrink-0"
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
                          className={`inline-block px-2 py-1 text-xs border ${statusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
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
          <div className="bg-white max-w-3xl w-full my-8 max-h-[92vh] overflow-y-auto border border-gray-200">
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
                      STATUS_FLOW.indexOf(selectedOrder.status) >
                        STATUS_FLOW.indexOf(step);
                    return (
                      <span
                        key={step}
                        className={`px-3 py-1.5 text-xs border capitalize ${
                          active
                            ? statusStyles(step)
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

              <div>
                <h3 className="text-lg text-gray-900 mb-3">Customer</h3>
                <div className="bg-gray-50 border border-gray-200 p-4">
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
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={selectedOrder.product.image}
                      alt={selectedOrder.product.name}
                      className="w-full sm:w-40 h-36 object-cover border border-gray-200"
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
                <div className="bg-gray-50 border border-gray-200 p-4 space-y-3">
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
                      className="w-full max-w-md border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Internal notes</h3>
                  <div className="bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700">
                    {selectedOrder.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handleMessageCustomer}
                className="flex items-center gap-2 px-5 py-2 border border-gray-900 text-gray-900 hover:bg-gray-50 transition"
              >
                <MessageSquare className="w-5 h-5" />
                Message customer
              </button>

              {selectedOrder.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedOrder.id)}
                    className="flex items-center gap-2 px-5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 transition"
                  >
                    <XIcon className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedOrder.id)}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
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
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  <Truck className="w-5 h-5" />
                  Mark as shipped
                </button>
              )}
              {selectedOrder.status === 'shipped' && (
                <button
                  type="button"
                  onClick={() => handleDeliver(selectedOrder.id)}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  <PackageCheck className="w-5 h-5" />
                  Mark as delivered
                </button>
              )}
              {(selectedOrder.status === 'delivered' ||
                selectedOrder.status === 'rejected') && (
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
