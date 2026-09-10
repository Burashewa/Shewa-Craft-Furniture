import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Mail, Send, ArrowLeft, Package } from 'lucide-react';
import { formatMessageTime } from '../../data/messages';
import { useToast } from '../../context/ToastContext';
import { useConversationRoom } from '../../context/ChatSocketContext';
import {
  getOrCreateAdminConversation,
  markAdminConversationRead,
  markAllAdminConversationsRead,
  sendAdminConversationMessage,
} from '../../services/messageService';
import { appendUniqueMessage } from '../../services/chatEvents';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

function CustomerAvatar({ src, name, className }) {
  if (src) {
    return <img src={src} alt="" className={`${className} object-cover rounded-full`} />;
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <div
      className={`${className} rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-medium`}
    >
      {initial}
    </div>
  );
}

function displayTime(value) {
  return formatMessageTime(value) || '';
}

export function MessagesManagement({
  chatFocus,
  onChatFocusConsumed,
  conversations,
  onConversationsChange,
  onRefreshConversations,
  loading = false,
}) {
  const setConversations = onConversationsChange;
  const { showToast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxFilter, setInboxFilter] = useState('all');
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  useConversationRoom(selectedConversation?.id);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || !selectedConversation) return;
    el.scrollTop = el.scrollHeight;
  }, [selectedConversation?.id, selectedConversation?.messages?.length]);

  useEffect(() => {
    if (!selectedConversation) return;
    messageInputRef.current?.focus();
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!selectedConversation) return;
    const match = conversations.find((c) => c.id === selectedConversation.id);
    if (match) setSelectedConversation(match);
  }, [conversations, selectedConversation?.id]);

  useEffect(() => {
    if (!chatFocus?.customerId && !chatFocus?.customerEmail) return;

    const focus = chatFocus;
    onChatFocusConsumed?.();

    let cancelled = false;
    (async () => {
      try {
        const conversation = await getOrCreateAdminConversation(focus);
        if (cancelled) return;
        if (onRefreshConversations) {
          await onRefreshConversations();
        } else {
          setConversations((prev) => {
            const exists = prev.some((item) => item.id === conversation.id);
            if (exists) {
              return prev.map((item) =>
                item.id === conversation.id ? conversation : item
              );
            }
            return [conversation, ...prev];
          });
        }
        setSelectedConversation(conversation);
      } catch (err) {
        if (cancelled) return;
        showToast({
          type: 'error',
          title: 'Could not open chat',
          message:
            err.message ||
            'This customer is not in the live account list yet.',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chatFocus, onChatFocusConsumed, onRefreshConversations, setConversations, showToast]);

  const filteredConversations = conversations
    .filter((conv) => {
      if (inboxFilter === 'unread' && !conv.unread) return false;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return (
        (conv.customerName || '').toLowerCase().includes(query) ||
        (conv.customerEmail || '').toLowerCase().includes(query) ||
        (conv.productName && conv.productName.toLowerCase().includes(query)) ||
        (conv.orderId && conv.orderId.toLowerCase().includes(query)) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => Number(b.unread) - Number(a.unread));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selectedConversation || sending) return;

    setSending(true);
    try {
      const data = await sendAdminConversationMessage(selectedConversation.id, text);
      const updatedConversation = {
        ...selectedConversation,
        ...data.conversation,
        unread: false,
        messages: appendUniqueMessage(
          selectedConversation.messages,
          data.message
        ),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id ? { ...conv, ...updatedConversation } : conv
        )
      );
      setSelectedConversation(updatedConversation);
      setNewMessage('');
      await onRefreshConversations?.();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not send message',
        message: err.message || 'Unable to send your reply.',
      });
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    if (!conversation.unread) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      )
    );
    try {
      await markAdminConversationRead(conversation.id);
      await onRefreshConversations?.();
    } catch {
      /* keep optimistic unread clear */
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleMarkAllRead = async () => {
    setConversations((prev) => prev.map((conv) => ({ ...conv, unread: false })));
    if (selectedConversation) {
      setSelectedConversation({ ...selectedConversation, unread: false });
    }
    try {
      await markAllAdminConversationsRead();
      await onRefreshConversations?.();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not mark as read',
        message: err.message || 'Unable to update unread state.',
      });
    }
  };

  const unreadCount = conversations.filter((c) => c.unread).length;
  const hasProductContext = Boolean(
    selectedConversation?.productName && selectedConversation?.productImage
  );

  const entrance = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <MotionDiv
      className="lg:pt-0 pt-16 h-[calc(100vh)] flex flex-col"
      {...entrance}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Customer conversations
              {unreadCount > 0 && (
                <span className="text-gray-900"> · {unreadCount} unread</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className={`text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2 self-start transition duration-200 ${focusRing}`}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div
          className={`w-full md:w-96 border-r border-gray-200 bg-white flex flex-col ${
            selectedConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, product, or order..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search conversations"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInboxFilter('all')}
                aria-pressed={inboxFilter === 'all'}
                className={`px-3 py-1.5 text-sm border rounded-md transition duration-200 ${focusRing} ${
                  inboxFilter === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setInboxFilter('unread')}
                aria-pressed={inboxFilter === 'unread'}
                className={`px-3 py-1.5 text-sm border rounded-md transition duration-200 ${focusRing} ${
                  inboxFilter === 'unread'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading conversations…' : 'No conversations found'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {inboxFilter === 'unread'
                    ? 'You are caught up — no unread threads.'
                    : 'Try a different name, product, or order ID.'}
                </p>
                {(searchQuery || inboxFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setInboxFilter('all');
                    }}
                    className={`mt-3 text-sm text-gray-700 underline underline-offset-2 transition duration-200 ${focusRing}`}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200 text-left ${focusRing} ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-gray-50 border-l-2 border-l-gray-900'
                      : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <CustomerAvatar
                        src={conversation.customerAvatar}
                        name={conversation.customerName}
                        className="w-12 h-12"
                      />
                      {conversation.unread && (
                        <span
                          className="absolute top-0 right-0 w-3 h-3 bg-gray-900 rounded-full border-2 border-white"
                          aria-label="Unread"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p
                          className={`text-sm truncate ${
                            conversation.unread
                              ? 'font-semibold text-gray-900'
                              : 'font-medium text-gray-900'
                          }`}
                        >
                          {conversation.customerName}
                        </p>
                        <span className="text-xs text-gray-500 shrink-0">
                          {displayTime(
                            conversation.lastMessageTime || conversation.lastMessageAt
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 truncate">
                        {conversation.orderId
                          ? `Order ${conversation.orderId}`
                          : conversation.productName || 'General inquiry'}
                      </p>
                      <p
                        className={`text-sm truncate ${
                          conversation.unread
                            ? 'font-medium text-gray-900'
                            : 'text-gray-600'
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white min-w-0">
            <div className="border-b border-gray-200">
              <div className="p-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className={`md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 transition duration-200 ${focusRing}`}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <CustomerAvatar
                  src={selectedConversation.customerAvatar}
                  name={selectedConversation.customerName}
                  className="w-10 h-10"
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {selectedConversation.customerName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedConversation.customerEmail || selectedConversation.customerId}
                  </p>
                </div>
              </div>

              {hasProductContext ? (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <img
                      src={selectedConversation.productImage}
                      alt=""
                      className="w-12 h-12 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        {selectedConversation.orderId
                          ? `Regarding order ${selectedConversation.orderId}`
                          : 'Regarding product'}
                      </p>
                      <p className="font-medium text-gray-900 truncate">
                        {selectedConversation.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${selectedConversation.productPrice}
                      </p>
                    </div>
                    <Package className="w-5 h-5 text-gray-400 shrink-0" />
                  </div>
                </div>
              ) : selectedConversation.orderId ? (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Package className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Regarding order</p>
                      <p className="font-medium text-gray-900">
                        {selectedConversation.orderId}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
            >
              {selectedConversation.messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'admin' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-md ${
                      message.sender === 'admin'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1.5 ${
                        message.sender === 'admin'
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {displayTime(message.timestamp)}
                      {message.sender === 'admin' ? ' · You' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex gap-2">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedConversation.customerName.split(' ')[0]}…`}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  aria-label="Message text"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className={`px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${focusRing}`}
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center px-6">
              <Mail className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-1">Select a conversation</p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Choose a customer on the left to view the thread and reply.
              </p>
            </div>
          </div>
        )}
      </div>
    </MotionDiv>
  );
}
