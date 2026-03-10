# BubbleExport SaaS Starter

A production-ready SaaS admin dashboard template built with **Next.js 16**, **Supabase**, and **Stripe**. This template was rebuilt from the most popular Bubble.io SaaS template (48.7k installs) to demonstrate what a real Bubble.io migration looks like in code.

**[Live Demo →](https://bubblexport-saas-starter.vercel.app)** · [Template Showcase](https://bubbleexport.com/templates/saas-admin)

> **Zero-config preview:** The live demo runs with `NEXT_PUBLIC_DEMO_MODE=true` — no Supabase or Stripe credentials required.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Stripe (Checkout + Billing Portal) |
| Charts | Recharts |
| Hosting | Vercel |

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/your-org/bubblexport-saas-starter.git
cd bubblexport-saas-starter
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the **SQL editor**, run `supabase/schema.sql` to create all tables, RLS policies, and triggers.
3. Optionally run `supabase/seed.sql` with real user UUIDs from **Authentication > Users** to seed sample data.

### 3. Create Stripe products

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com).
2. Create a product called **"Pro Plan"** with a recurring monthly price (e.g. $29/month).
3. Copy the **Price ID** (starts with `price_`).
4. Create a **webhook endpoint** pointing to `https://your-domain.com/api/webhooks/stripe` and subscribe to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 4. Configure environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

Create an account via `/signup`, then confirm your email and sign in.

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Add all environment variables from `.env.example` in the Vercel dashboard (Settings → Environment Variables).
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://your-app.vercel.app`).
5. Update your Stripe webhook endpoint URL to the production domain.
6. Deploy.

---

## Project structure

```
app/
  (auth)/          # Login, signup, forgot-password pages
  (dashboard)/     # Protected dashboard routes
    dashboard/     # Main KPI dashboard
    projects/      # Project CRUD
    settings/      # Profile + password settings
    billing/       # Stripe billing management
  api/
    webhooks/stripe/   # Stripe webhook handler
    billing/
      create-checkout/ # Initiates Stripe Checkout
      portal/          # Opens Stripe Customer Portal
components/
  ui/              # shadcn/ui primitives
  layout/          # Sidebar + header
  dashboard/       # MRR chart
lib/
  supabase/        # Browser + server Supabase clients
  stripe.ts        # Stripe helpers
supabase/
  schema.sql       # Database schema + RLS
  seed.sql         # Sample data
types/
  database.ts      # Generated Supabase types
```

---

## Built by BubbleExport

This starter is a live demonstration of what your Bubble.io app looks like after migration to Next.js + Supabase. Visit [bubbleexport.com](https://bubbleexport.com) to learn more.
