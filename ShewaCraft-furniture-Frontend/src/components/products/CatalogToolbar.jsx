import { Search, SlidersHorizontal } from 'lucide-react';
import { SORT_OPTIONS } from './catalogConstants';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const fieldClass =
  'border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900';

export function CatalogToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  resultsCount,
  onOpenFilters,
  activeFilterCount = 0,
  filtersButtonRef,
  filtersOpen = false,
}) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full min-h-11 pl-10 pr-4 py-2.5 ${fieldClass}`}
            aria-label="Search products"
          />
        </div>

        <div className="flex gap-3 shrink-0">
          <label className="sr-only" htmlFor="catalog-sort">
            Sort products
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`hidden sm:block min-h-11 min-w-52 px-3 py-2.5 text-sm ${fieldClass}`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            ref={filtersButtonRef}
            type="button"
            onClick={onOpenFilters}
            className={`lg:hidden min-h-11 px-4 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition ${focusRing}`}
            aria-expanded={filtersOpen}
            aria-controls="mobile-filters-dialog"
          >
            <SlidersHorizontal className="w-5 h-5" aria-hidden />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 bg-gray-900 text-white text-xs rounded-sm">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500">
          <span className="text-gray-900 font-medium">{resultsCount}</span>{' '}
          {resultsCount === 1 ? 'product found' : 'products found'}
        </p>

        <div className="sm:hidden">
          <label className="sr-only" htmlFor="catalog-sort-mobile">
            Sort products
          </label>
          <select
            id="catalog-sort-mobile"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`w-full min-h-11 px-3 py-2.5 text-sm ${fieldClass}`}
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
