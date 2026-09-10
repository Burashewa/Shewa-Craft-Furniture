import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { getAdminDashboard } from '../controllers/adminDashboardController.js';
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  updateAdminProduct,
  updateAdminProductStock,
} from '../controllers/adminProductController.js';
import { getAdminOrder, listAdminOrders } from '../controllers/adminOrderController.js';
import {
  listAdminCustomers,
  updateAdminCustomerStatus,
} from '../controllers/adminCustomerController.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import {
  getAdminConversation,
  getOrCreateAdminConversation,
  listAdminConversations,
  markAdminRead,
  markAllAdminRead,
  sendAdminMessage,
} from '../controllers/conversationController.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('admin'));

adminRouter.get('/health', (_req, res) => {
  res.json({ ok: true, role: 'admin' });
});

adminRouter.get('/dashboard', getAdminDashboard);

adminRouter.get('/products', listAdminProducts);
adminRouter.post('/products', createAdminProduct);
adminRouter.patch('/products/:id/stock', updateAdminProductStock);
adminRouter.patch('/products/:id', updateAdminProduct);
adminRouter.delete('/products/:id', deleteAdminProduct);

adminRouter.get('/orders', listAdminOrders);
adminRouter.get('/orders/:id', getAdminOrder);
adminRouter.patch('/orders/:id/status', updateOrderStatus);

adminRouter.get('/customers', listAdminCustomers);
adminRouter.patch('/customers/:id/status', updateAdminCustomerStatus);

adminRouter.get('/conversations', listAdminConversations);
adminRouter.post('/conversations', getOrCreateAdminConversation);
adminRouter.post('/conversations/read-all', markAllAdminRead);
adminRouter.get('/conversations/:id', getAdminConversation);
adminRouter.post('/conversations/:id/messages', sendAdminMessage);
adminRouter.post('/conversations/:id/read', markAdminRead);
