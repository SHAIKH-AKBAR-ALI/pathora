# Pathora

AI-powered personalized learning roadmap platform. Pick a topic, set your goal, and get a structured, phase-by-phase curriculum tailored to your exact needs.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Zustand
- **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic
- **AI:** Groq (Llama 3), Google Gemini, OpenAI (GPT-4o)
- **Database:** Supabase (PostgreSQL), Redis (Upstash)
- **Payments:** Razorpay (India)
- **Background Jobs:** Celery, Redis

## Current Status

- **Build Progress:** All 10 Phases Complete (V1 MVP)
- **Status:** [x] MVP Backend Ready, [x] Landing Page Live, [x] Full App UI Operational

## Environment Variables

Create a `.env` file in the root with the following keys:

```env
# Database & Auth
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Models
OPENAI_API_KEY=
GROQ_API_KEY=
GEMINI_API_KEY=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Cache & Queues
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Storage (V2)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_REGION=
```

## Running Locally

### 1. Backend

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run migrations
alembic -c backend/alembic.ini upgrade head

# Start server
uvicorn backend.main:app --reload
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Celery Worker

```bash
# Start worker (from root)
celery -A backend.workers.celery_app worker --loglevel=info

# Start beat (for scheduled resets)
celery -A backend.workers.celery_app beat --loglevel=info
```

## Roadmap

- [x] Phase 1-4: Foundation, Auth, & Core API
- [x] Phase 5: AI Roadmap Generation
- [x] Phase 6: Progress & Streak Tracking
- [x] Phase 7: Razorpay Integration
- [x] Phase 8: Admin Panel
- [x] Phase 9: Landing Page
- [x] Phase 10: App UI (Dashboard, Roadmap View, Profile)
- [ ] V2: Resume RAG, AI Chat, Quizzes
