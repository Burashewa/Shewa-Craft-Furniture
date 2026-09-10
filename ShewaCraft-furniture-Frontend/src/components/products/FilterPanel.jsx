import { CATEGORIES, PRICE_RANGES } from './catalogConstants';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

function FilterRadio({ name, value, selected, onSelect, children }) {
  const id = `${name}-${value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`;

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition duration-150"
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className={`w-4 h-4 shrink-0 accent-gray-900 ${focusRing}`}
      />
      <span
        className={`text-sm transition duration-150 ${
          selected ? 'text-gray-900 font-medium' : 'text-gray-700'
        }`}
      >
        {children}
      </span>
    </label>
  );
}

export function FilterPanel({
  namePrefix = 'desktop',
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onReset,
  resetDisabled = false,
}) {
  const categoryName = `${namePrefix}-category`;
  const priceName = `${namePrefix}-price`;

  return (
    <div className="space-y-8">
      <div>
        <h3
          id={`${namePrefix}-filter-category-heading`}
          className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3"
        >
          Category
        </h3>
        <div
          className="space-y-0.5"
          role="radiogroup"
          aria-labelledby={`${namePrefix}-filter-category-heading`}
        >
          {CATEGORIES.map((category) => (
            <FilterRadio
              key={category}
              name={categoryName}
              value={category}
              selected={selectedCategory === category}
              onSelect={() => onCategoryChange(category)}
            >
              {category}
            </FilterRadio>
          ))}
        </div>
      </div>

      <div>
        <h3
          id={`${namePrefix}-filter-price-heading`}
          className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3"
        >
          Price Range
        </h3>
        <div
          className="space-y-0.5"
          role="radiogroup"
          aria-labelledby={`${namePrefix}-filter-price-heading`}
        >
          {PRICE_RANGES.map((range) => (
            <FilterRadio
              key={range}
              name={priceName}
              value={range}
              selected={priceRange === range}
              onSelect={() => onPriceRangeChange(range)}
            >
              {range}
            </FilterRadio>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent ${focusRing}`}
      >
        Reset Filters
      </button>
    </div>
  );
}
