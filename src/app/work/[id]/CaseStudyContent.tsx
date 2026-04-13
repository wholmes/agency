"use client";

import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { IconArrowUpRight } from "@/components/icons";
import type { Project } from "@/lib/projects";
import type { CaseStudyUiLabels } from "@prisma/client";

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

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.9, ease: EASE_OUT },
  }),
};

function InViewMotion({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={cardVariant}
    >
      {children}
    </motion.div>
  );
}

export default function CaseStudyContent({
  project,
  labels,
}: {
  project: Project;
  labels: CaseStudyUiLabels;
}) {
  return (
    <>
      {/* ── Hero header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 30%, ${project.accent}08 0%, transparent 60%)`,
          }}
        />
        <div className="container relative">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={enterVariant}
          >
            <Link
              href="/work"
              className="back-link mb-8 inline-flex items-center gap-2 text-sm text-text-tertiary no-underline transition-colors [transition-duration:var(--duration-base)] hover:text-text-primary"
            >
              {labels.backToWorkLabel}
            </Link>
          </motion.div>

          <motion.p
            className="text-overline mb-4"
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={enterVariant}
          >
            {project.category} · {project.year}
          </motion.p>

          <h1 className="text-h1 mb-6">
            <motion.span
              className="block overflow-hidden pb-[0.04em]"
              initial="hidden"
              animate="visible"
              custom={0.16}
              variants={clipVariant}
            >
              {project.title}
            </motion.span>
          </h1>

          <motion.div
            className="mb-10 flex flex-wrap items-center gap-4"
            initial="hidden"
            animate="visible"
            custom={0.42}
            variants={enterVariant}
          >
            <div className="inline-flex items-center gap-2 rounded-sm border border-accent-muted bg-accent-subtle px-5 py-3">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-wide text-accent">{project.result}</span>
            </div>
            <p className="text-sm text-text-tertiary">{project.resultDetail}</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            custom={0.56}
            variants={enterVariant}
          >
            {project.services.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-border bg-surface px-3 py-2 text-xs tracking-wider text-text-secondary uppercase"
              >
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Hero image block ─────────────────────────────────────── */}
      <InViewMotion>
        <div
          className="relative flex h-[clamp(280px,40vw,480px)] items-center justify-center overflow-hidden"
          style={{ background: project.color }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, ${project.accent}28 0%, transparent 55%), radial-gradient(circle at 75% 70%, ${project.accent}14 0%, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.02)_1px,transparent_1px)] bg-size-[60px_60px]" />
          <span
            className="relative select-none font-display text-[clamp(6rem,18vw,14rem)] font-light tracking-tighter"
            style={{ color: project.accent, opacity: 0.1 }}
          >
            {project.title.split(" ")[0]}
          </span>
        </div>
      </InViewMotion>

      {/* ── Case study body ──────────────────────────────────────── */}
      <section aria-label="Case study details" className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InViewMotion delay={0}>
              <div className="rounded-lg border border-border bg-surface p-10">
                <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-accent uppercase">
                  {labels.problemSectionLabel}
                </p>
                <p className="font-display text-lg font-light leading-relaxed tracking-tight text-text-primary">
                  {project.problem}
                </p>
              </div>
            </InViewMotion>

            <InViewMotion delay={0.1}>
              <div className="rounded-lg border border-border bg-surface p-10">
                <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-accent uppercase">
                  {labels.approachSectionLabel}
                </p>
                <p className="font-display text-lg font-light leading-relaxed tracking-tight text-text-primary">
                  {project.approach}
                </p>
              </div>
            </InViewMotion>

            <InViewMotion delay={0.2} className="md:col-span-2">
              <div className="relative overflow-hidden rounded-lg border border-accent-muted bg-accent-subtle p-10">
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 left-0 h-0.5 bg-[linear-gradient(to_right,var(--color-accent),transparent)]"
                />
                <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-accent uppercase">
                  {labels.outcomeSectionLabel}
                </p>
                <p className="font-display text-lg font-light leading-relaxed tracking-tight text-text-primary">
                  {project.outcome}
                </p>
              </div>
            </InViewMotion>
          </div>

          <InViewMotion className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-24">
            <Link
              href="/work"
              className="back-link text-sm text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] hover:text-text-primary"
            >
              {labels.backToCaseStudiesLabel}
            </Link>
            <Link href="/contact" className="btn btn-primary">
              {labels.similarProjectCtaLabel}
              <IconArrowUpRight size={16} />
            </Link>
          </InViewMotion>
        </div>
      </section>
    </>
  );
}
