import { Search, SlidersHorizontal } from 'lucide-react';
import { SORT_OPTIONS } from './catalogConstants';

export function CatalogToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  resultsCount,
  onOpenFilters,
  activeFilterCount = 0,
}) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            aria-label="Search products"
          />
        </div>

        <div className="flex gap-3">
          <label className="sr-only" htmlFor="catalog-sort">
            Sort products
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="hidden sm:block px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onOpenFilters}
            className="lg:hidden px-4 py-3 border border-gray-300 bg-white flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 bg-gray-900 text-white text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          {resultsCount} {resultsCount === 1 ? 'product' : 'products'}
        </p>

        <div className="sm:hidden">
          <label className="sr-only" htmlFor="catalog-sort-mobile">
            Sort products
          </label>
          <select
            id="catalog-sort-mobile"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
