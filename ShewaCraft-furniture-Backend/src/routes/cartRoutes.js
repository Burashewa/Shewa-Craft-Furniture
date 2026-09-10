import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  addCartItem,
  getCart,
  moveToCart,
  removeCartItem,
  removeSavedItem,
  saveForLater,
  updateCartItem,
} from '../controllers/cartController.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);

cartRouter.get('/', getCart);
cartRouter.post('/items', addCartItem);
cartRouter.patch('/items/:itemId', updateCartItem);
cartRouter.delete('/items/:itemId', removeCartItem);
cartRouter.post('/save-for-later/:itemId', saveForLater);
cartRouter.post('/move-to-cart/:itemId', moveToCart);
cartRouter.delete('/saved/:itemId', removeSavedItem);
