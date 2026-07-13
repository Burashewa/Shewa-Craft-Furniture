import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export function FavoriteCard({
  item,
  onAddToCart,
  onRemove,
  onViewDetails,
}) {
  return (
    <article className="bg-white border border-gray-200 overflow-hidden flex flex-col">
      <button
        type="button"
        onClick={() => onViewDetails(item)}
        className="relative aspect-[4/5] bg-gray-100 overflow-hidden text-left group"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!item.inStock && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-gray-900/90 text-white text-xs">
            Out of stock
          </span>
        )}
      </button>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="text-left min-w-0"
          >
            <h2 className="text-lg text-gray-900 hover:text-gray-700 transition truncate">
              {item.name}
            </h2>
          </button>
          <Heart className="w-4 h-4 fill-gray-900 text-gray-900 shrink-0 mt-1" />
        </div>

        <p className="text-xl text-gray-900 mb-4">
          ${item.price.toLocaleString()}
        </p>

        <div className="mt-auto grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            className="w-full px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition inline-flex items-center justify-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
