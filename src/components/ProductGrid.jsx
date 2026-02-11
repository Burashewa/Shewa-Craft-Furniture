import { Heart, Star } from 'lucide-react';

export function ProductGrid({ products, onProductClick }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No products found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          {/* Product Image */}
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-100"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>

            {/* Stock Badge */}
            {!product.inStock && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg text-gray-900 group-hover:text-gray-700 transition">
                  {product.name}
                </h3>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-700">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl text-gray-900">${product.price.toLocaleString()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onProductClick(product);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
