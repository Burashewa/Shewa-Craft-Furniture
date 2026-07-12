import { Lock, Truck, RotateCcw } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../data/cart';

export function OrderSummary({
  itemCount,
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
}) {
  return (
    <aside className="border border-gray-200 bg-white p-5 sm:p-6 sticky top-24">
      <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">
        Order summary
      </h2>

      <div className="space-y-3 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-gray-900">${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-gray-900">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Estimated tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center py-5 mb-2">
        <span className="text-lg text-gray-900">Total</span>
        <span className="text-2xl text-gray-900">${total.toFixed(2)}</span>
      </div>

      <button
        type="button"
        disabled={itemCount === 0}
        onClick={onCheckout}
        className="w-full px-6 py-4 bg-gray-900 text-white hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 mb-4"
      >
        <Lock className="w-5 h-5" />
        Proceed to checkout
      </button>

      <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-100 mb-4">
        <Lock className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-600">
          Secure checkout — your payment information is protected.
        </p>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 shrink-0" />
          <span>Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>30-day return policy</span>
        </div>
      </div>
    </aside>
  );
}
