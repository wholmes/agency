---
name: premium-cms-nextjs
description: >-
  Production-grade marketing-site CMS on Next.js App Router, Prisma, PostgreSQL, same-app
  admin, migrations, local Docker vs Neon/Vercel, SEO/GA/GTM, email+forms+lead storage,
  UTM and conversion URLs. Use for greenfield or extending CMS, contact funnels, admin
  CRUD, Prisma env and migrate safety, or when the user mentions Neon, Vercel deploy, or
  internal UTM for on-site links.
---

> **Canonical user copy (default for new sites):** `~/.cursor/skills/premium-cms-nextjs/`. Edit there first; sync this file if the repo should match.

# Premium CMS on Next.js + Prisma

This skill encodes patterns from a **shipping** marketing site: one admin, many page types, Postgres in production, strict migration history, and analytics that do not double-count.

## What “premium” means

- **Schema and DB are the source of truth** — no `db push` to production; migrations ship with the app.
- **Local vs cloud are explicit** — env files + npm scripts so `prisma` CLI is never pointed at the wrong DSN by accident.
- **CMS is bounded** — JSON in DB is fine with **TypeScript parse + validation** at read/write; relational tables for listable, queryable entities.
- **High-value actions are traceable** — e.g. contact: validate → email → optional `ContactLead` row → GA4 Measurement Protocol event → **thank-you page** (conversion URL for ads) with `noindex`.

---

## Locked stack (defaults)

| Layer | Choice | Notes |
|--------|--------|--------|
| Framework | **Next.js** (App Router) | RSC for CMS reads; `revalidate` / `revalidatePath` / tags as appropriate. |
| ORM | **Prisma** + **PostgreSQL** | `datasource.url` = pooled; `directUrl` = **non-pooler** for migrate (Neon: `-pooler` in hostname → flaky locks). |
| Admin | **Same Next app** `/admin` + session cookie | Password in env; optional weak-password warning in UI. |
| Email | **Resend** (or similar); **API key in env only** | Never in DB. |
| Analytics | **GA4** | Client **gtag** *or* **GTM**, not two independent pageview pipelines; **Measurement Protocol** + API secret for server events (e.g. `generate_lead`). |

Details: [reference.md](reference.md).

---

## Local vs production database

**Problem:** Prisma loads `.env`; multiple env files can make `migrate` hit Neon when you meant Docker.

1. **`.env.docker`** — only URLs to **local Postgres** (e.g. `127.0.0.1:5434`).
2. **`db:*:local` scripts** — `npx dotenv -e .env.docker -- prisma …` **only** (no extra `-e .env` that overrides).
3. **Docker** — `compose up -d --wait` + `healthcheck` before migrate/seed.
4. **Dev against local** — copy `.env.docker` → `.env.development.local` (or a `db:sync-dev-env` script) so `next dev` matches migrate.

Changing Docker `POSTGRES_USER` / password without **volume reset** → stale creds; document `down -v` or reset script.

---

## Prisma: migrations and runtime

1. **Every** production column → **migration file**. If an env had `db push` in the past, `migrate deploy` can throw “column already exists” — fix with **`ADD COLUMN IF NOT EXISTS`** in SQL and/or `migrate resolve` per Prisma recovery docs, then process-only migrations going forward.
2. **`prisma generate`** in `postinstall` and `build` so CI/deploy never serves stale client.
3. **Deploy** runs **`prisma migrate deploy`**, not `migrate dev`.
4. **Singleton rows** `id: 1` for site-wide settings — document in `schema.prisma` comments.
5. **Single `PrismaClient` module** (global in dev) — avoid instantiating per request. Tune timeouts / pooler params in **application** code for Neon; strip params local DB cannot use (e.g. `channel_binding`).

---

## App shape (reference layout)

```
src/app/
  (routes)/public pages
  admin/login | admin/(protected)/   # session layout + grouped nav
  api/          # contact, webhooks
src/lib/
  cms/queries.ts     # server getters; React cache() for dedupe
  admin/mutations-data.ts
  utm.ts             # appendUtmToUrl, utmFrom*Db
  prisma.ts
prisma/schema.prisma, seed.ts, migrations/
```

- **Mutations** — after successful DB writes, `revalidatePath` (and `revalidateTag` if you use tags) for every affected public path.
- **Admin** — `AdminSaveForm`, success toasts, grouped nav by site area; long JSON in textarea → pretty default + **parse errors surfaced** (don’t save invalid JSON silently).

---

## CMS build order (prioritized)

1. Site + SEO settings (`noIndex` for staging).
2. **Chrome** (nav/footer JSON) with **typed** config — not `Record<string, unknown>` everywhere.
3. Page-scoped **copy models** (one per route family).
4. **Collections** (projects, team, blog, …) with list + detail admin.
5. **Contact** — form config JSON, API route, Resend, optional **`ContactLead`**, server-side GA4 event, **redirect to thank-you** route (`robots: noindex`).
6. Redirects (DB + middleware or edge), email notification settings, UTM centralization.

[reference.md](reference.md) has a longer feature menu and UTM surface table.

---

## UTM (internal links)

- **source** = your site/brand, **medium** = placement (`nav`, `footer`, `cta_section`), **campaign** = stable initiative, **content** = specific button or page slug (or auto from `usePathname()` for sitewide footer CTA), **term** usually empty.
- **Not** for “LinkedIn” unless that URL is only used on LinkedIn.
- **GTM** loaded → do **not** also inject duplicate direct GA snippet for the same property.
- **Two UTM blocks in one form** = two different buttons/links, not “two ad networks.”

---

## Security & ops

- Admin password from env; never commit real secrets; `.env.example` only placeholders.
- **PII** (saved leads) — admin-auth only; plan retention if needed.
- **Clone prod → local** — script using `PROD_DATABASE_URL` env, **unpooled** `pg_dump`, never commit dumps.
- **Vercel env scopes, rotation, backups, deploy order:** [operations.md](operations.md).

---

## Dev ergonomics (optional but valuable)

- **Middleware** that calls your own API/DB: in **development** avoid same-origin fetches that deadlock or block the whole chain; production behavior unchanged.
- **Instrumentation** `register()` — Prisma “warm” only where useful (e.g. prod), not every cold `next dev` unless you opt in.

(Framework-specific; read project `AGENTS.md` for Next version quirks.)

---

## Quality bar

- [ ] Schema + migrations in sync; deploy-safe when drift possible.
- [ ] `db` scripts and env story documented in README or `package.json` comments.
- [ ] Form API: consistent JSON errors; no stack to client.
- [ ] Thank-you / conversion page `noindex`.
- [ ] One GA4 client path; admin explains not to paste a second gtag.
- [ ] A11y: labels, table semantics in admin.

---

## Agent workflow

1. Read `schema.prisma` + `migrations/` before new columns.
2. Add a migration; use `IF NOT EXISTS` when old DBs may already have the column.
3. Ship **schema + query + admin + revalidate** together when possible.
4. Document or implement UTM strategy per surface (static CMS vs path-derived client).

**Ops (Vercel env, rotation, backups):** [operations.md](operations.md) · **Tables, migration recovery, UTM:** [reference.md](reference.md)

## Related

- Prisma `directUrl`, Neon pooler.
- Next.js App Router, Server Actions, `revalidatePath`.
- `AGENTS.md` / `CLAUDE.md` for this repo’s Next version.
