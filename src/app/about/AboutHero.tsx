"use client";

import { motion, type Variants } from "framer-motion";
import AboutInkCanvas from "@/components/AboutInkCanvas";
import type { AboutPageHero } from "@prisma/client";

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const clipVariant: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    transition: { delay, duration: 1.1, ease: EASE_OUT },
  }),
};

const enterVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.9, ease: EASE_OUT },
  }),
};

export default function AboutHero({ content }: { content: AboutPageHero }) {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden border-b border-border pt-[var(--nav-height)]">
      <AboutInkCanvas />
      {/* Editorial hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[22%] bottom-[18%] left-6 w-px bg-[linear-gradient(to_bottom,transparent,rgba(201,165,90,0.22)_20%,rgba(201,165,90,0.12)_50%,transparent)] md:left-10 lg:left-16"
      />

      <div className="container relative z-[1]">
        <motion.p
          className="text-overline mb-5"
          initial="hidden"
          animate="visible"
          custom={0.05}
          variants={enterVariant}
        >
          {content.overline}
        </motion.p>

        <h1 className="text-h1 mb-6 max-w-[700px]">
          <motion.span
            className="block overflow-hidden pb-[0.04em]"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={clipVariant}
          >
            {content.line1}
          </motion.span>
          <motion.span
            className="block overflow-hidden pb-[0.04em]"
            initial="hidden"
            animate="visible"
            custom={0.14}
            variants={clipVariant}
          >
            {content.line2}
          </motion.span>
          <motion.span
            className="block overflow-hidden pb-[0.04em]"
            initial="hidden"
            animate="visible"
            custom={0.28}
            variants={clipVariant}
          >
            {content.line3BeforeEm}
            <em className="italic-display text-accent">{content.line3Em}</em>
          </motion.span>
        </h1>

        <motion.p
          className="text-body-lg max-w-[520px]"
          initial="hidden"
          animate="visible"
          custom={0.56}
          variants={enterVariant}
        >
          {content.body}
        </motion.p>
      </div>
    </section>
  );
}
