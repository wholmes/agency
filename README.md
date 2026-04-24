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

Edit `.env` (and optionally `.env.local` after `vercel env pull`) and set at minimum:

- `DATABASE_URL` and `POSTGRES_PRISMA_URL` — see [Database URLs](#database-urls-neon--prisma) below.
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

For **production-like databases** (e.g. Neon after deploy), apply pending migrations with **`npm run db:deploy`** — not raw `npx prisma migrate deploy` unless your shell already loads the same env files (see [Database URLs](#database-urls-neon--prisma)).

`npm run build` runs `prisma generate` and then `next build`. `postinstall` runs `prisma generate` so the client exists after `npm install`.

---

## Environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `POSTGRES_PRISMA_URL` | Yes | **Pooled** Postgres URL (e.g. Neon with `-pooler` in the host). Used as Prisma’s primary `url` for app queries. |
| `DATABASE_URL` | Yes | **Direct** Postgres URL (Neon: host **without** `-pooler`). Used as `directUrl` for migrations (`migrate deploy`, `migrate resolve`) and tooling; avoids flaky advisory locks when talking only to the pooler. |
| `ADMIN_PASSWORD` | Yes for admin | Password for `/admin` (minimum 8 characters). |
| `ADMIN_SESSION_SECRET` | No | Secret used to sign the admin session cookie. If omitted, `ADMIN_PASSWORD` is used (fine for local dev; use a separate long secret in production). |
| `RESEND_API_KEY` | For contact email | Send contact form notifications via Resend; see `/admin/email` for "from" and notify addresses stored in the DB. |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_DOMAIN` | Optional | Overrides for delivery / sender domain if not using DB-only email settings. |
| `SCREENSHOTONE_ACCESS_KEY` **or** `SCREENSHOTONE_API_KEY` | For [ScreenshotOne](#screenshotone-admin-screenshot-captures) | Public access key from [ScreenshotOne](https://screenshotone.com); required for server-side “Capture & apply” in the case study admin. |
| `SCREENSHOTONE_SECRET_KEY` **or** `SCREENSHOTONE_SECRET` | Strongly recommended | Used to [sign](https://screenshotone.com/docs/authentication) the `/take` query string (HMAC-SHA256). If unset, requests are sent without a `signature` parameter (only if your ScreenshotOne project allows it). |
| `SCREENSHOTONE_CLI_DELAY_MS` | Optional | Delay before capture for the [`screenshot:one`](#screenshotone-admin-screenshot-captures) CLI only (default **1000** ms). |

### Database URLs (Neon + Prisma)

The schema uses **PostgreSQL** with **two** env vars (`prisma/schema.prisma`):

| Env var | Role |
| ------- | ---- |
| `POSTGRES_PRISMA_URL` | Pooled connection (Neon: turn **connection pooling ON** in the connect dialog — hostname contains `-pooler`). |
| `DATABASE_URL` | Direct connection (Neon: turn **connection pooling OFF** — hostname does **not** contain `-pooler`). |

Prisma Migrate and `migrate resolve` use **`DATABASE_URL`** (`directUrl`). If `DATABASE_URL` accidentally uses the pooler host, you may see **P1002** (advisory lock timeout). Local dev can duplicate the same string into both vars if you use a single non-Neon database; with Neon, use both URLs from the dashboard.

**Pull from Vercel** (recommended once the project is linked):

```bash
vercel env pull .env.local
```

The Prisma CLI only auto-loads **`.env`**, not `.env.local`. This repo’s **`npm run db:*`** scripts load **`.env` then `.env.local`** via `dotenv-cli`, so prefer:

- `npm run db:migrate` — development (`migrate dev`)
- `npm run db:deploy` — apply migrations (`migrate deploy`)
- `npm run db:resolve-applied -- <migration_folder_name>` — mark a migration applied when the DB already matches (drift recovery)

**Local example (single Postgres, no pooler):**

```env
DATABASE_URL="postgresql://USER@localhost:5432/agency_local"
POSTGRES_PRISMA_URL="postgresql://USER@localhost:5432/agency_local"
```

Copy `.env.example` as a starting point. JSON-heavy fields are stored as strings in Postgres the same way as in development.

In production, use a **strong** `ADMIN_PASSWORD` and preferably a distinct **`ADMIN_SESSION_SECRET`**.

---

## Admin UI (`/admin`)

| URL | What it does |
| --- | ------------- |
| `/admin/login` | Sign in with `ADMIN_PASSWORD`. |
| `/admin` | Overview and links to editors. |
| `/admin/settings` | Contact email, availability strip, **nav hide-on-scroll toggle**. |
| `/admin/seo` | Default metadata, indexing, GA4 / GTM / Measurement Protocol (server-side GA). |
| `/admin/email` | Resend delivery + auto-reply copy (API key stays in env). |
| `/admin/footer` | Footer tagline and remote blurb. |
| `/admin/chrome` | **SiteChrome** JSON (nav links, primary CTA, footer columns, utility links, copyright). |
| `/admin/home-hero` | Homepage hero copy and CTAs. |
| `/admin/cta` | Global "Ready to start?" CTA block. |
| `/admin/social` | Social proof (testimonial, stats, clients). |
| `/admin/home-teaser` | Homepage "Difference" / about teaser column. |
| `/admin/work` | `/work` listing hero, home preview strip, case study template labels. |
| `/admin/projects` | Case studies: list, reorder ↑↓, publish/draft, link to edit. |
| `/admin/projects/new` | Create case study (redirects to editor with a success toast). |
| `/admin/projects/[id]` | Edit one case study (including `services` as a JSON string array). Case study images: manual upload or **ScreenshotOne** remote capture into hero, listing cover, card thumbnail, mobile mockup, or **gallery** (append with optional caption). |
| `/admin/services` | Services hub copy, home strip, continuity, Lighthouse, estimator JSON. |
| `/admin/offerings` | Service offerings list; `/admin/offerings/[id]` edits one card. |
| `/admin/service-pages` | Service detail pages list; `/admin/service-pages/[slug]` edits `/services/[slug]`. |
| `/admin/capabilities` | **Capabilities cards**: list, reorder ↑↓, publish/draft, link to edit. |
| `/admin/capabilities/new` | Create a capability card (title, copy, tags, raw SVG icon). |
| `/admin/capabilities/[id]` | Edit one capability card. SVG preview rendered inline above the textarea. |
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
| `AdminSaveForm.tsx` | Client wrapper around `<form action={serverAction}>`. After a successful save it shows **"Saved"** (or a custom `successMessage`). Server Actions that call **`redirect()`** are detected (Next.js redirect digest) so they do **not** trigger an error toast. |
| `AdminUrlToast.tsx` | Mounted inside `<Suspense>` in the protected admin layout. Reads **`?toast=...`** once, shows a mapped message, then **`router.replace`** strips the query. Used when a server action **redirects** after create (e.g. new case study or industry page). |

**Redirect query params (see `AdminUrlToast.tsx` and `MESSAGES`):**

| `?toast=` value | Typical use |
| ----------------- | ----------- |
| `project-created` | After creating a case study. |
| `industry-created` | After creating an industry page. |
| `capability-created` | After creating a capability card. |
| `capability-deleted` | After deleting a capability card (redirects back to the list). |

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
| Case studies | `Project` — includes **`screenshots`** (`String`, default `[]`): JSON array of `{ "url": "…", "caption"?: "…" }` for the case study lightbox gallery. |
| Global settings | `SiteSettings` (`navHideOnScroll` controls header behaviour) |
| Home | `HomeHero`, `ServicesHomeSection`, `WorkPreviewSection`, `AboutHomeTeaser`, `SocialStat`, `SocialClient`, `FeaturedTestimonial` |
| Work listing | `WorkPageHero` |
| Services | `ServiceOffering`, `ServicesPageHero`, `ContinuityBlock`, `LighthouseGuarantee`, `ServicesContinuityIntro`, `ServiceDetailPage`, `ScopeEstimatorConfig` |
| **Capabilities** | **`Capability`** — `title`, `descriptor`, `detail`, `tags` (comma-separated), `iconSvg` (raw SVG string), `sortOrder`, `published` |
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
| `npm run db:migrate` | `prisma migrate dev` (loads `.env` + `.env.local`). |
| `npm run db:deploy` | `prisma migrate deploy` (loads `.env` + `.env.local`). |
| `npm run db:resolve-applied` | `prisma migrate resolve --applied` — pass migration name after `--`. |
| `npm run db:seed` | Run `prisma/seed.ts`. |
| `npm run db:studio` | Prisma Studio (table browser). |
| `npm run screenshot:one` | One-off [ScreenshotOne](#screenshotone-admin-screenshot-captures) capture to disk (loads `.env` + `.env.local`). |

### Editing content

1. **Admin UI** — `/admin` (set `ADMIN_PASSWORD`, restart the dev server after changing env).
2. **Prisma Studio** — `npm run db:studio`.
3. **Re-seed** — `npm run db:seed` resets data according to `seed.ts` (destructive; avoid on production if you need to keep live edits).
4. **Code** — Add getters in `src/lib/cms/queries.ts`, wire components, extend `prisma/seed.ts` for new defaults.

---

## ScreenshotOne (admin screenshot captures)

Remote page screenshots use the **[ScreenshotOne](https://screenshotone.com)** HTTP API (`GET https://api.screenshotone.com/take`). Captures run **only on the server** after an admin session check (`src/lib/admin/screenshotone-capture.ts` → `src/lib/screenshotone.ts`). The admin UI never sends API secrets to the browser.

### Environment

| Variable | Purpose |
| -------- | ------- |
| `SCREENSHOTONE_ACCESS_KEY` or `SCREENSHOTONE_API_KEY` | Access key appended as `access_key` on every `/take` request. |
| `SCREENSHOTONE_SECRET_KEY` or `SCREENSHOTONE_SECRET` | If set, the full query string (excluding `signature`) is signed with **HMAC-SHA256**; the hex digest is sent as `signature` (see ScreenshotOne [authentication](https://screenshotone.com/docs/authentication)). |

### Target URL rules

`assertScreenshotTargetUrl()` in `src/lib/screenshotone.ts` restricts what admins can capture:

- **Allowed:** `https://…` (any host).
- **Allowed:** `http://localhost/…` or `http://127.0.0.1/…` only (for local sites).
- **Rejected:** non-HTTPS URLs elsewhere (reduces accidental SSRF to internal `http` origins).

### API request shape (this repo)

All presets send:

| Parameter | Value |
| --------- | ----- |
| `format` | `jpeg` |
| `image_quality` | `82` |
| `delay` | Seconds derived from the admin “delay” field or CLI env (input is **milliseconds**; converted to seconds and clamped to **0–30**, matching ScreenshotOne’s sync capture limit). |
| `url` | The validated target page URL. |

Full-page presets also send `full_page=true` and `full_page_max_height` as in the table below.

### Presets (viewport and defaults)

Each preset maps to a case study **slot** in `/admin/projects/[id]`. Admins can choose **full page** vs **above the fold** (single viewport) where the UI offers radios; that maps to `ScreenshotOneFetchOptions` in code.

| Preset | Typical use | Viewport | Notes |
| ------ | ----------- | -------- | ----- |
| `hero` | Case study hero image | 1600×900 | Default **full page** (`full_page_max_height` **10000**). Optional above-the-fold. |
| `cover` | `/work` listing card art | 1440×810 | Default **full page** (max height **10000**). Optional above-the-fold. |
| `thumbnail` | Homepage / small card thumb | 1280×720 | Default **above the fold**. Optional **full page** (max height **10000**). |
| `mobile` | Phone mockup | 390×844, `viewport_mobile=true`, `device_scale_factor=2` | Default **full page** (max height **6000**). Optional above-the-fold. |
| `gallery` | Extra images in case study lightbox | 1440×900 | Default **above the fold**. Optional **full page** (max height **10000**). Appended to `Project.screenshots` JSON after client-side resize. |

### After capture (admin UI)

The API returns image bytes; the admin client resizes each result to the slot’s max dimensions (or gallery encode limits) via canvas, then stores **data URLs** or URLs in the form state. **Save the project** to persist. Gallery rows support an optional **caption** per image.

### CLI: one-off capture to a file

```bash
npm run screenshot:one -- <page-url> <hero|cover|thumbnail|mobile|gallery> <output.jpg> [viewport|full]
```

Loads **`.env`** then **`.env.local`** (same pattern as `db:*` scripts). Optional 4th argument:

| Argument | Presets | Meaning |
| -------- | ------- | ------- |
| `viewport` | `hero`, `cover`, `mobile` only | One viewport (“above the fold”) instead of the default full-page scroll for those three. |
| `full` | `thumbnail`, `gallery` only | Full-page scroll instead of the default single viewport for those two. |

Optional env: **`SCREENSHOTONE_CLI_DELAY_MS`** (default `1000`) — pre-capture wait in milliseconds.

### Errors

Failed HTTP responses are parsed when the body is JSON; the admin UI surfaces `error_message` / `error_code` from the API when present (see ScreenshotOne [errors](https://screenshotone.com/docs/errors)). Network failures and missing access keys produce clear server-side messages.

### Code map

| File | Role |
| ---- | ---- |
| `src/lib/screenshotone.ts` | Preset query parameters, signing, `fetchScreenshotOneDataUrl`, URL validation. |
| `src/lib/admin/screenshotone-capture.ts` | Server action `captureScreenshotWithScreenshotOne` (admin-gated). |
| `src/components/admin/CaseStudyImageUpload.tsx` | ScreenshotOne panel: URL, delay, destination, full-page radios, gallery caption, capture button. |
| `scripts/screenshot-one.mts` | CLI wrapper around `fetchScreenshotOneDataUrl`. |

---

## Key components

### `CapabilitiesScroll` (`src/components/sections/CapabilitiesScroll.tsx`)

Horizontally scrolling capabilities section on the Services page. Cards are fetched from the `Capability` DB model and passed as a prop from the server page (`src/app/services/page.tsx`).

**Scroll-jacking:** The outer `<section>` has a calculated `height` (`100vh + scrollDist`) that pins the inner sticky container while Framer Motion maps vertical scroll progress to a `translateX` on the card track.

**Visual effects (all driven by Framer Motion):**

| Effect | How |
| ------ | --- |
| Velocity skew | `useVelocity(x)` → `skewX` on the track — cards lean in the direction of travel. |
| Active spotlight | Nearest card to centre gets full opacity, accent border, and a radial glow; neighbours dim. `activeIndex` is tracked via `useMotionValueEvent` on `springProgress`. |
| Glint | Diagonal specular sweep plays once on card activation — key-based remount, no JS state. |
| Parallax depth | Icon / title / tags translate at different rates as the card crosses the viewport. |
| Odometer flip | `01 / 07` counter flips with `rotateX` when a card becomes active — key-based remount. |
| Monocle | Hovering the fine-print text hides the cursor and renders a circular magnifying lens via `createPortal` to `document.body`. True optical positioning: the word under the cursor stays centred in the lens. |

**Icon format:** Raw SVG stored in `Capability.iconSvg`. Use `currentColor` for stroke/fill so the icon inherits the card's accent colour. Recommended: 24×24 viewBox, 1.5px stroke, rounded caps/joins.

**Reduced motion:** Falls back to a static CSS grid — no sticky tricks, no JS effects.

### Navigation hide-on-scroll (`src/components/Navigation.tsx`)

Controlled by `SiteSettings.navHideOnScroll` (toggle at `/admin/settings`). When enabled:

- Nav stays visible until scroll position exceeds **80 px**.
- Hides (`translateY(-100%)`) when scrolling **down ≥ 8 px**.
- Reveals when scrolling **up ≥ 8 px** or when the mobile menu is open.
- Transform transitions at **340 ms** with `cubic-bezier(0.16, 1, 0.3, 1)` (spring curve) — set via inline `style` to avoid Tailwind CSS-variable conflicts.

---

## Troubleshooting

### Prisma client errors after schema changes (e.g. `prisma.capability` is undefined)

This is the most common dev-time issue. Turbopack caches the compiled Prisma client and **does not pick up a newly generated client without clearing `.next`**.

```bash
npx prisma generate
rm -rf .next
npm run dev
```

The `prisma migrate dev` command runs `prisma generate` automatically, but Turbopack still needs a clean build cache. **Always clear `.next` after adding a new model or field.**

### Admin login does nothing / "not configured"

- Ensure `ADMIN_PASSWORD` is at least **8 characters** in `.env`.
- Restart the dev server after changing `.env`.

### Schema changes

```bash
npm run db:migrate        # applies migration + regenerates client
rm -rf .next              # clear Turbopack cache
npm run db:seed           # only if you want to refresh seed data (destructive)
```

### Migrations on Neon (`relation already exists`, P3018 / P3009 / P1002)

- **`42P07` / “relation … already exists”** — The table is already in the database (e.g. after `db push` or manual SQL), but `_prisma_migrations` does not list that migration. If the live schema matches the migration SQL, record it without re-running SQL:

  ```bash
  npm run db:resolve-applied -- <migration_folder_name>
  npm run db:deploy
  ```

- **P3009** (“failed migrations”) — Same idea after you confirm the DB matches: `npm run db:resolve-applied -- <name>`, then `npm run db:deploy`.

- **P1002** (advisory lock timeout) — Usually **`DATABASE_URL` points at the pooler**. Set **`DATABASE_URL`** to Neon’s **direct** connection string (no `-pooler` in the host); keep **`POSTGRES_PRISMA_URL`** pooled. Retry when no other client holds a migration lock.

---

## Project layout

```
prisma/                 Schema, migrations, seed
scripts/                `screenshot-one.mts` — ScreenshotOne CLI (see README section)
src/app/admin/          Admin UI (login + CMS pages)
src/app/                App Router routes, layouts, sitemap, robots
src/components/         UI (sections, ScopeEstimator, ContactForm, …)
src/components/admin/   Admin toast provider, AdminSaveForm, URL toast helper
src/components/icons/   Centralised SVG icon library (currentColor, 24×24 viewBox)
src/lib/admin/          Session helpers, mutations-data, require-admin, screenshotone-capture
src/lib/cms/            Queries and shared CMS types
src/lib/screenshotone.ts   ScreenshotOne `/take` client (presets, signing, fetch)
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

1. Set **`POSTGRES_PRISMA_URL`** (pooled) and **`DATABASE_URL`** (direct) on the host (e.g. Vercel), plus **`ADMIN_PASSWORD`** / **`ADMIN_SESSION_SECRET`** for the admin UI. For case study **ScreenshotOne** capture, set **`SCREENSHOTONE_ACCESS_KEY`** (or `SCREENSHOTONE_API_KEY`) and **`SCREENSHOTONE_SECRET_KEY`** (or `SCREENSHOTONE_SECRET`) — see [ScreenshotOne](#screenshotone-admin-screenshot-captures).
2. Run migrations in CI or the release step: **`npx prisma migrate deploy`** with env vars injected (Vercel build usually has them), or locally **`npm run db:deploy`** which loads `.env` / `.env.local`. Do **not** use `migrate dev` against production.
3. Run **`npm run build`** then **`npm run start`**, or use your host's Next.js preset.

Prisma `generate` is part of `npm run build`. Use HTTPS in production so admin cookies stay secure (`secure` flag is enabled when `NODE_ENV === "production"`).

---

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Prisma documentation](https://www.prisma.io/docs)
- [Prisma + Next.js bundling](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-webpack-prisma)

Workspace notes for this repo's Next.js version: `AGENTS.md` / `CLAUDE.md`.
