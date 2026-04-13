# BrandMeetsCode — Agency site

Premium marketing site for **BrandMeetsCode**, built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, and **Prisma 5**. Page copy, case studies, services, navigation, forms, and most UI strings live in a **Prisma-backed database**. A password-protected **admin UI** at **`/admin`** edits frequently changed content and case studies; **Prisma Studio** and SQL remain available for everything else.

---

## Requirements

- **Node.js** 20+
- **npm** (or compatible client)

---

## Quick start (local)

```bash
git clone <repo-url>
cd agency
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:

- `DATABASE_URL` — see [Database URL](#database-url) below.
- `ADMIN_PASSWORD` — at least **8 characters** (required to sign in at `/admin`).

Create the database, apply migrations, seed content, and run the dev server:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

- **Site:** [http://localhost:3000](http://localhost:3000)  
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

After changing the Prisma schema or pulling new migrations:

```bash
npm run db:migrate
npx prisma generate   # also runs via postinstall / build
```

`npm run build` runs `prisma generate` and then `next build`. `postinstall` runs `prisma generate` so the client exists after `npm install`.

---

## Environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `DATABASE_URL` | Yes | Prisma connection string. |
| `ADMIN_PASSWORD` | Yes for admin | Password for `/admin` (minimum 8 characters). |
| `ADMIN_SESSION_SECRET` | No | Secret used to sign the admin session cookie. If omitted, `ADMIN_PASSWORD` is used (fine for local dev; use a separate long secret in production). |

### Database URL

**Local (SQLite — default in this repo):**

```env
DATABASE_URL="file:./prisma/data.db"
```

The path is relative to the **project root**. The database file lives under `prisma/data.db` and is gitignored once created.

**Production (PostgreSQL example):**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Use the connection string from your provider (Neon, Supabase, Railway, etc.). Update `datasource db { provider = "postgresql" }` in `prisma/schema.prisma`, then run `npx prisma migrate deploy` against production. Array-like fields are stored as JSON strings in SQLite; the same pattern works on Postgres.

In production, use a **strong** `ADMIN_PASSWORD` and preferably a distinct **`ADMIN_SESSION_SECRET`**.

---

## Admin UI (`/admin`)

| URL | What it does |
| --- | ------------- |
| `/admin/login` | Sign in with `ADMIN_PASSWORD`. |
| `/admin` | Overview and links to editors. |
| `/admin/settings` | Contact email, availability strip (nav). |
| `/admin/footer` | Footer tagline and remote blurb. |
| `/admin/chrome` | **SiteChrome** JSON (nav links, primary CTA, footer columns, utility links, copyright). |
| `/admin/home-hero` | Homepage hero copy and CTAs. |
| `/admin/cta` | Global “Ready to start?” CTA block. |
| `/admin/projects` | List case studies. |
| `/admin/projects/[id]` | Edit one case study (including `services` as a JSON string array). |

**Behavior:**

- **Session:** HTTP-only cookie, HMAC-signed, 7-day lifetime (`src/lib/admin/session.ts`).
- **Authorization:** Server Actions in `src/app/admin/(protected)/mutations.ts` call `isAdminSession()` and redirect to `/admin/login` if missing.
- **SEO:** `robots.txt` disallows `/admin`; admin routes use `noindex` metadata.

**Adding more editors:** Follow existing pages under `src/app/admin/(protected)/` and add actions in `mutations.ts`.

---

## Database and CMS

| Piece | Location |
| ----- | -------- |
| Schema | `prisma/schema.prisma` |
| Migrations | `prisma/migrations/` |
| Seed (default content) | `prisma/seed.ts` |
| Read API (cached where noted) | `src/lib/cms/queries.ts` |
| Prisma client | `src/lib/prisma.ts` |

### Models (overview)

| Area | Models |
| ---- | ------ |
| Case studies | `Project` |
| Global settings | `SiteSettings` |
| Home | `HomeHero`, `ServicesHomeSection`, `WorkPreviewSection`, `AboutHomeTeaser`, `SocialStat`, `SocialClient`, `FeaturedTestimonial` |
| Work listing | `WorkPageHero` |
| Services | `ServiceOffering`, `ServicesPageHero`, `ContinuityBlock`, `LighthouseGuarantee`, `ServicesContinuityIntro`, `ServiceDetailPage`, `ScopeEstimatorConfig` |
| About | `AboutPageHero`, `AboutStoryParagraph`, `AboutStorySection`, `AboutTeaserBelief`, `AboutTeaserCard`, `AboutValue`, `AboutValuesSectionHeader` |
| Shared CTAs | `CtaSectionCopy` |
| Footer | `FooterCopy` |
| Contact | `ContactPageCopy`, `ContactFormConfig` |
| Case study template | `CaseStudyUiLabels` |
| Nav / footer chrome | `SiteChrome` |

Service detail URLs are **`/services/[slug]`** (e.g. `web-design`, `brand-strategy`, `analytics-integration`), backed by `ServiceDetailPage.slug`.

### npm scripts

| Script | Command |
| ------ | ------- |
| `npm run dev` | Development server (Turbopack). |
| `npm run build` | `prisma generate` + production build. |
| `npm run start` | Production server (after `build`). |
| `npm run lint` | ESLint. |
| `npm run db:migrate` | `prisma migrate dev` (development migrations). |
| `npm run db:seed` | Run `prisma/seed.ts`. |
| `npm run db:studio` | Prisma Studio (table browser). |

### Editing content

1. **Admin UI** — `/admin` (set `ADMIN_PASSWORD`, restart the dev server after changing env).
2. **Prisma Studio** — `npm run db:studio`.
3. **Re-seed** — `npm run db:seed` resets data according to `seed.ts` (destructive; avoid on production if you need to keep live edits).
4. **Code** — Add getters in `src/lib/cms/queries.ts`, wire components, extend `prisma/seed.ts` for new defaults.

---

## Troubleshooting

### Prisma client errors (e.g. `prisma.siteChrome` is undefined)

Next.js **Turbopack** must **not** bundle Prisma. This repo sets `serverExternalPackages: ["@prisma/client", "prisma"]` in `next.config.ts`. If you see missing model delegates after an upgrade:

```bash
npx prisma generate
rm -rf .next
npm run dev
```

### Admin login does nothing / “not configured”

- Ensure `ADMIN_PASSWORD` is at least **8 characters** in `.env`.
- Restart the dev server after changing `.env`.

### Schema changes

```bash
npm run db:migrate
npm run db:seed   # only if you want to refresh seed data (destructive)
```

---

## Project layout

```
prisma/                 Schema, migrations, seed
src/app/admin/          Admin UI (login + CMS pages)
src/app/                App Router routes, layouts, sitemap, robots
src/components/         UI (sections, ScopeEstimator, ContactForm, …)
src/lib/admin/          Session helpers (signed cookie)
src/lib/cms/            Queries and shared CMS types
```

Global SEO metadata and JSON-LD in `src/app/layout.tsx` are defined in code, not in the database.

---

## Custom cursor

The site uses `src/components/CustomCursor.tsx` from `src/app/layout.tsx`. It only activates when the device reports **fine pointer + hover**; touch users keep the default cursor.

### Dwell ring

While the pointer stays on an interactive target, a ring tracks hover duration; fill duration is **`HOVER_FILL_MS`** (default **1700** ms), with **ease-out cubic** easing.

Targets resolve to a **root** (`<a>`, `<button>`, or `data-cursor="hover"`). Moving inside the same root does not reset the timer. Optional **`data-cursor-label`** enlarges the ring and shows a small label.

### Completion animation

On completion, the ring **shrinks** and **fades** over **`EXIT_SHRINK_MS`** (default **400** ms). Cosmetic only (no analytics or prefetch).

### Accessibility

If **`prefers-reduced-motion: reduce`**, the stroke does not animate in; after the dwell window, the ring hides without the shrink animation.

| Constant | Role |
| -------- | ---- |
| `HOVER_FILL_MS` | Time for a full ring fill |
| `EXIT_SHRINK_MS` | Shrink + fade after fill |

---

## Deploying

1. Set **`DATABASE_URL`** (and **`ADMIN_PASSWORD`** / **`ADMIN_SESSION_SECRET`** for the admin UI).
2. Run **`npx prisma migrate deploy`** in CI or your release step (not `migrate dev`).
3. Run **`npm run build`** then **`npm run start`**, or use your host’s Next.js preset.

Prisma `generate` is part of `npm run build`. Use HTTPS in production so admin cookies stay secure (`secure` flag is enabled when `NODE_ENV === "production"`).

---

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Prisma documentation](https://www.prisma.io/docs)
- [Prisma + Next.js bundling](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-webpack-prisma)

Workspace notes for this repo’s Next.js version: `AGENTS.md` / `CLAUDE.md`.
