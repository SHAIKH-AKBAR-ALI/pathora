"use client";

import { useState, useTransition } from "react";
import { Progress } from "@/components/ui/progress";
import { post, put } from "@/lib/api";
import type { Roadmap, ProgressData } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────

interface ExplainState {
  loading: boolean;
  text: string | null;
  type: "explain" | "why" | null;
}

// ── Sub-components ─────────────────────────────────────────────

function RatingButtons({
  roadmapId,
  initialRating,
}: {
  roadmapId: string;
  initialRating: number | null;
}) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [pending, startTransition] = useTransition();

  function handleRate(value: 1 | -1) {
    const next = rating === value ? null : value;
    startTransition(async () => {
      setRating(next);
      if (next !== null) {
        await post(`/roadmaps/${roadmapId}/rate`, { rating: next });
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[#6b7585] text-[12px] font-mono mr-1">Rate:</span>
      <button
        onClick={() => handleRate(1)}
        disabled={pending}
        aria-label="Thumbs up"
        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[15px] transition-all duration-150 ${
          rating === 1
            ? "bg-[#00c896]/15 border-[#00c896]/40 text-[#00c896]"
            : "border-white/[.07] text-[#6b7585] hover:border-[#00c896]/30 hover:text-[#00c896]"
        }`}
      >
        👍
      </button>
      <button
        onClick={() => handleRate(-1)}
        disabled={pending}
        aria-label="Thumbs down"
        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[15px] transition-all duration-150 ${
          rating === -1
            ? "bg-red-500/15 border-red-500/40 text-red-400"
            : "border-white/[.07] text-[#6b7585] hover:border-red-500/30 hover:text-red-400"
        }`}
      >
        👎
      </button>
    </div>
  );
}

function TopicRow({
  topic,
  roadmapId,
  phaseNumber,
  completed,
  onToggle,
}: {
  topic: string;
  roadmapId: string;
  phaseNumber: number;
  completed: boolean;
  onToggle: (topic: string) => void;
}) {
  const [explainState, setExplainState] = useState<ExplainState>({
    loading: false,
    text: null,
    type: null,
  });

  async function fetchExplanation(type: "explain" | "why") {
    // Toggle off if same type already showing
    if (explainState.type === type && explainState.text) {
      setExplainState({ loading: false, text: null, type: null });
      return;
    }

    setExplainState({ loading: true, text: null, type });
    const endpoint =
      type === "explain"
        ? `/roadmaps/${roadmapId}/explain`
        : `/roadmaps/${roadmapId}/why`;

    const res = await post<{ explanation?: string; answer?: string }>(endpoint, {
      topic,
    });

    const text =
      res.data?.explanation ?? res.data?.answer ?? res.error ?? "No response";
    setExplainState({ loading: false, text, type });
  }

  return (
    <div className="group">
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[.02] transition-colors">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(topic)}
          aria-label={completed ? `Mark ${topic} incomplete` : `Mark ${topic} complete`}
          className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-150 ${
            completed
              ? "bg-[#00c896] border-[#00c896] text-[#05080f]"
              : "border-white/20 hover:border-[#00c896]/50"
          }`}
        >
          {completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Topic name */}
        <span
          className={`flex-1 text-[13.5px] transition-colors ${
            completed ? "text-[#4a5568] line-through" : "text-[#b8c1cf]"
          }`}
        >
          {topic}
        </span>

        {/* Action buttons — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => fetchExplanation("explain")}
            disabled={explainState.loading && explainState.type === "explain"}
            title="Explain this topic simply"
            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
              explainState.type === "explain" && explainState.text
                ? "border-[#00c896]/40 text-[#00c896] bg-[#00c896]/[.07]"
                : "border-white/[.07] text-[#6b7585] hover:border-[#00c896]/30 hover:text-[#00c896]"
            }`}
          >
            {explainState.loading && explainState.type === "explain" ? "…" : "Explain"}
          </button>
          <button
            onClick={() => fetchExplanation("why")}
            disabled={explainState.loading && explainState.type === "why"}
            title="Why do I need to learn this?"
            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
              explainState.type === "why" && explainState.text
                ? "border-[#f0a500]/40 text-[#f0a500] bg-[#f0a500]/[.07]"
                : "border-white/[.07] text-[#6b7585] hover:border-[#f0a500]/30 hover:text-[#f0a500]"
            }`}
          >
            {explainState.loading && explainState.type === "why" ? "…" : "Why?"}
          </button>
        </div>
      </div>

      {/* Explain/Why result */}
      {explainState.text && (
        <div
          className={`mx-8 mb-2 px-4 py-3 rounded-xl text-[13px] leading-relaxed border ${
            explainState.type === "explain"
              ? "bg-[#00c896]/[.05] border-[#00c896]/15 text-[#b8c1cf]"
              : "bg-[#f0a500]/[.05] border-[#f0a500]/15 text-[#b8c1cf]"
          }`}
        >
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 opacity-60">
            {explainState.type === "explain" ? "Explanation" : "Why this matters"}
          </p>
          {explainState.text}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export function RoadmapDetail({
  roadmap,
  initialProgress,
  initialCompletion,
}: {
  roadmap: Roadmap;
  initialProgress: ProgressData;
  initialCompletion: number;
}) {
  const [completedTopics, setCompletedTopics] = useState<string[]>(
    initialProgress.completed_topics
  );
  const [completion, setCompletion] = useState(initialCompletion);
  const [saving, setSaving] = useState(false);

  async function toggleTopic(topic: string) {
    const next = completedTopics.includes(topic)
      ? completedTopics.filter((t) => t !== topic)
      : [...completedTopics, topic];

    setCompletedTopics(next);
    setSaving(true);

    const res = await put<{ progress: ProgressData; completion_percentage: number }>(
      `/roadmaps/${roadmap.id}/progress`,
      { completed_topics: next }
    );

    if (res.success && res.data) {
      setCompletion(res.data.completion_percentage);
    }
    setSaving(false);
  }

  const totalTopics = roadmap.content.phases.reduce(
    (acc, p) => acc + p.topics.length,
    0
  );
  const completedCount = completedTopics.length;

  const diffColors: Record<string, string> = {
    beginner: "text-[#00c896]",
    intermediate: "text-[#f0a500]",
    advanced: "text-red-400",
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
              diffColors[roadmap.difficulty] ?? "text-[#6b7585]"
            }`}
          >
            {roadmap.difficulty}
          </span>
          <span aria-hidden="true" className="text-[#3a4253]">·</span>
          <span className="text-[#6b7585] text-[11px] font-mono">
            ~{roadmap.content.total_estimated_days} days
          </span>
          {saving && (
            <>
              <span aria-hidden="true" className="text-[#3a4253]">·</span>
              <span className="text-[#6b7585] text-[11px] font-mono animate-pulse">
                Saving…
              </span>
            </>
          )}
        </div>

        <h1 className="font-display text-[24px] md:text-[30px] font-bold text-[#e8edf4] leading-tight mb-2">
          {roadmap.content.title}
        </h1>
        <p className="text-[#6b7585] text-[14px] leading-relaxed mb-6">
          Goal: {roadmap.goal}
        </p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#6b7585] font-mono">
              {completedCount} / {totalTopics} topics
            </span>
            <span
              className={`font-mono font-bold ${
                completion === 100 ? "text-[#00c896]" : "text-[#e8edf4]"
              }`}
            >
              {completion}%
            </span>
          </div>
          <Progress
            value={completion}
            className="h-2 bg-white/[.05] [&>[data-slot=progress-indicator]]:bg-[#00c896]"
          />
          {completion === 100 && (
            <p className="text-[#00c896] text-[12px] font-mono">
              ✓ Roadmap complete!
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="mt-4 flex items-center justify-between">
          <RatingButtons roadmapId={roadmap.id} initialRating={roadmap.rating} />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {roadmap.content.phases.map((phase) => {
          const phaseCompleted = phase.topics.filter((t) =>
            completedTopics.includes(t)
          ).length;
          const phaseTotal = phase.topics.length;
          const phasePercent =
            phaseTotal > 0
              ? Math.round((phaseCompleted / phaseTotal) * 100)
              : 0;
          const allDone = phaseCompleted === phaseTotal && phaseTotal > 0;

          return (
            <div
              key={phase.phase_number}
              className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                allDone
                  ? "border-[#00c896]/20 bg-[#00c896]/[.03]"
                  : "border-white/[.05] bg-[#0b0f1a]/50"
              }`}
            >
              {/* Phase header */}
              <div className="px-5 py-4 border-b border-white/[.04]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0 ${
                        allDone
                          ? "bg-[#00c896] text-[#05080f]"
                          : "bg-[#00c896]/[.08] border border-[#00c896]/25 text-[#00c896]"
                      }`}
                    >
                      {allDone ? "✓" : phase.phase_number}
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-[15px] text-[#e8edf4]">
                        {phase.title}
                      </h2>
                      {phase.description && (
                        <p className="text-[#6b7585] text-[12px] mt-0.5">
                          {phase.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[#6b7585] text-[11px] font-mono">
                      {phase.estimated_days}d
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        allDone ? "text-[#00c896]" : "text-[#6b7585]"
                      }`}
                    >
                      {phasePercent}%
                    </span>
                  </div>
                </div>
                {/* Phase progress bar */}
                <div className="h-1 bg-white/[.04] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00c896] rounded-full transition-all duration-300"
                    style={{ width: `${phasePercent}%` }}
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="px-2 py-2">
                {phase.topics.map((topic) => (
                  <TopicRow
                    key={topic}
                    topic={topic}
                    roadmapId={roadmap.id}
                    phaseNumber={phase.phase_number}
                    completed={completedTopics.includes(topic)}
                    onToggle={toggleTopic}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
