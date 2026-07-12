import { ProductCard } from './ProductCard';

export function ProductGrid({ products, onProductClick, onClearFilters }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white">
        <h3 className="text-xl text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
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
