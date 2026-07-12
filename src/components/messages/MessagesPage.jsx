import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { conversations as mockConversations, OWNER_RESPONSES } from '../../data/messages';
import { MessagesHeader } from './MessagesHeader';
import { ConversationList } from './ConversationList';
import { ConversationThread } from './ConversationThread';

export function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0]?.id ?? null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const handleSelect = (id) => {
    setActiveId(id);
    setMobileShowThread(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation) return;

    const text = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
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

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'owner',
        text: OWNER_RESPONSES[Math.floor(Math.random() * OWNER_RESPONSES.length)],
        timestamp: new Date().toISOString(),
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
      <MessagesHeader conversationCount={conversations.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {conversations.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-gray-200 bg-white">
            <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start a conversation from a product page when you have a question about a piece.
            </p>
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6 min-h-[65vh]">
            <div
              className={`lg:col-span-1 border border-gray-200 bg-white ${
                mobileShowThread ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  Inbox
                </h2>
              </div>
              <ConversationList
                conversations={conversations}
                activeId={activeId}
                onSelect={handleSelect}
              />
            </div>

            <div
              className={`lg:col-span-2 flex flex-col min-h-[60vh] ${
                mobileShowThread ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <button
                type="button"
                onClick={() => setMobileShowThread(false)}
                className="lg:hidden mb-3 text-sm text-gray-600 hover:text-gray-900 transition text-left"
              >
                ← Back to inbox
              </button>
              <ConversationThread
                conversation={activeConversation}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSend={handleSend}
                isTyping={isTyping}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
