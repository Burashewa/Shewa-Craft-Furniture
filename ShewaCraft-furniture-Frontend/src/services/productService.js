import { api } from './api';

export async function fetchProducts() {
  const data = await api('/api/products');
  return Array.isArray(data?.products) ? data.products : [];
}
