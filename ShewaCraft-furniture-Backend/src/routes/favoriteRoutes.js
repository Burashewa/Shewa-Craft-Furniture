import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  addFavorite,
  clearFavorites,
  listFavorites,
  removeFavorite,
} from '../controllers/favoriteController.js';

export const favoriteRouter = Router();

favoriteRouter.use(requireAuth);

favoriteRouter.get('/', listFavorites);
favoriteRouter.post('/', addFavorite);
favoriteRouter.delete('/', clearFavorites);
favoriteRouter.delete('/:productId', removeFavorite);
