"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { post } from "@/lib/api";
import type { User } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "◎" },
  { href: "/generate", label: "Generate", icon: "◈" },
  { href: "/progress", label: "Progress", icon: "⬡" },
  { href: "/billing", label: "Billing", icon: "□" },
];

function Sidebar({
  user,
  open,
  onClose,
}: {
  user: User;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await post("/auth/logout", {});
    router.push("/login");
  }

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[240px] flex flex-col
          bg-[#080c14] border-r border-white/[.05]
          transition-transform duration-250 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[.05]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <span className="text-[#00c896] text-[20px] leading-none font-display font-bold">
              ◈
            </span>
            <span className="font-display font-extrabold text-[17px] tracking-tight text-[#e8edf4]">
              Nexpath
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#3a4253] cursor-not-allowed text-[13.5px]"
                  aria-disabled="true"
                >
                  <span className="text-[15px] leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="ml-auto text-[10px] text-[#3a4253] border border-[#3a4253]/40 px-1.5 py-0.5 rounded font-mono">
                    soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 ${
                  active
                    ? "bg-[#00c896]/10 text-[#00c896]"
                    : "text-[#6b7585] hover:text-[#e8edf4] hover:bg-white/[.04]"
                }`}
              >
                <span className="text-[15px] leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Sign out */}
        <div className="px-3 py-4 border-t border-white/[.05] space-y-2">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#00c896]/10 border border-[#00c896]/20 flex items-center justify-center text-[10px] font-bold text-[#00c896] flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[#e8edf4] truncate">
                {user.full_name ?? user.email.split("@")[0]}
              </p>
              <p className="text-[11px] text-[#6b7585] truncate">{user.email}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="px-3">
            <span
              className={`inline-flex text-[10px] font-bold px-2 py-1 rounded font-mono tracking-widest ${
                user.role === "paid"
                  ? "bg-[#f0a500]/10 text-[#f0a500] border border-[#f0a500]/20"
                  : "bg-[#6b7585]/10 text-[#6b7585] border border-[#6b7585]/20"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] text-[#6b7585] hover:text-red-400 hover:bg-red-500/[.06] transition-all duration-150"
          >
            <span className="text-[15px] leading-none">↩</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#05080f] overflow-hidden">
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-4 px-5 h-14 border-b border-white/[.05] bg-[#05080f] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="text-[#6b7585] hover:text-[#e8edf4] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="font-display font-extrabold text-[16px] tracking-tight text-[#e8edf4]">
            Nexpath
          </span>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
