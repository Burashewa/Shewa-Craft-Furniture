import { X } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ActiveFilterChips({
  selectedCategory,
  priceRange,
  searchQuery,
  onClearCategory,
  onClearPrice,
  onClearSearch,
  onClearAll,
}) {
  const chips = [];

  if (selectedCategory && selectedCategory !== 'All') {
    chips.push({
      key: 'category',
      label: selectedCategory,
      onClear: onClearCategory,
    });
  }

  if (priceRange && priceRange !== 'All') {
    chips.push({
      key: 'price',
      label: priceRange,
      onClear: onClearPrice,
    });
  }

  if (searchQuery?.trim()) {
    chips.push({
      key: 'search',
      label: `"${searchQuery.trim()}"`,
      onClear: onClearSearch,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onClear}
          aria-label={`Remove ${chip.label} filter`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-sm text-sm text-gray-800 hover:bg-gray-200 transition ${focusRing}`}
        >
          {chip.label}
          <X className="w-3.5 h-3.5" aria-hidden />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className={`text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2 transition ${focusRing}`}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
