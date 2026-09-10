import { api } from './api';

export async function listFavorites() {
  const data = await api('/api/favorites', { auth: true });
  return Array.isArray(data?.favorites) ? data.favorites : [];
}

export async function addFavorite(productId) {
  const data = await api('/api/favorites', {
    method: 'POST',
    auth: true,
    body: { productId },
  });
  return data.favorite;
}

export async function removeFavorite(productId) {
  return api(`/api/favorites/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function clearFavorites() {
  return api('/api/favorites', { method: 'DELETE', auth: true });
}
