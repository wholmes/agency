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
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-[var(--nav-height)]"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <HeroCanvas />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-[1] mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
        <Link
          href="/industries"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35 no-underline transition-colors hover:text-[#c9a55a]"
        >
          ← Industries
        </Link>

        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-[#c9a55a]/80">
          {heroOverline}
        </p>

        <h1
          id="industry-heading"
          className="mb-6 max-w-[680px] font-display text-[clamp(2.4rem,5vw,4rem)] font-light leading-[1.08] tracking-[-0.03em] text-white"
        >
          {heroTitle}
        </h1>

        <p className="mb-10 max-w-[520px] font-body text-[17px] leading-relaxed text-white/50">
          {heroBody}
        </p>

        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#c9a55a] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#0e0e0e] transition-all duration-300 hover:bg-[#d4b46a] hover:shadow-[0_8px_32px_rgba(201,165,90,0.25)]"
        >
          {ctaLabel}
          <IconArrowUpRight size={13} />
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="absolute inset-0"
            style={{ background: "#c9a55a", animation: "scrollLine 1.4s linear infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
