import { Order } from '../models/Order.js';
import {
  ELIGIBLE_REVIEW_FILTER,
  publicTestimonial,
} from '../services/testimonialSerializer.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listFeaturedTestimonials = asyncHandler(async (_req, res) => {
  const rows = await Order.find({
    ...ELIGIBLE_REVIEW_FILTER,
    reviewFeatured: true,
  }).sort({ updatedAt: -1, date: -1 });

  const testimonials = rows.map(publicTestimonial).filter(Boolean);
  res.json({ testimonials });
});
