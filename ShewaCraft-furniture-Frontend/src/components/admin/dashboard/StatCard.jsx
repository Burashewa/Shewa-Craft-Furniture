import { TrendingDown, TrendingUp } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function StatCard({
  label,
  value,
  change,
  hint,
  icon: Icon,
  onClick,
  variant = 'default',
}) {
  const trend = change?.trend;
  const changeLabel = change?.label || '—';
  const isNavy = variant === 'navy';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg p-5 cursor-pointer transition duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0 ${focusRing} ${
        isNavy
          ? 'bg-gray-900 border border-gray-900 hover:bg-gray-800 hover:border-gray-800'
          : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`p-2.5 rounded-md ${
            isNavy ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <Icon className="w-5 h-5" aria-hidden />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            trend === 'up'
              ? 'text-emerald-700'
              : trend === 'down'
                ? isNavy
                  ? 'text-rose-300'
                  : 'text-rose-700'
                : isNavy
                  ? 'text-gray-300'
                  : 'text-gray-500'
          }`}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5" aria-hidden />
          ) : null}
          {trend === 'down' ? (
            <TrendingDown className="w-3.5 h-3.5" aria-hidden />
          ) : null}
          {changeLabel}
        </span>
      </div>
      <p
        className={`mt-4 text-3xl tracking-tight ${
          isNavy ? 'text-white' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
      <p className={`mt-1 text-sm ${isNavy ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </p>
      <p className={`mt-1 text-xs ${isNavy ? 'text-gray-300' : 'text-gray-500'}`}>
        {hint}
      </p>
    </button>
  );
}
