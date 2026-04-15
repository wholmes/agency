"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { IconArrowUpRight } from "@/components/icons";

const RunwayCanvas = dynamic(() => import("@/components/RunwayCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 50% 30%, #161310 0%, #0c0c0b 70%)",
      }}
    />
  ),
});

interface Props {
  heroOverline: string;
  heroTitle: string;
  heroBody: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function IndustryDetailHero({
  heroOverline,
  heroTitle,
  heroBody,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <section
      aria-labelledby="industry-heading"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden border-b border-border pt-[var(--nav-height)]"
    >
      <RunwayCanvas />

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
