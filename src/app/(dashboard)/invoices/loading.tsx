export default function InvoicesLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-24 bg-stone-200 rounded" />
        <div className="h-9 w-28 bg-stone-200 rounded-md" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-stone-200 px-4 py-4"
          >
            <div className="h-7 w-20 bg-stone-100 rounded mb-2" />
            <div className="h-3 w-24 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-stone-100 rounded" />
              <div className="h-3 w-32 bg-stone-100 rounded" />
            </div>
            <div className="h-3.5 w-16 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
