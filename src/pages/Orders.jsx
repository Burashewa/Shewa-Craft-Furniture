import { useState } from 'react';
import { Eye, X as XIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { products } from '../data/products';

export default function Orders() {
  const [orders] = useState([
    {
      id: 'ORD-1001',
      date: '2024-11-01',
      status: 'Processing',
      orderStatus: 'Pending',
      productId: 1,
      quantity: 1,
      price: 899.0,
      shipping: 'Standard - 3-5 days',
      address: '123 Main St, City, Country',
      payment: { method: 'Card', last4: '4242' }
    },
    {
      id: 'ORD-1002',
      date: '2024-10-18',
      status: 'Delivered',
      orderStatus: 'Approved',
      productId: 3,
      quantity: 1,
      price: 2299.0,
      shipping: 'Express - 1-2 days',
      address: '123 Main St, City, Country',
      payment: { method: 'Card', last4: '1111' }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
  <>
  <Header />
   <main className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track your recent purchases and order details</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4">
          {orders.map((order) => {
            const product = products.find((p) => p.id === order.productId) || {};
            const image = product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image';
            const name = product.name || 'Unknown product';
            const formattedDate = new Date(order.date).toLocaleDateString();
            return (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <img src={image} alt={name} className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded" />
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">{name}</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Order: {order.id} • {formattedDate}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.orderStatus === 'Approved' ? 'bg-green-100 text-green-800' : order.orderStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Qty: {order.quantity}</div>
                      </div>
                    </div>

                <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                  <div className="text-right mr-0 sm:mr-4">
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium text-gray-900">${order.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <span className={`px-3 py-1 text-sm rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition ml-2" aria-label={`View details for order ${order.id}`}>
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedOrder && (() => {
        const prod = products.find((p) => p.id === selectedOrder.productId) || {};
        const img = prod.images?.[0] || prod.image || 'https://via.placeholder.com/400x300?text=No+Image';
        const total = ((selectedOrder.price ?? prod.price ?? 0) * (selectedOrder.quantity ?? 1));
        return (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl text-gray-900">Order {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)}>
                  <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <img src={img} alt={prod.name || 'Product'} className="w-36 h-36 object-cover rounded" />
                  <div>
                    <h3 className="text-xl font-semibold">{prod.name || 'Unknown product'}</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.shipping}</p>
                    <p className="mt-2"><span className="font-medium">Shipping to:</span> {selectedOrder.address}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.payment.method} • **** {selectedOrder.payment.last4}</p>
                  <p className="mt-2"><span className="font-medium">Order Total:</span> ${total.toFixed(2)}</p>
                  <p className="mt-2"><span className="font-medium">Fulfillment:</span> {selectedOrder.status}</p>
                  <p className="mt-2"><span className="font-medium">Order Status:</span> <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${ (selectedOrder.orderStatus === 'Approved') ? 'bg-green-100 text-green-800' : (selectedOrder.orderStatus === 'Rejected') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedOrder.orderStatus}</span></p>
                </div>

                <div className="flex justify-end">
                  <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Close</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
</>
  );
}
