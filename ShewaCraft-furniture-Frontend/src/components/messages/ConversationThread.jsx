import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatMessageTime, QUICK_REPLY_CHIPS } from '../../data/messages';
import shewaCraftLogo from '../../assets/ShewaCraft_Logo.png';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ConversationThread({
  conversation,
  product,
  inputValue,
  onInputChange,
  onSend,
  isTyping,
  isSending = false,
}) {
  const prefersReducedMotion = useReducedMotion();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-lg p-8 text-center min-h-[60vh]">
        <div>
          <p className="text-lg text-gray-900 mb-2">Select a conversation</p>
          <p className="text-sm text-gray-600">
            Choose a thread from the list to continue chatting with support.
          </p>
        </div>
      </div>
    );
  }

  const thumb =
    conversation.productImage ||
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
  const price = conversation.productPrice ?? product?.price;
  const hasProductContext = Boolean(
    conversation.productId || conversation.productImage || product
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-lg h-full overflow-hidden">
      <div className="shrink-0 px-4 sm:px-5 py-3.5 border-b border-gray-200 flex items-center gap-3">
        <img
          src={shewaCraftLogo}
          alt=""
          className="w-10 h-10 object-contain bg-white border border-gray-200 rounded-md shrink-0 p-0.5"
        />
        <div className="min-w-0">
          <h2 className="text-gray-900 truncate font-medium">
            ShewaCraft Support
          </h2>
          <p className="text-sm text-gray-500 truncate">
            Typically replies within 2 hours
          </p>
        </div>
      </div>

      {hasProductContext && (
      <div className="shrink-0 px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={thumb}
            alt={conversation.productName}
            className="w-12 h-12 object-cover bg-gray-100 shrink-0 rounded-md"
          />
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate">
              {conversation.productName}
            </p>
            {price != null && (
              <p className="text-sm text-gray-500">
                ${Number(price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/80">
        {conversation.messages?.map((message, messageIndex) => {
          const isNewest = messageIndex === (conversation.messages?.length || 0) - 1;
          return (
          <MotionDiv
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
            initial={
              isNewest && !prefersReducedMotion ? { opacity: 0 } : false
            }
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-4 py-2.5 rounded-md ${
                message.sender === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                {message.text}
              </p>
              <p
                className={`text-[11px] mt-1.5 ${
                  message.sender === 'user' ? 'text-white/55' : 'text-gray-400'
                }`}
              >
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </MotionDiv>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="bg-white border border-gray-200 rounded-md px-4 py-3"
              aria-live="polite"
              aria-label="Support is typing"
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 p-3 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_REPLY_CHIPS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                onInputChange(label);
                inputRef.current?.focus();
              }}
              className={`px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition ${focusRing}`}
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={onSend} className="flex items-center gap-2">
          <label htmlFor="messages-thread-input" className="sr-only">
            Message
          </label>
          <input
            ref={inputRef}
            id="messages-thread-input"
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
            className={`flex-1 min-w-0 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${focusRing}`}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className={`px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center gap-2 shrink-0 ${focusRing}`}
            aria-label={isSending ? 'Sending message' : 'Send message'}
          >
            <Send className="w-4 h-4" aria-hidden />
            <span className="hidden sm:inline">{isSending ? 'Sending' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
