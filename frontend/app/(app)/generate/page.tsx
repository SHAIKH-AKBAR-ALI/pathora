"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post } from "@/lib/api";
import type { Roadmap } from "@/lib/types";

const DIFFICULTIES = [
  {
    value: "beginner",
    label: "Beginner",
    desc: "No prior knowledge needed",
    color: "#00c896",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Some experience required",
    color: "#f0a500",
  },
  {
    value: "advanced",
    label: "Advanced",
    desc: "Strong foundation needed",
    color: "#ef4444",
  },
] as const;

const LOADING_MESSAGES = [
  "Analyzing your goal…",
  "Designing learning phases…",
  "Sequencing topics…",
  "Estimating timelines…",
  "Finalizing your roadmap…",
];

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || !goal.trim()) return;

    setError("");
    setLoading(true);
    setLoadingStep(0);

    // Cycle through loading messages while waiting
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_MESSAGES.length);
    }, 3000);

    try {
      const res = await post<Roadmap>("/roadmaps", {
        topic: topic.trim(),
        difficulty,
        goal: goal.trim(),
      });

      clearInterval(interval);

      if (res.success && res.data) {
        router.push(`/roadmaps/${res.data.id}`);
      } else {
        setError(res.error ?? "Failed to generate roadmap. Please try again.");
        setLoading(false);
      }
    } catch {
      clearInterval(interval);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const canSubmit = topic.trim().length > 0 && goal.trim().length > 0;

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-3">
          AI Generator
        </p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-[#e8edf4] leading-tight mb-3">
          Generate your roadmap
        </h1>
        <p className="text-[#6b7585] text-[15px] leading-relaxed">
          Tell the AI what you want to learn and your goal. It will build a structured, phase-by-phase curriculum in under 20 seconds.
        </p>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="mb-8 p-6 rounded-2xl border border-[#00c896]/25 bg-[#00c896]/[.05]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#00c896]/30 border-t-[#00c896] animate-spin flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#e8edf4] text-[14px]">
                Building your roadmap…
              </p>
              <p className="text-[#6b7585] text-[13px] mt-0.5 transition-all">
                {LOADING_MESSAGES[loadingStep]}
              </p>
            </div>
          </div>
          <div className="mt-4 h-1 bg-white/[.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00c896] rounded-full transition-all duration-3000"
              style={{ width: `${((loadingStep + 1) / LOADING_MESSAGES.length) * 100}%` }}
            />
          </div>
          <p className="text-[#4a5568] text-[11px] mt-2 font-mono">
            This may take up to 20 seconds — please wait
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-[13px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Topic */}
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-[#b8c1cf] text-[13px]">
            What do you want to learn?
          </Label>
          <Input
            id="topic"
            type="text"
            placeholder="e.g. Python, Machine Learning, System Design, AWS…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={200}
            required
            disabled={loading}
            className="bg-[#0b0f1a] border-white/[.10] text-[#e8edf4] placeholder:text-[#4a5568] focus-visible:ring-[#00c896]/50 focus-visible:border-[#00c896]/50 h-12 text-[15px]"
          />
          <p className="text-[11px] text-[#4a5568] text-right font-mono">
            {topic.length}/200
          </p>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="text-[#b8c1cf] text-[13px]">
            Your current level
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                disabled={loading}
                className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                  difficulty === d.value
                    ? "border-[#00c896]/40 bg-[#00c896]/[.07]"
                    : "border-white/[.07] bg-[#0b0f1a]/60 hover:border-white/15"
                }`}
              >
                <p
                  className={`font-display font-bold text-[13px] mb-0.5 ${
                    difficulty === d.value ? "text-[#00c896]" : "text-[#e8edf4]"
                  }`}
                >
                  {d.label}
                </p>
                <p className="text-[11px] text-[#6b7585] leading-snug">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <Label htmlFor="goal" className="text-[#b8c1cf] text-[13px]">
            What is your goal?
          </Label>
          <textarea
            id="goal"
            placeholder="e.g. Get a job as a backend developer, build a personal project, pass a certification exam…"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={200}
            required
            disabled={loading}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-white/[.10] bg-[#0b0f1a] text-[#e8edf4] placeholder:text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-[#00c896]/50 focus:border-[#00c896]/50 resize-none text-[14px] leading-relaxed transition-colors disabled:opacity-50"
          />
          <p className="text-[11px] text-[#4a5568] text-right font-mono">
            {goal.length}/200
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || !canSubmit}
          className="w-full h-12 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[15px] rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating…" : "Generate Roadmap →"}
        </Button>
      </form>
    </div>
  );
}
