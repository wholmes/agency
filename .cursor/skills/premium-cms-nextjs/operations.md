# Premium CMS — operations

Runs with [SKILL.md](SKILL.md). Use this for **Vercel env discipline**, **secret rotation**, **backups**, and **release order**—the stuff you touch every week.

## Vercel environment variables

| Concern | Practice |
|---------|----------|
| **Scopes** | `Production`, `Preview`, `Development` intentionally differ (e.g. `noIndex`, staging GA, or separate Neon branch). Don’t assume Preview === Production. |
| **Pull for local** | `vercel env pull .env.local` (or project’s convention). **Review** pulled file; it can overwrite—keep a template in `.env.example` and never commit real secrets. |
| **Load order (local)** | Typical: `.env` base → `.env.local` overrides. **Prisma CLI** scripts should use **one** explicit file set (see [reference.md](reference.md)) so migrate never hits prod by mistake. |
| **Build-time vs runtime** | `prisma generate` / `migrate deploy` in build need `DATABASE_URL` (and friends) **available to the build**. If migrate runs in CI only, document that—Vercel default is build + deploy in one pipeline. |
| **Sensitive** | Mark API keys and DB URLs as **Sensitive** in Vercel so they don’t appear in logs or non-admin UI. |

**After changing env on Vercel:** redeploy (or rely on next deploy) so new values apply; runtime env changes don’t hot-swap already-running instances until redeploy.

## Secret rotation (checklist)

Rotate in **this order** when possible: **new value live in Vercel** → **verify** deploy → **revoke old** at provider.

| Secret | Where it lives | Notes |
|--------|----------------|--------|
| **Neon / Postgres** | `DATABASE_URL`, `POSTGRES_PRISMA_URL`, `directUrl` peer | Use Neon dashboard **reset** or new role; update **all** three if you split pooler/direct. Run `migrate deploy` smoke after URL change. |
| **Resend** (or SMTP) | `RESEND_API_KEY` etc. | Create new key; swap in Vercel; delete old key in Resend. |
| **GA4 Measurement Protocol** | `GA4_MEASUREMENT_ID` + **API secret** (env) | New secret in GA4 Admin → Data streams → MP; update env; old secret stops working when removed. |
| **Admin password** | `ADMIN_PASSWORD` or auth provider | Change env; communicate to anyone with access; old sessions may need re-login depending on implementation. |
| **Preview DB** | Optional second DSN for Preview | If Preview uses a **branch** DB, rotate URLs together with Neon branch creds. |

**Never** store these in CMS JSON or the database.

## Backups and clones

- **Cadence:** At minimum before risky migrations or provider changes; production should match your RPO (e.g. nightly logical dump if the business needs point-in-time recovery, use Neon backups + PITR if on a plan that supports it).
- **Tooling:** `pg_dump` / restore — use **direct** (non-pooler) URL. See [reference.md](reference.md#environment-and-scripts).
- **Storage:** Dumps off-box (encrypted); don’t commit `.sql` or dumps to git.
- **PII:** Lead tables in dumps = same sensitivity as prod; restrict who can run restore locally.

## Release / deploy order (mental model)

1. **Migrations merged** with code that expects the new schema (or feature flags if you must split).
2. **Build** runs `prisma generate`; **deploy step** runs `migrate deploy` against production DSN (your `package.json` / Vercel command should match this).
3. **Smoke:** public page + one admin save + optional form POST in staging/preview first if available.

If `migrate deploy` fails in production, **stop** and fix forward (resolve failed migration, or repair with Prisma docs)—don’t toggle `db push` on prod.

## Quick incident cues

| Symptom | Likely cause |
|---------|----------------|
| `P1001` / connection after deploy | Wrong DSN in that environment, pooler vs direct mix-up, or Neon sleeping (use pooler for app). |
| GA4 MP events missing | API secret rotated in GA4 but not in env, or wrong `measurement_id`. |
| Email stopped | Resend key rotated/revoked; check Resend dashboard + Vercel env. |
| Admin “wrong password” after change | Browser cache rare; usually env not redeployed or wrong scope (Preview vs Production). |

---

**Deeper:** env script matrix and UTM tables — [reference.md](reference.md). **Patterns:** [SKILL.md](SKILL.md).
