import { formatMessageTime } from '../../data/messages';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  productsById,
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-500">No conversations yet.</div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        const hasUnread = conversation.unread > 0 && !isActive;
        const product = productsById?.[conversation.productId];
        const thumb =
          product?.images?.[0] ||
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`w-full text-left px-4 py-3.5 transition border-l-2 ${focusRing} ${
                isActive
                  ? 'bg-gray-50 border-l-gray-900'
                  : 'bg-white border-l-transparent hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={thumb}
                    alt=""
                    className="w-11 h-11 object-cover bg-gray-100"
                  />
                  {hasUnread && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gray-900 border-2 border-white"
                      aria-label={`${conversation.unread} unread`}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-0.5">
                    <p
                      className={`text-sm truncate ${
                        hasUnread || isActive
                          ? 'font-medium text-gray-900'
                          : 'text-gray-900'
                      }`}
                    >
                      {conversation.productName}
                    </p>
                    <span className="text-xs shrink-0 text-gray-500">
                      {formatMessageTime(conversation.updatedAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      hasUnread
                        ? 'font-medium text-gray-800'
                        : 'text-gray-600'
                    }`}
                  >
                    {conversation.preview}
                  </p>
                  {hasUnread && (
                    <span className="inline-flex mt-2 px-2 py-0.5 text-xs border border-gray-200 bg-white text-gray-800">
                      {conversation.unread} new
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
