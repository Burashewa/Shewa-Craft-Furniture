import { Star } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ProductCard({ product, onProductClick }) {
  const priceLabel = `$${product.price.toLocaleString()}`;
  const stockLabel = product.inStock ? '' : ', Out of stock';

  return (
    <article className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition duration-200 motion-reduce:transition-none">
      <button
        type="button"
        onClick={() => onProductClick(product)}
        className={`w-full text-left ${focusRing}`}
        aria-label={`${product.name}, ${priceLabel}${stockLabel}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
            className={`w-full h-full object-cover transition-transform duration-200 motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-105 motion-reduce:group-hover:scale-100 ${
              product.inStock ? '' : 'opacity-90'
            }`}
          />
          {!product.inStock && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2 py-1 text-xs border bg-rose-50 text-rose-800 border-rose-200">
                Out of stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">
            {product.category}
          </p>
          <h3 className="text-base sm:text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition duration-200 motion-reduce:transition-none">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
            <Star className="w-4 h-4 fill-gray-900 text-gray-900" aria-hidden />
            <span className="sr-only">
              {product.rating} out of 5, {product.reviews} reviews
            </span>
            <span aria-hidden>{product.rating}</span>
            <span className="text-gray-400" aria-hidden>
              ({product.reviews})
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl text-gray-900">{priceLabel}</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-900 transition duration-200 motion-reduce:transition-none">
              View →
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
