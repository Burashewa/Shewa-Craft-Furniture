import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';


export function FeaturedProducts({ onViewDetails }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium furniture pieces
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              {/* Image */}
              <div className="relative h-80 bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-gray-900" />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-gray-900" />
                  </button>
                </div>

                {/* Category */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-sm rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onViewDetails(product)}
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-700 transition"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}
