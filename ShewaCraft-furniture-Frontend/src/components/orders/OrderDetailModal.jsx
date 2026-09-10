import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
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
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
}

function formatOrderDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

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
            className={`p-1 text-gray-400 hover:text-gray-900 ${focusRing}`}
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
      className="border border-gray-200 bg-gray-50 rounded-lg p-4 space-y-3"
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
          className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 ${focusRing}`}
        />
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white transition duration-200 ${focusRing}`}
          >
            Skip for now
          </button>
        )}
        <button
          type="submit"
          disabled={rating < 1}
          className={`px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`}
        >
          Submit rating
        </button>
      </div>
    </form>
  );
}

function formatPayment(payment) {
  if (!payment?.method && !payment?.bank) return 'Not provided';
  const method =
    payment.method === 'bank_transfer'
      ? 'Bank transfer'
      : payment.method || 'Payment';
  if (payment.bank) return `${method} · ${payment.bank}`;
  if (payment.last4) return `${method} · **** ${payment.last4}`;
  return method;
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
  const [confirmReceipt, setConfirmReceipt] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const closeButtonRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useBodyScrollLock(true);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !confirmReceipt) onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, confirmReceipt]);

  const lineItems = Array.isArray(order.items) ? order.items : [];
  const firstItem = lineItems[0];
  const snapshotImages = lineItems.map((item) => item.image).filter(Boolean);
  const images =
    snapshotImages.length > 0
      ? snapshotImages
      : product?.images?.length > 0
        ? product.images
        : [FALLBACK_IMAGE];
  const extraCount = Math.max(lineItems.length - 1, 0);
  const baseName = firstItem?.name || product?.name || 'Unknown product';
  const name = extraCount > 0 ? `${baseName} + ${extraCount} more` : baseName;
  const quantity = Number(order.quantity) > 0 ? Number(order.quantity) : 1;
  const total = Number(order.price ?? order.totals?.total ?? product?.price ?? 0);
  const unitPrice =
    firstItem?.unitPrice ?? (quantity > 0 ? total / quantity : total);
  const formattedDate = formatOrderDate(order.date);

  const status = (order.status || '').toLowerCase();
  const statusSteps = getOrderStatusSteps(status);
  const canConfirm = canCustomerConfirmReceipt(order);
  const canRate = canCustomerRate(order);
  const rated = hasOrderRating(order);
  const showRatingForm = (canRate || promptRating) && !skipRating && !rated;

  const handleConfirmReceipt = () => {
    onConfirmReceipt(order.id);
    setConfirmReceipt(false);
    setPromptRating(true);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const modalMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 8 },
      };

  return (
    <>
      <MotionDiv
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        onClick={() => {
          if (!confirmReceipt) onClose();
        }}
      >
        <div className="min-h-full flex items-start md:items-center justify-center px-4 py-6 sm:py-8">
          <MotionDiv
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="relative w-full max-w-6xl max-h-[90vh] bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col rounded-xl"
            {...modalMotion}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 w-10 h-10 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 transition ${focusRing}`}
              aria-label="Close order details"
            >
              <X className="w-5 h-5 mx-auto" />
            </button>

            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
                <div>
                  <div className="relative mb-4 bg-gray-100 overflow-hidden aspect-square rounded-lg">
                    <img
                      src={images[selectedImage]}
                      alt={name}
                      className="w-full h-full object-cover"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 rounded-md flex items-center justify-center hover:bg-white transition shadow-sm ${focusRing}`}
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 rounded-md flex items-center justify-center hover:bg-white transition shadow-sm ${focusRing}`}
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {images.map((imageSrc, index) => {
                        const isActive = selectedImage === index;
                        return (
                          <button
                            key={`${imageSrc}-${index}`}
                            type="button"
                            onClick={() => setSelectedImage(index)}
                            aria-label={`View image ${index + 1} of ${images.length}`}
                            aria-current={isActive ? 'true' : undefined}
                            className={`aspect-square overflow-hidden rounded-md border-2 transition ${focusRing} ${
                              isActive
                                ? 'border-gray-900 opacity-100'
                                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={imageSrc}
                              alt={`${name} view ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col min-w-0 pr-2 sm:pr-8">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Order details · {order.id}
                  </p>
                  <h2
                    id="order-detail-title"
                    className="text-3xl text-gray-900 mb-3"
                  >
                    {name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 text-xs border rounded-sm ${getStatusClasses(status)}`}
                    >
                      {formatOrderStatus(status)}
                    </span>
                    <p className="text-sm text-gray-600">Placed {formattedDate}</p>
                  </div>

                  {order.shipping ? (
                    <p className="text-sm text-gray-600 mb-6">{order.shipping}</p>
                  ) : null}

                  <div className="mb-6">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
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
                            className={`px-3 py-1.5 text-xs border rounded-sm capitalize ${
                              active
                                ? `${getStatusClasses(step)} ring-2 ring-gray-900 ring-offset-1`
                                : passed
                                  ? 'bg-gray-800 text-white border-gray-800'
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
                        You accepted this order on{' '}
                        {formatOrderStamp(order.customerReceivedAt)}.
                      </p>
                    )}
                  </div>

                  {showRatingForm && (
                    <div className="mb-6">
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
                    </div>
                  )}

                  {rated && !showRatingForm && (
                    <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Your rating
                      </p>
                      <div
                        className="flex items-center gap-1"
                        aria-label={`Rated ${order.rating} out of 5`}
                      >
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                    {lineItems.length > 1 && (
                      <div className="sm:col-span-2 space-y-2">
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                          Items
                        </p>
                        {lineItems.map((item, index) => (
                          <div
                            key={`${item.productId}-${item.color}-${index}`}
                            className="flex justify-between gap-3 text-sm text-gray-700"
                          >
                            <span>
                              {item.name}
                              {item.color ? ` · ${item.color}` : ''} × {item.quantity}
                            </span>
                            <span className="text-gray-900 shrink-0">
                              $
                              {formatMoney(
                                Number(item.unitPrice || 0) * Number(item.quantity || 0)
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Quantity
                      </p>
                      <p className="text-gray-900">{quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Unit price
                      </p>
                      <p className="text-gray-900">${formatMoney(unitPrice)}</p>
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
                      <p className="text-gray-900">{formatPayment(order.payment)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Order total
                      </p>
                      <p className="text-4xl text-gray-900">
                        ${formatMoney(total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 bg-white p-4 sm:p-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
              >
                Close
              </button>
              {canConfirm && (
                <button
                  type="button"
                  onClick={() => setConfirmReceipt(true)}
                  className={`px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-200 ${focusRing}`}
                >
                  I received this order
                </button>
              )}
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>

      <ConfirmDialog
        open={confirmReceipt}
        title="Confirm receipt?"
        message={`Confirm that you received ${name} for order ${order.id}?`}
        confirmLabel="I received it"
        onCancel={() => setConfirmReceipt(false)}
        onConfirm={handleConfirmReceipt}
      />
    </>
  );
}
