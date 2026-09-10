const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function OrderPipeline({ pipeline, total, onSelect }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg text-gray-900">Order pipeline</h2>
        <p className="text-sm text-gray-500">
          {total} order{total === 1 ? '' : 's'} in system
        </p>
      </div>
      <div className="p-6 space-y-4">
        {total > 0 ? (
          <>
            <div
              className="flex h-3 w-full overflow-hidden bg-gray-100 rounded-sm"
              role="img"
              aria-label="Order status pipeline"
            >
              {pipeline.map((step) =>
                step.count > 0 ? (
                  <button
                    key={step.status}
                    type="button"
                    onClick={() => onSelect(step.status)}
                    className={`${step.color} h-full transition duration-200 hover:opacity-80 ${focusRing}`}
                    style={{ width: `${(step.count / total) * 100}%` }}
                    aria-label={`${step.label}: ${step.count}`}
                    title={`${step.label}: ${step.count}`}
                  />
                ) : null
              )}
            </div>
            <ul className="space-y-1">
              {pipeline.map((step) => (
                <li key={step.status}>
                  <button
                    type="button"
                    onClick={() => onSelect(step.status)}
                    className={`w-full flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition duration-200 hover:bg-gray-50 ${focusRing}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 shrink-0 rounded-full ${step.color}`}
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {step.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 tabular-nums">
                      {step.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-gray-600">No orders yet.</p>
        )}
      </div>
    </article>
  );
}
