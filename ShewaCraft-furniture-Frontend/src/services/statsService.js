import { api } from './api';

export async function fetchAboutStats() {
  const data = await api('/api/stats');
  const stats = data?.stats || {};
  return {
    reviewCount: Math.max(0, Number(stats.reviewCount) || 0),
    averageRating: Number(stats.averageRating) || 0,
  };
}
