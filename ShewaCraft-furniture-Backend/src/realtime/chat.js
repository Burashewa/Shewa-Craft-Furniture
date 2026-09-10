import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';
import { verifyAccessToken } from '../services/tokenService.js';
import {
  socketConversationSummary,
  socketMessage,
} from '../services/conversationSerializer.js';

let io = null;

function conversationRoom(id) {
  return `conversation:${id}`;
}

function userRoom(id) {
  return `user:${id}`;
}

function readHandshakeToken(socket) {
  const authToken = socket.handshake.auth?.token;
  if (authToken) return String(authToken).trim();
  const header = socket.handshake.headers?.authorization || '';
  const [scheme, token] = String(header).split(' ');
  if (scheme === 'Bearer' && token) return token.trim();
  return null;
}

async function canJoinConversation(socket, conversationId) {
  if (!conversationId || !mongoose.isValidObjectId(conversationId)) return null;
  const conversation = await Conversation.findById(conversationId).select('customer');
  if (!conversation) return null;
  if (socket.user.role === 'admin') return conversation;
  if (String(conversation.customer) === String(socket.user._id)) return conversation;
  return null;
}

export function attachChat(server) {
  io = new Server(server, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = readHandshakeToken(socket);
      if (!token) {
        return next(new Error('Invalid or expired session'));
      }
      const payload = verifyAccessToken(token);
      const userId = payload.sub;
      if (!userId) {
        return next(new Error('Invalid or expired session'));
      }
      const user = await User.findById(userId).select('_id role');
      if (!user) {
        return next(new Error('Invalid or expired session'));
      }
      socket.user = { _id: user._id, role: user.role };
      next();
    } catch {
      next(new Error('Invalid or expired session'));
    }
  });

  io.on('connection', (socket) => {
    const userId = String(socket.user._id);
    socket.join(userRoom(userId));
    if (socket.user.role === 'admin') {
      socket.join('admin');
    }

    socket.on('conversation:join', async (payload, ack) => {
      const reply = typeof ack === 'function' ? ack : () => {};
      const conversationId = String(payload?.conversationId || '').trim();
      const conversation = await canJoinConversation(socket, conversationId);
      if (!conversation) {
        return reply({ error: 'Not found' });
      }
      socket.join(conversationRoom(conversationId));
      reply({ ok: true });
    });

    socket.on('conversation:leave', (payload, ack) => {
      const conversationId = String(payload?.conversationId || '').trim();
      if (conversationId) socket.leave(conversationRoom(conversationId));
      if (typeof ack === 'function') ack({ ok: true });
    });
  });

  return io;
}

function emitToConversationAudience(conversationId, customerId, event, payload) {
  if (!io) return;
  io.to(conversationRoom(conversationId))
    .to(userRoom(customerId))
    .to('admin')
    .emit(event, payload);
}

export function emitConversationMessage({ conversation, message }) {
  const conversationId = String(conversation._id);
  const customerId = String(conversation.customer?._id || conversation.customer);
  emitToConversationAudience(conversationId, customerId, 'conversation:message', {
    conversationId,
    message: socketMessage(message),
    conversation: socketConversationSummary(conversation),
  });
}

export function emitConversationUnread(conversation) {
  const conversationId = String(conversation._id);
  const customerId = String(conversation.customer?._id || conversation.customer);
  emitToConversationAudience(conversationId, customerId, 'conversation:unread', {
    conversationId,
    conversation: socketConversationSummary(conversation),
  });
}

export function emitAdminReadAll() {
  if (!io) return;
  io.to('admin').emit('conversation:unread', { all: true, adminUnread: false });
}
