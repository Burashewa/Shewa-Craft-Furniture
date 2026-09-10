import { api } from './api';

export async function listConversations() {
  const data = await api('/api/conversations', { auth: true });
  return Array.isArray(data?.conversations) ? data.conversations : [];
}

export async function getOrCreateConversation(productId) {
  const body = {};
  if (productId) body.productId = String(productId);
  const data = await api('/api/conversations', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.conversation;
}

export async function getConversation(id) {
  const data = await api(`/api/conversations/${encodeURIComponent(id)}`, {
    auth: true,
  });
  return data.conversation;
}

export async function sendConversationMessage(id, text) {
  const data = await api(`/api/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    auth: true,
    body: { text },
  });
  return data;
}

export async function markConversationRead(id) {
  return api(`/api/conversations/${encodeURIComponent(id)}/read`, {
    method: 'POST',
    auth: true,
  });
}

export async function listAdminConversations({ filter = 'all', search = '' } = {}) {
  const params = new URLSearchParams();
  if (filter && filter !== 'all') params.set('filter', filter);
  if (search.trim()) params.set('search', search.trim());
  const query = params.toString();
  const data = await api(
    `/api/admin/conversations${query ? `?${query}` : ''}`,
    { auth: true }
  );
  return Array.isArray(data?.conversations) ? data.conversations : [];
}

export async function getOrCreateAdminConversation(chatFocus) {
  const data = await api('/api/admin/conversations', {
    method: 'POST',
    auth: true,
    body: chatFocus,
  });
  return data.conversation;
}

export async function sendAdminConversationMessage(id, text) {
  const data = await api(
    `/api/admin/conversations/${encodeURIComponent(id)}/messages`,
    {
      method: 'POST',
      auth: true,
      body: { text },
    }
  );
  return data;
}

export async function markAdminConversationRead(id) {
  return api(`/api/admin/conversations/${encodeURIComponent(id)}/read`, {
    method: 'POST',
    auth: true,
  });
}

export async function markAllAdminConversationsRead() {
  return api('/api/admin/conversations/read-all', {
    method: 'POST',
    auth: true,
  });
}
