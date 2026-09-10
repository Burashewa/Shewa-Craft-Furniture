function stamp(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function customerDoc(conversation) {
  const customer = conversation.customer;
  if (customer && typeof customer === 'object' && customer._id) {
    return customer;
  }
  return null;
}

export function publicCustomerMessage(message) {
  return {
    id: String(message._id),
    sender: message.sender === 'admin' ? 'owner' : 'user',
    text: message.text,
    timestamp: stamp(message.createdAt),
  };
}

export function publicAdminMessage(message) {
  return {
    id: String(message._id),
    sender: message.sender,
    text: message.text,
    timestamp: stamp(message.createdAt),
  };
}

export function publicCustomerConversation(conversation, messages) {
  const lastAt = conversation.lastMessageAt || conversation.updatedAt;
  const json = {
    id: String(conversation._id),
    contactName: 'ShewaCraft Support',
    productName: conversation.productName || 'ShewaCraft Support',
    productId: conversation.product ? String(conversation.product) : null,
    productImage: conversation.productImage || '',
    productPrice: conversation.productPrice ?? null,
    preview: conversation.lastMessage || '',
    lastMessage: conversation.lastMessage || '',
    lastMessageAt: stamp(lastAt),
    updatedAt: stamp(lastAt),
    unread: Number(conversation.customerUnread || 0),
  };

  if (messages) {
    json.messages = messages.map(publicCustomerMessage);
  }

  return json;
}

export function publicAdminConversation(conversation, messages) {
  const customer = customerDoc(conversation);
  const lastAt = conversation.lastMessageAt || conversation.updatedAt;
  const json = {
    id: String(conversation._id),
    customerId: customer ? String(customer._id) : String(conversation.customer),
    customerName: customer?.fullName || '',
    customerEmail: customer?.email || '',
    customerAvatar: customer?.avatar || '',
    productId: conversation.product ? String(conversation.product) : null,
    productName: conversation.productName || null,
    productPrice: conversation.productPrice ?? null,
    productImage: conversation.productImage || null,
    orderId: conversation.orderPublicId || null,
    lastMessage: conversation.lastMessage || '',
    lastMessageAt: stamp(lastAt),
    lastMessageTime: stamp(lastAt),
    unread: Boolean(conversation.adminUnread),
  };

  if (messages) {
    json.messages = messages.map(publicAdminMessage);
  }

  return json;
}

export function socketMessage(message) {
  return {
    id: String(message._id),
    sender: message.sender,
    text: message.text,
    timestamp: stamp(message.createdAt),
  };
}

export function socketConversationSummary(conversation) {
  const customer = customerDoc(conversation);
  const lastAt = conversation.lastMessageAt || conversation.updatedAt;
  return {
    id: String(conversation._id),
    customerId: customer ? String(customer._id) : String(conversation.customer),
    customerName: customer?.fullName || '',
    customerEmail: customer?.email || '',
    customerAvatar: customer?.avatar || '',
    productId: conversation.product ? String(conversation.product) : null,
    productName: conversation.productName || '',
    productImage: conversation.productImage || '',
    productPrice: conversation.productPrice ?? null,
    orderId: conversation.orderPublicId || null,
    lastMessage: conversation.lastMessage || '',
    lastMessageAt: stamp(lastAt),
    customerUnread: Number(conversation.customerUnread || 0),
    adminUnread: Boolean(conversation.adminUnread),
  };
}
