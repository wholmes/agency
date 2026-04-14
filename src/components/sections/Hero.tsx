"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { IconArrowRight, IconArrowUpRight } from "../icons";
import MagneticButton from "../MagneticButton";
import type { HomeHero } from "@prisma/client";

const IsometricFieldCanvas = dynamic(() => import("../IsometricFieldCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
});

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const enterVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.9,
      ease: EASE_OUT,
    },
  }),
};

const clipVariant: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    transition: {
      delay,
      duration: 1.1,
      ease: EASE_OUT,
    },
  }),
};

export default function Hero({ content }: { content: HomeHero }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (lineRef.current) {
        const y = window.scrollY * 0.4;
        lineRef.current.style.transform = `translateY(${y}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-[var(--nav-height)]"
    >
      <IsometricFieldCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.03)_1px,transparent_1px)] bg-size-[80px_80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] -right-[10%] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,165,90,0.06)_0%,transparent_70%)]"
      />

      {/* Editorial hairline — aligns with container padding */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[22%] bottom-[18%] left-6 w-px bg-[linear-gradient(to_bottom,transparent,rgba(201,165,90,0.22)_20%,rgba(201,165,90,0.12)_50%,transparent)] md:left-10 lg:left-16"
      />

      <div className="container relative z-[1]">
        <motion.p
          className="text-overline mb-6"
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={enterVariant}
        >
          {content.overline}
        </motion.p>

        <h1 className="mb-6">
          <motion.span
            className="text-display block overflow-hidden pb-[0.06em]"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={clipVariant}
          >
            {content.headlineLine1}
          </motion.span>
          <motion.span
            className="text-display block overflow-hidden pb-[0.06em] pl-[clamp(2rem,10vw,12rem)] -mt-[20px]"
            initial="hidden"
            animate="visible"
            custom={0.12}
            variants={clipVariant}
          >
            <em className="italic-display text-accent">{content.headlineLine2Italic}</em>
          </motion.span>
          <motion.span
            className="text-display block overflow-hidden pb-[0.06em]"
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={clipVariant}
          >
            {content.headlineLine3}
          </motion.span>
        </h1>

        <motion.p
          className="text-body-lg mb-8 max-w-[480px]"
          initial="hidden"
          animate="visible"
          custom={0.55}
          variants={enterVariant}
        >
          {content.body}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial="hidden"
          animate="visible"
          custom={0.7}
          variants={enterVariant}
        >
          <MagneticButton>
            <Link href={content.primaryCtaHref} className="btn btn-primary" data-cursor-label="Let's Build">
              {content.primaryCtaLabel}
              <IconArrowUpRight size={16} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href={content.secondaryCtaHref} className="btn btn-secondary">
              {content.secondaryCtaLabel}
              <IconArrowRight size={16} />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      <div
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-16 h-px w-[45vw] bg-[linear-gradient(to_right,transparent,var(--color-border),transparent)]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs tracking-[0.15em] text-text-tertiary uppercase">Scroll</span>
        <ScrollLine />
      </motion.div>
    </section>
  );
}

function ScrollLine() {
  return (
    <div className="relative h-10 w-px overflow-hidden bg-border">
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
        className="absolute inset-0 bg-accent"
      />
    </div>
  );
}
