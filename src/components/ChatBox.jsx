import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { OWNER_RESPONSES } from '../data/messages';

export function ChatBox({ product, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'owner',
      text: `Hi! Thanks for your interest in the ${product.name}. How can I help you today?`,
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'owner',
          text: OWNER_RESPONSES[Math.floor(Math.random() * OWNER_RESPONSES.length)],
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-sm shrink-0">
              SC
            </div>
            <div className="min-w-0">
              <h3 className="text-sm truncate">ShewaCraft Support</h3>
              <p className="text-xs text-white/70 truncate">
                Typically replies {product.owner?.responseTime?.toLowerCase() || 'soon'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 hover:bg-white/10 flex items-center justify-center transition shrink-0"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-3">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-14 h-14 object-cover bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500">${product.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/60' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
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

        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              'Is this still available?',
              'More details?',
              'Delivery time?',
            ].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setInputValue(label)}
                className="px-2.5 py-1 border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-3 py-2 bg-gray-900 text-white hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
