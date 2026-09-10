import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { findBank } from '../data/banks.js';
import { calcCartTotals } from '../services/cartTotals.js';
import { canAdminTransition } from '../services/canTransition.js';
import { publicOrder } from '../services/orderSerializer.js';
import { isCloudinaryConfigured, uploadImageBuffer } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SHIPPING_LABEL = 'Standard - 3-5 days';

function generatePublicId() {
  const n = crypto.randomInt(100000, 1000000);
  return `ORD-${n}`;
}

async function uniquePublicId() {
  for (let i = 0; i < 8; i += 1) {
    const publicId = generatePublicId();
    const exists = await Order.exists({ publicId });
    if (!exists) return publicId;
  }
  throw new AppError(500, 'Unexpected server error');
}

export async function findOrderByParam(id, userId) {
  const value = String(id || '').trim();
  if (!value) throw new AppError(404, 'Not found');

  let order = await Order.findOne({ publicId: value });
  if (!order && mongoose.isValidObjectId(value)) {
    order = await Order.findById(value);
  }
  if (!order) throw new AppError(404, 'Not found');
  if (userId && String(order.user) !== String(userId)) {
    throw new AppError(404, 'Not found');
  }
  return order;
}

function snapshotItems(cartItems) {
  return cartItems.map((item) => ({
    product: item.product,
    name: item.name,
    image: item.image || '',
    color: item.color || '',
    quantity: item.quantity,
    unitPrice: item.price,
  }));
}

export const listOrders = asyncHandler(async (req, res) => {
  const rows = await Order.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
  res.json({ orders: rows.map(publicOrder) });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await findOrderByParam(req.params.id, req.user._id);
  res.json({ order: publicOrder(order) });
});

export const createOrder = asyncHandler(async (req, res) => {
  if (req.user.status === 'blocked') {
    throw new AppError(403, 'Your account cannot place orders.');
  }

  const location = String(req.body?.location || '').trim();
  const phoneNumber = String(req.body?.phoneNumber || '').trim();
  const bank = findBank(req.body?.bankId);

  const fields = {};
  if (!bank) fields.bank = 'Select a payment account.';
  if (!location) fields.location = 'Enter your delivery address.';
  else if (location.length > 200) fields.location = 'Delivery address is too long.';
  if (!phoneNumber) fields.phone = 'Enter a phone number.';
  else if (phoneNumber.length > 40) fields.phone = 'Phone number is too long.';
  if (!req.file) fields.file = 'Upload a payment screenshot.';
  if (Object.keys(fields).length > 0) {
    throw new AppError(400, Object.values(fields)[0], fields);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart?.items?.length) {
    throw new AppError(400, 'Your cart is empty', {
      cart: 'Your cart is empty',
    });
  }

  if (!isCloudinaryConfigured()) {
    throw new AppError(503, 'Image uploads are not configured');
  }

  let screenshotUrl = '';
  try {
    const result = await uploadImageBuffer(
      req.file.buffer,
      'shewacraft/payment-proofs'
    );
    screenshotUrl = result?.secure_url || '';
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, 'Unable to upload image');
  }
  if (!screenshotUrl) {
    throw new AppError(502, 'Unable to upload image');
  }

  const items = snapshotItems(cart.items);
  const totals = calcCartTotals(
    items.map((item) => ({ price: item.unitPrice, quantity: item.quantity }))
  );

  const order = await Order.create({
    publicId: await uniquePublicId(),
    user: req.user._id,
    customer: {
      name: req.user.fullName || '',
      email: req.user.email || '',
      phone: phoneNumber,
      location,
    },
    items,
    totals,
    payment: {
      method: 'bank_transfer',
      bank: bank.bankName,
      screenshot: screenshotUrl,
    },
    shippingLabel: SHIPPING_LABEL,
    status: 'pending',
    date: new Date(),
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ order: publicOrder(order) });
});

export const confirmReceipt = asyncHandler(async (req, res) => {
  const order = await findOrderByParam(req.params.id, req.user._id);
  if (order.status !== 'delivered') {
    throw new AppError(400, 'Confirm receipt when the order is delivered', {
      status: 'Confirm receipt when the order is delivered',
    });
  }
  order.status = 'completed';
  order.customerReceivedAt = new Date();
  await order.save();
  res.json({ order: publicOrder(order) });
});

export const submitRating = asyncHandler(async (req, res) => {
  const order = await findOrderByParam(req.params.id, req.user._id);
  if (order.status !== 'completed') {
    throw new AppError(400, 'Rate this order after you confirm receipt', {
      status: 'Rate this order after you confirm receipt',
    });
  }
  if (Number(order.rating) >= 1) {
    throw new AppError(400, 'This order already has a rating', {
      rating: 'This order already has a rating',
    });
  }

  const rating = Number(req.body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(400, 'Rating must be between 1 and 5', {
      rating: 'Rating must be between 1 and 5',
    });
  }

  order.rating = rating;
  const review = String(req.body?.review || '').trim();
  if (review.length > 2000) {
    throw new AppError(400, 'Review is too long', {
      review: 'Review is too long',
    });
  }
  order.review = review;
  await order.save();
  res.json({ order: publicOrder(order) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const status = String(req.body?.status || '').trim().toLowerCase();
  const order = await findOrderByParam(req.params.id);
  if (!canAdminTransition(order.status, status)) {
    throw new AppError(400, 'That status change is not allowed', {
      status: 'That status change is not allowed',
    });
  }
  order.status = status;
  if (status === 'delivered') {
    order.destinationConfirmedAt = new Date();
  }
  await order.save();
  await order.populate({ path: 'user', select: 'avatar fullName email' });
  res.json({ order: publicOrder(order) });
});
