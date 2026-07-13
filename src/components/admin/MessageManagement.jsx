import { useState, useEffect, useRef } from 'react';
import { Search, Mail, Send, ArrowLeft, Package } from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  {
    id: '1',
    customerId: 'cust-001',
    customerName: 'John Smith',
    customerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    productId: 1,
    productName: 'Luxury Velvet Armchair',
    productPrice: 899,
    productImage:
      'https://images.unsplash.com/photo-1765663241884-ebd171bdda1d?w=200&h=200&fit=crop',
    orderId: null,
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: "Hi, I'm interested in this armchair. Do you have it in Navy?",
        timestamp: '10:30 AM',
      },
      {
        id: 'm2',
        sender: 'admin',
        text: "Hello! Yes — Navy is in stock and one of our most requested finishes.",
        timestamp: '10:35 AM',
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Great! Can you ship to New York?',
        timestamp: '10:37 AM',
      },
    ],
    unread: true,
    lastMessage: 'Great! Can you ship to New York?',
    lastMessageTime: '10:37 AM',
  },
  {
    id: '2',
    customerId: 'cust-002',
    customerName: 'Sarah Johnson',
    customerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    productId: 2,
    productName: 'Dining Table Set',
    productPrice: 899,
    productImage:
      'https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?w=200&h=200&fit=crop',
    orderId: 'ORD-002',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'I submitted payment for ORD-002. Could you confirm you received it?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm2',
        sender: 'admin',
        text: "We've received your payment proof and are reviewing it now. You'll hear from us shortly.",
        timestamp: 'Yesterday',
      },
    ],
    unread: false,
    lastMessage: "We've received your payment proof and are reviewing it now.",
    lastMessageTime: 'Yesterday',
  },
  {
    id: '3',
    customerId: 'cust-004',
    customerName: 'Emily Davis',
    customerAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    productId: null,
    productName: null,
    productPrice: null,
    productImage: null,
    orderId: null,
    messages: [
      {
        id: 'm1',
        sender: 'admin',
        text: 'Hi Emily, we wanted to follow up on your recent account status. Please reply if you have questions.',
        timestamp: 'Mon',
      },
    ],
    unread: false,
    lastMessage: 'Hi Emily, we wanted to follow up on your recent account status.',
    lastMessageTime: 'Mon',
  },
];

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessagesManagement({ chatFocus, onChatFocusConsumed }) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxFilter, setInboxFilter] = useState('all');
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const pendingFocusRef = useRef(null);

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
    if (!chatFocus?.customerId) return;

    const focus = chatFocus;
    pendingFocusRef.current = focus;
    onChatFocusConsumed?.();

    setConversations((prev) => {
      const existing = prev.find((c) => c.customerId === focus.customerId);

      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                productId: focus.productId ?? c.productId,
                productName: focus.productName ?? c.productName,
                productPrice: focus.productPrice ?? c.productPrice,
                productImage: focus.productImage ?? c.productImage,
                orderId: focus.orderId ?? c.orderId,
                unread: false,
              }
            : c
        );
      }

      const firstName = focus.customerName?.split(' ')[0] || 'there';
      const opener = focus.orderId
        ? `Hi ${firstName}, I'm reaching out about your order ${focus.orderId}${
            focus.productName ? ` (${focus.productName})` : ''
          }. How can I help?`
        : `Hi ${firstName}, how can I help you today?`;

      return [
        {
          id: `conv-${focus.customerId}-${focus.orderId || 'new'}`,
          customerId: focus.customerId,
          customerName: focus.customerName,
          customerAvatar: focus.customerAvatar,
          productId: focus.productId ?? null,
          productName: focus.productName ?? null,
          productPrice: focus.productPrice ?? null,
          productImage: focus.productImage ?? null,
          orderId: focus.orderId ?? null,
          messages: [
            {
              id: `m-${Date.now()}`,
              sender: 'admin',
              text: opener,
              timestamp: formatTime(),
            },
          ],
          unread: false,
          lastMessage: opener,
          lastMessageTime: 'Just now',
        },
        ...prev,
      ];
    });
  }, [chatFocus, onChatFocusConsumed]);

  useEffect(() => {
    const focus = pendingFocusRef.current;
    if (!focus?.customerId) return;

    const match = conversations.find((c) => c.customerId === focus.customerId);
    if (!match) return;

    setSelectedConversation(match);
    pendingFocusRef.current = null;
  }, [conversations]);

  const filteredConversations = conversations
    .filter((conv) => {
      if (inboxFilter === 'unread' && !conv.unread) return false;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return (
        conv.customerName.toLowerCase().includes(query) ||
        (conv.productName && conv.productName.toLowerCase().includes(query)) ||
        (conv.orderId && conv.orderId.toLowerCase().includes(query)) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => Number(b.unread) - Number(a.unread));

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selectedConversation) return;

    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          id: `m-${Date.now()}`,
          sender: 'admin',
          text,
          timestamp: formatTime(),
        },
      ],
      lastMessage: text,
      lastMessageTime: 'Just now',
      unread: false,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );
    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      )
    );
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleMarkAllRead = () => {
    setConversations((prev) => prev.map((conv) => ({ ...conv, unread: false })));
    if (selectedConversation) {
      setSelectedConversation({ ...selectedConversation, unread: false });
    }
  };

  const unreadCount = conversations.filter((c) => c.unread).length;
  const hasProductContext = Boolean(
    selectedConversation?.productName && selectedConversation?.productImage
  );

  return (
    <div className="lg:pt-0 pt-16 h-[calc(100vh)] flex flex-col">
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
              className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2 self-start"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search conversations"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInboxFilter('all')}
                className={`px-3 py-1.5 text-sm border transition ${
                  inboxFilter === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setInboxFilter('unread')}
                className={`px-3 py-1.5 text-sm border transition ${
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
                <p className="text-sm text-gray-600">No conversations found</p>
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
                    className="mt-3 text-sm text-gray-700 underline underline-offset-2"
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
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-gray-50 border-l-2 border-l-gray-900'
                      : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={conversation.customerAvatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
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
                          {conversation.lastMessageTime}
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
                  className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 transition"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedConversation.customerAvatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {selectedConversation.customerName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedConversation.customerId}
                  </p>
                </div>
              </div>

              {hasProductContext ? (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
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
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
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
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'admin' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md px-4 py-2.5 ${
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
                      {message.timestamp}
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
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  aria-label="Message text"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
    </div>
  );
}
