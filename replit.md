# Umrahme

Platform SaaS multi-tenant untuk travel umrah/haji. Jamaah login dengan kode aktivasi dan mendapat aplikasi pendamping digital (agenda, pengumuman, kartu jamaah, doa, panduan ibadah). Admin travel mengelola batch keberangkatan, jamaah, agenda, dan pengumuman via dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/umrahme exec vite --host 0.0.0.0` — run frontend (port 5000)
- `pnpm --filter @workspace/umrahme exec tsc --noEmit` — typecheck frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.x
- Frontend: React 19 + Vite (port 5000)
- API: Express 5 (port 8080), built to `artifacts/api-server/dist/index.mjs`
- DB: Supabase (auth + data + storage) — `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- API server uses Drizzle ORM + Replit PostgreSQL (`DATABASE_URL`) for JWT auth routes only
- Frontend uses supabase-js REST API directly (no direct Postgres from Replit sandbox)

## Where things live

- `artifacts/umrahme/src/lib/supabase.ts` — all Supabase types + CRUD functions (source of truth)
- `artifacts/umrahme/src/context/AuthContext.tsx` — jamaah session (jamaah + tenant + keberangkatan)
- `artifacts/umrahme/src/pages/admin/AdminTenantForm.tsx` — full admin UI (1616+ lines, 6 tabs)
- `artifacts/umrahme/src/data/` — jamaah.ts (login flow), travelCompanion.ts (operational info)
- `supabase/schema.sql` — full schema documentation
- `supabase/migration_multi_keberangkatan.sql` — **run this in Supabase SQL Editor** to apply multi-batch schema

## Architecture decisions

- Supabase direct PostgreSQL (port 5432) is blocked from Replit sandbox network; all DB access from frontend uses REST API (port 443).
- `keberangkatan` (batch) is the core of the multi-tenant multi-batch model: each jamaah, agenda item, and announcement is scoped to a `keberangkatan_id`.
- `fase` is computed from `keberangkatan.tanggal_keberangkatan` / `tanggal_kepulangan` unless `fase_override` is set on keberangkatan or jamaah_accounts.
- Tenant-level fields (hotel, guide, etc.) are legacy fallbacks; the canonical data lives on the `keberangkatan` row.
- `createJamaah` accepts `keberangkatanId: string | null` — null is used by TravelDashboard (simple add) which doesn't have a batch selector.

## Product

- **Jamaah app**: Beranda (countdown, agenda hari ini, quick actions), Kartu Jamaah Digital, Agenda Perjalanan, Pengumuman, Panduan Ibadah, Doa, Navigator, Profil
- **Admin travel dashboard**: Manage tenant settings, keberangkatan batches, jamaah list (with AI import), agenda, announcements
- **Super admin**: Manage all tenants via `/admin`

## User preferences

- Do not migrate to Replit PostgreSQL — keep Supabase as the database.

## Gotchas

- Run `supabase/migration_multi_keberangkatan.sql` in Supabase SQL Editor before the multi-batch features work end-to-end.
- The Supabase direct DB connection string (`SUPABASE_DB_URL`) is unreachable from Replit (port 5432 blocked). Use Supabase Dashboard SQL Editor to run migrations.
- After running migration, may need to reload Supabase schema cache: Dashboard → API → "Reload schema".
- `fetchJamaah(tenantId)` fetches ALL jamaah for a tenant; filter by `keberangkatan_id` client-side in AdminTenantForm.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
