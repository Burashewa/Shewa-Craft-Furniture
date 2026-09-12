import { Router } from 'express';
import { listFeaturedTestimonials } from '../controllers/testimonialController.js';

export const testimonialRouter = Router();

testimonialRouter.get('/', listFeaturedTestimonials);
