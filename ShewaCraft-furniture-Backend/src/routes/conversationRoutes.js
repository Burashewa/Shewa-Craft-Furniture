import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getConversation,
  getOrCreateConversation,
  listConversations,
  markCustomerRead,
  sendCustomerMessage,
} from '../controllers/conversationController.js';

export const conversationRouter = Router();

conversationRouter.use(requireAuth);

conversationRouter.get('/', listConversations);
conversationRouter.post('/', getOrCreateConversation);
conversationRouter.get('/:id', getConversation);
conversationRouter.post('/:id/messages', sendCustomerMessage);
conversationRouter.post('/:id/read', markCustomerRead);
