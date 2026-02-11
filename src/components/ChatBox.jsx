import { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Smile } from 'lucide-react';
import ownerAvatar from "../assets/ShewaCraft_Logo.png";


const CurrentTimestamp = new Date(Date.now() - 60000);


export function ChatBox({ product, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'owner',
      text: `Hi! Thanks for your interest in the ${product.name}. How can I help you today?`,
      timestamp: CurrentTimestamp
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate owner response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me provide you with more details.",
        "I'd be happy to help you with that. This piece is one of our bestsellers!",
        "Absolutely! I can arrange that for you.",
        "Yes, we have that available. Would you like to know more about the dimensions?",
        "Great choice! This item is currently in stock and ready to ship."
      ];
      
      const ownerResponse = {
        id: messages.length + 2,
        sender: 'owner',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, ownerResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Chat Header */}
        <div className="bg-gray-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={ownerAvatar}
                alt={product.owner.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm">ShewaCraft Furniture</h3>
                <p className="text-xs text-gray-300">Typically replies {product.owner.responseTime.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-3">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500">${product.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Quick Replies */}
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInputValue('Is this item still available?')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100 transition"
            >
              Is this available?
            </button>
            <button
              onClick={() => setInputValue('Can you provide more details about the dimensions?')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100 transition"
            >
              More details?
            </button>
            <button
              onClick={() => setInputValue('What is the delivery timeframe?')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100 transition"
            >
              Delivery time?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
