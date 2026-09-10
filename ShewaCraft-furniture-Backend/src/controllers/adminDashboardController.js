import { loadAdminDashboard } from '../services/adminDashboard.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const dashboard = await loadAdminDashboard();
  res.json({ dashboard });
});
