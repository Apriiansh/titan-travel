export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 w-full h-75 bg-slate-900 -z-10" />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-40 bg-slate-200 rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="aspect-video rounded-2xl bg-slate-200" />
              <div className="space-y-3">
                <div className="h-8 w-2/3 bg-slate-200 rounded-lg" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 rounded-2xl bg-slate-200" />
              <div className="h-12 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
