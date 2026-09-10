import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useMessages } from '../../context/MessagesContext';
import { useToast } from '../../context/ToastContext';
import {
  useChatSocketEvent,
  useConversationRoom,
} from '../../context/ChatSocketContext';
import {
  getConversation,
  markConversationRead,
  sendConversationMessage,
} from '../../services/messageService';
import {
  appendUniqueMessage,
  toStorefrontMessage,
} from '../../services/chatEvents';
import { MessagesHeader } from './MessagesHeader';
import { ConversationList } from './ConversationList';
import { ConversationThread } from './ConversationThread';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function MessagesPage() {
  const { products } = useCatalog();
  const { conversations, unreadCount, loading, refresh } = useMessages();
  const { showToast } = useToast();
  const [activeId, setActiveId] = useState(null);
  const [thread, setThread] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const sendingLock = useRef(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const productsById = useMemo(
    () => Object.fromEntries(products.map((product) => [String(product.id), product])),
    [products]
  );

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      ),
    [conversations]
  );

  useEffect(() => {
    if (sortedConversations.length === 0) {
      setActiveId(null);
      setThread(null);
      return;
    }
    if (!activeId || !sortedConversations.some((item) => item.id === activeId)) {
      setActiveId(sortedConversations[0].id);
    }
  }, [sortedConversations, activeId]);

  useEffect(() => {
    if (!activeId) {
      setThread(null);
      return undefined;
    }

    let active = true;
    let firstLoad = true;

    const load = async () => {
      if (firstLoad) setLoadingThread(true);
      try {
        const conversation = await getConversation(activeId);
        if (!active) return;
        setThread(conversation);
        if (firstLoad && Number(conversation.unread) > 0) {
          await markConversationRead(activeId);
          await refresh();
        }
      } catch (err) {
        if (!active) return;
        setThread(null);
        showToast({
          type: 'error',
          title: 'Could not load conversation',
          message: err.message || 'Unable to load this thread.',
        });
      } finally {
        if (active) {
          setLoadingThread(false);
          firstLoad = false;
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [activeId, refresh, showToast]);

  useConversationRoom(activeId);

  useChatSocketEvent('conversation:message', (payload) => {
    if (!payload?.message || payload.conversationId !== activeId) return;
    const incoming = toStorefrontMessage(payload.message);
    setThread((current) => {
      if (!current || current.id !== payload.conversationId) return current;
      return {
        ...current,
        preview: payload.conversation?.lastMessage || current.preview,
        lastMessage: payload.conversation?.lastMessage || current.lastMessage,
        lastMessageAt: payload.conversation?.lastMessageAt || current.lastMessageAt,
        updatedAt: payload.conversation?.lastMessageAt || current.updatedAt,
        unread: Number(payload.conversation?.customerUnread ?? current.unread),
        messages: appendUniqueMessage(current.messages, incoming),
      };
    });
    if (payload.message.sender === 'admin') {
      markConversationRead(activeId).catch(() => {});
    }
  });

  const activeConversation = thread?.id === activeId ? thread : null;
  const activeProduct = activeConversation?.productId
    ? productsById[String(activeConversation.productId)]
    : null;

  const handleSelect = (id) => {
    setActiveId(id);
    setInputValue('');
    setMobileShowThread(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation || sendingLock.current) return;

    const text = inputValue.trim();
    sendingLock.current = true;
    setIsSending(true);

    try {
      const data = await sendConversationMessage(activeConversation.id, text);
      setInputValue('');
      if (data?.message) {
        setThread((current) =>
          current && current.id === activeConversation.id
            ? {
                ...current,
                ...data.conversation,
                unread: 0,
                messages: appendUniqueMessage(current.messages, data.message),
              }
            : current
        );
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <MessagesHeader
        conversationCount={conversations.length}
        unreadCount={unreadCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && conversations.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white rounded-lg">
            <p className="text-gray-600">Loading messages…</p>
          </div>
        ) : conversations.length === 0 ? (
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
                conversation={
                  activeConversation ||
                  (loadingThread
                    ? { id: activeId, productName: 'ShewaCraft Support', messages: [] }
                    : null)
                }
                product={activeProduct}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSend={handleSend}
                isTyping={false}
                isSending={isSending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
