import { CATEGORIES, PRICE_RANGES } from './catalogConstants';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

function FilterOption({ selected, children, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`w-full text-left px-3 py-2.5 text-sm transition ${focusRing} ${
        selected
          ? 'bg-gray-900 text-white font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onReset,
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3
          id="filter-category-heading"
          className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3"
        >
          Category
        </h3>
        <div
          className="space-y-1"
          role="radiogroup"
          aria-labelledby="filter-category-heading"
        >
          {CATEGORIES.map((category) => (
            <FilterOption
              key={category}
              selected={selectedCategory === category}
              onSelect={() => onCategoryChange(category)}
            >
              {category}
            </FilterOption>
          ))}
        </div>
      </div>

      <div>
        <h3
          id="filter-price-heading"
          className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3"
        >
          Price Range
        </h3>
        <div
          className="space-y-1"
          role="radiogroup"
          aria-labelledby="filter-price-heading"
        >
          {PRICE_RANGES.map((range) => (
            <FilterOption
              key={range}
              selected={priceRange === range}
              onSelect={() => onPriceRangeChange(range)}
            >
              {range}
            </FilterOption>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className={`w-full px-4 py-2.5 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition ${focusRing}`}
      >
        Reset Filters
      </button>
    </div>
  );
}
