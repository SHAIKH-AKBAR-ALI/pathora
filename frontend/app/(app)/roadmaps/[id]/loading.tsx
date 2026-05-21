export default function RoadmapLoading() {
  return (
    <div className="animate-pulse">
      {/* Back link skeleton */}
      <div className="px-6 pt-6">
        <div className="h-3.5 w-20 bg-white/[.06] rounded" />
      </div>

      <div className="px-6 py-8 max-w-3xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-16 bg-white/[.06] rounded" />
            <div className="h-3 w-20 bg-white/[.06] rounded" />
          </div>
          <div className="h-8 w-3/4 bg-white/[.09] rounded-lg" />
          <div className="h-4 w-full bg-white/[.05] rounded" />
          <div className="h-4 w-2/3 bg-white/[.05] rounded" />

          {/* Progress bar skeleton */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-white/[.05] rounded" />
              <div className="h-3 w-10 bg-white/[.05] rounded" />
            </div>
            <div className="h-2 w-full bg-white/[.05] rounded-full" />
          </div>

          {/* Rating skeleton */}
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-white/[.05] rounded-lg" />
            <div className="h-8 w-8 bg-white/[.05] rounded-lg" />
          </div>
        </div>

        {/* Phase cards skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[.04] bg-[#0b0f1a]/50 overflow-hidden"
            >
              {/* Phase header */}
              <div className="px-5 py-4 border-b border-white/[.04] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[.07]" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-40 bg-white/[.08] rounded" />
                      <div className="h-3 w-56 bg-white/[.05] rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-8 bg-white/[.05] rounded" />
                </div>
                <div className="h-1 w-full bg-white/[.05] rounded-full" />
              </div>

              {/* Topics skeleton */}
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-5 h-5 rounded bg-white/[.06] flex-shrink-0" />
                    <div
                      className="h-3 bg-white/[.06] rounded"
                      style={{ width: `${55 + ((i * 4 + j) % 3) * 15}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
