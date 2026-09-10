import mongoose from 'mongoose';
import { Favorite, publicFavorite } from '../models/Favorite.js';
import { Product } from '../models/Product.js';
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

async function productsById(ids) {
  const products = await Product.find({ _id: { $in: ids } });
  return new Map(products.map((product) => [String(product._id), product]));
}

export const listFavorites = asyncHandler(async (req, res) => {
  const rows = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
  const live = await productsById(rows.map((row) => row.product));
  const favorites = rows.map((row) =>
    publicFavorite(row, live.get(String(row.product)))
  );
  res.json({ favorites });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const productId = readProductId(req.body?.productId);
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, 'Not found');
  }

  try {
    const favorite = await Favorite.create({
      user: req.user._id,
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      inStock: product.inStock,
    });
    return res.status(201).json({ favorite: publicFavorite(favorite, product) });
  } catch (err) {
    if (err.code !== 11000) throw err;
    const existing = await Favorite.findOne({
      user: req.user._id,
      product: product._id,
    });
    return res.json({ favorite: publicFavorite(existing, product) });
  }
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const productId = readProductId(req.params.productId);
  await Favorite.deleteOne({ user: req.user._id, product: productId });
  res.json({ ok: true });
});

export const clearFavorites = asyncHandler(async (req, res) => {
  await Favorite.deleteMany({ user: req.user._id });
  res.json({ ok: true });
});
