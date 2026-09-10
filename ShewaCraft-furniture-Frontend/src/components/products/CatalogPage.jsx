import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { ProductDetailView } from '../ProductDetailView';
import { CATEGORIES } from './catalogConstants';
import { filterAndSortProducts } from './filterAndSortProducts';
import { CatalogHeader } from './CatalogHeader';
import { CatalogToolbar } from './CatalogToolbar';
import { FilterPanel } from './FilterPanel';
import { ActiveFilterChips } from './ActiveFilterChips';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { ProductGrid } from './ProductGrid';

export function CatalogPage() {
  const { products, loading, error } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filtersButtonRef = useRef(null);

  const categoryParam = searchParams.get('category');
  const selectedCategory =
    categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : 'All';

  const handleCategoryChange = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') {
      next.delete('category');
    } else {
      next.set('category', category);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange('All');
    setSortBy('featured');
    handleCategoryChange('All');
  };

  const resetSidebarFilters = () => {
    setPriceRange('All');
    handleCategoryChange('All');
  };

  const sidebarFiltersIdle = selectedCategory === 'All' && priceRange === 'All';

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        searchQuery,
        selectedCategory,
        priceRange,
        sortBy,
      }),
    [products, searchQuery, selectedCategory, priceRange, sortBy]
  );

  const activeFilterCount = [
    selectedCategory !== 'All',
    priceRange !== 'All',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <CatalogHeader category={selectedCategory} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 border border-gray-200 bg-white rounded-lg p-4 md:p-5">
              <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">
                Filters
              </h2>
              <FilterPanel
                namePrefix="desktop"
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onReset={resetSidebarFilters}
                resetDisabled={sidebarFiltersIdle}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <CatalogToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultsCount={filteredProducts.length}
              onOpenFilters={() => setMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
              filtersButtonRef={filtersButtonRef}
              filtersOpen={mobileFiltersOpen}
            />

            <ActiveFilterChips
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              searchQuery={searchQuery}
              onClearCategory={() => handleCategoryChange('All')}
              onClearPrice={() => setPriceRange('All')}
              onClearSearch={() => setSearchQuery('')}
              onClearAll={resetFilters}
            />

            {loading ? (
              <div className="p-12 text-center border border-gray-200 bg-white rounded-lg">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center border border-gray-200 bg-white rounded-lg">
                <p className="text-gray-900 font-medium">Unable to load products</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onProductClick={setSelectedProduct}
                onClearFilters={resetFilters}
              />
            )}
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        returnFocusRef={filtersButtonRef}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onReset={resetSidebarFilters}
        resetDisabled={sidebarFiltersIdle}
      />

      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
