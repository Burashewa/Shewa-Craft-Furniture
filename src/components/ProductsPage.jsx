import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { ProductDetailView } from './ProductDetailView';
import { products } from '../data/products';

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor'];
  const priceRanges = ['All', 'Under $500', '$500-$1000', '$1000-$2000', 'Over $2000'];

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'Under $500') matchesPrice = product.price < 500;
    else if (priceRange === '$500-$1000') matchesPrice = product.price >= 500 && product.price < 1000;
    else if (priceRange === '$1000-$2000') matchesPrice = product.price >= 1000 && product.price < 2000;
    else if (priceRange === 'Over $2000') matchesPrice = product.price >= 2000;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl text-gray-900 mb-2">Our Collection</h1>
          <p className="text-gray-600">Discover premium furniture for every space</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="text-lg text-gray-900 mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === category
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setPriceRange(range)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        priceRange === range
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange('All');
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Mobile Filter Toggle */}
            <div className="mb-6 flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Category</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-2 rounded transition ${
                          selectedCategory === category
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => setPriceRange(range)}
                        className={`w-full text-left px-3 py-2 rounded transition ${
                          priceRange === range
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </div>

            {/* Product Grid */}
            <ProductGrid 
              products={filteredProducts} 
              onProductClick={setSelectedProduct}
            />
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}