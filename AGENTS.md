# Titan Travel — AGENTS.md

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 · Prisma v7 · PostgreSQL (Neon) · shadcn/ui (base-nova) · Lucide icons

## Quick commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run lint` | ESLint (core-web-vitals + TS) |
| `npx tsc --noEmit` | TypeScript check (not in scripts) |
| `npx prisma migrate dev --name <name>` | Create + apply migration |
| `npx prisma generate` | Regenerate Prisma client |
| `npx tsx prisma/seed.ts` | Seed DB (creates admin user, packages, etc.) |

## Key architecture facts

- **Auth**: Custom JWT via `jose` (NOT NextAuth). Session stored in `auth_token` cookie. See `src/lib/auth.ts`.
- **Prisma client**: Import from `generated/prisma/client` (not `@prisma/client`). Uses `PrismaPg` adapter. Singleton at `src/lib/prisma.ts`.
- **Database**: PostgreSQL via Neon (PrismaPg adapter). MySQL config exists but is secondary.
- **Business logic**: Server Actions in `src/lib/actions/*.ts` (17 files). Prefer these over API routes for internal mutations.
- **API routes**: Only 3: `api/auth/*`, `api/upload`, `api/translate` — for external/client-triggered operations.
- **Multi-language**: en/id/ms via `src/lib/translations.ts` and `LocaleContext`. JSON fields in DB for translatable content.
- **TOPSIS engine**: `src/lib/topsis.ts`. 4 criteria: C1 Harga/Cost (0.35), C2 Fasilitas/Benefit (0.25), C3 Waktu/Cost (0.20), C4 Durasi/Cost (0.20). **Do not modify weights without confirmation.**
- **File uploads**: Vercel Blob (`BLOB_READ_WRITE_TOKEN`). Server action 5MB limit matches `next.config.ts`.

## Route structure (App Router)

| Route group | Auth | Purpose |
|---|---|---|
| `(panel)/admin/*` | Admin/Manager | Dashboard, packages, bookings, stats, settings, TOPSIS preview |
| `(panel)/manager/*` | Manager | Dashboard, reports (bookings, TOPSIS) |
| `dashboard/*` | User | My bookings, account |
| `paket/[slug]/*` | Public | Catalog (slug-based), detail, booking flow |
| `login/`, `register/` | Public | Auth |

## Component structure

- `components/` — Flat layout components (Navbar, Footer, HeroSection, etc.)
- `components/ui/` — shadcn primitives (button, dialog, table, etc.)
- `components/panel/` — Panel-specific components (Sidebar, ImageUpload, StatCard, etc.)

## Schema quirks

- Table/model names are English throughout (e.g., `TourPackage`, `Booking`, `VehicleType`)
- Multi-lang fields use `Json` type with shape `{ en: string, id: string, ms: string }`
- Pricing uses `PriceTier` relation (minPax/maxPax/price/originalPrice), not a flat field on `TourPackage`
- `BookingStatus` enum: `PENDING, CONFIRMED, CANCELLED, COMPLETED`
- `PaymentType` enum: `DP, HALF, FULL`
- `Role` enum: `USER, MANAGER, ADMIN`

## Environment

Requires: `DATABASE_URL` (PostgreSQL/Neon), `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`.

## Reference

Detailed workflow guidance lives in `.agents/` (but check against actual code — those files reference outdated schema/routes).
