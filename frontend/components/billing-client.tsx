"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";

interface BillingStatus {
  plan: string;
  status: string;
  current_period_end: string | null;
}

interface OrderData {
  order_id: string;
  amount: number;
  currency: string;
  razorpay_key_id: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProCard({ status }: { status: BillingStatus }) {
  return (
    <div className="max-w-lg">
      <div className="p-7 rounded-2xl border border-[#00c896]/30 bg-[#0b0f1a] accent-glow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#f0a500] uppercase">
              Pro Plan
            </span>
            <h2 className="font-display text-[22px] font-bold text-[#e8edf4] mt-1">
              Active subscription
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#00c896]/10 border border-[#00c896]/25 flex items-center justify-center text-[#00c896] text-lg">
            ◆
          </div>
        </div>

        {/* Details */}
        <dl className="space-y-3">
          <div className="flex items-center justify-between py-3 border-t border-white/[.05]">
            <dt className="text-[#6b7585] text-[13px]">Plan</dt>
            <dd className="text-[#e8edf4] text-[13px] font-semibold">Pro — ₹999/month</dd>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-white/[.05]">
            <dt className="text-[#6b7585] text-[13px]">Status</dt>
            <dd>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#00c896]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c896]" aria-hidden="true" />
                {status.status.toUpperCase()}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-white/[.05]">
            <dt className="text-[#6b7585] text-[13px]">Renews</dt>
            <dd className="text-[#e8edf4] text-[13px]">
              {formatDate(status.current_period_end)}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-[12px] text-[#4a5568] font-mono">
          To cancel, contact support. Cancellation takes effect at period end.
        </p>
      </div>
    </div>
  );
}

function UpgradeCard({
  userEmail,
  userName,
}: {
  userEmail?: string;
  userName?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setError("");
    setLoading(true);

    try {
      const res = await post<OrderData>("/billing/order", {});
      if (!res.success || !res.data) {
        setError(res.error ?? "Failed to create order. Try again.");
        setLoading(false);
        return;
      }

      const order = res.data;

      const options: RazorpayOptions = {
        key: order.razorpay_key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Nexpath",
        description: "Pro Plan — Monthly",
        order_id: order.order_id,
        prefill: { name: userName ?? "", email: userEmail ?? "" },
        theme: { color: "#00c896" },
        handler: async (response) => {
          const verifyRes = await post("/billing/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (verifyRes.success) {
            router.refresh();
          } else {
            setError(verifyRes.error ?? "Payment verification failed.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="p-7 rounded-2xl border border-white/[.07] bg-[#0b0f1a]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#6b7585] uppercase">
              Free Plan
            </span>
            <h2 className="font-display text-[22px] font-bold text-[#e8edf4] mt-1">
              Upgrade to Pro
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/[.04] border border-white/[.07] flex items-center justify-center text-[#6b7585] text-lg">
            □
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1 mb-6">
          <span className="font-display text-[40px] font-bold text-[#e8edf4]">₹999</span>
          <span className="text-[#6b7585] text-sm mb-2">/month</span>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-7">
          {[
            "Unlimited roadmaps",
            "Unlimited AI explanations",
            "GPT-4o powered (vs Llama3 on free)",
            "High-priority processing",
            "Unlimited resume analysis",
            "Pro support",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-[#b8c1cf]">
              <span aria-hidden="true" className="text-[#00c896] text-[10px]">◆</span>
              {f}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-[12px]">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full h-12 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[14px] rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-[#05080f]/30 border-t-[#05080f] rounded-full animate-spin"
                aria-hidden="true"
              />
              Opening checkout…
            </>
          ) : (
            "Upgrade to Pro — ₹999/month"
          )}
        </button>

        <p className="text-[11px] text-[#4a5568] text-center mt-3 font-mono">
          Secured by Razorpay · UPI, cards, netbanking accepted
        </p>
      </div>

      {/* Current limits */}
      <div className="mt-5 p-5 rounded-xl border border-white/[.05] bg-[#0b0f1a]/40">
        <p className="text-[12px] font-mono text-[#6b7585] mb-3 uppercase tracking-wide">
          Free plan limits
        </p>
        <ul className="space-y-2 text-[13px] text-[#6b7585]">
          <li>2 roadmaps / month</li>
          <li>5 AI explanations / day</li>
          <li>Llama3 model</li>
          <li>1 resume analysis / month</li>
        </ul>
      </div>
    </div>
  );
}

export function BillingClient({
  status,
  userEmail,
  userName,
}: {
  status: BillingStatus;
  userEmail?: string;
  userName?: string;
}) {
  const isPro = status.plan === "pro" && status.status === "active";

  return isPro ? (
    <ProCard status={status} />
  ) : (
    <UpgradeCard userEmail={userEmail} userName={userName ?? undefined} />
  );
}
