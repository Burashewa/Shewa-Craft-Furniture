import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function FavoritesHeader({ count, onClearAll }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Favorites</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Account</p>
            <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">Favorites</h1>
            <p className="text-gray-600 max-w-2xl">
              {count === 0
                ? 'Save pieces you love and add them to your cart when you are ready.'
                : `${count} saved ${count === 1 ? 'item' : 'items'} ready to revisit or add to cart.`}
            </p>
          </div>

          {count > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2 transition self-start sm:self-auto"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
