"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import StudioDashboardPanel from "./panels/StudioDashboardPanel";
import BlueprintPanel from "./panels/BlueprintPanel";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function V2Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const panel2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-42%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="relative overflow-hidden bg-[#0e0e0e] pt-[var(--nav-height)]"
    >
      {/* Gold bloom — top center, very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/3"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(201,165,90,0.09) 0%, transparent 60%)",
        }}
      />
      {/* Dot-grid — hero only, barely visible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 100%)",
        }}
      />

      {/* ── Top copy zone ── */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-8 pb-6 pt-16 md:px-16">

        {/* Overline */}
        <motion.div
          className="mb-10 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-flex size-6 items-center justify-center rounded-full border border-[#c9a55a]/40 font-mono text-[11px] font-semibold text-[#c9a55a]">B</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">BrandMeetsCode · Digital Studio</span>
        </motion.div>

        {/* Big headline */}
        <div className="mb-8 overflow-hidden">
          <motion.h1
            className="font-display text-[clamp(3rem,7.5vw,7.5rem)] font-light leading-[0.93] tracking-[-0.03em] text-white"
            initial={{ opacity: 0, y: "0.3em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <span className="block">The studio that makes</span>
            <span className="block">
              <span style={{ color: "#c9a55a" }}>brand meet </span>
              <em className="font-display italic" style={{ color: "rgba(255,255,255,0.9)" }}>code.</em>
            </span>
          </motion.h1>
        </div>

        {/* 2-col: body left, links right */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            <p className="max-w-[480px] text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-white/55">
              We build premium websites, analytics systems, and interactive experiences
              for ambitious B2B companies and SaaS founders. Brand strategy meets
              technical execution.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 md:items-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#c9a55a] px-7 py-3.5 font-body text-sm font-semibold text-[#080808] no-underline transition-all duration-300 hover:bg-[#d4b46a] hover:shadow-[0_0_24px_rgba(201,165,90,0.3)]"
            >
              Start a project
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-[11px] text-white/35 no-underline transition-colors hover:text-white/70"
            >
              View our work →
            </Link>
          </motion.div>
        </div>

        {/* Ticker row */}
        <motion.div
          className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex flex-wrap gap-6">
            {[
              { dot: "#c9a55a", text: "Lighthouse ≥ 90 guaranteed" },
              { dot: "#4ade80", text: "GDPR-compliant by default" },
              { dot: "#60a5fa", text: "14-day delivery cycles" },
            ].map(({ dot, text }) => (
              <span key={text} className="flex items-center gap-2 font-mono text-[10px] text-white/45">
                <span className="size-1.5 rounded-full" style={{ background: dot, opacity: 0.7 }} />
                {text}
              </span>
            ))}
          </div>
          <span className="hidden font-mono text-[10px] text-white/40 md:block">
            500+ businesses served →
          </span>
        </motion.div>
      </div>

      {/* ── Full-bleed product panel — bleeds off bottom ── */}
      <motion.div
        style={{ y: panelY }}
        className="relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      >
        {/* Horizontal rule with glow above panel */}
        <div className="relative mx-8 mb-0 md:mx-16">
          <div className="h-px bg-white/[0.06]" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.2) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Panel stack — main panel + overlapping second panel */}
        <div className="relative mx-8 md:mx-16">

          {/* Main panel — KanbanPanel */}
          <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] shadow-[0_-20px_80px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="h-[520px] md:h-[600px]">
              <StudioDashboardPanel />
            </div>

            {/* Page-bg gradient dissolves the panel into the next section */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
              style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
            />
          </div>

          {/* Floating second panel — parallaxes faster than main panel */}
          <motion.div
            className="pointer-events-none absolute right-[3%] top-[180px] hidden w-[42%] overflow-hidden rounded-xl border border-white/[0.1] md:block"
            style={{
              y: panel2Y,
              boxShadow: "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.0, ease: EASE }}
          >
            {/* Specular top edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(201,165,90,0.12) 60%, transparent 100%)",
              }}
            />
            <div className="h-[280px] md:h-[320px]">
              <BlueprintPanel />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
