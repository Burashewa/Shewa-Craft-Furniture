import { ArrowRight, CheckCircle2, Clock, MessageSquare, Package } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const ICONS = {
  orders: Clock,
  messages: MessageSquare,
  stock: Package,
};

function toneStyles(tone) {
  switch (tone) {
    case 'amber':
      return {
        wrap: 'border-amber-200 bg-amber-50/60',
        icon: 'bg-amber-100 text-amber-800',
      };
    case 'rose':
      return {
        wrap: 'border-rose-200 bg-rose-50/60',
        icon: 'bg-rose-100 text-rose-800',
      };
    default:
      return {
        wrap: 'border-gray-200 bg-white',
        icon: 'bg-gray-100 text-gray-800',
      };
  }
}

export function AttentionList({ items, onNavigate }) {
  if (items.length === 0) {
    return (
      <div className="border border-gray-200 bg-white rounded-lg p-5 flex items-start gap-3">
        <div className="p-2 rounded-md bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <p className="text-gray-900 font-medium">Everything looks good</p>
          <p className="text-sm text-gray-600 mt-1">
            No pending orders, low-stock products, or unread messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = ICONS[item.id] || Clock;
        const tones = toneStyles(item.tone);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.view, item.focus)}
            className={`text-left border rounded-lg p-5 transition duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-sm hover:border-gray-400 motion-reduce:hover:translate-y-0 ${focusRing} ${tones.wrap}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-md ${tones.icon}`}>
                <Icon className="w-5 h-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-900 font-medium leading-snug">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm text-gray-900">
                  {item.action}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
