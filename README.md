# Zalldi Platform

A production-ready hyperlocal commerce monorepo — food delivery, quick commerce groceries, and dine-out booking.

**Stack:** Next.js 15 · Supabase · Turborepo · pnpm · TypeScript · Tailwind CSS · Zustand · Zod

---

## Subdomain Map

| App | Subdomain | Port (local) |
|-----|-----------|--------------|
| Customer Web | zalldi.com | 3000 |
| Admin Panel | admin.zalldi.com | 3001 |
| Seller Hub | seller.zalldi.com | 3002 |
| Darkstore Manager | dstore.zalldi.com | 3003 |

---

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 — `npm install -g pnpm`
- Supabase account — [supabase.com](https://supabase.com)
- (Optional) Supabase CLI for local dev — `brew install supabase/tap/supabase`

---

## 1. Clone & Install

```bash
git clone https://github.com/your-org/zalldi-platform.git
cd zalldi-platform
pnpm install
```

---

## 2. Set Up Supabase

### Option A — Supabase Cloud (recommended to start)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → New Project
2. Note your **Project URL** and **anon key** from Settings → API
3. Run migrations in the SQL Editor (in order):

```sql
-- Paste contents of each file in order:
infrastructure/supabase/migrations/001_init_extensions.sql
infrastructure/supabase/migrations/002_users.sql
infrastructure/supabase/migrations/003_addresses.sql
infrastructure/supabase/migrations/004_darkstores.sql
infrastructure/supabase/migrations/005_categories.sql
infrastructure/supabase/migrations/006_products.sql
infrastructure/supabase/migrations/007_restaurants.sql
infrastructure/supabase/migrations/008_menus.sql
infrastructure/supabase/migrations/009_orders_food.sql
infrastructure/supabase/migrations/010_orders_grocery.sql
infrastructure/supabase/migrations/011_promos.sql
infrastructure/supabase/migrations/012_delivery_agents.sql
infrastructure/supabase/migrations/013_notifications.sql
```

4. (Optional) Run seed data for development:
```sql
-- infrastructure/supabase/seed/001_seed_data.sql
```

### Option B — Local Supabase

```bash
supabase init
supabase start
# Apply migrations
supabase db push
```

---

## 3. Environment Variables

Copy `.env.example` to each app and fill in your Supabase credentials:

```bash
cp .env.example apps/customer-web/.env.local
cp .env.example apps/admin-panel/.env.local
cp .env.example apps/seller-hub/.env.local
cp .env.example apps/darkstore-manager/.env.local
```

Edit each `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_ENV=development
```

---

## 4. Create Admin User

After setting up Supabase, create your first admin:

1. Go to Supabase Dashboard → Authentication → Users → Invite User
2. After the user signs up, run this in the SQL Editor:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

---

## 5. Run Locally

### All apps in parallel (recommended)

```bash
pnpm dev
```

This starts all 4 apps simultaneously via Turborepo.

### Individual apps

```bash
# Customer Web — localhost:3000
pnpm --filter @zalldi/customer-web dev

# Admin Panel — localhost:3001
pnpm --filter @zalldi/admin-panel dev

# Seller Hub — localhost:3002
pnpm --filter @zalldi/seller-hub dev

# Darkstore Manager — localhost:3003
pnpm --filter @zalldi/darkstore-manager dev
```

---

## 6. Build

```bash
# Build everything
pnpm build

# Build a single app
pnpm --filter @zalldi/customer-web build
```

---

## 7. Deploy to Vercel

Each app is deployed as a **separate Vercel project** pointing to the same monorepo.

### Steps for each app

1. Go to [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Select your monorepo repository
3. Set **Root Directory** to the app folder (e.g. `apps/customer-web`)
4. Vercel will auto-detect the `vercel.json` build commands
5. Add environment variables (same as `.env.local`)
6. Assign your custom domain in Vercel → Settings → Domains

| App folder | Domain |
|------------|--------|
| `apps/customer-web` | `zalldi.com` |
| `apps/admin-panel` | `admin.zalldi.com` |
| `apps/seller-hub` | `seller.zalldi.com` |
| `apps/darkstore-manager` | `dstore.zalldi.com` |

### Turbo Remote Cache (optional, speeds up CI)

```bash
npx turbo link
```

---

## 8. Monorepo Structure

```
zalldi-platform/
├── apps/
│   ├── customer-web/         → zalldi.com (food, groceries, dineout)
│   ├── admin-panel/          → admin.zalldi.com
│   ├── seller-hub/           → seller.zalldi.com
│   └── darkstore-manager/    → dstore.zalldi.com
├── packages/
│   ├── ui/                   → @zalldi/ui (shared components)
│   ├── auth/                 → @zalldi/auth (Supabase auth clients)
│   ├── database/             → @zalldi/database (query helpers)
│   ├── types/                → @zalldi/types (shared TypeScript types)
│   ├── validation/           → @zalldi/validation (Zod schemas)
│   └── config/               → @zalldi/config (env validation)
├── infrastructure/
│   └── supabase/
│       ├── migrations/       → SQL migrations (run in order)
│       └── seed/             → Dev seed data
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## 9. Key Architecture Decisions

| Decision | Why |
|----------|-----|
| Turborepo | Parallel builds, caching, only rebuilds what changed |
| pnpm workspaces | Strict dependency hoisting, fast installs |
| Supabase RLS | Row-Level Security on every table — no accidental data leaks |
| Server Components default | Data fetching at RSC level, minimal client JS |
| Zustand for cart | Persisted client-side cart with `persist` middleware |
| Zod everywhere | Schemas shared between client validation and server parsing |
| Separate Vercel projects | True isolation, independent deployments, separate env vars |

---

## 10. Adding a Seller / Darkstore Operator

1. User registers on `seller.zalldi.com`
2. Admin goes to `admin.zalldi.com/customers`, finds the user
3. Runs in Supabase SQL Editor:

```sql
UPDATE user_profiles SET role = 'seller' WHERE email = 'seller@example.com';
```

4. Seller can now log in to `seller.zalldi.com`

---

## 11. Health Checks

- Customer Web: `GET /api/health` → returns DB connectivity status
- All apps: check `/login` page loads cleanly

---

## 12. Local Development Tips

- **Supabase Studio** (if running locally): http://localhost:54323
- **Email testing** (Inbucket): http://localhost:54324
- **Type generation** after schema changes:
  ```bash
  supabase gen types typescript --linked > packages/database/src/types/supabase.ts
  ```
- **Cache issues**: `pnpm clean` then `pnpm install`

---

## Environment Variable Reference

| Variable | Required | Used by |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | All apps |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | All apps |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (server-side) | All apps |
| `NEXT_PUBLIC_APP_ENV` | Optional | All apps |
| `NEXT_PUBLIC_APP_NAME` | Optional | All apps |
| `NEXT_PUBLIC_CUSTOMER_WEB_URL` | Optional | Redirects |

---

## License

Private — All rights reserved, Zalldi Technologies.
