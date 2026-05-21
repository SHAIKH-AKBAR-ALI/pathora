import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Roadmap, StreakData, User } from "@/lib/types";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    beginner:
      "bg-[#00c896]/10 text-[#00c896] border-[#00c896]/20",
    intermediate:
      "bg-[#f0a500]/10 text-[#f0a500] border-[#f0a500]/20",
    advanced:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded border font-mono tracking-widest ${
        colors[difficulty] ?? "bg-white/5 text-[#6b7585] border-white/10"
      }`}
    >
      {difficulty.toUpperCase()}
    </span>
  );
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const totalTopics = roadmap.content.phases.reduce(
    (acc, p) => acc + p.topics.length,
    0
  );

  return (
    <Link
      href={`/roadmaps/${roadmap.id}`}
      className="group block p-6 rounded-2xl border border-white/[.05] bg-[#0b0f1a]/60 hover:border-[#00c896]/25 hover:bg-[#0b0f1a] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,.4)]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-[15px] text-[#e8edf4] truncate group-hover:text-[#00c896] transition-colors">
            {roadmap.topic}
          </h3>
          <p className="text-[#6b7585] text-[12px] mt-0.5 truncate">{roadmap.goal}</p>
        </div>
        <DifficultyBadge difficulty={roadmap.difficulty} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#6b7585] font-mono">
            {roadmap.content.phases.length} phases · {totalTopics} topics
          </span>
          <span className="text-[#6b7585] font-mono">
            ~{roadmap.content.total_estimated_days}d
          </span>
        </div>
        {/* Progress bar placeholder — actual progress fetched on detail page */}
        <div className="h-1 bg-white/[.05] rounded-full" />
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#00c896]/[.07] border border-[#00c896]/15 flex items-center justify-center text-2xl mb-5">
        ◈
      </div>
      <h3 className="font-display text-xl font-bold text-[#e8edf4] mb-2">
        No roadmaps yet
      </h3>
      <p className="text-[#6b7585] text-[14px] max-w-[320px] mb-7 leading-relaxed">
        Generate your first AI-powered learning roadmap in seconds.
      </p>
      <Link
        href="/generate"
        className="inline-flex items-center gap-2 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[14px] px-7 py-3 rounded-xl transition-colors"
      >
        Generate roadmap →
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");

  let user: User | null = null;
  let roadmaps: Roadmap[] = [];
  let streak = 0;

  try {
    const [userRes, roadmapsRes, streakRes] = await Promise.all([
      serverFetch<User>("/auth/me"),
      serverFetch<Roadmap[]>("/roadmaps"),
      serverFetch<StreakData>("/progress/streak"),
    ]);
    user = userRes.data;
    roadmaps = roadmapsRes.data ?? [];
    streak = streakRes.data?.streak ?? 0;
  } catch {
    // Partial failure — render with whatever we have (empty state)
  }

  const firstName = user?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-[#6b7585] text-[13px] font-mono mb-1">Welcome back</p>
          <h1 className="font-display text-[28px] md:text-[34px] font-bold text-[#e8edf4] leading-tight">
            {firstName}
          </h1>
        </div>
        <Link
          href="/generate"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[13px] px-5 py-2.5 rounded-xl transition-colors"
        >
          <span>◈</span>
          New Roadmap
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="stat-card p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50" style={{ "--stat-color": "#00c896" } as React.CSSProperties}>
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Roadmaps
          </p>
          <p className="font-display text-[26px] font-bold text-[#e8edf4]">
            {roadmaps.length}
          </p>
        </div>
        <div className="stat-card p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50" style={{ "--stat-color": "#f0a500" } as React.CSSProperties}>
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Day Streak
          </p>
          <p className="font-display text-[26px] font-bold text-[#f0a500]">
            {streak}
            <span className="text-[14px] ml-0.5">🔥</span>
          </p>
        </div>
        <div className="stat-card p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50" style={{ "--stat-color": "#f0a500" } as React.CSSProperties}>
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Plan
          </p>
          <p
            className={`font-display text-[18px] font-bold ${
              user?.role === "paid" ? "text-[#f0a500]" : "text-[#6b7585]"
            }`}
          >
            {user?.role === "paid" ? "Pro ◆" : "Free"}
          </p>
        </div>
        <div className="stat-card p-4 rounded-xl border border-white/[.05] bg-[#0b0f1a]/50" style={{ "--stat-color": "#00c896" } as React.CSSProperties}>
          <p className="text-[#6b7585] text-[11px] font-mono uppercase tracking-wide mb-1">
            Phases Total
          </p>
          <p className="font-display text-[24px] font-bold text-[#e8edf4]">
            {roadmaps.reduce((acc, r) => acc + r.content.phases.length, 0)}
          </p>
        </div>
      </div>

      {/* Roadmaps section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-[18px] font-bold text-[#e8edf4]">
            My Roadmaps
          </h2>
          {roadmaps.length > 0 && (
            <Link
              href="/generate"
              className="text-[13px] text-[#00c896] hover:text-[#00d4aa] transition-colors"
            >
              + New
            </Link>
          )}
        </div>

        {roadmaps.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps.map((r) => (
              <RoadmapCard key={r.id} roadmap={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
