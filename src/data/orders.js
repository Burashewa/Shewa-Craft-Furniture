export const ORDER_STATUS_FLOW = ['pending', 'approved', 'shipped', 'delivered'];

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
