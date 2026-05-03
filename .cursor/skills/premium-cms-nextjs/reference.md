# Premium CMS — reference

Companion to [SKILL.md](SKILL.md). **Ongoing ops** (Vercel env, rotation, backups): [operations.md](operations.md). **Here:** env matrix, UTM by surface, migration failures, script naming.

## Environment and scripts

| Intent | How |
|--------|-----|
| Local Docker only | `npx dotenv -e .env.docker -- prisma <cmd>`; `package.json` scripts e.g. `db:deploy:local`, `db:seed:local` |
| Cloud (Neon) from laptop | `dotenv -e .env -e .env.local` or `vercel env pull` — scripts like `db:deploy` |
| Next dev on local DB | `.env.docker` → `.env.development.local` so runtime matches migrate |
| **Avoid** | Chaining `dotenv` files so Prisma picks prod while you meant Docker |

`POSTGRES_PRISMA_URL` and `DATABASE_URL` are both required for Prisma 5+ split URL; for a **single** local instance, same URL in both is OK.

**Neon:** pooler for app runtime; **direct** (non-`-pooler`) for `directUrl` / migrations. **`pg_dump` / `pg_restore`** to clone: use a **direct** connection string, not the pooler.

## Migration failures (recovery patterns)

- **`P3018` / "column already exists"** — a past `db push` or manual change applied something the migration also tries. Options: (a) add `ADD COLUMN IF NOT EXISTS` in that migration for greenfield safety, (b) `prisma migrate resolve` after manual align with Prisma docs, then redeploy.
- **Failed mid-migration** — follow Prisma’s “failed migration” recovery; do not hand-edit `_prisma_migrations` without understanding state.

## UTM: where each surface gets params

| Surface | Source in CMS | `utm_content` |
|--------|-----------------|----------------|
| Nav primary (JSON chrome) | `primaryCta.utm*` fields | Per-field |
| Home hero / CTA copy | `primaryUtm*` / `secondaryUtm*` on that model | Per block in admin |
| CTA section (two-button block) | Two blocks: primary + secondary UTM; **`mailto:` secondaries** often skip UTM in code | One value per block; same on every page using the section |
| Home services strip **inline** link | `footerLinkUtm*` | **`utm_content` field** = that link only |
| Sitewide **V2 footer** “Start a project” | Same `footerLinkUtm*` for source/medium/campaign/term | **Auto** from `usePathname()` path slug (optional pattern) |
| Calendly on contact | `calendlyUtm*` | All five optional |

**Internal:** `utm_source=site` (or brand slug), `utm_medium=nav|footer|…`, `utm_campaign=…`, `utm_content` = placement or path.

**External ad URLs** use the ad platform or spreadsheet link builder; CMS is for **on-site** controlled links.

## Greenfield `package.json` (suggested names)

- `db:up` / `db:down` — compose
- `db:deploy:local` — compose wait + `migrate deploy` with **only** `.env.docker`
- `db:seed:local` — seed with same
- `db:deploy` — cloud with `.env` + `.env.local`
- `db:migrate:local` vs `db:migrate` — parallel naming for `migrate dev`
- `build` — `prisma generate && next build`
- `postinstall` — `prisma generate`

## JSON in the CMS

- Store pretty JSON; validate in **server** actions before write (`JSON.parse` in try/catch).
- Surface parse errors in admin toasts / inline, not a 500 with no message.
- **Types:** `lib/cms/*-types.ts` + `zod` or hand-rolled parse — reject unknown keys if that matters for your editors.

## Feature inventory (pick what you need)

- **Core:** SiteSettings, SeoSettings, `noIndex`, 404, sitemap, dynamic OG.
- **Chrome:** nav + footer + CTA with typed config.
- **Page copy** models per major route; **collections** (case studies, team, blog, industries, redirects).
- **Forms:** config JSON, POST handler, Resend, optional lead table, GA4 MP, thank-you page.
- **Ops:** admin overview, optional DB clone script, email settings (no API secrets in DB).

## Anti-patterns

- Long-term **production** schema = `db push` only.
- **Two** independent GA4 pageview implementations (e.g. gtag + GTM without container owning GA).
- **Secrets** in database rows.
- CMS saves with **no** revalidation of public routes.
- **Contact** success with no idempotency story for duplicate POSTs (at least don’t 500; log and optionally unique constraint).

## Reference code locations (illustrative)

A mature implementation includes: `prisma/schema.prisma`, `lib/cms/queries.ts`, `lib/utm.ts`, `app/admin/(protected)/`, `package.json` db scripts, `docker-compose.yml`, `.env.example`, `app/api/.../route.ts` for forms. Copy **patterns**, not the whole app, for new projects.
