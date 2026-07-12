import { Star } from 'lucide-react';

export function ProductCard({ product, onProductClick }) {
  return (
    <article className="group bg-white border border-gray-100 hover:border-gray-200 transition">
      <button
        type="button"
        onClick={() => onProductClick(product)}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!product.inStock && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-gray-900/90 text-white text-xs">
                Out of stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">
            {product.category}
          </p>
          <h3 className="text-base sm:text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
            <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
            <span>{product.rating}</span>
            <span className="text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl text-gray-900">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 group-hover:text-gray-900 transition">
              View →
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
