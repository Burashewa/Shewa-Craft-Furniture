export function isEligibleReview(order) {
  const rating = Number(order?.rating);
  const review = String(order?.review || '').trim();
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 && review.length > 0;
}

export const ELIGIBLE_REVIEW_FILTER = {
  rating: { $gte: 1, $lte: 5 },
  review: { $regex: /\S/ },
};

export function publicTestimonial(order) {
  if (!isEligibleReview(order)) return null;
  const first = (order.items || [])[0];
  const name = String(order.customer?.name || '').trim();
  if (!name) return null;

  return {
    id: order.publicId,
    name,
    quote: String(order.review).trim(),
    rating: Number(order.rating),
    product: String(first?.name || '').trim(),
  };
}

export function adminTestimonial(order) {
  if (!isEligibleReview(order)) return null;
  const first = (order.items || [])[0];
  const customer = order.customer || {};

  return {
    id: order.publicId,
    customer: {
      name: String(customer.name || '').trim(),
      email: String(customer.email || '').trim(),
    },
    rating: Number(order.rating),
    review: String(order.review).trim(),
    product: String(first?.name || '').trim(),
    featured: Boolean(order.reviewFeatured),
    date: order.date || order.createdAt || null,
  };
}
