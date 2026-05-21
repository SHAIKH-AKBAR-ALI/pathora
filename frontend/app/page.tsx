// ─────────────────────────────────────────────────────────────────
// Pathora Landing Page — Phase 9
// ─────────────────────────────────────────────────────────────────
import Link from "next/link";

// ── DATA ─────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "◈",
    title: "AI Roadmaps",
    desc: "GPT-4o or Llama3 generates a phase-by-phase curriculum tailored to your exact goal and skill level.",
  },
  {
    icon: "◎",
    title: "Progress Tracking",
    desc: "Check off topics as you complete them. Visual progress bars show exactly how far you've come.",
  },
  {
    icon: "⬡",
    title: "Daily Streaks",
    desc: "Stay consistent. Each day you learn extends your streak — missing one resets it. Build the habit.",
  },
  {
    icon: "◇",
    title: "Explain Simply",
    desc: "Stuck on a concept? One click gives you a jargon-free breakdown written for actual humans.",
  },
  {
    icon: "△",
    title: "Why Learn This?",
    desc: "Every topic shows how it connects to your goal — so you're never wondering why it matters.",
  },
  {
    icon: "□",
    title: "Pro Plan",
    desc: "GPT-4o quality roadmaps, unlimited generations, and high-priority AI processing for serious learners.",
  },
];

const ROADMAP_PHASES = [
  {
    n: 1,
    title: "Python Fundamentals",
    days: 7,
    topics: ["Variables & Data Types", "Control Flow", "Functions & Scope", "Lists & Dictionaries"],
    done: [0, 1],
  },
  {
    n: 2,
    title: "Core Libraries",
    days: 10,
    topics: ["File I/O & Error Handling", "Modules & Packages", "Virtual Environments", "pip & Dependencies"],
    done: [],
  },
  {
    n: 3,
    title: "Web Development",
    days: 14,
    topics: ["FastAPI Basics", "REST API Design", "SQLAlchemy ORM", "JWT Authentication"],
    done: [],
  },
];

const TESTIMONIALS = [
  {
    initials: "AM",
    name: "Arjun Mehta",
    role: "CS Student, IIT Delhi",
    quote:
      "I used to spend hours figuring out what to learn next. Pathora handed me a complete plan in 10 seconds. Genuinely changed how I study.",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "Career Switcher → Frontend Dev",
    quote:
      "The 'Why Learn This?' button is underrated. Understanding context made me 3× faster at absorbing new concepts.",
  },
  {
    initials: "RN",
    name: "Rohan Nair",
    role: "Freelancer, Bangalore",
    quote:
      "Upgraded to Pro and the GPT-4o roadmaps are noticeably sharper. The AWS architecture roadmap was spot on — nothing wasted.",
  },
];

const FAQS = [
  {
    q: "How does Pathora generate roadmaps?",
    a: "Pathora uses large language models — Llama3 for free users, GPT-4o for Pro — to build a structured, phase-by-phase curriculum from your topic, difficulty, and goal. Every output is validated through Pydantic schemas before delivery.",
  },
  {
    q: "Is the free plan actually free?",
    a: "Yes. Free users get 2 roadmaps per month and 5 AI explanations per day — no credit card needed. Upgrade to Pro when you're ready for more.",
  },
  {
    q: "What does Pro include?",
    a: "Unlimited roadmaps, unlimited AI explanations, GPT-4o quality AI (vs Llama3 on free), high-priority processing queue, and Pro support. It's ₹999/month.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing settings at any time. You keep Pro access until the end of the current billing period — no proration, no surprises.",
  },
  {
    q: "What topics can I build roadmaps for?",
    a: "Anything — programming, design, finance, languages, cloud infrastructure, data science, writing, business strategy. Pathora is completely topic-agnostic.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use Supabase Auth with JWT tokens in secure HTTP-only cookies. Passwords are hashed with bcrypt. We never sell your data and you can delete your account at any time.",
  },
];

const FREE_FEATURES = [
  "2 roadmaps / month",
  "5 AI explanations / day",
  "Llama3 model (fast)",
  "Progress tracking",
  "Daily streak tracking",
  "1 resume analysis / month",
];

const PRO_FEATURES = [
  "Unlimited roadmaps",
  "Unlimited AI explanations",
  "GPT-4o model (sharper)",
  "Progress tracking",
  "Daily streak tracking",
  "Unlimited resume analysis",
  "High-priority queue",
  "Pro support",
];

// ── COMPONENTS ───────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[.06] backdrop-blur-xl bg-[#05080f]/75">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#00c896] text-[22px] leading-none font-display font-bold">◈</span>
          <span className="font-display font-extrabold text-[18px] tracking-tight">Pathora</span>
        </div>

        <div className="hidden md:flex items-center gap-7 text-[13.5px] text-[#6b7585]">
          {[
            ["#how-it-works", "How it works"],
            ["#features", "Features"],
            ["#pricing", "Pricing"],
            ["#faq", "FAQ"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-[#e8edf4] transition-colors duration-150">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/login" className="hidden md:block text-[13px] text-[#6b7585] hover:text-[#e8edf4] transition-colors px-4 py-2 rounded-lg hover:bg-white/[.04]">
            Sign in
          </Link>
          <Link href="/signup" className="text-[13px] bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold px-5 py-2.5 rounded-lg transition-colors duration-150">
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent_30%,#05080f_80%)] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#00c896]/[.05] blur-[120px] pointer-events-none" />

      {/* Floating nodes */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none hidden md:block">
        <div className="absolute top-[18%] right-[9%] animate-float" style={{ animationDelay: "0s" }}>
          <div className="w-14 h-14 rounded-full border border-[#00c896]/35 bg-[#00c896]/[.06] flex items-center justify-center text-[#00c896] text-xs font-mono">
            P1
          </div>
        </div>
        <div className="absolute top-[30%] right-[20%] animate-float" style={{ animationDelay: "1.4s" }}>
          <div className="w-11 h-11 rounded-full border border-[#f0a500]/30 bg-[#f0a500]/[.05] flex items-center justify-center text-[#f0a500] text-xs font-mono">
            P2
          </div>
        </div>
        <div className="absolute top-[44%] right-[13%] animate-float" style={{ animationDelay: "0.7s" }}>
          <div className="w-9 h-9 rounded-full border border-white/10 bg-white/[.03] flex items-center justify-center text-white/25 text-xs font-mono">
            P3
          </div>
        </div>
        <svg className="absolute top-[14%] right-[4%] w-72 h-[380px] opacity-20" viewBox="0 0 220 300" fill="none">
          <path
            className="dash-draw"
            d="M 160 35 Q 110 85 140 135 Q 170 185 105 240"
            stroke="#00c896"
            strokeWidth="1.2"
            strokeDasharray="4 5"
          />
        </svg>
        <div className="absolute bottom-[28%] left-[6%] animate-float-slow" style={{ animationDelay: "2s" }}>
          <div className="w-7 h-7 rotate-45 border border-[#00c896]/20 bg-[#00c896]/[.04]" />
        </div>
        <div className="absolute top-[52%] left-[12%] animate-float" style={{ animationDelay: "3.2s" }}>
          <div className="w-4 h-4 rounded-full bg-[#f0a500]/25" />
        </div>
        <div className="absolute top-[22%] left-[20%] animate-float-slow" style={{ animationDelay: "1s" }}>
          <div className="w-3 h-3 rounded-full bg-[#00c896]/20" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-28">
        <div className="max-w-[680px]">
          <div className="inline-flex items-center gap-2 text-[11px] text-[#00c896] border border-[#00c896]/30 bg-[#00c896]/[.07] px-3.5 py-1.5 rounded-full mb-9 font-mono tracking-widest uppercase">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#00c896] animate-pulse-dot" />
            AI-Powered Learning Paths
          </div>

          <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] font-extrabold leading-[0.92] tracking-tight mb-8">
            Learn anything.
            <br />
            <span className="text-[#00c896]">Master it</span>
            <br />
            faster.
          </h1>

          <p className="text-[#7b8794] text-[1.1rem] md:text-[1.2rem] leading-relaxed max-w-[500px] mb-11">
            Pick a topic, set your goal. Pathora&apos;s AI generates a personalized step-by-step roadmap and
            tracks your progress every single day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[15px] px-9 py-4 rounded-xl transition-all duration-150 hover:scale-[1.025] active:scale-[.975] accent-glow-animate">
              Start Learning Free
              <span aria-hidden="true" className="text-[18px] leading-none">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-[#e8edf4] text-[15px] px-9 py-4 rounded-xl transition-all duration-150 hover:bg-white/[.04]"
            >
              See how it works
            </a>
          </div>

          <div className="mt-14 flex items-center gap-5 text-[13px] text-[#6b7585]">
            <div className="flex -space-x-2.5">
              {["AM", "PS", "RN", "KS", "VG"].map((init) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full bg-[#0d1117] border-2 border-[#05080f] flex items-center justify-center text-[9px] font-bold text-[#00c896]"
                >
                  {init}
                </div>
              ))}
            </div>
            <span>
              Join <strong className="text-[#e8edf4] font-semibold">2,000+</strong> learners already on track
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pick your topic",
      desc: "Enter what you want to learn, your current level, and the specific goal you want to reach.",
      color: "#00c896",
    },
    {
      n: "02",
      title: "AI builds your roadmap",
      desc: "Our AI generates a structured, phase-by-phase curriculum in under 10 seconds. No fluff.",
      color: "#f0a500",
    },
    {
      n: "03",
      title: "Learn and track",
      desc: "Check off topics as you finish them. Maintain streaks. Watch your progress compound.",
      color: "#00c896",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-24">
          <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-4">Process</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold">
            Three steps to clarity
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          <div aria-hidden="true" className="hidden md:block absolute top-[2.85rem] left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px bg-gradient-to-r from-[#00c896]/25 via-[#f0a500]/25 to-[#00c896]/25" />

          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div
                aria-hidden="true"
                className="font-display text-[80px] font-extrabold leading-none mb-1 select-none"
                style={{ color: step.color, opacity: 0.1 }}
              >
                {step.n}
              </div>
              <div
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-sm font-bold -mt-[60px] relative z-10 bg-[#05080f] mb-6"
                style={{ borderColor: step.color, color: step.color }}
              >
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-[#6b7585] text-[15px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,200,150,.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="text-center mb-24">
          <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-4">Features</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold">
            Everything you need
            <br />
            to level up
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group p-7 rounded-2xl border border-white/[.05] bg-[#0b0f1a]/50 hover:border-[#00c896]/25 hover:bg-[#0b0f1a] transition-all duration-300"
            >
              <div className="text-[26px] mb-5 text-[#00c896] leading-none">{f.icon}</div>
              <h3 className="font-display text-[17px] font-semibold mb-2.5">{f.title}</h3>
              <p className="text-[#6b7585] text-[14px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapPreview() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-2/3 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(0,200,150,.04)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-5">Preview</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] mb-6">
              Your roadmap,
              <br />
              structured and clear.
            </h2>
            <p className="text-[#6b7585] text-[15px] leading-relaxed mb-9 max-w-[420px]">
              Every roadmap is broken into phases with clear topics, estimated days, and logical progression.
              No more random YouTube rabbit holes.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 text-[#00c896] font-semibold text-[15px] hover:gap-3 transition-all duration-150 group">
              Generate your own
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 duration-150">→</span>
            </Link>
          </div>

          {/* Roadmap card */}
          <div className="rounded-2xl border border-white/[.07] bg-[#0b0f1a] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,.5)]">
            <div className="px-6 py-5 border-b border-white/[.05]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-[17px]">Python for Beginners</h3>
                  <p className="text-[#6b7585] text-[11px] mt-1 font-mono">Goal: backend developer</p>
                </div>
                <span className="text-[10px] bg-[#00c896]/10 text-[#00c896] border border-[#00c896]/20 px-2.5 py-1 rounded font-mono tracking-wide">
                  BEGINNER
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/[.05] rounded-full overflow-hidden">
                  <div className="h-full w-[22%] bg-[#00c896] rounded-full" />
                </div>
                <span className="text-[#6b7585] text-[11px] font-mono flex-shrink-0">22% complete</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {ROADMAP_PHASES.map((phase) => (
                <div key={phase.n}>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-7 h-7 rounded-lg bg-[#00c896]/[.08] border border-[#00c896]/25 flex items-center justify-center text-[#00c896] text-[11px] font-bold font-mono flex-shrink-0">
                      {phase.n}
                    </div>
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="font-semibold text-[14px] truncate">{phase.title}</span>
                      <span className="text-[#6b7585] text-[11px] font-mono flex-shrink-0 ml-2">{phase.days}d</span>
                    </div>
                  </div>
                  <div className="ml-10 space-y-2">
                    {phase.topics.map((topic, ti) => {
                      const done = phase.done.includes(ti);
                      return (
                        <div key={ti} className="flex items-center gap-2.5 text-[13px]">
                          <div
                            className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
                              done ? "bg-[#00c896] border-[#00c896] text-[#05080f]" : "border-white/15"
                            }`}
                          >
                            {done && <span className="text-[10px] font-bold leading-none">✓</span>}
                          </div>
                          <span className={done ? "text-[#6b7585] line-through" : "text-[#b8c1cf]"}>
                            {topic}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-white/[.05] flex items-center justify-between">
              <span className="text-[#6b7585] text-[11px] font-mono">~45 days total</span>
              <div className="flex gap-2">
                <button className="text-[11px] text-[#6b7585] border border-white/[.07] px-3 py-1.5 rounded-lg hover:border-[#00c896]/30 hover:text-[#00c896] transition-colors">
                  Explain
                </button>
                <button className="text-[11px] text-[#6b7585] border border-white/[.07] px-3 py-1.5 rounded-lg hover:border-[#f0a500]/30 hover:text-[#f0a500] transition-colors">
                  Why?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,200,150,.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5">
        <div className="text-center mb-20">
          <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-4">Pricing</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold mb-4">
            Start free. Go Pro when ready.
          </h2>
          <p className="text-[#6b7585]">No credit card required to start.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[760px] mx-auto">
          {/* Free */}
          <div className="p-8 rounded-2xl border border-white/[.07] bg-[#0b0f1a]">
            <p className="text-[#6b7585] text-[13px] mb-2 font-mono tracking-wide">FREE</p>
            <div className="flex items-end gap-1 mb-7">
              <span className="font-display text-5xl font-bold">₹0</span>
              <span className="text-[#6b7585] text-sm mb-2">/month</span>
            </div>
            <Link href="/signup" className="block w-full py-3 rounded-xl border border-white/10 text-[14px] font-semibold hover:bg-white/[.04] transition-colors mb-8 text-center">
              Get started free
            </Link>
            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[13.5px] text-[#6b7585]">
                  <span aria-hidden="true" className="text-[#6b7585]/40 text-[10px]">◦</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative p-8 rounded-2xl border border-[#00c896]/35 bg-[#0b0f1a] accent-glow">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#00c896] text-[#05080f] text-[10px] font-bold px-3.5 py-1.5 rounded-full tracking-widest">
                MOST POPULAR
              </span>
            </div>
            <p className="text-[#00c896] text-[13px] mb-2 font-mono tracking-wide">PRO</p>
            <div className="flex items-end gap-1 mb-7">
              <span className="font-display text-5xl font-bold">₹999</span>
              <span className="text-[#6b7585] text-sm mb-2">/month</span>
            </div>
            <Link href="/signup" className="block w-full py-3 rounded-xl bg-[#00c896] hover:bg-[#00b484] text-[#05080f] text-[14px] font-bold transition-colors mb-8 text-center">
              Upgrade to Pro
            </Link>
            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[13.5px]">
                  <span aria-hidden="true" className="text-[#00c896] text-[10px]">◆</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-20">
          <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-4">Testimonials</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold">Learners love it</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl border border-white/[.05] bg-[#0b0f1a]/60 hover:border-white/10 transition-colors duration-300"
            >
              <p aria-hidden="true" className="text-[#00c896] text-[32px] font-display leading-none mb-4">&ldquo;</p>
              <p className="text-[#b8c1cf] text-[14px] leading-relaxed mb-7">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#00c896] flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[13.5px]">{t.name}</p>
                  <p className="text-[#6b7585] text-[11px] mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-32">
      <div className="max-w-[700px] mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-[#00c896] text-[11px] font-mono tracking-[.18em] uppercase mb-4">FAQ</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold">Questions?</h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group border border-white/[.05] bg-[#0b0f1a]/60 rounded-xl overflow-hidden"
            >
              <summary className="px-6 py-5 flex items-center justify-between hover:bg-white/[.02] transition-colors duration-150">
                <span className="font-semibold text-[14px] pr-5">{faq.q}</span>
                <span className="text-[#6b7585] flex-shrink-0 text-[22px] leading-none group-open:rotate-45 transition-transform duration-200 font-thin">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 pt-3.5 text-[#6b7585] text-[13.5px] leading-relaxed border-t border-white/[.04]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-28 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl border border-[#00c896]/22 bg-[#0b0f1a] p-16 overflow-hidden text-center">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(0,200,150,.07)_0%,transparent_65%)] pointer-events-none" />
          <div aria-hidden="true" className="absolute top-0 left-0 w-32 h-32 border-t border-l border-[#00c896]/15 rounded-tl-3xl pointer-events-none" />
          <div aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-[#00c896]/15 rounded-br-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold mb-5 leading-[1.05]">
              Your roadmap
              <br />
              is waiting.
            </h2>
            <p className="text-[#6b7585] text-[16px] mb-11 max-w-[420px] mx-auto leading-relaxed">
              Stop wondering what to learn next. Get a personalized path built for your exact goal — in under
              10 seconds.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#00c896] hover:bg-[#00b484] text-[#05080f] font-bold text-[15px] px-11 py-4 rounded-xl transition-all duration-150 hover:scale-[1.025] active:scale-[.975] accent-glow">
              Start Learning Free <span aria-hidden="true">→</span>
            </Link>
            <p className="text-[#6b7585] text-[12px] mt-5 font-mono">
              No credit card required · Free plan forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[.05] py-16">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#00c896] text-[20px] leading-none font-display font-bold">◈</span>
              <span className="font-display font-extrabold text-[18px]">Pathora</span>
            </div>
            <p className="text-[#6b7585] text-[13.5px] leading-relaxed max-w-[280px]">
              AI-powered personalized learning roadmaps. Learn anything, structured and focused.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[13px] mb-5">Product</p>
            <ul className="space-y-3">
              {["Features", "Pricing", "Roadmap", "Changelog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#6b7585] text-[13px] hover:text-[#e8edf4] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-[13px] mb-5">Company</p>
            <ul className="space-y-3">
              {["About", "Blog", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#6b7585] text-[13px] hover:text-[#e8edf4] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#6b7585] text-[12px]">© 2026 Pathora. All rights reserved.</span>
          <span className="text-[#6b7585] text-[12px] font-mono">Built with AI · Powered by curiosity</span>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="bg-[#05080f] text-[#e8edf4] overflow-x-hidden">
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <RoadmapPreview />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
