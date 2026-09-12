import { Order } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPublicStats = asyncHandler(async (_req, res) => {
  const [row] = await Order.aggregate([
    { $match: { rating: { $gte: 1, $lte: 5 } } },
    {
      $group: {
        _id: null,
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  const reviewCount = Number(row?.reviewCount) || 0;
  const averageRating =
    reviewCount > 0 ? Number(Number(row.averageRating).toFixed(1)) : 0;

  res.json({
    stats: {
      reviewCount,
      averageRating,
    },
  });
});
