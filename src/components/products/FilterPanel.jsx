import { CATEGORIES, PRICE_RANGES } from './catalogConstants';

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
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2.5 text-sm transition ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
          Price Range
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onPriceRangeChange(range)}
              className={`w-full text-left px-3 py-2.5 text-sm transition ${
                priceRange === range
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full px-4 py-2.5 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
