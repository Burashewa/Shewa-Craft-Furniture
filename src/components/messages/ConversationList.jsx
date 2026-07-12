import { formatMessageTime } from '../../data/messages';

export function ConversationList({ conversations, activeId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-500">No conversations yet.</div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation.id)}
              className={`w-full text-left px-4 py-4 transition ${
                isActive ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className={`text-sm truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {conversation.productName}
                </p>
                <span
                  className={`text-xs shrink-0 ${
                    isActive ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {formatMessageTime(conversation.updatedAt)}
                </span>
              </div>
              <p
                className={`text-sm truncate ${
                  isActive ? 'text-white/80' : 'text-gray-600'
                }`}
              >
                {conversation.preview}
              </p>
              {conversation.unread > 0 && !isActive && (
                <span className="inline-flex mt-2 px-2 py-0.5 text-xs bg-gray-900 text-white">
                  {conversation.unread} new
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
