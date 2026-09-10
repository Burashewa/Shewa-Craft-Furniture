import { api } from './api';

export async function listBanks() {
  const data = await api('/api/checkout/banks');
  return Array.isArray(data?.banks) ? data.banks : [];
}

export async function listOrders() {
  const data = await api('/api/orders', { auth: true });
  return Array.isArray(data?.orders) ? data.orders : [];
}

export async function createOrder({ bankId, location, phoneNumber, screenshot }) {
  const body = new FormData();
  body.append('bankId', String(bankId));
  body.append('location', location);
  body.append('phoneNumber', phoneNumber);
  body.append('screenshot', screenshot);
  return api('/api/orders', { method: 'POST', auth: true, body });
}

export async function confirmReceipt(orderId) {
  return api(`/api/orders/${encodeURIComponent(orderId)}/confirm-receipt`, {
    method: 'POST',
    auth: true,
  });
}

export async function submitRating(orderId, { rating, review = '' }) {
  return api(`/api/orders/${encodeURIComponent(orderId)}/rating`, {
    method: 'POST',
    auth: true,
    body: { rating, review },
  });
}
