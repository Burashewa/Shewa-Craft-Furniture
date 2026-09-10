import mongoose from 'mongoose';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { calcCartTotals } from '../services/cartTotals.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function readProductId(value) {
  const productId = String(value || '').trim();
  if (!productId || !mongoose.isValidObjectId(productId)) {
    throw new AppError(400, 'Enter a valid product', {
      productId: 'Enter a valid product',
    });
  }
  return productId;
}

function readItemId(value) {
  const itemId = String(value || '').trim();
  if (!itemId || !mongoose.isValidObjectId(itemId)) {
    throw new AppError(400, 'Enter a valid cart item', {
      itemId: 'Enter a valid cart item',
    });
  }
  return itemId;
}

function readQuantity(value, fallback = 1) {
  const quantity = Number(value ?? fallback);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError(400, 'Quantity must be at least 1', {
      quantity: 'Quantity must be at least 1',
    });
  }
  return quantity;
}

function normalizeColor(value) {
  return String(value || '').trim();
}

const SUPPORT_OWNER = {
  name: 'ShewaCraft Support',
  avatar: '',
  responseTime: 'Within 2 hours',
};

function snapshotLine(product, { quantity, color }) {
  return {
    product: product._id,
    name: product.name,
    image: product.images?.[0] || '',
    price: product.price,
    quantity,
    color,
    inStock: product.inStock,
    owner: { ...SUPPORT_OWNER },
  };
}

function publicLine(item, live) {
  const liveJson =
    live && typeof live.toJSON === 'function' ? live.toJSON() : live;
  return {
    id: String(item._id),
    productId: String(item.product),
    name: liveJson?.name ?? item.name,
    image: liveJson?.images?.[0] ?? item.image,
    price: liveJson?.price ?? item.price,
    quantity: item.quantity,
    color: item.color || '',
    inStock: liveJson?.inStock ?? item.inStock,
    owner: { ...SUPPORT_OWNER },
  };
}

function publicSaved(item, live) {
  const liveJson =
    live && typeof live.toJSON === 'function' ? live.toJSON() : live;
  return {
    id: String(item._id),
    productId: String(item.product),
    name: liveJson?.name ?? item.name,
    image: liveJson?.images?.[0] ?? item.image,
    price: liveJson?.price ?? item.price,
    inStock: liveJson?.inStock ?? item.inStock,
  };
}

async function productsById(ids) {
  const unique = [...new Set(ids.map((id) => String(id)))];
  const products = await Product.find({ _id: { $in: unique } });
  return new Map(products.map((product) => [String(product._id), product]));
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (cart) return cart;
  try {
    return await Cart.create({ user: userId, items: [], savedForLater: [] });
  } catch (err) {
    if (err.code !== 11000) throw err;
    return Cart.findOne({ user: userId });
  }
}

async function cartEnvelope(cart) {
  const live = await productsById([
    ...cart.items.map((item) => item.product),
    ...cart.savedForLater.map((item) => item.product),
  ]);
  const items = cart.items.map((item) =>
    publicLine(item, live.get(String(item.product)))
  );
  const savedForLater = cart.savedForLater.map((item) =>
    publicSaved(item, live.get(String(item.product)))
  );
  return { items, savedForLater, totals: calcCartTotals(items) };
}

async function sendCart(res, cart, status = 200) {
  res.status(status).json(await cartEnvelope(cart));
}

function findLine(cart, productId, color) {
  return cart.items.find(
    (item) =>
      String(item.product) === String(productId) &&
      (item.color || '') === color
  );
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await sendCart(res, cart);
});

export const addCartItem = asyncHandler(async (req, res) => {
  const productId = readProductId(req.body?.productId);
  const quantity = readQuantity(req.body?.quantity, 1);
  const color = normalizeColor(req.body?.color);
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Not found');
  }

  const cart = await getOrCreateCart(req.user._id);
  const existing = findLine(cart, product._id, color);

  if (existing) {
    existing.quantity += quantity;
    existing.name = product.name;
    existing.image = product.images?.[0] || existing.image;
    existing.price = product.price;
    existing.inStock = product.inStock;
    existing.owner = { ...SUPPORT_OWNER };
  } else {
    if (!product.inStock) {
      throw new AppError(400, 'This item is out of stock', {
        productId: 'This item is out of stock',
      });
    }
    cart.items.push(snapshotLine(product, { quantity, color }));
  }

  await cart.save();
  await sendCart(res, cart, existing ? 200 : 201);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const itemId = readItemId(req.params.itemId);
  const quantity = readQuantity(req.body?.quantity);
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);
  if (!item) {
    throw new AppError(404, 'Not found');
  }
  item.quantity = quantity;
  await cart.save();
  await sendCart(res, cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const itemId = readItemId(req.params.itemId);
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);
  if (item) item.deleteOne();
  await cart.save();
  await sendCart(res, cart);
});

export const saveForLater = asyncHandler(async (req, res) => {
  const itemId = readItemId(req.params.itemId);
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);
  if (!item) {
    throw new AppError(404, 'Not found');
  }

  const alreadySaved = cart.savedForLater.find(
    (saved) => String(saved.product) === String(item.product)
  );
  if (!alreadySaved) {
    cart.savedForLater.push({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      inStock: item.inStock,
    });
  }
  item.deleteOne();
  await cart.save();
  await sendCart(res, cart);
});

export const moveToCart = asyncHandler(async (req, res) => {
  const itemId = readItemId(req.params.itemId);
  const cart = await getOrCreateCart(req.user._id);
  const saved = cart.savedForLater.id(itemId);
  if (!saved) {
    throw new AppError(404, 'Not found');
  }

  const product = await Product.findById(saved.product);
  if (product && !product.inStock) {
    const existing = findLine(cart, saved.product, '');
    if (!existing) {
      throw new AppError(400, 'This item is out of stock', {
        productId: 'This item is out of stock',
      });
    }
  }

  const line = snapshotLine(
    product || {
      _id: saved.product,
      name: saved.name,
      images: [saved.image],
      price: saved.price,
      inStock: saved.inStock,
    },
    { quantity: 1, color: '' }
  );

  const existing = findLine(cart, saved.product, '');
  if (existing) {
    existing.quantity += 1;
    if (product) {
      existing.name = product.name;
      existing.image = product.images?.[0] || existing.image;
      existing.price = product.price;
      existing.inStock = product.inStock;
      existing.owner = { ...SUPPORT_OWNER };
    }
  } else {
    cart.items.push(line);
  }

  saved.deleteOne();
  await cart.save();
  await sendCart(res, cart);
});

export const removeSavedItem = asyncHandler(async (req, res) => {
  const itemId = readItemId(req.params.itemId);
  const cart = await getOrCreateCart(req.user._id);
  const saved = cart.savedForLater.id(itemId);
  if (saved) saved.deleteOne();
  await cart.save();
  await sendCart(res, cart);
});
