This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Custom cursor

The site uses a custom cursor (`src/components/CustomCursor.tsx`), rendered from `src/app/layout.tsx`. It only activates on devices that report **fine pointer + hover** (`(hover: none)` bails out early, so touch users keep the normal cursor).

### Dwell ring (hover “preloader”)

While the pointer stays over an interactive target, a ring tracks **how long** you hover: a stroke fills **clockwise from the top** around a subtle track circle. Fill duration is controlled by **`HOVER_FILL_MS`** (default **1700** ms). The **visible** progress uses **ease-out cubic** easing so the stroke moves faster at first and eases into the finish; elapsed time is still capped at `HOVER_FILL_MS`.

Interactive targets are resolved to a **root** (`<a>`, `<button>`, or an element with `data-cursor="hover"`). Moving inside the same root does **not** reset the timer; switching to another control starts a new dwell.

Optional **`data-cursor-label`** (on the element or an ancestor) enlarges the ring and shows a small uppercase label.

### Completion animation (cosmetic only)

When the dwell completes, the ring content **shrinks** (scale toward zero with **ease-in cubic**) and **fades out** over **`EXIT_SHRINK_MS`** (default **400** ms). This is **purely ornamental**—it does **not** fire analytics, prefetch routes, or perform any other side effects.

After that animation, the ring stays **invisible** until the pointer **leaves** that interactive root (e.g. moves to the page background or to a different control). Hovering the same control again after leaving will run the full dwell + exit sequence again.

### Accessibility

If **`prefers-reduced-motion: reduce`** is set, the stroke does not animate in over time; after the same dwell window elapses, the ring **hides** without the animated shrink sequence.

### Tuning

| Constant            | Role                                      |
| ------------------- | ----------------------------------------- |
| `HOVER_FILL_MS`     | Wall-clock time for a full ring fill      |
| `EXIT_SHRINK_MS`    | Shrink + fade duration after fill completes |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
