"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { IconArrowUpRight } from "@/components/icons";

const RunwayCanvas = dynamic(() => import("@/components/RunwayCanvas"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 30%, #161310 0%, #0c0c0b 70%)" }} />
  ),
});

const DnaHelixCanvas = dynamic(() => import("@/components/DnaHelixCanvas"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 62% 40%, #0d1a18 0%, #0c0c0b 70%)" }} />
  ),
});

const LegalCanvas = dynamic(() => import("@/components/LegalCanvas"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 50% 40% at 65% 40%, #1a1508 0%, #0c0c0b 70%)" }} />
  ),
});

const RealEstateCanvas = dynamic(() => import("@/components/RealEstateCanvas"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 60% 60%, #1a1208 0%, #0c0c0b 70%)" }} />
  ),
});

const RestaurantCanvas = dynamic(() => import("@/components/RestaurantCanvas"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse 50% 40% at 65% 60%, #1a0a00 0%, #0c0c0b 70%)" }} />
  ),
});

const CANVAS_MAP: Record<string, React.ComponentType> = {
  "life-sciences": DnaHelixCanvas,
  "law-firms": LegalCanvas,
  "real-estate": RealEstateCanvas,
  "restaurants": RestaurantCanvas,
};

interface Props {
  slug: string;
  heroOverline: string;
  heroTitle: string;
  heroBody: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function IndustryDetailHero({
  slug,
  heroOverline,
  heroTitle,
  heroBody,
  ctaLabel,
  ctaHref,
}: Props) {
  const HeroCanvas = CANVAS_MAP[slug] ?? RunwayCanvas;

  return (
    <section
      aria-labelledby="industry-heading"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden border-b border-border pt-[var(--nav-height)]"
    >
      <HeroCanvas />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="container relative z-[1]">
        <Link
          href="/industries"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-tertiary no-underline transition-colors hover:text-accent"
        >
          ← Industries
        </Link>

        <p className="text-overline mb-5">{heroOverline}</p>

        <h1 id="industry-heading" className="text-h1 mb-6 max-w-[640px]">
          {heroTitle}
        </h1>

        <p className="text-body-lg mb-10 max-w-[560px] text-text-secondary">
          {heroBody}
        </p>

        <Link href={ctaHref} className="btn btn-primary">
          {ctaLabel}
          <IconArrowUpRight size={16} />
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs tracking-[0.15em] text-text-tertiary uppercase">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-border">
          <div
            className="absolute inset-0 bg-accent"
            style={{ animation: "scrollLine 1.4s linear infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
