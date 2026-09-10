import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import {
  publicAdminConversation,
  publicAdminMessage,
  publicCustomerConversation,
  publicCustomerMessage,
} from '../services/conversationSerializer.js';
import {
  emitAdminReadAll,
  emitConversationMessage,
  emitConversationUnread,
} from '../realtime/chat.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { readSearch } from '../utils/readSearch.js';

const CUSTOMER_POPULATE = { path: 'customer', select: 'fullName email avatar role' };

function readText(body) {
  const text = String(body?.text || '').trim();
  if (!text) {
    throw new AppError(400, 'Enter a message', { text: 'Enter a message' });
  }
  if (text.length > 4000) {
    throw new AppError(400, 'Message is too long', { text: 'Message is too long' });
  }
  return text;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function asObjectId(value) {
  const id = String(value || '').trim();
  if (!id || !mongoose.isValidObjectId(id)) return null;
  return id;
}

async function loadMessages(conversationId) {
  return Message.find({ conversation: conversationId }).sort({ createdAt: 1, _id: 1 });
}

async function loadMessagesByConversation(ids) {
  if (ids.length === 0) return new Map();
  const rows = await Message.find({ conversation: { $in: ids } }).sort({
    createdAt: 1,
    _id: 1,
  });
  const grouped = new Map();
  for (const row of rows) {
    const key = String(row.conversation);
    const list = grouped.get(key) || [];
    list.push(row);
    grouped.set(key, list);
  }
  return grouped;
}

async function applyProductContext(conversation, productId, snapshot = {}) {
  const id = asObjectId(productId);
  if (id) {
    const product = await Product.findById(id);
    if (product) {
      conversation.product = product._id;
      conversation.productName = product.name;
      conversation.productImage = product.images?.[0] || '';
      conversation.productPrice = product.price;
      return;
    }
  }

  const name = String(snapshot.productName || '').trim();
  if (!name) return;

  conversation.productName = name;
  if (snapshot.productImage != null) {
    conversation.productImage = String(snapshot.productImage);
  }
  if (snapshot.productPrice != null && snapshot.productPrice !== '') {
    const price = Number(snapshot.productPrice);
    if (Number.isFinite(price)) conversation.productPrice = price;
  }
}

async function applyOrderContext(conversation, orderId, customerId) {
  const value = String(orderId || '').trim();
  if (!value) return;

  let order = await Order.findOne({ publicId: value });
  if (!order && mongoose.isValidObjectId(value)) {
    order = await Order.findById(value);
  }
  if (!order) {
    conversation.orderPublicId = value;
    return;
  }
  if (String(order.user) !== String(customerId)) return;

  conversation.order = order._id;
  conversation.orderPublicId = order.publicId;

  if (!conversation.productName && order.items?.[0]) {
    const first = order.items[0];
    conversation.product = first.product || conversation.product;
    conversation.productName = first.name || '';
    conversation.productImage = first.image || '';
    conversation.productPrice = first.unitPrice ?? null;
  }
}

async function getOrCreateByCustomer(customerId) {
  let conversation = await Conversation.findOne({ customer: customerId });
  if (conversation) return conversation;

  try {
    conversation = await Conversation.create({ customer: customerId });
    return conversation;
  } catch (err) {
    if (err?.code === 11000) {
      conversation = await Conversation.findOne({ customer: customerId });
      if (conversation) return conversation;
    }
    throw err;
  }
}

async function findOwnedConversation(id, userId) {
  const objectId = asObjectId(id);
  if (!objectId) throw new AppError(404, 'Not found');

  const conversation = await Conversation.findById(objectId);
  if (!conversation || String(conversation.customer) !== String(userId)) {
    throw new AppError(404, 'Not found');
  }
  return conversation;
}

async function findAdminConversation(id) {
  const objectId = asObjectId(id);
  if (!objectId) throw new AppError(404, 'Not found');

  const conversation = await Conversation.findById(objectId).populate(CUSTOMER_POPULATE);
  if (!conversation) throw new AppError(404, 'Not found');
  return conversation;
}

function focusPayload(body = {}) {
  if (body.chatFocus && typeof body.chatFocus === 'object') {
    return { ...body, ...body.chatFocus };
  }
  return body;
}

async function findCustomerFromFocus(body) {
  const focus = focusPayload(body);
  const customerId = asObjectId(focus.customerId);
  if (customerId) {
    const user = await User.findById(customerId);
    if (user && user.role === 'customer') return user;
  }

  const email = String(focus.customerEmail || focus.email || '').trim().toLowerCase();
  if (email) {
    const user = await User.findOne({ email, role: 'customer' });
    if (user) return user;
  }

  throw new AppError(404, 'Not found');
}

async function populateCustomer(conversation) {
  if (!conversation.populated?.('customer') && !conversation.customer?.fullName) {
    await conversation.populate(CUSTOMER_POPULATE);
  }
  return conversation;
}

export const listConversations = asyncHandler(async (req, res) => {
  const rows = await Conversation.find({ customer: req.user._id }).sort({
    lastMessageAt: -1,
    updatedAt: -1,
  });
  res.json({ conversations: rows.map((row) => publicCustomerConversation(row)) });
});

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const conversation = await getOrCreateByCustomer(req.user._id);
  await applyProductContext(conversation, req.body?.productId);
  await conversation.save();

  const messages = await loadMessages(conversation._id);
  res.json({
    conversation: publicCustomerConversation(conversation, messages),
  });
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await findOwnedConversation(req.params.id, req.user._id);
  const messages = await loadMessages(conversation._id);
  res.json({
    conversation: publicCustomerConversation(conversation, messages),
  });
});

export const sendCustomerMessage = asyncHandler(async (req, res) => {
  const text = readText(req.body);
  const conversation = await findOwnedConversation(req.params.id, req.user._id);
  const now = new Date();

  const message = await Message.create({
    conversation: conversation._id,
    sender: 'customer',
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = now;
  conversation.adminUnread = true;
  await conversation.save();
  await populateCustomer(conversation);
  emitConversationMessage({ conversation, message });

  res.status(201).json({
    message: publicCustomerMessage(message),
    conversation: publicCustomerConversation(conversation),
  });
});

export const markCustomerRead = asyncHandler(async (req, res) => {
  const conversation = await findOwnedConversation(req.params.id, req.user._id);
  conversation.customerUnread = 0;
  await conversation.save();
  await populateCustomer(conversation);
  emitConversationUnread(conversation);
  res.json({ ok: true, conversation: publicCustomerConversation(conversation) });
});

export const listAdminConversations = asyncHandler(async (req, res) => {
  const filterParam = String(req.query.filter || 'all').trim().toLowerCase();
  const search = readSearch(req.query.search);
  const query = {};

  if (filterParam === 'unread') {
    query.adminUnread = true;
  }

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    const customers = await User.find({
      role: 'customer',
      $or: [{ fullName: pattern }, { email: pattern }],
    }).select('_id');

    query.$or = [
      { customer: { $in: customers.map((user) => user._id) } },
      { productName: pattern },
      { orderPublicId: pattern },
      { lastMessage: pattern },
    ];
  }

  const rows = await Conversation.find(query)
    .populate(CUSTOMER_POPULATE)
    .sort({ adminUnread: -1, lastMessageAt: -1, updatedAt: -1 });

  const grouped = await loadMessagesByConversation(rows.map((row) => row._id));
  res.json({
    conversations: rows.map((row) =>
      publicAdminConversation(row, grouped.get(String(row._id)) || [])
    ),
  });
});

export const getOrCreateAdminConversation = asyncHandler(async (req, res) => {
  const focus = focusPayload(req.body);
  const customer = await findCustomerFromFocus(focus);
  const conversation = await getOrCreateByCustomer(customer._id);

  await applyProductContext(conversation, focus.productId, focus);
  await applyOrderContext(conversation, focus.orderId, customer._id);
  await conversation.save();
  await conversation.populate(CUSTOMER_POPULATE);

  const messages = await loadMessages(conversation._id);
  res.json({
    conversation: publicAdminConversation(conversation, messages),
  });
});

export const getAdminConversation = asyncHandler(async (req, res) => {
  const conversation = await findAdminConversation(req.params.id);
  const messages = await loadMessages(conversation._id);
  res.json({
    conversation: publicAdminConversation(conversation, messages),
  });
});

export const sendAdminMessage = asyncHandler(async (req, res) => {
  const text = readText(req.body);
  const conversation = await findAdminConversation(req.params.id);
  const now = new Date();

  const message = await Message.create({
    conversation: conversation._id,
    sender: 'admin',
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = now;
  conversation.customerUnread = Number(conversation.customerUnread || 0) + 1;
  conversation.adminUnread = false;
  await conversation.save();
  emitConversationMessage({ conversation, message });

  res.status(201).json({
    message: publicAdminMessage(message),
    conversation: publicAdminConversation(conversation),
  });
});

export const markAdminRead = asyncHandler(async (req, res) => {
  const conversation = await findAdminConversation(req.params.id);
  conversation.adminUnread = false;
  await conversation.save();
  emitConversationUnread(conversation);
  res.json({ ok: true, conversation: publicAdminConversation(conversation) });
});

export const markAllAdminRead = asyncHandler(async (_req, res) => {
  await Conversation.updateMany({ adminUnread: true }, { $set: { adminUnread: false } });
  emitAdminReadAll();
  res.json({ ok: true });
});
