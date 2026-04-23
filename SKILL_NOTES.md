# Premium Dark UI — Skill Notes

This document summarizes what was built, what was learned, and what got captured in the `premium-dark-ui` Cursor skill during this project.

---

## What the skill is

`premium-dark-ui` is a personal Cursor agent skill that encodes everything learned building this site into reusable guidance. When you start a new premium dark site — or add a new section to this one — the agent reads the skill and already knows how this design system works. You don't re-explain it. You just build.

The skill lives at `~/.cursor/skills/premium-dark-ui/` and is available across every project you open in Cursor. It has three files:

- **`SKILL.md`** — the operative playbook. 20 systems, all documented.
- **`reference.md`** — copy-paste code for every pattern.
- **`cms-and-architecture.md`** — schema, routes, data flow, canvas internals, env vars, new build checklist.

---

## What the skill covers

### The visual system

The skill documents exactly how to make a dark UI feel rich rather than flat. That means layering noise grain (SVG feTurbulence fixed overlay), dot grids with elliptical mask fades, and gold radial blooms on every section — never just a solid background color. It documents the three-color palette (`#0e0e0e`, `#080808`, `#c9a55a`), the border trick (white/7% opacity + specular inset shadow for a glowing top edge), and the bottom dissolve gradient that melts panels into the page.

### Typography

Three font families, used for exactly one purpose each. `font-display` for marketing headlines — light weight, tight negative tracking, clamp sizing. `font-mono` for every overline, tag, stat, and label — uppercase, wide tracking, low opacity. `font-body` for everything else. The skill also documents the emphasis tricks: one gold `<span>` around a keyword in the headline, one italic word for contrast, and the Yellowtail script character (`/`) used as a wordmark divider.

### Isometric SVG icons

The full math for true isometric projection — `iso()` and `pt()` helper functions, the `IsoBox` component that builds three-faced cubes (right, left, top), draw order, fill opacities, and the `goldTop` highlight flag. The skill covers both the process-section style (higher contrast, editorial) and the ghost watermark style (very faint, accent-colored focal element, fades further on card hover).

### Framer Motion

The universal easing constant `[0.16, 1, 0.3, 1]` and why it matters. The `viewport: { once: true, amount: 0 }` rule — `amount: 0` is non-negotiable, it prevents the flicker bug where items re-animate when scrolled past quickly. Stagger patterns, the clip-path reveal for headlines, and the two-panel parallax depth trick where a main panel moves at one speed and a floating secondary panel moves faster, creating a convincing Z-axis without 3D transforms.

### Scroll hijack

The state machine (`idle → active → released`) that intercepts wheel scroll to pan a tall full-page screenshot inside a fixed 16:9 viewport, then hands control back to the page after an overscroll buffer. The `useLayoutEffect` reset (not `useEffect`) for base64 images that render synchronously. The `flex flex-col justify-start` fix that prevents tall images from centering in their viewport.

### Panels and cards

How to build the main product panel (rounded top only, no bottom border, strong upward shadow, specular top highlight, dissolve gradient). How to build the floating secondary panel (absolute positioned, pointer-events-none, parallax faster than the main). Glass cards, gold left-bar hover states, and the browser chrome mock component.

### Navigation dropdown

Spring animation, 60ms open / 250ms close delay, scroll-closes-dropdown behavior. The layered background (near-black + noise + dot grid + backdrop blur). Gold vertical hover bars on link cards. The `DROPDOWN_HREFS` set that gates which nav items get mega-menus. All dropdown content (services list, project grid, industry cards) comes from Prisma via the root layout — never fetched inside the Navigation component itself.

### Section anatomy

The repeating formula used on every section of the site: overline + horizontal rule row, display headline, constrained body text, CTA. Documented as a template so every new section feels like it belongs.

### Capabilities strip and LED dots

Eight synth colors cycling per capability with unique duration and delay values so the dots desync and pulse like a mixing board. The CSS `@keyframes ledPulse` injected once. The dynamic grid column logic that uses `grid-cols-5` when there are exactly five items to prevent orphaning the last card.

### Footer CTA

The `HeroFieldCanvas` masked behind a gradient so it fades into the copy. The CTA grid layout. Stack logo treatment (`brightness-0 invert` + low opacity hover). Nav link hover transitions with the same easing curve used everywhere else.

### Service and work drilldown pages

Two-column hero with the right panel bleeding to the viewport edge (`marginRight: calc(-50vw + 50%)`). Per-slug process sections with isometric icons. Full-width breakout compositions with a main panel and floating secondary. FAQ accordion with `motion.details` and a `+` that rotates to `×` on open.

### OG image system

The reusable `OgCard` component (edge runtime, 1200×630) that matches the on-site aesthetic — dark background, gold radial bloom, 80px line grid, gold rule, serif headline. Per-route overrides for blog posts and work pages. All social share previews look like the site.

### CMS and architecture

Complete documentation of the Prisma schema (32+ models), which model feeds which UI surface, every CMS query function and what it returns, the `(legacy)` route group pattern, the root layout `Promise.all` that fetches all nav data once, the `HeroFieldCanvas` scroll sync math and visibility fix, the product panels (all pure React + Framer Motion, no Three.js), and a 10-step checklist for starting a fresh build from this system.

---

## How to use the skill

The skill is already active. Because it lives in `~/.cursor/skills/`, Cursor picks it up automatically in every project you open — you don't install or configure anything.

**The agent triggers it automatically** when your prompt matches the description. Phrases that activate it include anything about dark UI, premium site, isometric icons, panel design, parallax, scroll hijack, glass card, ghost SVG, LED dot, capabilities strip, or OG image. If you're building something that fits this system, just describe what you want and the agent reads the skill first.

**To invoke it explicitly**, just mention it directly:

> "Using the premium-dark-ui skill, add a new process section with isometric icons."

or

> "Follow the dark UI skill — build a service detail page for this new offering."

**To read it yourself**, the three files are at:
```
~/.cursor/skills/premium-dark-ui/SKILL.md
~/.cursor/skills/premium-dark-ui/reference.md
~/.cursor/skills/premium-dark-ui/cms-and-architecture.md
```

Open any of them in Cursor whenever you want to look something up — the reference file especially is designed to be scanned, not read top to bottom.

**To update it** when you learn something new, just ask:

> "Add what we just built to the premium-dark-ui skill."

The skill is a living document. The more you add to it, the less you ever have to re-explain your design system to the agent.

---

## Why it exists

Every pattern in this skill was discovered by solving a real problem on this build — the parallax flicker, the scroll hijack, the screenshot starting mid-page, the orphaned capabilities card, the ghost SVGs, the gold hex drift. The skill means the next build starts with all of that already solved.

It's not a design system doc. It's not a component library. It's the judgment layer — the decisions that make the difference between a dark site that looks expensive and one that just looks dark.
