import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-api";
import { BillingClient } from "@/components/billing-client";
import type { User } from "@/lib/types";

interface BillingStatus {
  plan: string;
  status: string;
  current_period_end: string | null;
}

export default async function BillingPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");

  const [statusRes, userRes] = await Promise.all([
    serverFetch<BillingStatus>("/billing/status"),
    serverFetch<User>("/auth/me"),
  ]);

  const status = statusRes.data ?? { plan: "free", status: "active", current_period_end: null };
  const user = userRes.data;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-3">
          Billing
        </p>
        <h1 className="font-display text-[28px] md:text-[34px] font-bold text-[#e8edf4] leading-tight">
          Plan & Billing
        </h1>
      </div>

      <BillingClient
        status={status}
        userEmail={user?.email}
        userName={user?.full_name ?? undefined}
      />
    </div>
  );
}
