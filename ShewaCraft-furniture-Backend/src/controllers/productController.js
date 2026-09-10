import { Product, PRODUCT_CATEGORIES } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readSearch } from '../utils/readSearch.js';

const PRICE_RANGES = {
  'Under $500': { $lt: 500 },
  '$500-$1000': { $gte: 500, $lt: 1000 },
  '$1000-$2000': { $gte: 1000, $lt: 2000 },
  'Over $2000': { $gte: 2000 },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilter(query) {
  const filter = {};

  const search = readSearch(query.search);
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }];
  }

  const category = String(query.category || '').trim();
  if (category && category !== 'All' && PRODUCT_CATEGORIES.includes(category)) {
    filter.category = category;
  }

  const priceRange = String(query.priceRange || '').trim();
  if (priceRange && priceRange !== 'All' && PRICE_RANGES[priceRange]) {
    filter.price = PRICE_RANGES[priceRange];
  }

  return filter;
}

function buildSort(sortBy) {
  switch (sortBy) {
    case 'price-asc':
      return { price: 1 };
    case 'price-desc':
      return { price: -1 };
    case 'rating':
      return { rating: -1 };
    case 'featured':
    default:
      return { featured: -1, rating: -1 };
  }
}

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find(buildFilter(req.query)).sort(
    buildSort(req.query.sortBy)
  );
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError(404, 'Not found');
  }
  res.json({ product });
});
