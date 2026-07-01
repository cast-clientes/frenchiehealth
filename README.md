# Frenchie Skin Tracker

Track your French Bulldog's skin health with daily tips, a feeding guide, and an AI care assistant.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Stripe · Anthropic Claude · next-intl (EN/ES)

---

## Quick Setup

### 1. Install

```bash
npm install
cp .env.example .env.local
# Fill in all variables in .env.local
```

### 2. Environment variables

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Signing secret |
| `STRIPE_MONTHLY_PRICE_ID` | Create in Stripe → Products |
| `STRIPE_LIFETIME_PRICE_ID` | Create in Stripe → Products (one-time) |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local |

### 3. Supabase

1. Create a project at supabase.com
2. Run migrations in SQL Editor (in order):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_triggers.sql`
   - `supabase/migrations/004_seed_daily_tips.sql` — 50 tips EN+ES
   - `supabase/migrations/005_seed_feeding_plans.sql` — feeding content EN+ES
3. Create two Storage buckets (public): `skin-photos`, `dog-photos`
4. Enable Auth: Email (magic link) + Google OAuth

### 4. Stripe (test mode)

1. Create two products:
   - Monthly: $7.99/mo recurring → `STRIPE_MONTHLY_PRICE_ID`
   - Lifetime: $24.99 one-time → `STRIPE_LIFETIME_PRICE_ID`
2. Webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
3. Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 5. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all `.env.example` variables in Vercel project settings.

---

## App structure

```
app/[locale]/
  auth/login/          # Magic link + Google
  onboarding/          # 3 separate legal consents (required)
  (app)/               # Auth + consent gated
    dashboard/         # Today's tip, recent entries, quick add
    tracker/           # Skin history timeline
      new/             # Photo + itch score + zone + food + env
    tips/              # 50 tips by category
    feeding/           # Protein guide, portions, elimination diet
    chat/              # AI assistant (rate limited for free)
    dogs/new/          # Add Frenchie profile
    upgrade/           # Stripe checkout
  (public)/
    terms/             # Terms of Service (EN + ES)
    privacy/           # Privacy Policy (EN + ES)

supabase/migrations/   # 5 SQL files ready to run
messages/en.json       # English strings
messages/es.json       # Spanish strings
```

---

## Free vs. Paid

| Feature | Free | Paid |
|---------|------|------|
| Skin entries | 5 total | Unlimited |
| AI chat | 3/day | Unlimited |
| PDF export | ❌ | ✅ |
| Feeding plan | First section | All 4 sections |
| Price | $0 | $7.99/mo or $24.99 lifetime |

---

## Legal

`/terms` and `/privacy` are **draft** documents. The draft warning banner is intentional — remove it only after legal review. The medical disclaimer (onboarding + AI responses) is mandatory and must not be removed.
