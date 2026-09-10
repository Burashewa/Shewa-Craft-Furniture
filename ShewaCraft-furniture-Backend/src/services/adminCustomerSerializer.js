import { dateOnly } from './orderSerializer.js';

export function adminCustomer(user, orders = []) {
  const sorted = [...orders].sort((a, b) => {
    const aTime = new Date(a.date || a.createdAt).getTime();
    const bTime = new Date(b.date || b.createdAt).getTime();
    return bTime - aTime;
  });
  const paid = orders.filter((order) => order.status !== 'rejected');
  const json = typeof user.toJSON === 'function' ? user.toJSON() : user;

  return {
    id: json.id || String(json._id),
    name: json.fullName || '',
    email: json.email || '',
    phone: json.phone || '',
    avatar: json.avatar || '',
    status: json.status || 'active',
    location: json.location || '',
    notes: json.notes || '',
    preferredPayment: json.preferredPayment || '',
    joinDate: dateOnly(json.createdAt),
    totalOrders: orders.length,
    totalSpent: paid.reduce((sum, order) => sum + Number(order.totals?.total || 0), 0),
    lastOrder: sorted[0] ? dateOnly(sorted[0].date || sorted[0].createdAt) : null,
    recentOrders: sorted.slice(0, 5).map((order) => ({
      id: order.publicId,
      product: (order.items || []).map((item) => item.name).filter(Boolean).join(', '),
      total: order.totals?.total ?? 0,
      status: order.status,
      date: dateOnly(order.date || order.createdAt),
    })),
  };
}
