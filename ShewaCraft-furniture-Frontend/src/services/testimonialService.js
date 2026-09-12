import { api } from './api';

export async function fetchFeaturedTestimonials() {
  const data = await api('/api/testimonials');
  return Array.isArray(data?.testimonials) ? data.testimonials : [];
}
