import { Router } from 'express';
import { banks } from '../data/banks.js';

export const checkoutRouter = Router();

checkoutRouter.get('/banks', (_req, res) => {
  res.json({ banks });
});
