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
| `RESEND_API_KEY` | For contact email | Send contact form notifications via Resend; see `/admin/email` for “from” and notify addresses stored in the DB. |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_DOMAIN` | Optional | Overrides for delivery / sender domain if not using DB-only email settings. |

### Database URL

The schema uses **PostgreSQL** (`provider = "postgresql"` in `prisma/schema.prisma`).

**Local example:**

```env
DATABASE_URL="postgresql://USER@localhost:5432/agency_local"
```

**Production (Neon, Supabase, Railway, Vercel Postgres, etc.):**

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Use the connection string from your provider. For production deploys, run `npx prisma migrate deploy` (not `migrate dev`). JSON-heavy fields are stored as strings in Postgres the same way as in development.

In production, use a **strong** `ADMIN_PASSWORD` and preferably a distinct **`ADMIN_SESSION_SECRET`**.

---

## Admin UI (`/admin`)

| URL | What it does |
| --- | ------------- |
| `/admin/login` | Sign in with `ADMIN_PASSWORD`. |
| `/admin` | Overview and links to editors. |
| `/admin/settings` | Contact email, availability strip (nav). |
| `/admin/seo` | Default metadata, indexing, GA4 / GTM / Measurement Protocol (server-side GA). |
| `/admin/email` | Resend delivery + auto-reply copy (API key stays in env). |
| `/admin/footer` | Footer tagline and remote blurb. |
| `/admin/chrome` | **SiteChrome** JSON (nav links, primary CTA, footer columns, utility links, copyright). |
| `/admin/home-hero` | Homepage hero copy and CTAs. |
| `/admin/cta` | Global “Ready to start?” CTA block. |
| `/admin/social` | Social proof (testimonial, stats, clients). |
| `/admin/home-teaser` | Homepage “Difference” / about teaser column. |
| `/admin/work` | `/work` listing hero, home preview strip, case study template labels. |
| `/admin/projects` | Case studies: list, reorder, publish/draft, link to edit. |
| `/admin/projects/new` | Create case study (redirects to editor with a success toast). |
| `/admin/projects/[id]` | Edit one case study (including `services` as a JSON string array). |
| `/admin/services` | Services hub copy, home strip, continuity, Lighthouse, estimator JSON. |
| `/admin/offerings` | Service offerings list; `/admin/offerings/[id]` edits one card. |
| `/admin/service-pages` | Service detail pages list; `/admin/service-pages/[slug]` edits `/services/[slug]`. |
| `/admin/industries` | Industries hub + list; `/admin/industries/new` creates a page; `/admin/industries/[slug]` edits `/industries/[slug]`. |
| `/admin/about` | About page hero, story, values. |
| `/admin/contact` | Contact page copy + contact form JSON config. |

**Behavior:**

- **Session:** HTTP-only cookie, HMAC-signed, 7-day lifetime (`src/lib/admin/session.ts`).
- **Authorization:** Protected routes use `requireAdminSession()`; server actions live in `src/app/admin/(protected)/mutations.ts` and `src/lib/admin/mutations-data.ts`.
- **SEO:** `robots.txt` disallows `/admin`; admin routes use `noindex` metadata.
- **Weak password:** If `ADMIN_PASSWORD` is still the default placeholder, a warning banner appears in the admin shell.

**Adding more editors:** Follow existing pages under `src/app/admin/(protected)/`, add server actions in `mutations.ts` or `mutations-data.ts`, and wire `revalidatePath` for affected public routes.

### Admin toasts (save feedback)

Success and error feedback for CMS saves is implemented in **`src/components/admin/`**:

| Piece | Role |
| ----- | ---- |
| `AdminToast.tsx` | `AdminToastProvider` wraps the protected admin layout; `useAdminToast()` exposes `success`, `error`, `info`, and `dismiss`. Toasts stack bottom-right, auto-dismiss after a few seconds, and respect the existing dark surface styling. |
| `AdminSaveForm.tsx` | Client wrapper around `<form action={serverAction}>`. After a successful save it shows **“Saved”** (or a custom `successMessage`). Server Actions that call **`redirect()`** are detected (Next.js redirect digest) so they do **not** trigger an error toast. |
| `AdminUrlToast.tsx` | Mounted inside `<Suspense>` in the protected admin layout. Reads **`?toast=...`** once, shows a mapped message, then **`router.replace`** strips the query. Used when a server action **redirects** after create (e.g. new case study or industry page). |

**Redirect query params (see `AdminUrlToast.tsx` and `MESSAGES`):**

| `?toast=` value | Typical use |
| ----------------- | ----------- |
| `project-created` | After creating a case study; redirect URL includes this param. |
| `industry-created` | After creating an industry page. |

**Client-only forms** (`useActionState`, JSON editors) call `useAdminToast()` in a `useEffect` when a save completes without validation errors (e.g. **Chrome** and **Contact form JSON** editors).

**Not covered:** Login and sign-out forms intentionally do not use this toast stack.

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
| Industries | `IndustriesHub`, `IndustryPage` |
| SEO / analytics defaults | `SeoSettings` |
| Email (CMS copy, not API key) | `EmailSettings` |

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
src/components/admin/   Admin toast provider, AdminSaveForm, URL toast helper
src/lib/admin/          Session helpers, mutations-data, require-admin
src/lib/cms/            Queries and shared CMS types
```

Default site metadata and analytics IDs can be edited in **`SeoSettings`** via `/admin/seo`; **`src/app/layout.tsx`** uses `generateMetadata` and injects JSON-LD and analytics scripts from that data where applicable.

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
