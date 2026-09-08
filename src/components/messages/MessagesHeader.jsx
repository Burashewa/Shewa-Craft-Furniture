import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function MessagesHeader({ conversationCount, unreadCount = 0 }) {
  const hasConversations = conversationCount > 0;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          hasConversations ? 'py-5 sm:py-6' : 'py-8'
        }`}
      >
        <nav
          className={`flex items-center gap-1.5 text-sm text-gray-500 ${
            hasConversations ? 'mb-3' : 'mb-4'
          }`}
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-gray-900 transition">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden />
          <span className="text-gray-900">Messages</span>
        </nav>
        <p className="text-sm uppercase tracking-wider text-gray-500 mb-1.5">
          Account
        </p>
        <h1
          className={`text-gray-900 mb-1.5 ${
            hasConversations ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
          }`}
        >
          Messages
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
          {conversationCount === 0
            ? 'No conversations yet. Ask about a product to start chatting with support.'
            : `${conversationCount} conversation${
                conversationCount === 1 ? '' : 's'
              } with ShewaCraft support${
                unreadCount > 0
                  ? ` · ${unreadCount} unread`
                  : ''
              }.`}
        </p>
      </div>
    </div>
  );
}
