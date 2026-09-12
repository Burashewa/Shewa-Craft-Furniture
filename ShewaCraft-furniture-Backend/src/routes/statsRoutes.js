import { Router } from 'express';
import { getPublicStats } from '../controllers/statsController.js';

export const statsRouter = Router();

statsRouter.get('/', getPublicStats);
