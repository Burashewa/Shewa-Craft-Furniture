import { Router } from 'express';
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPassword,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { authRateLimit } from '../middleware/authRateLimit.js';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, register);
authRouter.post('/login', authRateLimit, login);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/me', requireAuth, me);
authRouter.post('/forgot-password', authRateLimit, forgotPassword);
authRouter.post('/reset-password', resetPassword);
