import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAccessToken } from '../services/session';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/$/,
  ''
);

const ChatSocketContext = createContext(null);

export function ChatSocketProvider({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (loading || !isAuthenticated || !user?.id) {
      setSocket((current) => {
        current?.disconnect();
        return null;
      });
      return undefined;
    }

    const token = getAccessToken();
    if (!token) return undefined;

    const next = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    setSocket(next);

    return () => {
      next.disconnect();
    };
  }, [isAuthenticated, user?.id, loading]);

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error('useChatSocket must be used within a ChatSocketProvider');
  }
  return context;
}

export function useChatSocketEvent(event, handler) {
  const { socket } = useChatSocket();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket || !event) return undefined;
    const listener = (...args) => handlerRef.current(...args);
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
}

export function useConversationRoom(conversationId) {
  const { socket } = useChatSocket();

  useEffect(() => {
    if (!socket || !conversationId) return undefined;
    socket.emit('conversation:join', { conversationId });
    return () => {
      socket.emit('conversation:leave', { conversationId });
    };
  }, [socket, conversationId]);
}
