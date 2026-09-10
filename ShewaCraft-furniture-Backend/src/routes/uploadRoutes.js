import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { uploadProductImage } from '../middleware/uploadProductImage.js';
import { uploadImage } from '../controllers/uploadController.js';

export const uploadRouter = Router();

uploadRouter.use(requireAuth, requireRole('admin'));
uploadRouter.post('/images', uploadProductImage, uploadImage);
