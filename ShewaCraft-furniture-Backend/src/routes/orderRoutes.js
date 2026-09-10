import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { uploadPaymentProof } from '../middleware/uploadPaymentProof.js';
import {
  confirmReceipt,
  createOrder,
  getOrder,
  listOrders,
  submitRating,
} from '../controllers/orderController.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);

orderRouter.get('/', listOrders);
orderRouter.post('/', uploadPaymentProof, createOrder);
orderRouter.get('/:id', getOrder);
orderRouter.post('/:id/confirm-receipt', confirmReceipt);
orderRouter.post('/:id/rating', submitRating);
