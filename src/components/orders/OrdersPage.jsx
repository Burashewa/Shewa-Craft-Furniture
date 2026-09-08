import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { products } from '../../data/products';
import { orders as mockOrders } from '../../data/orders';
import { useToast } from '../../context/ToastContext';
import { OrdersHeader } from './OrdersHeader';
import { OrderCard } from './OrderCard';
import { OrderDetailModal } from './OrderDetailModal';

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function OrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const selectedProduct = selectedOrder
    ? products.find((p) => p.id === selectedOrder.productId)
    : null;

  const patchOrder = (orderId, patch) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order))
    );
    setSelectedOrder((current) =>
      current?.id === orderId ? { ...current, ...patch } : current
    );
  };

  const handleConfirmReceipt = (orderId) => {
    const stamp = todayStamp();
    patchOrder(orderId, {
      status: 'completed',
      customerReceivedAt: stamp,
    });
    showToast({
      type: 'success',
      title: 'Order received',
      message: `${orderId} is now completed. Please rate the product.`,
    });
  };

  const handleSubmitRating = (orderId, { rating, review }) => {
    patchOrder(orderId, { rating, review });
    showToast({
      type: 'success',
      title: 'Thanks for rating',
      message: `You rated ${orderId} ${rating} out of 5.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <OrdersHeader count={orders.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When you place an order, it will show up here so you can track fulfillment and details.
            </p>
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const product = products.find((p) => p.id === order.productId);
              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  product={product}
                  onViewDetails={setSelectedOrder}
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          key={selectedOrder.id}
          order={selectedOrder}
          product={selectedProduct}
          onClose={() => setSelectedOrder(null)}
          onConfirmReceipt={handleConfirmReceipt}
          onSubmitRating={handleSubmitRating}
        />
      )}
    </div>
  );
}
