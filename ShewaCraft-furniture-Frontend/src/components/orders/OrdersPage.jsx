import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useToast } from '../../context/ToastContext';
import {
  confirmReceipt,
  listOrders,
  submitRating,
} from '../../services/orderService';
import { OrdersHeader } from './OrdersHeader';
import { OrderCard } from './OrderCard';
import { OrderDetailModal } from './OrderDetailModal';

export function OrdersPage() {
  const { getProductById } = useCatalog();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedProduct = selectedOrder
    ? getProductById(selectedOrder.productId)
    : null;

  useEffect(() => {
    let active = true;
    setLoading(true);
    listOrders()
      .then((next) => {
        if (!active) return;
        setOrders(next);
      })
      .catch((err) => {
        if (!active) return;
        setOrders([]);
        showToast({
          type: 'error',
          title: 'Could not load orders',
          message: err.message || 'Unable to load your orders.',
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [showToast]);

  const replaceOrder = (nextOrder) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === nextOrder.id ? nextOrder : order))
    );
    setSelectedOrder((current) =>
      current?.id === nextOrder.id ? nextOrder : current
    );
  };

  const handleConfirmReceipt = async (orderId) => {
    try {
      const data = await confirmReceipt(orderId);
      if (data?.order) replaceOrder(data.order);
      showToast({
        type: 'success',
        title: 'Order received',
        message: `${orderId} is now completed. Please rate the product.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not update order',
        message: err.message || 'Unable to confirm receipt.',
      });
    }
  };

  const handleSubmitRating = async (orderId, { rating, review }) => {
    try {
      const data = await submitRating(orderId, { rating, review });
      if (data?.order) replaceOrder(data.order);
      showToast({
        type: 'success',
        title: 'Thanks for rating',
        message: `You rated ${orderId} ${rating} out of 5.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not submit rating',
        message: err.message || 'Unable to save your rating.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <OrdersHeader count={orders.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white rounded-lg">
            <p className="text-gray-600">Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white rounded-lg">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When you place an order, it will show up here so you can track fulfillment and details.
            </p>
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const product = getProductById(order.productId);
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
