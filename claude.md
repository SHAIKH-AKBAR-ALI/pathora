# Pathora — Project Context

## What we are building
An AI-powered education and learning platform (SaaS).
Users pick a topic + difficulty level + goal → AI generates a personalized 
step-by-step learning roadmap.
Monetized via Stripe subscriptions (free vs paid plans).
Product name: Pathora

---

## Tech stack

### Frontend
- Next.js 14 (App Router + SSR)
- Tailwind CSS
- shadcn/ui
- Zustand (state management)
- Stripe.js (payments)

### Backend
- FastAPI (Python)
- LangGraph (agentic AI flows)
- LangChain (RAG pipeline — V2 only)
- Celery (background jobs)
- NGINX (reverse proxy on EC2)
- Alembic (database migrations)
- Pydantic (LLM output validation)

### AI / LLM — fallback chain
- Free users: Groq (llama3) → Gemini free tier (fallback) → 503 if both fail
- Paid users: OpenAI GPT-4o → Groq (fallback) → 503 if both fail
- AI timeout: 20 seconds max then trigger fallback
- Token budgeting: max input + output tokens enforced on every call
- All LLM output parsed through Pydantic schemas — never trust raw output

### Database
- Supabase (PostgreSQL + Auth + Realtime)
- pgvector inside Supabase (V2 — resume RAG)
- Redis via Upstash (cache + rate limiting + queues)
- AWS S3 (file storage — PDFs, videos)

### Embeddings
- OpenAI text-embedding-3-small (API call only — no local model, no RAM usage)
- V1: not used. V2: resume upload → embeddings → pgvector similarity search

### Deployment
- Vercel (frontend — free tier)
- AWS EC2 t2.micro (backend — free tier, upgrade to t3.small when needed)
- NGINX on EC2 (reverse proxy)
- Docker
- GitHub Actions (CI/CD)
- GitHub Secrets (env vars — never .env on server)

### Payments + Auth
- Stripe Subscriptions + Webhooks
- Stripe webhook signature verification + idempotency protection
- Supabase Auth (email + password + Google OAuth)
- JWT via Supabase (short-lived access tokens + refresh rotation)
- Never store JWT in localStorage — use secure HTTP-only cookies

### Coding agents
- Claude Code CLI
- Gemini Code CLI

---

## Subscription plans

### Free plan
- 2 roadmaps per month
- 5 AI explanations per day
- 1 resume analysis per month
- Max file upload: 2MB
- LLM: Groq → Gemini fallback
- Low priority Celery queue

### Pro plan (paid)
- Unlimited roadmaps
- Unlimited AI explanations
- Unlimited resume analysis
- Max file upload: 10MB
- LLM: OpenAI GPT-4o → Groq fallback
- High priority Celery queue

---

## User roles
- `free` — default on signup
- `paid` — after Stripe subscription confirmed via webhook
- `admin` — full platform control, separate route protection

---

## LLM router logic
- Check user plan from DB before every AI call
- Free → try Groq → if fail try Gemini → if all fail return 503
- Paid → try OpenAI GPT-4o → if fail try Groq → if all fail return 503
- Every call has 20s timeout
- Every call has max token budget
- All errors caught, logged, and fallback triggered
- All LLM responses validated through Pydantic before returning

---

## Usage limits enforcement
- Store in DB per user:
  - roadmaps_used_this_month
  - ai_explanations_used_today
  - resume_analyses_used_this_month
- Check before every AI call — if limit hit return 429 with upgrade prompt
- Reset monthly counts via Celery scheduled job (1st of every month)
- Reset daily counts via Celery scheduled job (midnight every day)

---

## Celery job states
Every background job must track state:
- PENDING
- PROCESSING
- SUCCESS
- FAILED
- RETRYING

Store job state in DB. User sees live status on frontend.
Dead letter queue in V2.

---

## Queue separation (V2)
- high_priority (paid users)
- low_priority (free users)
- email_tasks
- ai_tasks
- embedding_tasks (V2)

V1: two queues only — high_priority and low_priority.

---

## RAG strategy
- V1: No RAG. LLM generates roadmaps directly from prompt only.
- V2: Resume upload → extract text → OpenAI embeddings → pgvector 
  similarity search → personalized skill gap roadmap
- Future: Curated content library → RAG pulls real resources per topic

---

## Security — V1 non negotiable
- JWT auth check on every API endpoint
- Admin role check on every admin route (server side — never trust frontend)
- Rate limiting per user per minute via Redis (SlowAPI)
- Per-IP rate limiting on public endpoints
- Input validation + max length on all user inputs
- Prompt injection guard in every system prompt
- Stripe webhook signature + timestamp verification
- Idempotency protection — store processed webhook event IDs
- .env never on server — use GitHub Secrets
- HTTPS only (Vercel auto + NGINX on EC2)
- File upload: MIME type validation + extension check + max size
- Never store card details — Stripe handles everything
- Soft deletes on all tables (deleted_at timestamp)

---

## Security — V2
- Sentry error tracking (free tier)
- Signed S3 URLs for file access (expire after 15 minutes)
- GDPR — delete account deletes all user data
- 2FA for admin accounts
- Audit logs table (admin actions, subscription changes, bans)

---

## Observability
### V1
- Thumbs up/down rating on every roadmap generated
- Log every AI call to DB: user_id, topic, model_used, tokens, latency, timestamp
- Celery job state tracking

### V2
- LangSmith — LLM call logging, latency, cost tracking (free tier)
- Posthog — user product analytics, funnels, feature usage (free tier)
- Sentry — error tracking (free tier)
- Model performance comparison — Groq vs GPT-4o ratings

---

## Database conventions
- Soft deletes everywhere: deleted_at TIMESTAMP (never hard delete)
- Indexes on: user_id, email, created_at, subscription_status, role
- pgvector indexes: HNSW for similarity search (V2)
- All migrations via Alembic — never manually edit production DB
- Audit table for sensitive changes (V2)

---

## Feature flags
- Simple DB boolean table: feature_flags (name, enabled)
- Check flag before serving feature
- Lets us deploy unfinished features safely
- No external tool needed — just a DB table

---

## Caching strategy (Redis)
- Cache generated roadmaps by topic+level+goal hash
- Cache repeated AI explanations
- Cache user dashboard data
- Cache leaderboard
- Cache embeddings lookup (V2)

---

## API conventions
- All responses: { success: bool, data: any, error: str }
- All AI calls wrapped in try/catch with fallback
- All LLM output through Pydantic schema before returning
- FastAPI OpenAPI docs properly tagged with examples
- Service layer pattern: /api → /services → /repositories → /models

---

## Folder structure
/frontend         → Next.js app
/backend
  /api            → route handlers
  /services       → llm_router, embeddings, rag, stripe
  /repositories   → DB queries
  /models         → SQLAlchemy models
  /schemas        → Pydantic schemas
  /workers        → Celery tasks
  /core           → config, security, middleware

---

## Environment variables
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
GROQ_API_KEY
GEMINI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
UPSTASH_REDIS_URL
UPSTASH_REDIS_TOKEN
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET_NAME
AWS_REGION

---

## Cost summary
- Launch cost: $0/mo (everything on free tiers + AWS free tier)
- After AWS free tier ends: ~$10/mo
- Upgrade EC2 to t3.small ($15/mo) only when RAM hits limits
- AWS Secrets Manager — skip until team grows

---

## V1 features — build first
1. Landing page (9 sections)
2. Topic + level + goal picker
3. AI roadmap generation with LLM router
4. Auth (signup, login, Google OAuth)
5. Progress tracking (check off topics, progress bar, streak)
6. "Explain this simply" button (5/day free)
7. "Why am I learning this?" button
8. Usage limits enforcement
9. Stripe subscription flow (free + pro)
10. Admin panel (users, plans, revenue, ban/suspend, usage stats)
11. NGINX setup on EC2
12. Rate limiting
13. Celery job states
14. DB indexes + Alembic migrations
15. Feature flags table

## V2 features
- Resume upload + RAG + skill gap roadmap
- AI chat per topic
- Quiz per phase
- Skill gap analysis (skip what you know)
- X hours/day timeline adjuster
- Weekly digest email
- Public roadmap profiles
- Leaderboard + gamification
- Job market skills tied to roadmap
- LangSmith + Posthog + Sentry
- Queue separation
- Celery dead letter queue
- Audit logs

## Future features
- Resume to job match score ("You are 62% ready for ML Engineer")
- Study buddy matching
- Interview prep mode
- AI voice explanations
- Community resource ratings
- Job scraping integration (LinkedIn, Indeed)
- AI memory per user
- Adaptive difficulty
- Roadmap visualization (tree/graph)

---

## Coding conventions
- Python: snake_case, type hints everywhere, async/await
- TypeScript: camelCase, strict mode on
- All API responses: { success: bool, data: any, error: str }
- Every AI call wrapped in try/catch with fallback
- No hardcoded API keys — always from env
- Every LLM response validated through Pydantic
- Soft deletes on all DB tables
- Every endpoint has rate limiting

---

## Build Notes
- Python 3.11.9 is the required version (3.14 not supported)
- Use SESSION POOLER connection string for Supabase (not direct, not transaction pooler)
- Add statement_cache_size=0 to all asyncpg engine connections
- Enum types use DO block with EXCEPTION WHEN duplicate_object pattern
- asyncpg==0.29.0 and pydantic-settings==2.6.1 added to requirements.txt
- Migration command: alembic -c backend/alembic.ini upgrade head (run from project root)
- bcrypt must be pinned to 4.0.1 (newer versions break passlib)
- uvicorn run command: uvicorn backend.main:app --reload (from project root)
- Groq model: llama-3.1-8b-instant
- Gemini model: gemini-2.0-flash
- OpenAI model: gpt-4o-mini (paid users)
- Production uvicorn command: uvicorn backend.main:app --proxy-headers --forwarded-allow-ips="*"
- Redis caching enabled for roadmaps (24hr TTL, keyed by SHA-256 of topic+difficulty+goal)
- Explain endpoint: 5/day limit for free users
- Why endpoint: no usage limit
- Celery beat schedules use crontab (not intervals): daily reset at midnight, monthly reset on 1st
- Streak is per-roadmap, based on UTC timezone