import { Order } from '../models/Order.js';
import { AppError } from '../utils/AppError.js';
import { findOrderByParam } from './orderController.js';
import {
  ELIGIBLE_REVIEW_FILTER,
  adminTestimonial,
  isEligibleReview,
} from '../services/testimonialSerializer.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readSearch } from '../utils/readSearch.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const listAdminTestimonials = asyncHandler(async (req, res) => {
  const filter = { ...ELIGIBLE_REVIEW_FILTER };
  const featured = String(req.query.featured || '').trim().toLowerCase();
  if (featured === 'yes') filter.reviewFeatured = true;
  if (featured === 'no') filter.reviewFeatured = { $ne: true };

  const search = readSearch(req.query.search);
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { publicId: pattern },
      { 'customer.name': pattern },
      { 'customer.email': pattern },
      { 'items.name': pattern },
      { review: pattern },
    ];
  }

  const rows = await Order.find(filter).sort({ date: -1, createdAt: -1 });
  res.json({ testimonials: rows.map(adminTestimonial).filter(Boolean) });
});

export const updateAdminTestimonialFeatured = asyncHandler(async (req, res) => {
  const order = await findOrderByParam(req.params.id);
  if (!isEligibleReview(order)) {
    throw new AppError(400, 'Only written reviews can be featured', {
      featured: 'Only written reviews can be featured',
    });
  }

  if (typeof req.body?.featured !== 'boolean') {
    throw new AppError(400, 'Featured must be true or false', {
      featured: 'Featured must be true or false',
    });
  }

  order.reviewFeatured = req.body.featured;
  await order.save();
  res.json({ testimonial: adminTestimonial(order) });
});
