export const ORDER_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'shipped',
  'delivered',
  'completed',
];

export function canTransition(from, to) {
  const current = String(from || '').toLowerCase();
  const next = String(to || '').toLowerCase();
  if (current === 'pending') return next === 'approved' || next === 'rejected';
  if (current === 'approved') return next === 'shipped';
  if (current === 'shipped') return next === 'delivered';
  if (current === 'delivered') return next === 'completed';
  return false;
}

export function canAdminTransition(from, to) {
  const next = String(to || '').toLowerCase();
  if (next === 'completed') return false;
  return canTransition(from, to);
}
