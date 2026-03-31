export default function DashboardLoading() {
  return (
    <div className="max-w-4xl space-y-8 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-stone-200 px-4 py-4"
          >
            <div className="h-8 w-16 bg-stone-100 rounded mb-2" />
            <div className="h-3 w-24 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="space-y-1.5">
              <div className="h-3.5 w-40 bg-stone-100 rounded" />
              <div className="h-3 w-24 bg-stone-100 rounded" />
            </div>
            <div className="h-5 w-16 bg-stone-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
