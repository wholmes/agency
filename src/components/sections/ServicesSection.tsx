"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight } from "../icons";
import { parseOutcomeList } from "@/lib/service-icons";
import type { ServiceOffering as ServiceOfferingModel } from "@prisma/client";
import type { ServicesHomeSection } from "@prisma/client";
import { appendUtmToUrl, utmFromFooterLinkDb } from "@/lib/utm";
import BrandLogoMark from "@/components/BrandLogoMark";

// ---------------------------------------------------------------------------
// Fabricated UI panels — one per service slug
// ---------------------------------------------------------------------------

function WebDesignPanel() {
  return (
    <div className="h-full w-full rounded-t-lg bg-[#0f0f0e] p-5 font-mono">
      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-auto flex h-5 w-40 items-center gap-1.5 rounded bg-white/[0.05] px-2.5">
          <span className="size-1 rounded-full bg-white/20" />
          <div className="h-1 w-20 rounded-full bg-white/10" />
        </div>
      </div>
      {/* Page layout skeleton */}
      <div className="flex gap-3">
        {/* Sidebar */}
        <div className="flex w-28 shrink-0 flex-col gap-2">
          {["Layouts","Components","Typography","Colors","Spacing"].map((item, i) => (
            <div key={item} className={`flex items-center gap-2 rounded px-2 py-1.5 text-[9px] ${i === 1 ? "bg-[#c9a55a]/15 text-[#c9a55a]" : "text-white/30"}`}>
              <span className={`size-1 rounded-full ${i === 1 ? "bg-[#c9a55a]" : "bg-white/10"}`} />
              {item}
            </div>
          ))}
        </div>
        {/* Canvas */}
        <div className="flex-1 space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-white/[0.07]" />
          <div className="h-2 w-full rounded-full bg-white/[0.04]" />
          <div className="h-2 w-5/6 rounded-full bg-white/[0.04]" />
          <div className="mt-3 h-16 w-full rounded-md bg-[#c9a55a]/10 ring-1 ring-[#c9a55a]/20" />
          <div className="flex gap-2 pt-1">
            <div className="h-7 flex-1 rounded bg-[#c9a55a]/20 text-center text-[8px] leading-7 text-[#c9a55a]">Primary</div>
            <div className="h-7 flex-1 rounded bg-white/[0.05] text-center text-[8px] leading-7 text-white/30">Secondary</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebDevPanel() {
  const lines = [
    { indent: 0, content: "export async function", accent: true },
    { indent: 1, content: "getServerSideProps(ctx) {", accent: false },
    { indent: 2, content: "const session = await", accent: true },
    { indent: 3, content: "getSession(ctx.req);", accent: false },
    { indent: 2, content: "const data = await db", accent: true },
    { indent: 3, content: ".query.projects", accent: false },
    { indent: 3, content: ".findMany({...});", accent: false },
    { indent: 2, content: "return { props: { data } };", accent: false },
    { indent: 1, content: "}", accent: false },
  ];
  return (
    <div className="h-full w-full rounded-t-lg bg-[#0d0d0c] p-5">
      {/* Tab bar */}
      <div className="mb-4 flex items-center gap-0 border-b border-white/[0.06] pb-0">
        {["page.tsx","queries.ts","schema.prisma"].map((tab, i) => (
          <div key={tab} className={`border-b px-3 py-2 text-[9px] font-mono ${i === 0 ? "border-[#c9a55a] text-[#c9a55a]" : "border-transparent text-white/25"}`}>
            {tab}
          </div>
        ))}
      </div>
      {/* Code */}
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-4 shrink-0 text-right text-[9px] text-white/15">{i + 1}</span>
            <span className={`text-[9px] leading-relaxed ${line.accent ? "text-[#c9a55a]/80" : "text-white/35"}`} style={{ paddingLeft: `${line.indent * 10}px` }}>
              {line.content}
            </span>
          </div>
        ))}
      </div>
      {/* Status bar */}
      <div className="mt-4 flex items-center gap-3 border-t border-white/[0.05] pt-3">
        <span className="size-1.5 rounded-full bg-[#4daf7c]" />
        <span className="text-[8px] text-white/25">TypeScript · Next.js 15 · No errors</span>
      </div>
    </div>
  );
}

function BrandPanel() {
  const palette = ["#c9a55a","#1a1714","#f0ede8","#8a7a60","#3d3328"];
  return (
    <div className="h-full w-full rounded-t-lg bg-[#0f0f0e] p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-white/30">brand-system-v3.fig</span>
        <span className="rounded bg-[#c9a55a]/15 px-2 py-0.5 text-[8px] text-[#c9a55a]">Approved</span>
      </div>
      {/* Logo area */}
      <div className="mb-5 flex h-16 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <BrandLogoMark variant="footerDark" />
          <div className="h-3 w-20 rounded-full bg-white/10" />
        </div>
      </div>
      {/* Color palette */}
      <div className="mb-4">
        <p className="mb-2 text-[8px] text-white/20">Color System</p>
        <div className="flex gap-1.5">
          {palette.map((c) => (
            <div key={c} className="flex-1">
              <div className="mb-1 h-7 rounded" style={{ background: c }} />
              <div className="h-1.5 w-full rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </div>
      {/* Type scale */}
      <div className="space-y-1.5">
        {[["Display","48/52"],["Heading","32/36"],["Body","16/24"]].map(([name, size]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-[8px] text-white/25">{name}</span>
            <span className="font-mono text-[8px] text-[#c9a55a]/60">{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const bars = [42, 68, 55, 80, 64, 90, 73, 85, 60, 95, 78, 88];
  return (
    <div className="h-full w-full rounded-t-lg bg-[#0d0d0c] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[8px] text-white/25">Conversion Rate</p>
          <p className="font-mono text-lg font-semibold text-[#c9a55a]">4.8%</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#4daf7c]/10 px-2 py-1 text-[8px] text-[#4daf7c]">
          ↑ 31% vs last period
        </span>
      </div>
      {/* Bar chart */}
      <div className="mb-4 flex h-16 items-end gap-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: i === bars.length - 1
                ? "rgba(201,165,90,0.9)"
                : i > bars.length - 4
                ? "rgba(201,165,90,0.4)"
                : "rgba(255,255,255,0.07)",
            }}
          />
        ))}
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-3">
        {[["Sessions","12.4k"],["Bounce","38%"],["LTV","$284"]].map(([label, val]) => (
          <div key={label}>
            <p className="text-[7px] text-white/20">{label}</p>
            <p className="font-mono text-[10px] text-white/60">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<string, React.ComponentType> = {
  "web-design": WebDesignPanel,
  "web-development": WebDevPanel,
  "brand-strategy": BrandPanel,
  "analytics-growth": AnalyticsPanel,
};

function getPanel(slug: string, index: number): React.ComponentType {
  if (PANELS[slug]) return PANELS[slug];
  const keys = Object.keys(PANELS);
  return PANELS[keys[index % keys.length]];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ServicesSection({
  offerings,
  homeSection,
}: {
  offerings: ServiceOfferingModel[];
  homeSection: ServicesHomeSection;
}) {
  const footerLinkHref = appendUtmToUrl(homeSection.footerLinkHref, utmFromFooterLinkDb(homeSection));

  return (
    <section aria-labelledby="services-heading" className="overflow-hidden">

      {/* Section header */}
      <div className="container pt-[var(--section-padding-y)]">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <ScrollReveal>
              <p className="text-overline mb-4">{homeSection.overline}</p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 id="services-heading" className="text-h2">
                {homeSection.headingLine1}
                <br />
                <em className="italic-display text-accent">{homeSection.headingEmphasis}</em>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <Link href="/services" className="btn btn-ghost text-text-secondary">
              All Services
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </div>

      {/* Service rows */}
      {offerings.map((service, i) => {
        const Panel = getPanel(service.slug, i);
        const outcomes = parseOutcomeList(service.outcomesHome);
        const isEven = i % 2 === 0;

        return (
          <div key={service.slug} className="border-t border-border">
            <div className={`container grid grid-cols-1 items-center gap-0 lg:grid-cols-2`}>

              {/* Copy — alternates left/right */}
              <div className={`py-16 lg:py-20 ${isEven ? "lg:order-1" : "lg:order-2"} lg:pr-16`}>
                <ScrollReveal>
                  <div className="mb-6 flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary">
                      {service.number ?? String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="font-body mb-4 text-2xl font-semibold tracking-tight text-text-primary">
                    {service.title}
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-text-secondary max-w-[440px]">
                    {service.descriptionHome}
                  </p>
                  <ul className="mb-8 flex flex-col gap-2.5">
                    {outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-3 text-xs text-text-tertiary">
                        <span className="size-1 shrink-0 rounded-full bg-accent/50" aria-hidden="true" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent no-underline transition-opacity hover:opacity-70"
                  >
                    Learn more <IconArrowUpRight size={14} />
                  </Link>
                </ScrollReveal>
              </div>

              {/* UI Panel — bleeds off the edge */}
              <div className={`hidden lg:block ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative h-[380px] overflow-hidden rounded-t-xl border border-b-0 border-white/[0.06] bg-[#0f0f0e] shadow-[0_-8px_60px_rgba(0,0,0,0.6)] ${
                    isEven
                      ? "ml-8 rounded-tl-xl"
                      : "mr-8 rounded-tr-xl"
                  }`}
                >
                  {/* Subtle grid inside panel */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  {/* Accent glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: "radial-gradient(ellipse, rgba(201,165,90,0.12) 0%, transparent 70%)" }}
                  />
                  <div className="relative z-10 h-full p-1">
                    <Panel />
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="border-t border-border">
        <div className="container pb-[var(--section-padding-y)]">
          <ScrollReveal className="mt-12 max-w-[720px]">
            <p className="text-sm leading-relaxed text-text-secondary">
              {homeSection.footerBeforeHighlight}
              <span className="text-text-primary">{homeSection.footerHighlight}</span>
              {homeSection.footerAfterHighlightBeforeLink}
              <Link href={footerLinkHref} className="text-accent no-underline transition-opacity hover:opacity-80">
                {homeSection.footerLinkLabel}
              </Link>
              {homeSection.footerAfterLink}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
