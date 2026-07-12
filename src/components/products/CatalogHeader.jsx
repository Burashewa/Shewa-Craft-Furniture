import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function CatalogHeader({ category }) {
  const isFiltered = category && category !== 'All';
  const title = isFiltered ? category : 'All Products';
  const subtitle = isFiltered
    ? `Browse furniture for your ${category.toLowerCase()}`
    : 'Discover premium furniture for every space';

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-gray-900 transition">
            Products
          </Link>
          {isFiltered && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{category}</span>
            </>
          )}
        </nav>

        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}
