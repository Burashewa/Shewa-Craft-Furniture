import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import {
  conversations as mockConversations,
  getUnreadCount,
  OWNER_RESPONSES,
} from '../../data/messages';
import { products } from '../../data/products';
import { MessagesHeader } from './MessagesHeader';
import { ConversationList } from './ConversationList';
import { ConversationThread } from './ConversationThread';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0]?.id ?? null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const sendingLock = useRef(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const productsById = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    []
  );

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      ),
    [conversations]
  );

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;
  const activeProduct = activeConversation
    ? productsById[activeConversation.productId]
    : null;
  const unreadCount = getUnreadCount(conversations);

  const handleSelect = (id) => {
    setActiveId(id);
    setInputValue('');
    setMobileShowThread(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation || sendingLock.current) return;

    const text = inputValue.trim();
    sendingLock.current = true;
    setIsSending(true);
    const sentAt = new Date();
    const userMessage = {
      id: sentAt.getTime(),
      sender: 'user',
      text,
      timestamp: sentAt.toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              preview: text,
              updatedAt: userMessage.timestamp,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    );
    setInputValue('');
    setIsTyping(true);
    window.setTimeout(() => {
      sendingLock.current = false;
      setIsSending(false);
    }, 280);

    window.setTimeout(() => {
      const replyAt = new Date();
      const reply = {
        id: replyAt.getTime() + 1,
        sender: 'owner',
        text: OWNER_RESPONSES[
          Math.floor(Math.random() * OWNER_RESPONSES.length)
        ],
        timestamp: replyAt.toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                preview: reply.text,
                updatedAt: reply.timestamp,
                messages: [...c.messages, reply],
              }
            : c
        )
      );
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <MessagesHeader
        conversationCount={conversations.length}
        unreadCount={unreadCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {conversations.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white rounded-lg">
            <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start a conversation from a product page when you have a question
              about a piece.
            </p>
            <Link
              to="/products"
              className={`inline-flex px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition ${focusRing}`}
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6 min-h-[70vh] lg:h-[calc(100vh-14rem)]">
            <div
              className={`lg:col-span-1 border border-gray-200 bg-white rounded-lg flex flex-col min-h-0 overflow-hidden ${
                mobileShowThread ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div className="shrink-0 px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  Inbox
                </h2>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ConversationList
                  conversations={sortedConversations}
                  activeId={activeId}
                  onSelect={handleSelect}
                  productsById={productsById}
                />
              </div>
            </div>

            <div
              className={`lg:col-span-2 flex flex-col min-h-0 ${
                mobileShowThread ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <button
                type="button"
                onClick={() => setMobileShowThread(false)}
                className={`lg:hidden mb-3 inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition self-start ${focusRing}`}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden />
                Back to inbox
              </button>
              <ConversationThread
                conversation={activeConversation}
                product={activeProduct}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSend={handleSend}
                isTyping={isTyping}
                isSending={isSending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
