import { Trash2 } from 'lucide-react';

export function SavedItem({ item, onMoveToCart, onRemove }) {
  return (
    <article className="bg-white border border-gray-200 p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-2">
            <div>
              <h3 className="text-gray-900">{item.name}</h3>
              <p className="text-gray-600 mt-1">${item.price.toLocaleString()}</p>
              {!item.inStock && (
                <p className="text-xs uppercase tracking-wider text-gray-500 mt-2">
                  Currently unavailable
                </p>
              )}
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
          <button
            type="button"
            onClick={() => onMoveToCart(item)}
            disabled={!item.inStock}
            className="mt-2 px-4 py-2 border border-gray-900 text-sm text-gray-900 hover:bg-gray-50 transition disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Move to cart
          </button>
        </div>
      </div>
    </article>
  );
}
