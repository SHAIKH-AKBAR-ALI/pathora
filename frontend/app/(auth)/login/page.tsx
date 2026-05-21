"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post } from "@/lib/api";
import type { User } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await post<User>("/auth/login", { email, password });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error ?? "Login failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05080f] flex items-center justify-center px-5 py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div aria-hidden="true" className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />
      <div aria-hidden="true" className="fixed inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_30%,#05080f_80%)] pointer-events-none" />
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#00c896]/[.05] blur-[120px] pointer-events-none"
      />

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-[#00c896] text-[22px] leading-none font-display font-bold">◈</span>
            <span className="font-display font-extrabold text-[20px] tracking-tight text-[#e8edf4]">
              Nexpath
            </span>
          </Link>
          <p className="text-[#6b7585] text-[13px] mt-3">Welcome back. Sign in to continue.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[.07] bg-[#0b0f1a] p-8">
          <h1 className="font-display text-[22px] font-bold text-[#e8edf4] mb-7">Sign in</h1>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#b8c1cf] text-[13px]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                className="bg-[#05080f]/80 border-white/[.10] text-[#e8edf4] placeholder:text-[#4a5568] focus-visible:ring-[#00c896]/50 focus-visible:border-[#00c896]/50 h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#b8c1cf] text-[13px]">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-[12px] text-[#6b7585] hover:text-[#00c896] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                className="bg-[#05080f]/80 border-white/[.10] text-[#e8edf4] placeholder:text-[#4a5568] focus-visible:ring-[#00c896]/50 focus-visible:border-[#00c896]/50 h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-11 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[14px] rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#05080f]/30 border-t-[#05080f] rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6b7585] text-[13px] mt-6">
          No account?{" "}
          <Link href="/signup" className="text-[#00c896] hover:text-[#00d4aa] transition-colors font-medium">
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
}
