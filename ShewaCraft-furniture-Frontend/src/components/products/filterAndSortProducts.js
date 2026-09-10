function matchesPriceRange(price, priceRange) {
  if (priceRange === 'All') return true;
  if (priceRange === 'Under $500') return price < 500;
  if (priceRange === '$500-$1000') return price >= 500 && price < 1000;
  if (priceRange === '$1000-$2000') return price >= 1000 && price < 2000;
  if (priceRange === 'Over $2000') return price >= 2000;
  return true;
}

function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        const aFeatured = a.featured ? 1 : 0;
        const bFeatured = b.featured ? 1 : 0;
        if (bFeatured !== aFeatured) return bFeatured - aFeatured;
        return b.rating - a.rating;
      });
  }
}

export function filterAndSortProducts(
  products,
  { searchQuery = '', selectedCategory = 'All', priceRange = 'All', sortBy = 'featured' }
) {
  const query = searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    const matchesPrice = matchesPriceRange(product.price, priceRange);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return sortProducts(filtered, sortBy);
}
