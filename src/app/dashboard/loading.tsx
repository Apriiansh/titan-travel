export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 w-full h-75 bg-slate-900 -z-10" />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="animate-pulse space-y-8">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
