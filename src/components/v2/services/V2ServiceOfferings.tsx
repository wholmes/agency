"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ServiceIconGlyph, parseOutcomeList } from "@/lib/service-icons";
import type { ServiceOffering } from "@prisma/client";

const PanelSkeleton = () => <div className="h-full w-full min-h-[320px] bg-[#131313] rounded-xl" />;

const DesignTokenPanel   = dynamic(() => import("@/components/v2/panels/DesignTokenPanel"),   { ssr: false, loading: () => <PanelSkeleton /> });
const BlueprintPanel     = dynamic(() => import("@/components/v2/panels/BlueprintPanel"),     { ssr: false, loading: () => <PanelSkeleton /> });
const TerminalPanel      = dynamic(() => import("@/components/v2/panels/TerminalPanel"),      { ssr: false, loading: () => <PanelSkeleton /> });
const ArcadePanel        = dynamic(() => import("@/components/v2/panels/ArcadePanel"),        { ssr: false, loading: () => <PanelSkeleton /> });
const BrandStrategyPanel = dynamic(() => import("@/components/v2/panels/BrandStrategyPanel"), { ssr: false, loading: () => <PanelSkeleton /> });
const MessagingPanel     = dynamic(() => import("@/components/v2/panels/MessagingPanel"),     { ssr: false, loading: () => <PanelSkeleton /> });
const AnalyticsPanel     = dynamic(() => import("@/components/v2/panels/AnalyticsPanel"),     { ssr: false, loading: () => <PanelSkeleton /> });
const IntentlyPanel      = dynamic(() => import("@/components/v2/panels/IntentlyPanel"),      { ssr: false, loading: () => <PanelSkeleton /> });

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const NUMS = ["01", "02", "03", "04"];
const DISPLAY_TITLES = ["Design.", "Develop.", "Strategy.", "Analytics."];

// Row background accents — different per service
const ROW_ACCENTS = [
  "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,165,90,0.04) 0%, transparent 70%)",
  "radial-gradient(ellipse 55% 70% at 15% 50%, rgba(96,165,250,0.03) 0%, transparent 70%)",
  "radial-gradient(ellipse 60% 80% at 75% 40%, rgba(201,165,90,0.04) 0%, transparent 70%)",
  "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(74,222,128,0.025) 0%, transparent 70%)",
];

function OutcomePills({ outcomes }: { outcomes: string[] }) {
  if (!outcomes.length) return null;
  return (
    <ul className="flex flex-col gap-2.5">
      {outcomes.map((o, i) => (
        <li key={o} className="flex items-baseline gap-3">
          <span
            className="shrink-0 font-mono text-[9px] text-white/40"
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] leading-snug text-white/50">{o}</span>
        </li>
      ))}
    </ul>
  );
}

function ServiceCta({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 no-underline transition-all duration-300 hover:border-[#c9a55a]/40 hover:bg-[#c9a55a]/[0.06] hover:text-[#c9a55a]"
    >
      Explore service
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 9.5l7-7M9.5 2.5H3M9.5 2.5v6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function PanelShell({
  children,
  className = "",
  height = "h-[380px] md:h-[460px]",
}: {
  children: React.ReactNode;
  className?: string;
  height?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] ${height} ${className}`}
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Specular top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(201,165,90,0.1) 60%, transparent 100%)",
        }}
      />
      {children}
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24"
        style={{ background: "linear-gradient(to top, rgba(10,10,12,0.92) 0%, transparent 100%)" }}
      />
    </div>
  );
}

// ─── Row 1: Web Design ───────────────────────────────────────────────────────
// Copy left · DesignTokenPanel right (main) · BlueprintPanel floating overlay
function DesignRow({ offering }: { offering: ServiceOffering }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY   = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);
  const floatY  = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const copyY   = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);
  const outcomes = parseOutcomeList(offering.outcomesListing);

  return (
    <div ref={ref} className="relative border-b border-white/[0.06]">
      {/* Row bg accent — clipped separately so panels can overflow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: ROW_ACCENTS[0] }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.15) 50%, transparent 100%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto max-w-[1280px] grid grid-cols-1 items-center gap-12 px-8 py-24 md:grid-cols-[1fr_1.15fr] md:px-16 md:py-28"
      >
        {/* Copy */}
        <motion.div style={{ y: copyY }} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/35">{NUMS[0]}</span>
            <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/35">
              <ServiceIconGlyph iconKey={offering.iconKey} size={15} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{offering.subtitle}</span>
          </div>

          <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.9] tracking-[-0.035em] text-white">
            {DISPLAY_TITLES[0]}
          </h2>

          <p className="max-w-[400px] text-[15px] leading-relaxed text-white/40">
            {offering.descriptionListing}
          </p>

          <OutcomePills outcomes={outcomes} />
          <ServiceCta href={offering.href} />
        </motion.div>

        {/* Panels — layered */}
        <div className="relative h-[460px] md:h-[520px]">
          <motion.div style={{ y: mainY }} className="relative z-10">
            <PanelShell height="h-[380px] md:h-[460px]">
              <DesignTokenPanel />
            </PanelShell>
          </motion.div>
          {/* Floating overlay — BlueprintPanel, bottom-left */}
          <motion.div
            style={{ y: floatY }}
            className="absolute bottom-[-20px] left-[-5%] z-20 hidden w-[62%] md:block"
          >
            <PanelShell height="h-[180px]" className="border-white/[0.1]">
              <BlueprintPanel />
            </PanelShell>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Row 2: Web Development ──────────────────────────────────────────────────
// TerminalPanel left (main) · ArcadePanel floating top-right · copy right
function DevelopRow({ offering }: { offering: ServiceOffering }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY  = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);
  const floatY = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const copyY  = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);
  const outcomes = parseOutcomeList(offering.outcomesListing);

  return (
    <div ref={ref} className="relative border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: ROW_ACCENTS[1] }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.12) 50%, transparent 100%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto max-w-[1280px] grid grid-cols-1 items-center gap-12 px-8 py-24 md:grid-cols-[1.15fr_1fr] md:px-16 md:py-28"
      >
        {/* Panels — layered */}
        <div className="relative h-[460px] md:h-[520px]">
          <motion.div style={{ y: mainY }} className="relative z-10">
            <PanelShell height="h-[380px] md:h-[460px]">
              <TerminalPanel />
            </PanelShell>
          </motion.div>
          {/* Floating overlay — ArcadePanel, top-right */}
          <motion.div
            style={{ y: floatY }}
            className="absolute right-[-6%] top-[-20px] z-20 hidden w-[62%] md:block"
          >
            <PanelShell height="h-[190px]" className="border-white/[0.1]">
              <ArcadePanel />
            </PanelShell>
          </motion.div>
        </div>

        {/* Copy */}
        <motion.div style={{ y: copyY }} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/35">{NUMS[1]}</span>
            <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/35">
              <ServiceIconGlyph iconKey={offering.iconKey} size={15} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{offering.subtitle}</span>
          </div>

          <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.9] tracking-[-0.035em] text-white">
            {DISPLAY_TITLES[1]}
          </h2>

          <p className="max-w-[400px] text-[15px] leading-relaxed text-white/40">
            {offering.descriptionListing}
          </p>

          <OutcomePills outcomes={outcomes} />
          <ServiceCta href={offering.href} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Row 3: Brand Strategy ───────────────────────────────────────────────────
// Copy left · BrandStrategyPanel right (main) · MessagingPanel floating
function StrategyRow({ offering }: { offering: ServiceOffering }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY  = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);
  const floatY = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const copyY  = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);
  const outcomes = parseOutcomeList(offering.outcomesListing);

  return (
    <div ref={ref} className="relative border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: ROW_ACCENTS[2] }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.15) 50%, transparent 100%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto max-w-[1280px] grid grid-cols-1 items-center gap-12 px-8 py-24 md:grid-cols-[1fr_1.15fr] md:px-16 md:py-28"
      >
        {/* Copy */}
        <motion.div style={{ y: copyY }} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/35">{NUMS[2]}</span>
            <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/35">
              <ServiceIconGlyph iconKey={offering.iconKey} size={15} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{offering.subtitle}</span>
          </div>

          <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.9] tracking-[-0.035em] text-white">
            {DISPLAY_TITLES[2]}
          </h2>

          <p className="max-w-[400px] text-[15px] leading-relaxed text-white/40">
            {offering.descriptionListing}
          </p>

          <OutcomePills outcomes={outcomes} />
          <ServiceCta href={offering.href} />
        </motion.div>

        {/* Panels — layered */}
        <div className="relative h-[460px] md:h-[520px]">
          <motion.div style={{ y: mainY }} className="relative z-10">
            <PanelShell height="h-[380px] md:h-[460px]">
              <BrandStrategyPanel />
            </PanelShell>
          </motion.div>
          {/* MessagingPanel floating top-right */}
          <motion.div
            style={{ y: floatY }}
            className="absolute right-[-6%] top-[-20px] z-20 hidden w-[62%] md:block"
          >
            <PanelShell height="h-[190px]" className="border-white/[0.1]">
              <MessagingPanel />
            </PanelShell>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Row 4: Analytics & Growth ───────────────────────────────────────────────
// AnalyticsPanel full-width top · IntentlyPanel floating · copy below
function GrowthRow({ offering }: { offering: ServiceOffering }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY  = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);
  const floatY = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  const outcomes = parseOutcomeList(offering.outcomesListing);

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: ROW_ACCENTS[3] }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.1) 50%, transparent 100%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.06 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto max-w-[1280px] px-8 py-24 md:px-16 md:py-28"
      >
        {/* Wide panel area */}
        <div className="relative mb-16">
          <motion.div style={{ y: mainY }} className="relative z-10">
            <PanelShell height="h-[340px] md:h-[420px]">
              <AnalyticsPanel />
            </PanelShell>
          </motion.div>
          {/* IntentlyPanel floating bottom-right */}
          <motion.div
            style={{ y: floatY }}
            className="absolute bottom-[-28px] right-[-3%] z-20 hidden w-[52%] md:block"
          >
            <PanelShell height="h-[200px]" className="border-white/[0.1]">
              <IntentlyPanel />
            </PanelShell>
          </motion.div>
        </div>

        {/* Copy + outcomes 2-col */}
        <div className="grid grid-cols-1 gap-10 border-t border-white/[0.06] pt-16 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-white/35">{NUMS[3]}</span>
              <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/35">
                <ServiceIconGlyph iconKey={offering.iconKey} size={15} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{offering.subtitle}</span>
            </div>
            <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.9] tracking-[-0.035em] text-white">
              {DISPLAY_TITLES[3]}
            </h2>
            <p className="max-w-[400px] text-[15px] leading-relaxed text-white/40">
              {offering.descriptionListing}
            </p>
          </div>
          <div className="flex flex-col gap-6 md:pt-2">
            <OutcomePills outcomes={outcomes} />
            <ServiceCta href={offering.href} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const ROW_COMPONENTS = [DesignRow, DevelopRow, StrategyRow, GrowthRow];

export default function V2ServiceOfferings({ offerings }: { offerings: ServiceOffering[] }) {
  return (
    <section aria-label="Service offerings" className="bg-[#0e0e0e]">
      {/* Section header */}
      <motion.div
        className="mx-auto flex max-w-[1280px] items-center gap-4 border-b border-white/[0.06] px-8 py-8 md:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">What we do</span>
        <div className="h-px flex-1 bg-white/[0.04]" />
        <span className="font-mono text-[10px] text-white/35">4 services</span>
      </motion.div>

      {offerings.slice(0, 4).map((offering, i) => {
        const RowComponent = ROW_COMPONENTS[i] ?? DesignRow;
        return <RowComponent key={offering.slug} offering={offering} />;
      })}
    </section>
  );
}
