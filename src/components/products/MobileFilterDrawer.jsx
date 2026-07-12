import { useEffect } from 'react';
import { X } from 'lucide-react';
import { FilterPanel } from './FilterPanel';

export function MobileFilterDrawer({
  open,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onReset,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 transition"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <FilterPanel
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            onReset={onReset}
          />
        </div>

        <div className="p-5 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
