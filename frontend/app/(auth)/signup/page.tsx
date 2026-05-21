"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post } from "@/lib/api";
import type { User } from "@/lib/types";

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pw)) return "Password must contain at least 1 uppercase letter";
  if (!/\d/.test(pw)) return "Password must contain at least 1 number";
  if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(pw))
    return "Password must contain at least 1 special character";
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setLoading(true);
    try {
      const res = await post<User>("/auth/signup", {
        email,
        password,
        full_name: fullName.trim() || null,
      });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error ?? "Signup failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = (() => {
    if (!password) return null;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(password),
    ];
    const passed = checks.filter(Boolean).length;
    if (passed <= 1) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (passed === 2) return { label: "Fair", color: "#f0a500", width: "50%" };
    if (passed === 3) return { label: "Good", color: "#00c896", width: "75%" };
    return { label: "Strong", color: "#00c896", width: "100%" };
  })();

  return (
    <div className="min-h-screen bg-[#05080f] flex items-center justify-center px-5 py-16">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-[#00c896]/[.04] blur-[100px] pointer-events-none"
      />

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-[#00c896] text-[22px] leading-none font-display font-bold">◈</span>
            <span className="font-display font-extrabold text-[20px] tracking-tight text-[#e8edf4]">
              Pathora
            </span>
          </Link>
          <p className="text-[#6b7585] text-[13px] mt-3">Create your free account. No card required.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[.07] bg-[#0b0f1a] p-8">
          <h1 className="font-display text-[22px] font-bold text-[#e8edf4] mb-7">Get started</h1>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-[#b8c1cf] text-[13px]">
                Full name <span className="text-[#6b7585]">(optional)</span>
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder="Arjun Mehta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                disabled={loading}
                className="bg-[#05080f]/80 border-white/[.10] text-[#e8edf4] placeholder:text-[#4a5568] focus-visible:ring-[#00c896]/50 focus-visible:border-[#00c896]/50 h-11"
              />
            </div>

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
              <Label htmlFor="password" className="text-[#b8c1cf] text-[13px]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
                className="bg-[#05080f]/80 border-white/[.10] text-[#e8edf4] placeholder:text-[#4a5568] focus-visible:ring-[#00c896]/50 focus-visible:border-[#00c896]/50 h-11"
              />
              {/* Password strength bar */}
              {passwordStrength && (
                <div className="space-y-1 pt-1">
                  <div className="h-1 bg-white/[.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: passwordStrength.width,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <p className="text-[11px]" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-11 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[14px] rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#05080f]/30 border-t-[#05080f] rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create free account"
              )}
            </Button>

            <p className="text-[11px] text-[#4a5568] text-center leading-relaxed">
              By signing up you agree to our{" "}
              <a href="#" className="text-[#6b7585] hover:text-[#00c896] transition-colors">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#6b7585] hover:text-[#00c896] transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6b7585] text-[13px] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00c896] hover:text-[#00d4aa] transition-colors font-medium">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
