"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import type { IndustriesHub } from "@prisma/client";

const IndustriesOrbitCanvas = dynamic(
  () => import("@/components/IndustriesOrbitCanvas"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #161310 0%, #0c0c0b 70%)",
        }}
      />
    ),
  },
);

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const enterVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.9, ease: EASE_OUT },
  }),
};

const clipVariant: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    transition: { delay, duration: 1.1, ease: EASE_OUT },
  }),
};

export default function IndustriesHero({ hub, industries }: { hub: IndustriesHub; industries: { listTitle: string; slug: string }[] }) {
  return (
    <section
      aria-labelledby="industries-heading"
      className="relative flex min-h-[75dvh] flex-col justify-center overflow-hidden border-b border-white/[0.06] bg-[#0e0e0e] pt-[var(--nav-height)] md:min-h-[90dvh] md:justify-center"
    >
      {/* Orbit canvas — shifted right so the ring centre sits in the right half of the hero,
          then masked so it fades before reaching the copy on the left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 [transform:translateX(35%)_translateY(-25%)] md:[transform:none]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 90% at 40% 50%, black 0%, black 30%, rgba(0,0,0,0.4) 60%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 40% 50%, black 0%, black 30%, rgba(0,0,0,0.4) 60%, transparent 80%)",
          }}
        >
          <IndustriesOrbitCanvas />
        </div>
      </div>

      <div className="relative z-[1] w-full px-8 pt-[20vh] md:px-16 md:pt-0">
        <motion.p
          className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50"
          initial="hidden"
          animate="visible"
          custom={0.08}
          variants={enterVariant}
        >
          {hub.overline}
        </motion.p>

        <h1 id="industries-heading" className="mb-6">
          <motion.span
            className="block overflow-hidden pb-[0.04em] font-display text-[clamp(2.5rem,5.5vw,6rem)] font-light leading-[0.93] tracking-[-0.03em] text-white"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={clipVariant}
          >
            Your industry.<br />
            <em className="not-italic" style={{ color: "#c9a55a" }}>Our obsession.</em>
          </motion.span>
        </h1>

        <motion.p
          className="mb-10 max-w-[480px] text-[15px] leading-relaxed text-white/60"
          initial="hidden"
          animate="visible"
          custom={0.42}
          variants={enterVariant}
        >
          {hub.introBody}
        </motion.p>

        {/* Industry pills */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: EASE_OUT }}
        >
          {industries.map((item, i) => (
            <motion.a
              key={item.slug}
              href={`/industries/${item.slug}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.07, duration: 0.5, ease: EASE_OUT }}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-1.5 font-mono text-[11px] tracking-[0.12em] text-white/40 no-underline"
              style={{ background: "rgba(255,255,255,0.03)", transition: `color 0.3s, border-color 0.3s, background 0.3s` }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(201,165,90,0.9)";
                el.style.borderColor = "rgba(201,165,90,0.3)";
                el.style.background = "rgba(201,165,90,0.06)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255,255,255,0.4)";
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: "rgba(201,165,90,0.5)" }}
              />
              {item.listTitle}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
