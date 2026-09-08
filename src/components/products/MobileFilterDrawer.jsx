import { useEffect } from 'react';
import { X } from 'lucide-react';
import { FilterPanel } from './FilterPanel';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function MobileFilterDrawer({
  open,
  onClose,
  returnFocusRef,
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
    const focusTarget = returnFocusRef?.current;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      requestAnimationFrame(() => {
        focusTarget?.focus();
      });
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-title"
        id="mobile-filters-dialog"
        className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 id="mobile-filters-title" className="text-lg text-gray-900">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 text-gray-600 hover:text-gray-900 transition ${focusRing}`}
            aria-label="Close filters"
          >
            <X className="w-5 h-5" aria-hidden />
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
            className={`w-full py-3 bg-gray-900 text-white hover:bg-gray-800 transition ${focusRing}`}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
