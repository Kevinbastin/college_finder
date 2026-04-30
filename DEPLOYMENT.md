# Deployment Guide

This project is ready for production deployment.

## What is already done
- College listing + search + filters + pagination
- College detail page
- Compare colleges
- Predictor tool
- Q&A / discussion
- Auth + saved items
- Prisma schema + seeded dataset
- Local build passes

## What you still need to do
- Deploy to Vercel
- Point Vercel to the production PostgreSQL database
- Run production migration/seed
- Replace the placeholder live URL in README

## 1) Prepare the Neon database
If you already have a Neon database, you can reuse it.

You need the connection string like:

```bash
postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require
```

## 2) Set Vercel environment variables
In Vercel project settings, add:

- `DATABASE_URL` = your Neon connection string
- `NEXTAUTH_SECRET` = a long random secret
- `NEXTAUTH_URL` = your deployed Vercel URL

Example:

- `NEXTAUTH_URL=https://college-find.vercel.app`

## 3) Deploy the app
Import the repository into Vercel and deploy it.

The project already has:
- `vercel.json`
- a working build command
- Prisma generation in the build flow

## 4) Run production migration
After the first deployment, run this from your local machine with the **production** `DATABASE_URL` set:

```bash
DATABASE_URL="your-neon-url" npx prisma migrate deploy
```

If the production DB is empty, this will create the schema.

## 5) Seed production data
If the production database does not yet have college rows, seed it:

```bash
DATABASE_URL="your-neon-url" npx prisma db seed
```

## 6) Verify production
Open these pages after deploy:

- `/`
- `/colleges`
- `/compare`
- `/predictor`
- `/login`
- `/saved`

Check these behaviors:
- listing loads 60 colleges
- search and filters work
- college detail page opens correctly
- compare table works for 2–3 colleges
- predictor returns results
- login/register works
- saved colleges and saved comparisons persist

## 7) Update README
Replace the placeholder live URL in `README.md` with your deployed Vercel URL.

## Common issue
If `prisma migrate deploy` fails because the database is not empty:
- create a fresh Neon database for production, or
- baseline the existing database before deploying

For a student project, the easiest path is usually:
1. create a fresh Neon database
2. deploy to Vercel
3. run `prisma migrate deploy`
4. run `prisma db seed`

## Final expected result
A live URL that works end-to-end with:
- PostgreSQL-backed data
- auth
- saved items
- compare
- predictor
- Q&A
