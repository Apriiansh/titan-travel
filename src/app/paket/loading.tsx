export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 w-full h-75 bg-slate-900 -z-10" />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="animate-pulse space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded-full" />
            <div className="h-10 w-80 bg-slate-200 rounded-lg" />
            <div className="h-5 w-64 bg-slate-100 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  <div className="h-8 w-28 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
