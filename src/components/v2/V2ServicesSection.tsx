"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import KanbanPanel from "./panels/KanbanPanel";
import BlueprintPanel from "./panels/BlueprintPanel";
import ArcadePanel from "./panels/ArcadePanel";
import BrandStrategyPanel from "./panels/BrandStrategyPanel";
import IntentlyPanel from "./panels/IntentlyPanel";
import type { ServiceOffering as ServiceOfferingModel } from "@prisma/client";
import type { ServicesHomeSection } from "@prisma/client";
import { parseOutcomeList } from "@/lib/service-icons";
import { appendUtmToUrl, utmFromFooterLinkDb } from "@/lib/utm";
import { ProcessRow } from "@/components/v2/V2ProcessSection";
import DesignTokenPanel from "@/components/v2/panels/DesignTokenPanel";
import TerminalPanel from "@/components/v2/panels/TerminalPanel";
import MessagingPanel from "@/components/v2/panels/MessagingPanel";
import AnalyticsPanel from "@/components/v2/panels/AnalyticsPanel";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Each panel maps to a service by index
const PANELS = [KanbanPanel, BlueprintPanel, BrandStrategyPanel, IntentlyPanel];

// Section label numbers — Linear style "2.0 Plan →"
const SECTION_NUMS = ["1.0", "2.0", "3.0", "4.0"];

// Short one-word display titles — override CMS title in the headline
const SHORT_TITLES = ["Design.", "Develop.", "Strategy.", "Growth."];


const STATS = [
  { value: "500+",  label: "Projects delivered" },
  { value: "98",    label: "Avg Lighthouse score" },
  { value: "14d",   label: "Avg delivery cycle" },
  { value: "94%",   label: "On-time rate" },
  { value: "4.9★",  label: "Client satisfaction" },
];

function StatStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="border-y border-white/[0.07]"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)" }}
    >
      <div className="mx-auto max-w-[1280px] px-8 md:px-16">
        {/* Overline */}
        <div className="border-b border-white/[0.05] py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">By the numbers</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="border-r border-white/[0.05] px-6 py-10 last:border-r-0"
            >
              <div
                className="mb-1.5 font-display font-light leading-none tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(2.4rem,4vw,4rem)" }}
              >
                {value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ServiceRow({
  service,
  index,
  Panel,
  Panel2,
  overlayRight = "-2%",
}: {
  service: ServiceOfferingModel;
  index: number;
  Panel: React.ComponentType;
  Panel2?: React.ComponentType;
  overlayRight?: string;
}) {
  const outcomes = parseOutcomeList(service.outcomesHome);
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const panel2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  return (
    <div ref={rowRef} className="relative overflow-hidden">

      {/* A — Ghost number watermark behind headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-8 select-none font-mono text-[clamp(6rem,18vw,16rem)] font-bold leading-none text-white md:left-16"
        style={{ opacity: 0.025, letterSpacing: "-0.05em" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* ── Copy block ── */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-8 py-16 md:grid-cols-2 md:items-center md:px-16">
        {/* Left: number label + headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {index === 0 && (
            <div className="mb-8 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                What we do
              </p>
              <Link
                href="/services"
                className="font-mono text-[10px] text-white/45 no-underline transition-colors hover:text-white/50"
              >
                All Services →
              </Link>
            </div>
          )}
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {SECTION_NUMS[index]}
          </p>
          <h2 className="font-display text-[clamp(3rem,5.5vw,5rem)] font-light leading-[0.97] tracking-[-0.03em] text-white">
            {SHORT_TITLES[index] ?? service.title}
          </h2>
        </motion.div>

        {/* Right: description + pill tags + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <p className="mb-8 max-w-[440px] text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-white/70">
            {service.descriptionHome}
          </p>

          {/* D — Staggered pill tags */}
          <ul className="mb-10 flex flex-wrap gap-2">
            {outcomes.map((o, oi) => (
              <motion.li
                key={o}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + oi * 0.07, ease: EASE }}
                className="rounded-full border border-white/[0.14] bg-white/[0.05] px-3.5 py-1.5 text-[12px] text-white/65"
              >
                {o}
              </motion.li>
            ))}
          </ul>

          {/* C — Proper pill CTA */}
          <Link
            href={service.href}
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] px-5 py-2.5 font-mono text-[11px] font-medium text-white/60 no-underline transition-all duration-300 hover:border-[#c9a55a]/40 hover:bg-[#c9a55a]/08 hover:text-[#c9a55a]"
          >
            Explore {service.title}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* ── Full-width panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="relative mx-8 overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.07] shadow-[0_-16px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] md:mx-16"
      >
        {/* Top specular line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(201,165,90,0.15) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)",
          }}
        />
        <div className={Panel2 ? "h-[440px] md:h-[520px]" : "h-[380px] md:h-[460px]"}>
          <Panel />
        </div>

        {/* Floating second panel — only when Panel2 provided */}
        {Panel2 && (
          <motion.div
            className="pointer-events-none absolute top-[160px] hidden w-[44%] overflow-hidden rounded-xl border border-white/[0.1] md:block"
            style={{ right: overlayRight, y: panel2Y, boxShadow: "0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(201,165,90,0.12) 60%, transparent 100%)" }}
            />
            <div className="h-[320px] md:h-[380px]">
              <Panel2 />
            </div>
          </motion.div>
        )}

        {/* Bottom dissolve — page bg fades the panel away */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to top, #080808 0%, transparent 100%)" }}
        />
      </motion.div>
    </div>
  );
}

export default function V2ServicesSection({
  offerings,
  homeSection,
}: {
  offerings: ServiceOfferingModel[];
  homeSection: ServicesHomeSection;
}) {
  const footerLinkHref = appendUtmToUrl(
    homeSection.footerLinkHref,
    utmFromFooterLinkDb(homeSection)
  );

  return (
    <section
      aria-label="Services"
      className="relative z-10 -mt-16 bg-[#080808]"
    >
      {/* Each service row is preceded by its process breakdown */}
      {offerings.map((service, i) => {
        const Panel = PANELS[i % PANELS.length];
        return (
          <div key={service.slug}>
            {/* Midpoint stat strip — between Dev and Strategy */}
            {i === 2 && <StatStrip />}
            <ProcessRow index={i} />
            <ServiceRow
              service={service}
              index={i}
              Panel={Panel}
              Panel2={i === 0 ? DesignTokenPanel : i === 1 ? TerminalPanel : i === 2 ? MessagingPanel : i === 3 ? AnalyticsPanel : undefined}
              overlayRight={i === 2 ? "48%" : "3%"}
            />
          </div>
        );
      })}

      {/* Footer */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1280px] px-8 py-16 md:px-16">
          <p className="max-w-[600px] text-sm leading-relaxed text-white/45">
            {homeSection.footerBeforeHighlight}
            <span className="text-white/60">{homeSection.footerHighlight}</span>
            {homeSection.footerAfterHighlightBeforeLink}
            <Link
              href={footerLinkHref}
              className="text-[#c9a55a] no-underline transition-opacity hover:opacity-70"
            >
              {homeSection.footerLinkLabel}
            </Link>
            {homeSection.footerAfterLink}
          </p>
        </div>
      </div>
    </section>
  );
}
