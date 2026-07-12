import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../../data/products';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else if (!categoryParam) {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        searchQuery,
        selectedCategory,
        priceRange,
        sortBy,
      }),
    [searchQuery, selectedCategory, priceRange, sortBy]
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
            <div className="sticky top-24 border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">
                Filters
              </h2>
              <FilterPanel
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onReset={resetFilters}
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

            <ProductGrid
              products={filteredProducts}
              onProductClick={setSelectedProduct}
              onClearFilters={resetFilters}
            />
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onReset={resetFilters}
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
