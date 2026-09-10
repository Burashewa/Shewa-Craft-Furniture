import { rateLimit } from 'express-rate-limit';

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req, res) {
    res.status(429).json({
      error: { message: 'Too many attempts. Try again later.' },
    });
  },
});
