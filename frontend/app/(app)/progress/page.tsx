import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-api";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { Roadmap, ProgressResult, StreakData } from "@/lib/types";

function DifficultyDot({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    beginner: "bg-[#00c896]",
    intermediate: "bg-[#f0a500]",
    advanced: "bg-red-400",
  };
  return (
    <span
      aria-hidden="true"
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${colors[difficulty] ?? "bg-[#6b7585]"}`}
    />
  );
}

export default async function ProgressPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");

  const [roadmapsRes, streakRes] = await Promise.all([
    serverFetch<Roadmap[]>("/roadmaps"),
    serverFetch<StreakData>("/progress/streak"),
  ]);

  const roadmaps = roadmapsRes.data ?? [];
  const streak = streakRes.data?.streak ?? 0;

  // Fetch progress for every roadmap in parallel
  const progressResults = await Promise.all(
    roadmaps.map((r) =>
      serverFetch<ProgressResult>(`/roadmaps/${r.id}/progress`).then(
        (res) => res.data ?? null
      )
    )
  );

  // Aggregate stats
  let totalTopics = 0;
  let completedTopics = 0;
  roadmaps.forEach((r, i) => {
    const phases = r.content.phases;
    const t = phases.reduce((acc, p) => acc + p.topics.length, 0);
    const c = progressResults[i]?.progress.completed_topics.length ?? 0;
    totalTopics += t;
    completedTopics += c;
  });
  const overallPct =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-3">
          Progress
        </p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-[#e8edf4] leading-tight">
          Your progress
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50">
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Overall
          </p>
          <p className="font-display text-[24px] font-bold text-[#e8edf4]">
            {overallPct}%
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50">
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Streak
          </p>
          <p className="font-display text-[24px] font-bold text-[#f0a500]">
            {streak}
            <span className="text-[14px] ml-0.5">🔥</span>
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50">
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Completed
          </p>
          <p className="font-display text-[24px] font-bold text-[#00c896]">
            {completedTopics}
          </p>
          <p className="text-[#6b7585] text-[10px] font-mono">topics</p>
        </div>
        <div className="p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50">
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Roadmaps
          </p>
          <p className="font-display text-[24px] font-bold text-[#e8edf4]">
            {roadmaps.length}
          </p>
        </div>
      </div>

      {/* Per-roadmap progress */}
      {roadmaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[#6b7585] text-[15px] mb-5">
            No roadmaps yet. Create one to start tracking progress.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[14px] px-7 py-3 rounded-xl transition-colors"
          >
            Generate roadmap →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-display text-[18px] font-bold text-[#e8edf4] mb-5">
            Roadmap breakdown
          </h2>
          {roadmaps.map((r, i) => {
            const result = progressResults[i];
            const pct = result?.completion_percentage ?? 0;
            const completed = result?.progress.completed_topics.length ?? 0;
            const total = r.content.phases.reduce(
              (acc, p) => acc + p.topics.length,
              0
            );

            return (
              <Link
                key={r.id}
                href={`/roadmaps/${r.id}`}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-white/[.05] bg-[#0b0f1a]/50 hover:border-[#00c896]/25 hover:bg-[#0b0f1a] transition-all duration-200"
              >
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <DifficultyDot difficulty={r.difficulty} />
                    <h3 className="font-display font-semibold text-[14px] text-[#e8edf4] truncate group-hover:text-[#00c896] transition-colors">
                      {r.topic}
                    </h3>
                  </div>
                  <p className="text-[#6b7585] text-[12px] truncate mb-3">
                    {r.goal}
                  </p>
                  <div className="space-y-1.5">
                    <Progress
                      value={pct}
                      className="h-1.5 bg-white/[.05] [&>[data-slot=progress-indicator]]:bg-[#00c896]"
                    />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6b7585] font-mono">
                        {completed}/{total} topics
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          pct === 100 ? "text-[#00c896]" : "text-[#6b7585]"
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: phases count */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-[#6b7585] text-[11px] font-mono">
                    {r.content.phases.length} phases
                  </p>
                  <p className="text-[#6b7585] text-[11px] font-mono">
                    ~{r.content.total_estimated_days}d
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
