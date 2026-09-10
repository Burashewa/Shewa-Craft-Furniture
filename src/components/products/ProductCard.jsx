import { Star } from 'lucide-react';
import { ProductCardGallery } from './ProductCardGallery';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ProductCard({ product, onProductClick }) {
  const priceLabel = `$${product.price.toLocaleString()}`;
  const stockLabel = product.inStock ? '' : ', Out of stock';

  return (
    <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition duration-200 motion-reduce:transition-none">
      <ProductCardGallery
        product={product}
        onQuickView={onProductClick}
        frameClassName="aspect-[4/5]"
      >
        {!product.inStock && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2 py-1 text-xs border rounded-sm bg-rose-50 text-rose-800 border-rose-200">
              Out of stock
            </span>
          </div>
        )}
      </ProductCardGallery>

      <button
        type="button"
        onClick={() => onProductClick(product)}
        className={`w-full text-left p-4 sm:p-5 ${focusRing}`}
        aria-label={`${product.name}, ${priceLabel}${stockLabel}`}
      >
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
      </button>
    </article>
  );
}
