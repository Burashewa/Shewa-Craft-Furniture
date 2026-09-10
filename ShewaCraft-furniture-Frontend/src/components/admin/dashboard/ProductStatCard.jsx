const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ProductStatCard({
  label,
  value,
  icon: Icon,
  active = false,
  className = '',
  onClick,
  children,
}) {
  const cardClass = `text-left bg-white border rounded-lg p-4 transition duration-200 motion-reduce:transition-none ${
    onClick
      ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-sm hover:border-gray-300 motion-reduce:hover:translate-y-0'
      : ''
  } ${focusRing} ${
    active ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'
  } ${className}`;

  const content = (
    <>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {Icon ? <Icon className="w-3.5 h-3.5" aria-hidden /> : null}
        {label}
      </div>
      <p className="text-2xl text-gray-900">{value}</p>
      {children}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cardClass}
      >
        {content}
      </button>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
