import { api } from './api';

export async function uploadProductImage(file) {
  const body = new FormData();
  body.append('image', file);
  const data = await api('/api/uploads/images', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.url;
}

export async function listAdminProducts() {
  const data = await api('/api/admin/products', { auth: true });
  return Array.isArray(data?.products) ? data.products : [];
}

export async function createAdminProduct(body) {
  const data = await api('/api/admin/products', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.product;
}

export async function updateAdminProduct(id, body) {
  const data = await api(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    auth: true,
    body,
  });
  return data.product;
}

export async function deleteAdminProduct(id) {
  return api(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function updateAdminProductStock(id, body) {
  const data = await api(`/api/admin/products/${encodeURIComponent(id)}/stock`, {
    method: 'PATCH',
    auth: true,
    body,
  });
  return data.product;
}

export async function listAdminOrders({ status = 'all', search = '' } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search.trim()) params.set('search', search.trim());
  const query = params.toString();
  const data = await api(`/api/admin/orders${query ? `?${query}` : ''}`, {
    auth: true,
  });
  return Array.isArray(data?.orders) ? data.orders : [];
}

export async function getAdminOrder(id) {
  const data = await api(`/api/admin/orders/${encodeURIComponent(id)}`, {
    auth: true,
  });
  return data.order;
}

export async function patchAdminOrderStatus(id, status) {
  const data = await api(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    auth: true,
    body: { status },
  });
  return data.order;
}

export async function listAdminCustomers({ status = 'all', search = '' } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search.trim()) params.set('search', search.trim());
  const query = params.toString();
  const data = await api(`/api/admin/customers${query ? `?${query}` : ''}`, {
    auth: true,
  });
  return Array.isArray(data?.customers) ? data.customers : [];
}

export async function patchAdminCustomerStatus(id, status) {
  const data = await api(
    `/api/admin/customers/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      auth: true,
      body: { status },
    }
  );
  return data.customer;
}

export async function listAdminTestimonials({ featured = 'all', search = '' } = {}) {
  const params = new URLSearchParams();
  if (featured && featured !== 'all') params.set('featured', featured);
  if (search.trim()) params.set('search', search.trim());
  const query = params.toString();
  const data = await api(`/api/admin/testimonials${query ? `?${query}` : ''}`, {
    auth: true,
  });
  return Array.isArray(data?.testimonials) ? data.testimonials : [];
}

export async function patchAdminTestimonialFeatured(id, featured) {
  const data = await api(`/api/admin/testimonials/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    auth: true,
    body: { featured },
  });
  return data.testimonial;
}

export async function getAdminDashboard() {
  const data = await api('/api/admin/dashboard', { auth: true });
  return data.dashboard;
}
