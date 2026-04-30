# CollegeFind — College Discovery & Decision Platform

A full-stack college discovery and comparison platform for Indian students. Search, compare, predict admission chances, and save your favorite colleges across 60+ institutions in India.

## Live Application

**Frontend**: https://college-finder-henna.vercel.app  
**Backend API**: https://college-finder-z9dq.onrender.com

## Tech Stack

**Frontend**
- Next.js 16 (App Router) with TypeScript
- Tailwind CSS v3 for styling
- NextAuth.js for authentication (Credentials Provider)
- React Hot Toast for notifications

**Backend**
- Next.js API routes (serverless)
- Prisma ORM with PostgreSQL
- NextAuth integration

**Database**
- Neon PostgreSQL (serverless)
- 60 pre-seeded colleges with realistic data

**Deployment**
- Frontend: Vercel (with API proxy to backend)
- Backend: Render (free tier with cold start spindown)
- Database: Neon Postgres

## Features

### 1. Smart College Discovery
- Browse 60+ colleges with live debounced search
- Filter by state, college type, fees range, NAAC grade, rating, and courses
- URL-based state management for shareable links
- Pagination with skeleton loaders for fast perceived performance

### 2. Detailed College Profiles
- Four-tab interface: Overview, Courses, Placements, Contact
- Quick stats bar (fees, placement %, avg/highest package, student count)
- Top recruiters and course offerings
- Similar colleges recommendation engine
- Breadcrumb navigation

### 3. College Comparison
- Compare 2–3 colleges side-by-side
- 11+ metrics: location, fees, placements, ratings, establishment year
- Best-value highlighting for standout metrics
- Persistent floating compare bar
- Smart search modal for adding colleges

### 4. Authentication & Saved Items
- Secure email/password registration and login
- Session persistence with NextAuth
- Bookmark individual colleges to personal "Saved Colleges" list
- Save and reuse multi-college comparisons
- Protected pages (requires login)

### 5. Admission Predictor
- Enter exam type (JEE Main/Advanced, NEET, CAT, GATE) and rank
- Instant chance prediction: High/Moderate/Low badges
- Filtered college recommendations based on cutoff data

### 6. Community Q&A
- Ask questions on any college detail page
- Answer community questions (authenticated users)
- Expandable answer threads
- Real-time updates with optimistic UI

## Local Development

### Prerequisites
- Node.js 18+
- npm/yarn
- PostgreSQL (or Docker)

### Setup

```bash
git clone https://github.com/Kevinbastin/college_finder.git
cd college_discovery

npm install

cp .env.example .env.local

npx prisma generate

npx prisma migrate dev

npx prisma db seed

npm run dev
```

Open http://localhost:3000 after the development server starts.

## Environment Variables

### Development (`.env.local`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/college_finder
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel)
```
NEXTAUTH_URL=https://college-finder-henna.vercel.app
NEXTAUTH_SECRET=<same-as-render>
```

**Note**: Do not set `NEXT_PUBLIC_API_URL` in production; the Vercel rewrite handles API proxying to Render.

### Production (Render Backend)
```
DATABASE_URL=<your-neon-connection-string>
NEXTAUTH_SECRET=<same-as-vercel>
NEXTAUTH_URL=https://college-finder-henna.vercel.app
NODE_ENV=production
```

## Deployment

### Architecture
- **Frontend** runs on Vercel (build + deployment)
- **Backend** runs on Render (Next.js app with API routes)
- **Database** runs on Neon (PostgreSQL)
- **Proxy**: Vercel rewrites `/api/*` requests to Render (preserves cookies for auth)

### Step-by-Step Deployment

#### 1. Deploy Backend to Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo (`Kevinbastin/college_finder`)
4. Configure:
   - **Name**: `college-finder-backend`
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npx prisma migrate deploy && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables:
   - `DATABASE_URL` = your Neon connection string
   - `NEXTAUTH_SECRET` = random 32+ char secret
   - `NEXTAUTH_URL` = your Vercel frontend URL (once deployed)
   - `NODE_ENV` = `production`
6. Deploy (green ✓ when ready)

#### 2. Seed Production Database
After Render deployment succeeds:
```bash
curl https://college-finder-z9dq.onrender.com/api/seed
```
Expected response: `{"success":true,"message":"Seeded 60 colleges!"}`

#### 3. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Import your GitHub repo
3. Configure:
   - **Framework**: Next.js
   - **Build Command**: `npx prisma generate && next build` (migrations run on Render)
4. Add Environment Variables:
   - `NEXTAUTH_URL` = `https://college-finder-henna.vercel.app` (or your domain)
   - `NEXTAUTH_SECRET` = same value as Render
5. Deploy (auto-deploys on git push afterward)

#### 4. Enable API Proxy (optional but recommended)
Vercel automatically rewrites `/api/*` to Render (via `vercel.json`). No additional config needed.

## Database Schema

### Tables
- **College**: 60 institutions with full metadata (fees, placements, rankings)
- **User**: Registered users (email, hashed password)
- **SavedCollege**: User bookmarks (many-to-many with College)
- **SavedComparison**: User comparison sets (multiple colleges per comparison)
- **Question**: Per-college community questions
- **Answer**: Answers to questions (many-to-one with Question)

### Sample College Data
- **60 colleges** across 12 states
- Distribution: 8 IITs, 6 NITs, 4 IIMs, 6 Private Engineering, 4 Private Management, 6 State Universities, 8 Private Deemed, 6 Medical, 6 Law/Arts, 6 Newer Private
- Data includes: fees, placement rates, avg/highest packages, cutoff ranks by exam, courses, contacts, NAAC grades

---

## Testing Features

```bash
npm run dev
```

---

## Documentation

- [Deployment Guide](./DEPLOY_RENDER.md) — Detailed Render + Vercel setup
- API Routes documented in `src/app/api/`

---

## Contributing

Feel free to fork, modify, and use this as a template for your college discovery projects.

---

## Performance Notes

- **Cold starts**: Render free tier spins down after 15 min inactivity (first request ~30s). Upgrade to Starter ($7/mo) for always-on.
- **Neon free tier**: Suitable for small projects. Upgrade if you exceed limits.
- **Vercel**: Unlimited builds on free tier; auto-deployments on git push.

---

This project provides a structured way to compare colleges, evaluate admission options, and manage saved selections.
