export function appendUniqueMessage(messages, incoming) {
  if (!incoming?.id) return messages || [];
  const list = messages || [];
  if (list.some((item) => String(item.id) === String(incoming.id))) return list;
  return [...list, incoming];
}

export function toStorefrontMessage(message) {
  if (!message) return null;
  let sender = message.sender;
  if (sender === 'admin') sender = 'owner';
  if (sender === 'customer') sender = 'user';
  return {
    id: message.id,
    sender,
    text: message.text,
    timestamp: message.timestamp,
  };
}

export function toAdminMessage(message) {
  if (!message) return null;
  return {
    id: message.id,
    sender: message.sender,
    text: message.text,
    timestamp: message.timestamp,
  };
}

export function applyCustomerConversationEvent(list, payload) {
  const id = payload?.conversationId;
  const summary = payload?.conversation || {};
  if (!id) return list;

  const lastAt = summary.lastMessageAt || null;
  const patch = {
    id,
    contactName: 'ShewaCraft Support',
    productName: summary.productName || 'ShewaCraft Support',
    productId: summary.productId ?? null,
    productImage: summary.productImage || '',
    productPrice: summary.productPrice ?? null,
    preview: summary.lastMessage || '',
    lastMessage: summary.lastMessage || '',
    lastMessageAt: lastAt,
    updatedAt: lastAt,
    unread: Number(summary.customerUnread || 0),
  };

  const existing = list.find((item) => item.id === id);
  if (!existing) return [patch, ...list];
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function applyAdminConversationEvent(list, payload) {
  const id = payload?.conversationId;
  const summary = payload?.conversation || {};
  if (!id) return list;

  const incoming = toAdminMessage(payload.message);
  const lastAt = summary.lastMessageAt || null;
  const patch = {
    id,
    customerId: summary.customerId,
    customerName: summary.customerName || '',
    customerEmail: summary.customerEmail || '',
    customerAvatar: summary.customerAvatar || '',
    productId: summary.productId ?? null,
    productName: summary.productName || null,
    productPrice: summary.productPrice ?? null,
    productImage: summary.productImage || null,
    orderId: summary.orderId || null,
    lastMessage: summary.lastMessage || '',
    lastMessageAt: lastAt,
    lastMessageTime: lastAt,
    unread: Boolean(summary.adminUnread),
  };

  const existing = list.find((item) => item.id === id);
  if (!existing) {
    return [{ ...patch, messages: incoming ? [incoming] : [] }, ...list];
  }

  return list.map((item) =>
    item.id === id
      ? {
          ...item,
          ...patch,
          messages: incoming
            ? appendUniqueMessage(item.messages, incoming)
            : item.messages,
        }
      : item
  );
}
