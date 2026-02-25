import { useState } from 'react';
import { Eye, X as XIcon } from 'lucide-react';
import { Header } from '../components/Header';

export default function Orders() {
  const [orders] = useState([
    {
      id: 'ORD-1001',
      date: '2024-11-01',
      status: 'Processing',
      total: 249.99,
      product: {
        name: 'Cozy Armchair',
        image: 'https://images.unsplash.com/photo-1582582494702-1d8a6b1d6d9d?w=400&h=300&fit=crop'
      },
      shipping: 'Standard - 3-5 days',
      address: '123 Main St, City, Country',
      payment: { method: 'Card', last4: '4242' }
    },
    {
      id: 'ORD-1002',
      date: '2024-10-18',
      status: 'Delivered',
      total: 899.0,
      product: {
        name: 'Modern Sofa',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'
      },
      shipping: 'Express - 1-2 days',
      address: '123 Main St, City, Country',
      payment: { method: 'Card', last4: '1111' }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
   <>
   <Header />
    <div className="lg:pt-0 pt-16">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track your recent purchases and order details</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={order.product.image} alt={order.product.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <div className="font-medium text-gray-900">{order.product.name}</div>
                  <div className="text-sm text-gray-500">Order: {order.id} • {order.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-medium text-gray-900">${order.total.toFixed(2)}</div>
                </div>
                <div>
                  <span className={`px-3 py-1 text-sm rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:text-blue-900 ml-4">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl text-gray-900">Order {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)}>
                <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-4 items-start">
                <img src={selectedOrder.product.image} alt={selectedOrder.product.name} className="w-36 h-36 object-cover rounded" />
                <div>
                  <h3 className="text-xl font-semibold">{selectedOrder.product.name}</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.shipping}</p>
                  <p className="mt-2"><span className="font-medium">Shipping to:</span> {selectedOrder.address}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p><span className="font-medium">Payment Method:</span> {selectedOrder.payment.method} • **** {selectedOrder.payment.last4}</p>
                <p className="mt-2"><span className="font-medium">Order Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                <p className="mt-2"><span className="font-medium">Status:</span> {selectedOrder.status}</p>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
</>
  );
}
