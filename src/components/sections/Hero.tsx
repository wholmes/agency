"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { IconArrowRight, IconArrowUpRight } from "../icons";
import MagneticButton from "../MagneticButton";

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

export default function Hero() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Subtle parallax on the decorative line */
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
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "var(--nav-height)",
        overflow: "hidden",
      }}
    >
      {/* Background grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201, 165, 90, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 165, 90, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 165, 90, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Overline */}
        <motion.p
          className="text-overline"
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={enterVariant}
          style={{ marginBottom: "var(--space-8)" }}
        >
          Premium Web Development Agency
        </motion.p>

        {/* Main headline — intentional typographic decision */}
        <h1 style={{ marginBottom: "var(--space-8)" }}>
          <motion.span
            className="text-display"
            style={{ display: "block", overflow: "hidden" }}
            initial="hidden"
            animate="visible"
            custom={0}
            variants={clipVariant}
          >
            Brand
          </motion.span>
          <motion.span
            className="text-display"
            style={{
              display: "block",
              overflow: "hidden",
              paddingLeft: "clamp(2rem, 10vw, 12rem)",
            }}
            initial="hidden"
            animate="visible"
            custom={0.12}
            variants={clipVariant}
          >
            <em
              className="italic-display"
              style={{ color: "var(--color-accent)" }}
            >
              meets
            </em>
          </motion.span>
          <motion.span
            className="text-display"
            style={{ display: "block", overflow: "hidden" }}
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={clipVariant}
          >
            Code.
          </motion.span>
        </h1>

        {/* Supporting copy */}
        <motion.p
          className="text-body-lg"
          initial="hidden"
          animate="visible"
          custom={0.55}
          variants={enterVariant}
          style={{
            maxWidth: "480px",
            marginBottom: "var(--space-10)",
          }}
        >
          We build premium websites for B2B companies and SaaS founders who need
          both design precision and engineering depth. Every pixel earns its place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.7}
          variants={enterVariant}
          style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}
        >
          <MagneticButton>
            <Link href="/contact" className="btn btn-primary" data-cursor-label="Let's Build">
              Start a Project
              <IconArrowUpRight size={16} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/work" className="btn btn-secondary">
              See the Work
              <IconArrowRight size={16} />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Decorative offset line — breaks the grid intentionally */}
      <div
        ref={lineRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "var(--space-16)",
          right: 0,
          width: "45vw",
          height: "1px",
          background: "linear-gradient(to right, transparent, var(--color-border), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "var(--space-10)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
        aria-hidden="true"
      >
        <span style={{ fontSize: "var(--text-xs)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
          Scroll
        </span>
        <ScrollLine />
      </motion.div>
    </section>
  );
}

function ScrollLine() {
  return (
    <div
      style={{
        width: 1,
        height: 40,
        background: "var(--color-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--color-accent)",
        }}
      />
    </div>
  );
}
