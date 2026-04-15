"use client";

import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { IconArrowUpRight } from "@/components/icons";
import WorkSunburst from "@/components/WorkSunburst";
import CtaSection from "@/components/sections/CtaSection";
import type { Project } from "@/lib/projects";
import type { CtaSectionCopy, WorkPageHero } from "@prisma/client";

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
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.9, ease: EASE_OUT },
  }),
};

export default function WorkPageClient({
  projects,
  workHero,
  ctaCopy,
}: {
  projects: Project[];
  workHero: WorkPageHero;
  ctaCopy: CtaSectionCopy;
}) {
  return (
    <>
      <section
        aria-label="Work hero"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden border-b border-border pt-[var(--nav-height)]"
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <WorkSunburst />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(201,165,90,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.055)_1px,transparent_1px)] bg-size-[80px_80px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.35)_100%)]"
        />

        <div className="container relative z-[1] pb-16 md:pb-20">
          <motion.p
            className="text-overline mb-5"
            initial="hidden"
            animate="visible"
            custom={0.05}
            variants={enterVariant}
          >
            {workHero.overline}
          </motion.p>

          <h1 className="text-h1 mb-0 max-w-[640px]">
            <motion.span
              className="block overflow-hidden pb-[0.06em] leading-[1.05]"
              initial="hidden"
              animate="visible"
              custom={0}
              variants={clipVariant}
            >
              {workHero.headlineLine1}
            </motion.span>
            <motion.span
              className="block overflow-hidden pb-[0.42em] leading-[1.2]"
              initial="hidden"
              animate="visible"
              custom={0.14}
              variants={clipVariant}
            >
              <em className="italic-display text-accent">{workHero.headlineLine2Italic}</em>
            </motion.span>
          </h1>

          <motion.p
            className="text-body-lg max-w-[520px]"
            initial="hidden"
            animate="visible"
            custom={0.42}
            variants={enterVariant}
          >
            {workHero.body}
          </motion.p>
        </div>
      </section>

      <section aria-label="Case studies" className="section">
        <div className="container">
          <div className="flex flex-col gap-24">
            {projects.map((project) => (
              <CaseStudy key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection copy={ctaCopy} />
    </>
  );
}

function CaseStudy({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <article ref={ref} aria-labelledby={`case-${project.id}`}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={0}
        variants={cardVariant}
      >
        <Link
          href={`/work/${project.id}`}
          className="case-header mb-10 grid grid-cols-1 items-center gap-8 no-underline transition-opacity hover:opacity-90 md:grid-cols-[1.2fr_1fr]"
        >
          <div
            className="relative flex h-[clamp(240px,35vw,400px)] items-center justify-center overflow-hidden rounded-lg"
            style={{ background: project.color }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 40%, ${project.accent}22 0%, transparent 60%)`,
              }}
            />
            <span
              className="font-display select-none text-[clamp(4rem,12vw,8rem)] font-light tracking-tighter"
              style={{ color: project.accent, opacity: 0.12 }}
            >
              {project.title.split(" ")[0]}
            </span>
          </div>

          <div>
            <p className="mb-3 text-xs tracking-wider text-text-tertiary uppercase">
              {project.category} · {project.year}
            </p>
            <h2 id={`case-${project.id}`} className="text-h3 mb-5">
              {project.title}
            </h2>
            <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-accent-muted bg-accent-subtle px-4 py-2">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-xs font-medium text-accent">{project.result}</span>
            </div>
            <p className="text-sm text-text-tertiary">{project.resultDetail}</p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
              Read case study <IconArrowUpRight size={14} />
            </div>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="case-body grid grid-cols-1 gap-8 md:grid-cols-2"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={1}
        variants={cardVariant}
      >
        <div className="rounded-lg border border-border bg-surface p-8">
          <p className="mb-4 text-xs font-medium tracking-wider text-accent uppercase">Problem</p>
          <p className="text-base leading-relaxed text-text-secondary">{project.problem}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-8">
          <p className="mb-4 text-xs font-medium tracking-wider text-accent uppercase">Approach</p>
          <p className="text-base leading-relaxed text-text-secondary">{project.approach}</p>
        </div>
      </motion.div>

      <div className="mt-16 h-px bg-border" aria-hidden="true" />
    </article>
  );
}
