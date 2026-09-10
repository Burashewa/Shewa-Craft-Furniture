export function WeeklyRevenueChart({ weekly, peakRevenue, hasRevenue }) {
  const maxRevenue = Math.max(peakRevenue, 1);

  return (
    <article className="xl:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg text-gray-900">Weekly revenue</h2>
          <p className="text-sm text-gray-500">Last 7 days performance</p>
        </div>
        {hasRevenue ? (
          <p className="text-sm text-gray-600">
            Peak{' '}
            <span className="text-gray-900 font-medium">
              ${peakRevenue.toLocaleString()}
            </span>
          </p>
        ) : null}
      </div>
      <div className="p-6">
        {hasRevenue ? (
          <div
            className="flex items-end justify-between gap-3 h-52 pt-8"
            role="img"
            aria-label="Bar chart of weekly revenue"
          >
            {weekly.map((day) => {
              const height = Math.max(
                12,
                Math.round((day.amount / maxRevenue) * 100)
              );
              return (
                <div
                  key={day.key}
                  className="group relative flex-1 flex flex-col items-center justify-end gap-2 h-full"
                >
                  <span className="pointer-events-none absolute -top-1 -translate-y-full z-10 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] text-white opacity-0 transition duration-200 group-hover:opacity-100 motion-reduce:transition-none">
                    ${day.amount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {day.amount >= 1000
                      ? `$${(day.amount / 1000).toFixed(1)}k`
                      : `$${day.amount}`}
                  </span>
                  <div
                    className="w-full max-w-12 bg-gray-900/90 hover:bg-gray-900 transition duration-200 rounded-sm"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-600 py-10 text-center">
            No revenue in this period
          </p>
        )}
      </div>
    </article>
  );
}
