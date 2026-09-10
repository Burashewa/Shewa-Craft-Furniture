import { Trash2, Plus, Minus, Heart, MessageCircle } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
  onChat,
  onViewProduct,
}) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 transition duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-sm hover:border-gray-300 motion-reduce:hover:translate-y-0">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onViewProduct(item)}
          className={`w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-gray-100 overflow-hidden rounded-md cursor-pointer group ${focusRing}`}
          aria-label={`View details for ${item.name}`}
        >
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover transition duration-200 group-hover:scale-[1.03] group-hover:brightness-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:brightness-100"
          />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="text-lg text-gray-900">{item.name}</h3>
              {item.color && (
                <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>
              )}
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-2">
                {item.inStock ? 'In stock' : 'Out of stock'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className={`p-2 text-gray-400 hover:text-gray-900 transition duration-200 ${focusRing}`}
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={`w-9 h-9 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white ${focusRing}`}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-gray-900">{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className={`w-9 h-9 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition duration-200 ${focusRing}`}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onSaveForLater(item)}
                className={`text-sm text-gray-600 hover:text-gray-900 transition inline-flex items-center gap-1.5 ${focusRing}`}
              >
                <Heart className="w-4 h-4" />
                Save for later
              </button>
              <span className="text-xl text-gray-900">
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onChat(item)}
              className={`inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition ${focusRing}`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat with ShewaCraft Support
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
