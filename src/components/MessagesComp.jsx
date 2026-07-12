import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import ownerAvatar from "../assets/ShewaCraft_Logo.png";

const CurrentTimestamp = new Date(Date.now() - 60000);

const defaultProduct = {
  name: 'Unknown Product',
  price: 0,
  images: ['https://via.placeholder.com/150'],
  owner: {
    name: 'Unknown Owner',
    responseTime: 'N/A'
  }
};

export default function MessagesComp({ product = defaultProduct }) {
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
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center gap-3 rounded-t-lg shadow-md">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 border-x border-gray-200">
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
      <form onSubmit={handleSendMessage} className="p-4 bg-white border border-gray-200 rounded-b-lg">
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
      </div>
    </div>
  );
}

export { MessagesComp };