import { motion, useReducedMotion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Send, MessageCircle } from 'lucide-react';
import { formatMessageTime } from '../data/messages';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import { useToast } from '../context/ToastContext';
import {
  useChatSocketEvent,
  useConversationRoom,
} from '../context/ChatSocketContext';
import {
  getOrCreateConversation,
  sendConversationMessage,
} from '../services/messageService';
import {
  appendUniqueMessage,
  toStorefrontMessage,
} from '../services/chatEvents';
import shewaCraftLogo from '../assets/ShewaCraft_Logo.png';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ChatBox({ product, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const { isAuthenticated } = useAuth();
  const { refresh } = useMessages();
  const { showToast } = useToast();
  const location = useLocation();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(isAuthenticated);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sendingLock = useRef(false);

  const responseTime = 'within 2 hours';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [messages, prefersReducedMotion]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    const load = async () => {
      try {
        const conversation = await getOrCreateConversation(product.id);
        if (!active) return;
        setConversationId(conversation.id);
        setMessages(conversation.messages || []);
        await refresh();
      } catch (err) {
        if (!active) return;
        showToast({
          type: 'error',
          title: 'Could not open chat',
          message: err.message || 'Unable to load this conversation.',
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated, product.id, refresh, showToast]);

  useConversationRoom(conversationId);

  useChatSocketEvent('conversation:message', (payload) => {
    if (!payload?.message || payload.conversationId !== conversationId) return;
    const incoming = toStorefrontMessage(payload.message);
    setMessages((prev) => appendUniqueMessage(prev, incoming));
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversationId || sendingLock.current) return;

    const text = inputValue.trim();
    sendingLock.current = true;
    setIsSending(true);

    try {
      const data = await sendConversationMessage(conversationId, text);
      setInputValue('');
      if (data?.message) {
        setMessages((prev) => appendUniqueMessage(prev, data.message));
      }
      await refresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not send message',
        message: err.message || 'Unable to send your message.',
      });
    } finally {
      sendingLock.current = false;
      setIsSending(false);
    }
  };

  const formatTime = (message) => {
    if (message.timestampLabel) return message.timestampLabel;
    if (!message.timestamp) return '';
    if (typeof message.timestamp === 'string') {
      return formatMessageTime(message.timestamp);
    }
    return message.timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const drawerMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 24 },
      };

  return (
    <MotionDiv
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-chat-title"
      className="fixed inset-0 z-60 md:inset-y-0 md:left-auto md:right-0 md:w-full md:max-w-105 flex flex-col bg-white border-l border-gray-200 shadow-xl"
      {...drawerMotion}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="shrink-0 bg-gray-900 text-white px-4 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={shewaCraftLogo}
            alt=""
            className="w-10 h-10 object-contain bg-white rounded-md shrink-0 p-0.5"
          />
          <div className="min-w-0">
            <h3 id="owner-chat-title" className="text-sm font-medium truncate">
              ShewaCraft Support
            </h3>
            <p className="text-xs text-white/70 truncate">
              Typically replies {responseTime}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center transition shrink-0 ${focusRing} focus-visible:ring-offset-gray-900`}
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="shrink-0 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-12 h-12 object-cover bg-gray-100 shrink-0 border border-gray-200 rounded-md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{product.name}</p>
            <p className="text-sm text-gray-500">
              ${Number(product.price).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-gray-50/80">
        {!isAuthenticated ? (
          <div className="h-full min-h-48 flex flex-col items-center justify-center text-center px-6">
            <MessageCircle
              className="w-10 h-10 text-gray-300 mb-3"
              aria-hidden
            />
            <p className="text-sm text-gray-900 font-medium">Sign in to chat</p>
            <p className="text-xs text-gray-500 mt-1 max-w-64 mb-4">
              Sign in so your questions about this product are saved in Messages.
            </p>
            <Link
              to="/auth/signin"
              state={{ from: location }}
              className={`inline-flex px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 transition ${focusRing}`}
            >
              Sign in
            </Link>
          </div>
        ) : loading ? (
          <div className="h-full min-h-48 flex items-center justify-center">
            <p className="text-sm text-gray-500">Loading conversation…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full min-h-48 flex flex-col items-center justify-center text-center px-6">
            <MessageCircle
              className="w-10 h-10 text-gray-300 mb-3"
              aria-hidden
            />
            <p className="text-sm text-gray-900 font-medium">Start the conversation</p>
            <p className="text-xs text-gray-500 mt-1 max-w-64">
              Ask about availability, details, or delivery for this product.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-md ${
                  message.sender === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap wrap-break-word">
                  {message.text}
                </p>
                <p
                  className={`text-[11px] mt-1.5 ${
                    message.sender === 'user'
                      ? 'text-white/55'
                      : 'text-gray-400'
                  }`}
                >
                  {formatTime(message)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {isAuthenticated && (
        <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Is this still available?', 'More details?', 'Delivery time?'].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setInputValue(label);
                    inputRef.current?.focus();
                  }}
                  className={`px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition ${focusRing}`}
                >
                  {label}
                </button>
              )
            )}
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <label htmlFor="owner-chat-input" className="sr-only">
              Message
            </label>
            <input
              ref={inputRef}
              id="owner-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
              disabled={!conversationId || isSending}
              className={`flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || !conversationId || isSending}
              className={`px-3.5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0 ${focusRing}`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </MotionDiv>
  );
}
