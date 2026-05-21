# Pathora — Build Phases

> ⚠️ STRICT RULE: Do NOT start the next phase until ALL tasks in the current phase are marked [x] complete.

---

## Phase 1 — Project Foundation
**Goal:** Repo ready, environment set up, all tooling in place.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Folder structure created (backend + frontend)
- [ ] requirements.txt installed successfully
- [ ] .env file created with all keys from CLAUDE.md
- [ ] .gitignore created (ignore .env, .venv, __pycache__)
- [ ] Docker + docker-compose.yml set up
- [ ] GitHub repo created
- [ ] GitHub Actions CI/CD basic pipeline created
- [ ] CLAUDE.md + PHASES.md committed to repo

---

## Phase 2 — Database Schema + Migrations
**Goal:** All DB tables designed, created, and migrated via Alembic.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Supabase project created
- [ ] SQLAlchemy models created for: users, roadmaps, progress, subscriptions, usage_limits, feature_flags, ai_logs, celery_jobs
- [ ] Soft deletes (deleted_at) on all tables
- [ ] Indexes on: user_id, email, created_at, subscription_status, role
- [ ] Alembic initialized and first migration created
- [ ] Migration applied to Supabase

---

## Phase 3 — Authentication
**Goal:** Full auth flow working (email + Google OAuth).
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Supabase Auth configured (email + Google OAuth)
- [ ] JWT middleware in FastAPI (verify token on every request)
- [ ] Secure HTTP-only cookie setup (never localStorage)
- [ ] User role check middleware (free / paid / admin)
- [ ] Auth endpoints: signup, login, logout, refresh token
- [ ] Frontend: signup page, login page, Google OAuth button
- [ ] Protected route wrapper in Next.js

---

## Phase 4 — Core Backend
**Goal:** FastAPI fully set up with all middleware, rate limiting, and LLM router.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] FastAPI app initialized with proper structure
- [ ] CORS middleware configured
- [ ] SlowAPI rate limiting (per user + per IP)
- [ ] Global error handler
- [ ] Health check endpoint
- [ ] LLM router service built (free: Groq→Gemini, paid: GPT-4o→Groq)
- [ ] 20s timeout + token budget on every LLM call
- [ ] Pydantic schemas for all LLM responses
- [ ] Prompt injection guard in all system prompts
- [ ] Redis (Upstash) connected
- [ ] Celery worker initialized with job state tracking
- [ ] API response format enforced: { success, data, error }

---

## Phase 5 — Roadmap Generation
**Goal:** Users can generate AI roadmaps based on topic + level + goal.
**Status:** [x] COMPLETE (May 21, 2026) — 13/13 tests passing

### Tasks
- [x] Topic + difficulty + goal picker UI (frontend)
- [x] Roadmap generation endpoint (backend)
- [x] Usage limit check before every AI call
- [x] LLM router used for generation
- [x] Roadmap saved to DB
- [x] Redis cache by topic+level+goal hash
- [x] Celery job state tracking for generation
- [x] Thumbs up/down rating on roadmap
- [x] AI call logged to DB (user_id, model, tokens, latency)
- [x] "Explain this simply" button (5/day free limit)
- [x] "Why am I learning this?" button

---

## Phase 6 — Progress Tracking
**Goal:** Users can track their learning progress.
**Status:** [x] COMPLETE (May 22, 2026)

### Tasks
- [x] Check off individual topics in roadmap
- [x] Progress bar per roadmap
- [x] Streak tracking (daily activity)
- [x] Progress saved to DB
- [x] Dashboard shows all roadmaps + progress
- [x] Celery job resets daily counts at midnight
- [x] Celery job resets monthly counts on 1st

---

## Phase 7 — Stripe Subscription
**Goal:** Free and Pro plans working end to end.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Stripe products + prices created (free + pro)
- [ ] Stripe checkout session endpoint
- [ ] Stripe webhook endpoint with signature verification
- [ ] Idempotency protection (store processed webhook event IDs)
- [ ] User role updated to `paid` after successful payment
- [ ] Subscription cancellation handled via webhook
- [ ] Usage limits enforced based on plan
- [ ] Upgrade prompt shown when free limit hit (429)
- [ ] Frontend: pricing page, upgrade button, billing portal

---

## Phase 8 — Admin Panel
**Goal:** Full admin control over users, plans, and platform.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Admin role middleware (server side check)
- [ ] Admin endpoints: list users, ban/suspend, change plan
- [ ] Usage stats endpoint (roadmaps generated, AI calls, revenue)
- [ ] Feature flags table + toggle endpoint
- [ ] Frontend: admin dashboard UI
- [ ] Revenue overview (Stripe data)
- [ ] User management table (search, filter, ban)

---

## Phase 9 — Frontend Landing Page
**Goal:** Public landing page live on Vercel.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Section 1: Hero
- [ ] Section 2: How it works
- [ ] Section 3: Features
- [ ] Section 4: Roadmap demo/preview
- [ ] Section 5: Pricing
- [ ] Section 6: Testimonials
- [ ] Section 7: FAQ
- [ ] Section 8: CTA
- [ ] Section 9: Footer
- [ ] Deployed to Vercel

---

## Phase 10 — Frontend App UI
**Goal:** Full user-facing app UI connected to backend.
**Status:** [ ] NOT STARTED

### Tasks
- [ ] Auth pages (signup, login, Google OAuth)
- [ ] Dashboard page (roadmaps list, progress, streak)
- [ ] Roadmap generator page (topic picker form)
- [ ] Roadmap detail page (phases, topics, checkboxes)
- [ ] Progress bar + streak UI
- [ ] Explain + Why buttons with usage counter
- [ ] Upgrade modal (when limit hit)
- [ ] Billing/account page
- [ ] Mobile responsive
- [ ] Connected to all backend endpoints

---

## Summary

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project Foundation | [x] |
| 2 | Database Schema | [x] |
| 3 | Authentication | [x] |
| 4 | Core Backend | [x] |
| 5 | Roadmap Generation | [x] |
| 6 | Progress Tracking | [ ] |
| 7 | Stripe Subscription | [ ] |
| 8 | Admin Panel | [ ] |
| 9 | Landing Page | [ ] |
| 10 | Frontend App UI | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |