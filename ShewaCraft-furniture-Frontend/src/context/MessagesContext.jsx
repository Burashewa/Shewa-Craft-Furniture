import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { useChatSocketEvent } from './ChatSocketContext';
import { listConversations } from '../services/messageService';
import { applyCustomerConversationEvent } from '../services/chatEvents';

const MessagesContext = createContext(null);

export function getUnreadCount(conversationList = []) {
  return conversationList.reduce(
    (sum, conversation) => sum + (Number(conversation.unread) || 0),
    0
  );
}

export function MessagesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setConversations([]);
      setLoading(false);
      return [];
    }
    const next = await listConversations();
    setConversations(next);
    setLoading(false);
    return next;
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!user?.id) {
      setConversations([]);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    listConversations()
      .then((next) => {
        if (!active) return;
        setConversations(next);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setConversations([]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id, authLoading]);

  useChatSocketEvent('conversation:message', (payload) => {
    setConversations((prev) => applyCustomerConversationEvent(prev, payload));
  });

  useChatSocketEvent('conversation:unread', (payload) => {
    if (payload?.all) return;
    setConversations((prev) => applyCustomerConversationEvent(prev, payload));
  });

  const unreadCount = useMemo(
    () => getUnreadCount(conversations),
    [conversations]
  );

  const value = useMemo(
    () => ({
      conversations,
      unreadCount,
      loading,
      refresh,
    }),
    [conversations, unreadCount, loading, refresh]
  );

  return (
    <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}
