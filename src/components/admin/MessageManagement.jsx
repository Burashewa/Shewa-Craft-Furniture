import { useState, useEffect, useRef } from 'react';
import { Search, Mail, MoreVertical, Send } from 'lucide-react';

export function MessagesManagement() {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      customerId: 'cust-001',
      customerName: 'John Smith',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      productId: 1,
      productName: 'Luxury Velvet Armchair',
      productPrice: 899,
      productImage: 'https://images.unsplash.com/photo-1765663241884-ebd171bdda1d?w=200&h=200&fit=crop',
      messages: [
        { id: 'm1', sender: 'customer', text: "Hi, I'm interested in this armchair. Do you have it in Navy color?", timestamp: '10:30 AM' },
        { id: 'm2', sender: 'admin', text: "Hello! Yes, we do have it available in Navy. It's one of our most popular colors.", timestamp: '10:35 AM' },
        { id: 'm3', sender: 'customer', text: 'Great! Can you ship to New York?', timestamp: '10:37 AM' },
      ],
      unread: true,
      lastMessage: 'Great! Can you ship to New York?',
      lastMessageTime: '10:37 AM'
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || !selectedConversation) return;
    // Scroll to bottom to show latest message
    el.scrollTop = el.scrollHeight;
  }, [selectedConversation?.id, selectedConversation?.messages?.length]);

  const filteredConversations = conversations.filter((conv) =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedMessage = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          id: `m${selectedConversation.messages.length + 1}`,
          sender: 'admin',
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ],
      lastMessage: newMessage,
      lastMessageTime: 'Just now',
      unread: false
    };

    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id ? updatedMessage : conv
      )
    );

    setSelectedConversation(updatedMessage);
    setNewMessage('');
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);

    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id
          ? { ...conv, unread: false }
          : conv
      )
    );
  };

  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
<div className="lg:pt-0 pt-16 h-screen flex flex-col">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">
          Chat with customers {unreadCount > 0 && `• ${unreadCount} unread`}
        </p>
      </div>
    </div>
  </div>

  <div className="flex-1 flex overflow-hidden">
    {/* Conversations List */}
    <div className="w-full md:w-96 border-r border-gray-200 bg-white flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation)}
            className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
              selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={conversation.customerAvatar}
                  alt={conversation.customerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.unread && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm truncate ${conversation.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>
                    {conversation.customerName}
                  </p>
                  <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{conversation.productName}</p>
                <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Chat Area */}
    {selectedConversation ? (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="border-b border-gray-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.customerAvatar}
                alt={selectedConversation.customerName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{selectedConversation.customerName}</p>
                <p className="text-sm text-gray-600">Customer ID: {selectedConversation.customerId}</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Product Info Section */}
          <button 
            onClick={() => {/* Will handle navigation */}}
            className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition border-t border-gray-200 text-left"
          >
            <p className="text-xs text-gray-600 mb-2">Regarding Product:</p>
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.productImage}
                alt={selectedConversation.productName}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{selectedConversation.productName}</p>
                <p className="text-sm text-gray-600">${selectedConversation.productPrice}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'admin'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'admin' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Select a conversation to start messaging</p>
        </div>
      </div>
    )}
  </div>
</div>
  );
}
