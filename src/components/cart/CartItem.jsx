import { Trash2, Plus, Minus, Heart, MessageCircle } from 'lucide-react';

export function CartItem({ item, onUpdateQuantity, onRemove, onSaveForLater, onChat }) {
  return (
    <article className="bg-white border border-gray-200 p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-gray-100 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

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
              className="p-2 text-gray-400 hover:text-gray-900 transition"
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
                className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-gray-900">{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onSaveForLater(item)}
                className="text-sm text-gray-600 hover:text-gray-900 transition inline-flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4" />
                Save for later
              </button>
              <span className="text-xl text-gray-900">
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>

          {item.owner && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onChat(item)}
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with {item.owner.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
