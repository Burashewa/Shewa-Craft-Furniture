import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import {
  ORDER_STATUS_FLOW,
  canCustomerConfirmReceipt,
  canCustomerRate,
  formatOrderStamp,
  formatOrderStatus,
  getOrderStatusSteps,
  getStatusClasses,
  hasOrderRating,
} from '../../data/orders';

function StarRatingInput({ value, onChange, labelledBy }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-labelledby={labelledBy}>
      {[1, 2, 3, 4, 5].map((star) => {
        const selected = star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            onClick={() => onChange(star)}
            className="p-1 text-gray-400 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          >
            <Star
              className={`w-7 h-7 ${selected ? 'fill-gray-900 text-gray-900' : ''}`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ProductRatingForm({ productName, onSubmit, onSkip }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  return (
    <form
      className="border border-gray-200 bg-gray-50 p-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (rating < 1) return;
        onSubmit({ rating, review: review.trim() });
      }}
    >
      <div>
        <h3 id="order-rating-label" className="text-sm font-medium text-gray-900">
          Rate {productName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          How was this piece? Your rating helps other shoppers.
        </p>
      </div>
      <StarRatingInput
        value={rating}
        onChange={setRating}
        labelledBy="order-rating-label"
      />
      <label className="block">
        <span className="sr-only">Optional review</span>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          placeholder="Optional comment"
          className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        />
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-white transition"
          >
            Skip for now
          </button>
        )}
        <button
          type="submit"
          disabled={rating < 1}
          className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit rating
        </button>
      </div>
    </form>
  );
}

export function OrderDetailModal({
  order,
  product,
  onClose,
  onConfirmReceipt,
  onSubmitRating,
}) {
  const [promptRating, setPromptRating] = useState(false);
  const [skipRating, setSkipRating] = useState(false);

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

  const status = (order.status || '').toLowerCase();
  const statusSteps = getOrderStatusSteps(status);
  const canConfirm = canCustomerConfirmReceipt(order);
  const canRate = canCustomerRate(order);
  const rated = hasOrderRating(order);
  const showRatingForm = (canRate || promptRating) && !skipRating && !rated;

  const handleConfirmReceipt = () => {
    if (
      !window.confirm(
        `Confirm that you received ${name} for order ${order.id}?`
      )
    ) {
      return;
    }
    onConfirmReceipt(order.id);
    setPromptRating(true);
  };

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
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Order details
            </p>
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
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl text-gray-900 mb-2">{name}</h3>
              <p className="text-sm text-gray-600 mb-1">Placed {formattedDate}</p>
              <p className="text-sm text-gray-600 mb-3">{order.shipping}</p>
              <span
                className={`inline-flex px-2.5 py-0.5 text-xs border ${getStatusClasses(status)}`}
              >
                {formatOrderStatus(status)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Fulfillment progress
            </h3>
            <div className="flex flex-wrap gap-2">
              {statusSteps.map((step) => {
                const active = status === step;
                const passed =
                  status !== 'rejected' &&
                  ORDER_STATUS_FLOW.indexOf(status) >
                    ORDER_STATUS_FLOW.indexOf(step);

                return (
                  <span
                    key={step}
                    className={`px-3 py-1.5 text-xs border capitalize ${
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
            {status === 'rejected' && (
              <p className="text-sm text-rose-700 mt-3">
                This order was rejected. Contact support if you need help
                resubmitting payment or placing a new order.
              </p>
            )}
            {status === 'delivered' && (
              <p className="text-sm text-gray-600 mt-3">
                ShewaCraft confirmed this order reached your address
                {order.destinationConfirmedAt
                  ? ` on ${formatOrderStamp(order.destinationConfirmedAt)}`
                  : ''}
                . Confirm receipt when you have the product.
              </p>
            )}
            {status === 'completed' && order.customerReceivedAt && (
              <p className="text-sm text-gray-600 mt-3">
                You accepted this order on {formatOrderStamp(order.customerReceivedAt)}.
              </p>
            )}
          </div>

          {showRatingForm && (
            <ProductRatingForm
              productName={name}
              onSubmit={(payload) => {
                onSubmitRating(order.id, payload);
                setPromptRating(false);
              }}
              onSkip={() => {
                setPromptRating(false);
                setSkipRating(true);
              }}
            />
          )}

          {rated && !showRatingForm && (
            <div className="border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Your rating</p>
              <div className="flex items-center gap-1" aria-label={`Rated ${order.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= order.rating
                        ? 'fill-gray-900 text-gray-900'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {order.review ? (
                <p className="text-sm text-gray-700 mt-2">{order.review}</p>
              ) : null}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Quantity
              </p>
              <p className="text-gray-900">{order.quantity}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Unit price
              </p>
              <p className="text-gray-900">
                $
                {(order.price ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Ship to
              </p>
              <p className="text-gray-900">{order.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Payment
              </p>
              <p className="text-gray-900">
                {order.payment.method} · **** {order.payment.last4}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Order total
              </p>
              <p className="text-xl text-gray-900">
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            {canConfirm && (
              <button
                type="button"
                onClick={handleConfirmReceipt}
                className="px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                I received this order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
