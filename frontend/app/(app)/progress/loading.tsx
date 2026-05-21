export default function ProgressLoading() {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10 space-y-2">
        <div className="h-3 w-16 bg-white/[.06] rounded" />
        <div className="h-9 w-40 bg-white/[.08] rounded-lg" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[.04] bg-[#0b0f1a]/50 space-y-2"
          >
            <div className="h-2.5 w-14 bg-white/[.06] rounded" />
            <div className="h-7 w-10 bg-white/[.08] rounded" />
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="h-5 w-36 bg-white/[.07] rounded mb-5" />

      {/* Roadmap progress rows skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-white/[.04] bg-[#0b0f1a]/50"
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/[.08]" />
                <div className="h-4 w-1/2 bg-white/[.08] rounded" />
              </div>
              <div className="h-3 w-2/3 bg-white/[.05] rounded" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-white/[.05] rounded-full" />
                <div className="flex justify-between">
                  <div className="h-2.5 w-16 bg-white/[.05] rounded" />
                  <div className="h-2.5 w-8 bg-white/[.05] rounded" />
                </div>
              </div>
            </div>
            <div className="space-y-1 flex-shrink-0">
              <div className="h-3 w-14 bg-white/[.05] rounded" />
              <div className="h-3 w-10 bg-white/[.05] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
