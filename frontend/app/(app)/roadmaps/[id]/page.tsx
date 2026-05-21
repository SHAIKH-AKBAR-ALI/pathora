import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import { RoadmapDetail } from "@/components/roadmap-detail";
import type { Roadmap, ProgressResult } from "@/lib/types";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");

  const [roadmapRes, progressRes] = await Promise.all([
    serverFetch<Roadmap>(`/roadmaps/${id}`),
    serverFetch<ProgressResult>(`/roadmaps/${id}/progress`),
  ]);

  if (!roadmapRes.success || !roadmapRes.data) {
    notFound();
  }

  const roadmap = roadmapRes.data;
  const progressData = progressRes.data;

  const initialProgress = progressData?.progress ?? {
    id: "",
    user_id: "",
    roadmap_id: id,
    completed_topics: [],
    streak: 0,
    last_activity: null,
    created_at: "",
  };
  const initialCompletion = progressData?.completion_percentage ?? 0;

  return (
    <div>
      {/* Back nav */}
      <div className="px-6 pt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[#6b7585] hover:text-[#e8edf4] text-[13px] transition-colors"
        >
          <span aria-hidden="true">←</span>
          Dashboard
        </Link>
      </div>

      <RoadmapDetail
        roadmap={roadmap}
        initialProgress={initialProgress}
        initialCompletion={initialCompletion}
      />
    </div>
  );
}
