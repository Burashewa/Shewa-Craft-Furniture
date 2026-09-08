import { Package } from 'lucide-react';
import { ProductCard } from './ProductCard';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ProductGrid({ products, onProductClick, onClearFilters }) {
  if (products.length === 0) {
    return (
      <div className="p-12 text-center border border-gray-200 bg-white">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden />
        <p className="text-gray-900 font-medium">No products found</p>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          No products match the current filters. Try adjusting your search or
          filters to find what you&apos;re looking for.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className={`mt-4 inline-flex items-center px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition ${focusRing}`}
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}
