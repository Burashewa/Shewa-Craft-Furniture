import { useState } from 'react';
import { Search, Eye, Check, X as XIcon, Download, Filter } from 'lucide-react';

export function OrdersManagement() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        location: '123 Main St, City, State'
      },
      product: {
        name: 'Modern Sofa',
        price: 1299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop'
      },
      payment: {
        bank: 'Bank of America',
        screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
      },
      status: 'pending',
      date: '2024-02-10',
      total: 1299
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567891',
        location: '456 Oak Ave, Town, State'
      },
      product: {
        name: 'Dining Table Set',
        price: 899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?w=200&h=200&fit=crop'
      },
      payment: {
        bank: 'Chase Bank',
        screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
      },
      status: 'approved',
      date: '2024-02-09',
      total: 899
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Mike Brown',
        email: 'mike@example.com',
        phone: '+1234567892',
        location: '789 Pine Rd, Village, State'
      },
      product: {
        name: 'Office Chair',
        price: 349,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1637762646936-29b68cd6670d?w=200&h=200&fit=crop'
      },
      payment: {
        bank: 'Wells Fargo',
        screenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
      },
      status: 'pending',
      date: '2024-02-08',
      total: 698
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleApprove = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'approved' } : order
      )
    );
    setSelectedOrder(null);
  };

  const handleReject = (orderId) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: 'rejected' } : order
        )
      );
      setSelectedOrder(null);
    }
  };

  const handleShip = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'shipped' } : order
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
 <div className="lg:pt-0 pt-16">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">Review and approve customer orders</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>
    </div>
  </div>

  <div className="p-6">
    {/* Filters */}
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>

    {/* Orders Table */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.product.name}</div>
                  <div className="text-sm text-gray-500">Qty: {order.product.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Order Detail Modal */}
  {selectedOrder && (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900">Order Details - {selectedOrder.id}</h2>
          <button onClick={() => setSelectedOrder(null)}>
            <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
              <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
              <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
              <p><span className="font-medium">Delivery Location:</span> {selectedOrder.customer.location}</p>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><span className="font-medium">Product:</span> {selectedOrder.product.name}</p>
              <p><span className="font-medium">Price:</span> ${selectedOrder.product.price}</p>
              <p><span className="font-medium">Quantity:</span> {selectedOrder.product.quantity}</p>
              <p className="text-lg"><span className="font-medium">Total:</span> ${selectedOrder.total}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <p><span className="font-medium">Bank:</span> {selectedOrder.payment.bank}</p>
              <div>
                <p className="font-medium mb-2">Payment Screenshot:</p>
                <img 
                  src={selectedOrder.payment.screenshot} 
                  alt="Payment proof" 
                  className="w-full max-w-md rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          {selectedOrder.status === 'pending' && (
            <>
              <button
                onClick={() => handleReject(selectedOrder.id)}
                className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
              >
                <XIcon className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedOrder.id)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Check className="w-5 h-5" />
                Approve Order
              </button>
            </>
          )}
          {selectedOrder.status === 'approved' && (
            <button
              onClick={() => handleShip(selectedOrder.id)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Check className="w-5 h-5" />
              Mark as Shipped
            </button>
          )}
          {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' || selectedOrder.status === 'rejected') && (
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
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
