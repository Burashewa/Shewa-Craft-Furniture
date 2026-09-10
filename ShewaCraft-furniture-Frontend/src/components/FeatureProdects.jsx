import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { ProductCardGallery } from './products/ProductCardGallery';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function FeaturedProducts({ onViewDetails, items, limit = 4 }) {
  const { products, loading, error } = useCatalog();
  const defaultFeatured = products.filter((product) => product.featured);
  const list = (items ?? defaultFeatured).slice(0, limit);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Handpicked</p>
          <h2 className="text-4xl text-gray-900 mb-4">Featured Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Standout pieces chosen for craftsmanship, comfort, and style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="col-span-full text-center text-gray-600">Loading featured pieces...</p>
          ) : error ? (
            <p className="col-span-full text-center text-gray-600">{error}</p>
          ) : (
            list.map((product) => (
            <article
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <ProductCardGallery
                product={product}
                onQuickView={onViewDetails}
                frameClassName="h-72"
              >
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 rounded-sm text-sm text-gray-800">
                    {product.category}
                  </span>
                </div>
              </ProductCardGallery>

              <button
                type="button"
                onClick={() => onViewDetails(product)}
                className={`w-full text-left p-6 ${focusRing}`}
              >
                <h3 className="text-lg text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                  <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 group-hover:text-gray-900 text-sm transition">
                    View Details →
                  </span>
                </div>
              </button>
            </article>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
