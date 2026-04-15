"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import type { ServicesPageHero as ServicesPageHeroModel } from "@prisma/client";

const HeroFieldCanvas = dynamic(() => import("../HeroFieldCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 60% 35%, #191614 0%, #0c0c0b 65%)",
      }}
    />
  ),
});

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const enterVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.85, ease: EASE_OUT },
  }),
};

export default function ServicesPageHero({ content }: { content: ServicesPageHeroModel }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (lineRef.current) {
        lineRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      aria-labelledby="services-page-heading"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-[var(--nav-height)]"
    >
      <HeroFieldCanvas variant="services" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.03)_1px,transparent_1px)] bg-size-[80px_80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] -right-[10%] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,165,90,0.06)_0%,transparent_70%)]"
      />

      <div className="container relative z-[1] max-md:-translate-y-12">
        <div className="max-md:rounded-md max-md:border max-md:border-border/25 max-md:px-5 max-md:py-8 md:border-transparent md:bg-transparent md:p-0 md:shadow-none">
        <motion.p
          className="text-overline mb-6"
          initial="hidden"
          animate="visible"
          custom={0.08}
          variants={enterVariant}
        >
          {content.overline}
        </motion.p>

        <motion.h1
          id="services-page-heading"
          className="text-h1 mb-6 max-w-[640px]"
          initial="hidden"
          animate="visible"
          custom={0.18}
          variants={enterVariant}
        >
          {content.title}
        </motion.h1>

        <motion.p
          className="text-body-lg max-w-[520px]"
          initial="hidden"
          animate="visible"
          custom={0.38}
          variants={enterVariant}
        >
          {content.body}
        </motion.p>
        </div>
      </div>

      <div
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-16 h-px w-[45vw] bg-[linear-gradient(to_right,transparent,var(--color-border),transparent)]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.55 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs tracking-[0.15em] text-text-tertiary uppercase">Scroll</span>
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
