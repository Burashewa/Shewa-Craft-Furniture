import { Eye, Star } from 'lucide-react';
import {
  canCustomerConfirmReceipt,
  canCustomerRate,
  formatOrderStatus,
  getStatusClasses,
  hasOrderRating,
} from '../../data/orders';

export function OrderCard({ order, product, onViewDetails }) {
  const image =
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
  const name = product?.name || 'Unknown product';
  const formattedDate = new Date(order.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const showConfirm = canCustomerConfirmReceipt(order);
  const showRate = canCustomerRate(order);
  const rated = hasOrderRating(order);

  return (
    <article className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-gray-100">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg text-gray-900 truncate">{name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {order.id} · {formattedDate}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`inline-flex px-2.5 py-0.5 text-xs border ${getStatusClasses(order.status)}`}
            >
              {formatOrderStatus(order.status)}
            </span>
            <span className="text-sm text-gray-600">Qty {order.quantity}</span>
            {rated && (
              <span className="inline-flex items-center gap-1 text-sm text-gray-900">
                <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                {order.rating}/5
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
        <div className="sm:text-right">
          <p className="text-xs uppercase tracking-wider text-gray-500">Total</p>
          <p className="text-xl text-gray-900">
            $
            {order.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        {showConfirm && (
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
          >
            Confirm receipt
          </button>
        )}
        {showRate && (
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
          >
            Rate product
          </button>
        )}
        <button
          type="button"
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition"
          aria-label={`View details for order ${order.id}`}
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
      </div>
    </article>
  );
}
