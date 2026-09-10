import { Product } from '../models/Product.js';
import { applyStockToggle, parseProductBody } from '../services/productPayload.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAdminProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ featured: -1, name: 1 });
  res.json({ products });
});

export const createAdminProduct = asyncHandler(async (req, res) => {
  const fields = parseProductBody(req.body, { partial: false });
  const product = await Product.create(fields);
  res.status(201).json({ product });
});

export const updateAdminProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError(404, 'Not found');
  }
  const fields = parseProductBody(req.body, { partial: true });
  Object.assign(product, fields);
  await product.save();
  res.json({ product });
});

export const deleteAdminProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError(404, 'Not found');
  }
  res.json({ ok: true });
});

export const updateAdminProductStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError(404, 'Not found');
  }
  applyStockToggle(product, req.body);
  await product.save();
  res.json({ product });
});
