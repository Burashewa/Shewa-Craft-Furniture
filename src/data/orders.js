export const ORDER_STATUS_FLOW = [
  'pending',
  'approved',
  'shipped',
  'delivered',
  'completed',
];

const emptyConfirmation = {
  destinationConfirmedAt: null,
  customerReceivedAt: null,
  rating: null,
  review: '',
};

export const orders = [
  {
    id: 'ORD-1001',
    date: '2024-11-01',
    status: 'pending',
    productId: 1,
    quantity: 1,
    price: 899.0,
    shipping: 'Standard - 3-5 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '4242' },
    ...emptyConfirmation,
  },
  {
    id: 'ORD-1002',
    date: '2024-10-28',
    status: 'approved',
    productId: 2,
    quantity: 1,
    price: 549.0,
    shipping: 'Standard - 3-5 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '4242' },
    ...emptyConfirmation,
  },
  {
    id: 'ORD-1003',
    date: '2024-10-22',
    status: 'shipped',
    productId: 3,
    quantity: 1,
    price: 2299.0,
    shipping: 'Express - 1-2 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '1111' },
    ...emptyConfirmation,
  },
  {
    id: 'ORD-1004',
    date: '2024-10-18',
    status: 'delivered',
    productId: 1,
    quantity: 1,
    price: 899.0,
    shipping: 'Standard - 3-5 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '4242' },
    destinationConfirmedAt: '2024-10-20',
    customerReceivedAt: null,
    rating: null,
    review: '',
  },
  {
    id: 'ORD-1005',
    date: '2024-10-10',
    status: 'rejected',
    productId: 2,
    quantity: 1,
    price: 549.0,
    shipping: 'Standard - 3-5 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '1111' },
    ...emptyConfirmation,
  },
  {
    id: 'ORD-1006',
    date: '2024-10-05',
    status: 'completed',
    productId: 4,
    quantity: 1,
    price: 459.0,
    shipping: 'Standard - 3-5 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '4242' },
    destinationConfirmedAt: '2024-10-08',
    customerReceivedAt: '2024-10-09',
    rating: 5,
    review: 'Solid build and arrived in great condition.',
  },
];

export function formatOrderStatus(status) {
  const value = (status || '').toLowerCase();
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getStatusClasses(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'approved':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'rejected':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'shipped':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'delivered':
      return 'bg-violet-50 text-violet-800 border-violet-200';
    case 'completed':
      return 'bg-gray-900 text-white border-gray-900';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function getOrderStatusSteps(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'rejected') {
    return ['pending', 'rejected'];
  }
  return ORDER_STATUS_FLOW;
}

export function canTransition(from, to) {
  const current = (from || '').toLowerCase();
  const next = (to || '').toLowerCase();
  if (current === 'pending') return next === 'approved' || next === 'rejected';
  if (current === 'approved') return next === 'shipped';
  if (current === 'shipped') return next === 'delivered';
  if (current === 'delivered') return next === 'completed';
  return false;
}

export function hasOrderRating(order) {
  return Number(order?.rating) >= 1;
}

export function canCustomerConfirmReceipt(order) {
  return (order?.status || '').toLowerCase() === 'delivered';
}

export function canCustomerRate(order) {
  return (order?.status || '').toLowerCase() === 'completed' && !hasOrderRating(order);
}

export function formatOrderStamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
