import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { formatMessageTime } from '../../data/messages';

export function ConversationThread({
  conversation,
  inputValue,
  onInputChange,
  onSend,
  isTyping,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 p-8 text-center">
        <div>
          <p className="text-lg text-gray-900 mb-2">Select a conversation</p>
          <p className="text-sm text-gray-600">
            Choose a thread from the list to continue chatting with support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center text-sm shrink-0">
          SC
        </div>
        <div className="min-w-0">
          <h2 className="text-gray-900 truncate">{conversation.contactName}</h2>
          <p className="text-sm text-gray-500 truncate">
            About {conversation.productName}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 ${
                message.sender === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1.5 ${
                  message.sender === 'user' ? 'text-white/60' : 'text-gray-500'
                }`}
              >
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onSend} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            aria-label="Message"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
