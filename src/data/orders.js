export const orders = [
  {
    id: 'ORD-1001',
    date: '2024-11-01',
    status: 'Processing',
    orderStatus: 'Pending',
    productId: 1,
    quantity: 1,
    price: 899.0,
    shipping: 'Standard - 3-5 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '4242' },
  },
  {
    id: 'ORD-1002',
    date: '2024-10-18',
    status: 'Delivered',
    orderStatus: 'Approved',
    productId: 3,
    quantity: 1,
    price: 2299.0,
    shipping: 'Express - 1-2 days',
    address: '123 Main St, City, Country',
    payment: { method: 'Card', last4: '1111' },
  },
];

export function getStatusClasses(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'delivered' || normalized === 'approved') {
    return 'bg-gray-900 text-white';
  }
  if (normalized === 'rejected') {
    return 'bg-gray-200 text-gray-700';
  }
  return 'bg-gray-100 text-gray-800';
}
