import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { ProductCardGallery } from './products/ProductCardGallery';
import { ConveyorSlider } from './ui/ConveyorSlider';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const FEATURED_VISIBLE_AT = [
  { minWidth: 0, count: 1 },
  { minWidth: 640, count: 2 },
  { minWidth: 1024, count: 4 },
];

function FeaturedProductCard({ product, onViewDetails }) {
  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition h-full">
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
  );
}

function FeaturedProductsGrid({ products, onViewDetails }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)]"
        >
          <FeaturedProductCard
            product={product}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </div>
  );
}

export function FeaturedProducts({ onViewDetails, items }) {
  const { products, loading, error } = useCatalog();
  const list = useMemo(
    () => items ?? products.filter((product) => product.featured),
    [items, products]
  );

  let body = null;
  if (loading) {
    body = <p className="text-center text-gray-600">Loading featured pieces...</p>;
  } else if (error) {
    body = <p className="text-center text-gray-600">{error}</p>;
  } else if (list.length === 0) {
    body = <p className="text-center text-gray-600">No featured pieces right now.</p>;
  } else {
    body = (
      <ConveyorSlider
        items={list}
        getKey={(product) => product.id}
        renderItem={(product) => (
          <FeaturedProductCard product={product} onViewDetails={onViewDetails} />
        )}
        visibleAt={FEATURED_VISIBLE_AT}
        ariaLabel="Featured collection"
        previousLabel="Previous featured product"
        nextLabel="Next featured product"
        dotsLabel="Featured products"
        itemLabel={(product, index) =>
          `Go to featured product ${index + 1}, ${product.name}`
        }
        overflowOnly
        fallback={
          <FeaturedProductsGrid products={list} onViewDetails={onViewDetails} />
        }
      />
    );
  }

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

        {body}

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
