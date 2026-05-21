export default function DashboardLoading() {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-white/[.06] rounded" />
          <div className="h-9 w-44 bg-white/[.08] rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-white/[.06] rounded-xl" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[.04] bg-[#0b0f1a]/50 space-y-2"
          >
            <div className="h-2.5 w-16 bg-white/[.06] rounded" />
            <div className="h-7 w-10 bg-white/[.08] rounded" />
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="h-5 w-28 bg-white/[.07] rounded mb-5" />

      {/* Roadmap cards skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-white/[.04] bg-[#0b0f1a]/50 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-white/[.08] rounded" />
                <div className="h-3 w-1/2 bg-white/[.05] rounded" />
              </div>
              <div className="h-5 w-16 bg-white/[.06] rounded" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-2.5 w-24 bg-white/[.05] rounded" />
                <div className="h-2.5 w-8 bg-white/[.05] rounded" />
              </div>
              <div className="h-1 w-full bg-white/[.05] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
