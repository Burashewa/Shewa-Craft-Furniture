import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './routes/authRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { favoriteRouter } from './routes/favoriteRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { checkoutRouter } from './routes/checkoutRoutes.js';
import { conversationRouter } from './routes/conversationRoutes.js';
import { uploadRouter } from './routes/uploadRoutes.js';
import { testimonialRouter } from './routes/testimonialRoutes.js';
import { statsRouter } from './routes/statsRoutes.js';
import { sanitizeMongo } from './middleware/sanitizeMongo.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(sanitizeMongo);
  app.use('/uploads', express.static(env.uploadDir));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/favorites', favoriteRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/checkout', checkoutRouter);
  app.use('/api/conversations', conversationRouter);
  app.use('/api/uploads', uploadRouter);
  app.use('/api/testimonials', testimonialRouter);
  app.use('/api/stats', statsRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
