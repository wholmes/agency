"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { ServicesPageHero } from "@prisma/client";

const HeroFieldCanvas = dynamic(() => import("@/components/HeroFieldCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 70% 55% at 65% 40%, #1a1714 0%, #0e0e0e 65%)" }}
    />
  ),
});

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function V2ServicesHero({ content }: { content: ServicesPageHero }) {
  return (
    <section
      aria-labelledby="v2-services-heading"
      className="relative flex min-h-[90dvh] flex-col justify-center overflow-hidden bg-[#0e0e0e] pt-[var(--nav-height)]"
    >
      {/* Isometric field — right-biased, fades left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to left, black 0%, black 30%, rgba(0,0,0,0.5) 55%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to left, black 0%, black 30%, rgba(0,0,0,0.5) 55%, transparent 75%)",
        }}
      >
        <HeroFieldCanvas variant="services" />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 50% at 30% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 30% 50%, black 0%, transparent 100%)",
        }}
      />

      {/* Copy */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-8 md:px-16">
        <div className="max-w-[55%]">
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-flex size-6 items-center justify-center rounded-full border border-[#c9a55a]/40 font-mono text-[11px] font-semibold text-[#c9a55a]">B</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30">BrandMeetsCode · Services</span>
        </motion.div>

        <motion.h1
          id="v2-services-heading"
          className="mb-6 font-display text-[clamp(3rem,7vw,7rem)] font-light leading-[0.93] tracking-[-0.03em] text-white"
          initial={{ opacity: 0, y: "0.3em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="max-w-[480px] text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-white/50"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
        >
          {content.body}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="relative h-8 w-px overflow-hidden bg-white/10">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
              className="absolute inset-0 bg-[#c9a55a]"
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Scroll</span>
        </motion.div>
        </div>
      </div>

      {/* Bottom fade into page bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
      />
    </section>
  );
}
