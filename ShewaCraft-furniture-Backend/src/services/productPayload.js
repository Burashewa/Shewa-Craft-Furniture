import { PRODUCT_CATEGORIES, normalizeSpecifications } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';

function isHttpsUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseImages(images, { required = false } = {}) {
  if (images === undefined) {
    if (required) {
      throw new AppError(400, 'Add at least one product photo', {
        images: 'Add at least one product photo',
      });
    }
    return undefined;
  }
  if (!Array.isArray(images)) {
    throw new AppError(400, 'Product images must be HTTPS URLs', {
      images: 'Product images must be HTTPS URLs',
    });
  }

  const urls = images.map((item) => String(item || '').trim()).filter(Boolean);
  if (required && urls.length === 0) {
    throw new AppError(400, 'Add at least one product photo', {
      images: 'Add at least one product photo',
    });
  }

  for (const url of urls) {
    if (url.toLowerCase().startsWith('data:') || !isHttpsUrl(url)) {
      throw new AppError(400, 'Product images must be HTTPS URLs', {
        images: 'Product images must be HTTPS URLs',
      });
    }
  }

  return urls;
}

function parseColors(colors) {
  if (colors === undefined) return undefined;
  if (!Array.isArray(colors)) {
    throw new AppError(400, 'Colors must be a list of names', {
      colors: 'Colors must be a list of names',
    });
  }
  return colors.map((color) => String(color || '').trim()).filter(Boolean);
}

function parseSpecifications(specs) {
  if (specs === undefined) return undefined;
  if (!Array.isArray(specs)) {
    throw new AppError(400, 'Specifications must be a list', {
      specifications: 'Specifications must be a list',
    });
  }
  return normalizeSpecifications(specs);
}

function parseStockCount(value) {
  const stockCount = Number(value);
  if (!Number.isFinite(stockCount) || stockCount < 0) {
    throw new AppError(400, 'Enter a valid stock count', {
      stockCount: 'Enter a valid stock count',
    });
  }
  return Math.floor(stockCount);
}

export function parseProductBody(body = {}, { partial = false } = {}) {
  const fields = {};
  const errors = {};

  if (!partial || body.name !== undefined) {
    const name = String(body.name ?? '').trim();
    if (!name) errors.name = 'Enter a product name';
    else fields.name = name;
  }

  if (!partial || body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.price = 'Enter a valid product price';
    } else {
      fields.price = price;
    }
  }

  if (!partial || body.category !== undefined) {
    const category = String(body.category ?? '').trim();
    if (!PRODUCT_CATEGORIES.includes(category)) {
      errors.category = 'Choose a valid category';
    } else {
      fields.category = category;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(400, Object.values(errors)[0], errors);
  }

  if (!partial || body.description !== undefined) {
    fields.description = String(body.description ?? '');
  }

  const images = parseImages(body.images, { required: !partial });
  if (images !== undefined) fields.images = images;

  if (!partial || body.featured !== undefined) {
    fields.featured = Boolean(body.featured);
  }

  if (!partial || body.assembly !== undefined) {
    fields.assembly = String(body.assembly ?? '').trim();
  }

  const colors = parseColors(body.colors);
  if (colors !== undefined) fields.colors = colors;

  const specifications = parseSpecifications(body.specifications);
  if (specifications !== undefined) fields.specifications = specifications;

  if (!partial || body.inStock !== undefined || body.stockCount !== undefined) {
    const inStockProvided = body.inStock !== undefined;
    const countProvided = body.stockCount !== undefined;
    const inStock = inStockProvided ? Boolean(body.inStock) : true;
    const stockCount = countProvided
      ? parseStockCount(body.stockCount)
      : inStock
        ? 10
        : 0;

    if (!inStock) {
      fields.inStock = false;
      fields.stockCount = 0;
    } else {
      fields.stockCount = stockCount;
      fields.inStock = stockCount > 0;
    }
  }

  return fields;
}

export function applyStockToggle(product, body = {}) {
  if (body.inStock === undefined) {
    throw new AppError(400, 'inStock is required', {
      inStock: 'inStock is required',
    });
  }

  const inStock = Boolean(body.inStock);
  if (!inStock) {
    product.inStock = false;
    product.stockCount = 0;
    return product;
  }

  const nextCount =
    body.stockCount !== undefined
      ? parseStockCount(body.stockCount)
      : Math.max(1, Number(product.stockCount) || 10);

  product.stockCount = Math.max(1, nextCount);
  product.inStock = true;
  return product;
}
