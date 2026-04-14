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

export default function IndustriesHero({ hub }: { hub: IndustriesHub }) {
  return (
    <section
      aria-labelledby="industries-heading"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden border-b border-border pt-[var(--nav-height)]"
    >
      <IndustriesOrbitCanvas />

      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.025)_1px,transparent_1px)] bg-size-[80px_80px]"
      />

      {/* Radial accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(201,165,90,0.05)_0%,transparent_65%)]"
      />

      {/* Editorial hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[22%] bottom-[18%] left-6 w-px bg-[linear-gradient(to_bottom,transparent,rgba(201,165,90,0.22)_20%,rgba(201,165,90,0.12)_50%,transparent)] md:left-10 lg:left-16"
      />

      <div className="container relative z-[1]">
        <motion.p
          className="text-overline mb-6"
          initial="hidden"
          animate="visible"
          custom={0.08}
          variants={enterVariant}
        >
          {hub.overline}
        </motion.p>

        <h1 id="industries-heading" className="text-h1 mb-6 max-w-[640px]">
          <motion.span
            className="block overflow-hidden pb-[0.04em]"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={clipVariant}
          >
            {hub.headline}
          </motion.span>
        </h1>

        <motion.p
          className="text-body-lg max-w-[520px] text-text-secondary"
          initial="hidden"
          animate="visible"
          custom={0.42}
          variants={enterVariant}
        >
          {hub.introBody}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.55 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs tracking-[0.15em] text-text-tertiary uppercase">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-border">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
            className="absolute inset-0 bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
