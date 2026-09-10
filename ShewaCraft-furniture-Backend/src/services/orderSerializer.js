export function stamp(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function dateOnly(value) {
  const iso = stamp(value);
  return iso ? iso.slice(0, 10) : null;
}

function userIdOf(order) {
  const user = order.user;
  if (user && typeof user === 'object' && user._id) {
    return String(user._id);
  }
  return String(user || '');
}

function userAvatar(order) {
  const user = order.user;
  if (user && typeof user === 'object' && 'avatar' in user) {
    return user.avatar || '';
  }
  return '';
}

export function publicOrder(order) {
  const items = (order.items || []).map((item) => ({
    productId: String(item.product),
    name: item.name,
    image: item.image || '',
    color: item.color || '',
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const first = items[0];
  const customer = order.customer || {};

  return {
    id: order.publicId,
    status: order.status,
    date: dateOnly(order.date) || dateOnly(order.createdAt),
    updatedAt: stamp(order.updatedAt),
    customer: {
      id: userIdOf(order),
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      location: customer.location || '',
      avatar: userAvatar(order),
    },
    items,
    totals: {
      subtotal: order.totals?.subtotal ?? 0,
      shipping: order.totals?.shipping ?? 0,
      tax: order.totals?.tax ?? 0,
      total: order.totals?.total ?? 0,
    },
    payment: {
      method: order.payment?.method || 'bank_transfer',
      bank: order.payment?.bank || '',
      screenshot: order.payment?.screenshot || '',
      reference: order.payment?.reference || '',
    },
    shipping: order.shippingLabel || 'Standard - 3-5 days',
    address: customer.location || '',
    productId: first?.productId || null,
    quantity,
    price: order.totals?.total ?? 0,
    destinationConfirmedAt: stamp(order.destinationConfirmedAt),
    customerReceivedAt: stamp(order.customerReceivedAt),
    rating: order.rating ?? null,
    review: order.review || '',
    notes: order.notes || '',
  };
}
