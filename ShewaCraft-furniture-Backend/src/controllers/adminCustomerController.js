import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { adminCustomer } from '../services/adminCustomerSerializer.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readSearch } from '../utils/readSearch.js';

const CUSTOMER_STATUSES = ['active', 'blocked'];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function ordersByUser(userIds) {
  if (userIds.length === 0) return new Map();
  const rows = await Order.find({ user: { $in: userIds } }).sort({
    date: -1,
    createdAt: -1,
  });
  const grouped = new Map();
  for (const row of rows) {
    const key = String(row.user);
    const list = grouped.get(key) || [];
    list.push(row);
    grouped.set(key, list);
  }
  return grouped;
}

export const listAdminCustomers = asyncHandler(async (req, res) => {
  const filter = { role: 'customer' };
  const status = String(req.query.status || 'all').trim().toLowerCase();
  if (status !== 'all' && CUSTOMER_STATUSES.includes(status)) {
    filter.status = status;
  }

  const search = readSearch(req.query.search);
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ fullName: pattern }, { email: pattern }, { phone: pattern }];
  }

  const users = await User.find(filter).sort({ createdAt: -1 });
  const grouped = await ordersByUser(users.map((user) => user._id));
  res.json({
    customers: users.map((user) =>
      adminCustomer(user, grouped.get(String(user._id)) || [])
    ),
  });
});

export const updateAdminCustomerStatus = asyncHandler(async (req, res) => {
  const status = String(req.body?.status || '').trim().toLowerCase();
  if (!CUSTOMER_STATUSES.includes(status)) {
    throw new AppError(400, 'Status must be active or blocked', {
      status: 'Status must be active or blocked',
    });
  }

  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'customer') {
    throw new AppError(404, 'Not found');
  }

  user.status = status;
  await user.save();

  const grouped = await ordersByUser([user._id]);
  res.json({
    customer: adminCustomer(user, grouped.get(String(user._id)) || []),
  });
});
