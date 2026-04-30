# CollegeFind — College Discovery Platform

A production-grade college discovery and decision platform for Indian students. Search, compare, and make informed decisions about 60+ colleges across India.

## 🚀 Live URL

> **[https://your-deployment.vercel.app](https://your-deployment.vercel.app)** *(Update after deployment)*

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router) · TypeScript
- **Styling**: Tailwind CSS v3
- **Database**: PostgreSQL (Neon — serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Credentials Provider)
- **Deployment**: Vercel
- **Notifications**: react-hot-toast

## ✨ Features

1. **College Listing + Search + Filter** — Browse 60 colleges with live debounced search, combinable filters (state, type, fees, NAAC, rating, courses), URL-based state, pagination, skeleton loaders
2. **College Detail Page** — Full information with tabs (Overview, Courses, Placements, Contact), quick stats bar, similar colleges, breadcrumbs
3. **Compare Colleges** — Side-by-side comparison of 2-3 colleges with best-value green highlighting, floating compare bar, search modal
4. **Auth + Saved Colleges** — Email/password login/register with NextAuth, bookmark colleges, save comparison sets, protected saved page, optimistic updates
5. **College Predictor** — Enter exam (JEE Main/Advanced, NEET, CAT, GATE) and rank to find matching colleges with High/Moderate/Low chance badges
6. **Q&A Discussion** — Per-college Q&A on detail pages, auth-gated posting, expandable answers

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/college-discovery.git
cd college-discovery

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with 60 colleges
npx prisma db seed

# Start dev server
npm run dev
```

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth sessions |
| `NEXTAUTH_URL` | Your app URL (http://localhost:3000 for dev) |

Copy [.env.example](.env.example) to `.env` for local development.

## 🚀 Deployment

1. Push code to GitHub
2. Create a Neon database at [neon.tech](https://neon.tech)
3. Import project on [vercel.com](https://vercel.com)
4. Add `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in the Vercel dashboard
5. Run `prisma migrate deploy` against the production database
6. Seed the production database if needed with `npx prisma db seed`
7. Deploy — Vercel auto-builds on push

## 📊 Database

- **60 realistic Indian colleges** across 12 states
- 8 IITs, 6 NITs, 4 IIMs, 6 Private Engineering, 4 Private Management, 6 State Universities, 8 Private Deemed, 6 Medical, 6 Law/Arts, 6 Newer Private
- Full data: fees, placements, cutoff ranks, courses, contact info

---

Built with ❤️ for students across India
