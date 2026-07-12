import { useEffect } from 'react';
import { X } from 'lucide-react';
import { getStatusClasses } from '../../data/orders';

export function OrderDetailModal({ order, product, onClose }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const image =
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
  const name = product?.name || 'Unknown product';
  const total = (order.price ?? product?.price ?? 0) * (order.quantity ?? 1);
  const formattedDate = new Date(order.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 shadow-xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
      >
        <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order details</p>
            <h2 id="order-detail-title" className="text-2xl text-gray-900">
              {order.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
            aria-label="Close order details"
          >
            <X className="w-5 h-5 mx-auto" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-36 h-36 shrink-0 overflow-hidden bg-gray-100">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl text-gray-900 mb-2">{name}</h3>
              <p className="text-sm text-gray-600 mb-1">Placed {formattedDate}</p>
              <p className="text-sm text-gray-600 mb-3">{order.shipping}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex px-2.5 py-0.5 text-xs ${getStatusClasses(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <span className={`inline-flex px-2.5 py-0.5 text-xs ${getStatusClasses(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Quantity</p>
              <p className="text-gray-900">{order.quantity}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Unit price</p>
              <p className="text-gray-900">
                ${(order.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Ship to</p>
              <p className="text-gray-900">{order.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Payment</p>
              <p className="text-gray-900">
                {order.payment.method} · **** {order.payment.last4}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order total</p>
              <p className="text-xl text-gray-900">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
