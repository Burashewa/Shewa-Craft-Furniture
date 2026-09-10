import { api } from './api';

export async function getCart() {
  return api('/api/cart', { auth: true });
}

export async function addCartItem({ productId, quantity = 1, color = '' }) {
  return api('/api/cart/items', {
    method: 'POST',
    auth: true,
    body: { productId, quantity, color },
  });
}

export async function updateCartItem(itemId, quantity) {
  return api(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    auth: true,
    body: { quantity },
  });
}

export async function removeCartItem(itemId) {
  return api(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function saveCartItemForLater(itemId) {
  return api(`/api/cart/save-for-later/${encodeURIComponent(itemId)}`, {
    method: 'POST',
    auth: true,
  });
}

export async function moveSavedItemToCart(itemId) {
  return api(`/api/cart/move-to-cart/${encodeURIComponent(itemId)}`, {
    method: 'POST',
    auth: true,
  });
}

export async function removeSavedCartItem(itemId) {
  return api(`/api/cart/saved/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    auth: true,
  });
}
