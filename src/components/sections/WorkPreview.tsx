"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight } from "../icons";
import type { Project } from "@/lib/projects";
import type { WorkPreviewSection } from "@prisma/client";

const TOP_OFFSET = 100; // sticky top for first card (px)
const STACK_STEP = 24;  // each card sits 24px lower than the previous

export default function WorkPreview({
  projects,
  header,
}: {
  projects: Project[];
  header: WorkPreviewSection;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the whole stack container scrolling through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section aria-labelledby="work-heading" className="section bg-[#f5f0e8]">
      <div className="container">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[560px]">
            <ScrollReveal>
              <p className="mb-4 font-body text-xs font-medium uppercase tracking-[0.15em] text-[#8a7a60]">{header.overline}</p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 id="work-heading" className="font-display text-[length:var(--text-4xl)] font-light leading-[1.05] tracking-[-0.025em] text-[#1a1714]">
                {header.headingLine1}{" "}
                <em className="italic-display text-[#c9a55a]">{header.headingEmphasis}</em>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <Link href="/work" className="inline-flex items-center gap-2 rounded-full border border-[#c9a55a]/30 px-5 py-2.5 font-body text-sm text-[#8a7a60] no-underline transition-colors duration-300 hover:border-[#c9a55a] hover:text-[#1a1714]">
              All Work <IconArrowUpRight size={13} />
            </Link>
          </ScrollReveal>
        </div>

        {/* `relative`: useScroll(target) requires a non-static positioned element */}
        <div ref={containerRef} className="relative flex flex-col gap-6">
          {projects.map((project, i) => (
            <StackCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              containerScrollProgress={scrollYProgress}
            />
          ))}
        </div>

        <div className="pt-16 text-center">
          <div className="inline-block h-px w-16 bg-[#c9a55a]/30" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function StackCard({
  project,
  index,
  total,
  containerScrollProgress,
}: {
  project: Project;
  index: number;
  total: number;
  containerScrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each card starts shrinking when the card after it begins to stack on top.
  // Cards shrink by 3% per card stacked on top of them.
  // The last card never shrinks.
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;
  const targetScale = 1 - (total - 1 - index) * 0.04;

  const scale = useTransform(
    containerScrollProgress,
    [cardStart, cardEnd],
    [1, index === total - 1 ? 1 : targetScale]
  );

  return (
    <div
      className="sticky"
      style={{ top: `${TOP_OFFSET + index * STACK_STEP}px` }}
    >
      {/* Padding gives the box-shadow room so it isn't clipped by the sticky boundary */}
      <motion.div style={{ scale, transformOrigin: "top center" }} className="px-1 pb-4 -mb-4">
        <CardContent project={project} />
      </motion.div>
    </div>
  );
}

function CardContent({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.id}`}
      className="project-row block no-underline"
      style={{ "--project-accent": project.accent } as React.CSSProperties}
      aria-label={`Selected work: ${project.title}`}
      data-cursor-label="View Work"
    >
      <article className="project-article grid grid-cols-1 gap-6 rounded-xl border border-[#e0d8cc] bg-[#1a1714] p-8 shadow-[0_4px_32px_rgba(0,0,0,0.15)] transition-[transform,box-shadow,border-color] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] md:grid-cols-[1fr_1.2fr] md:items-center">
        {project.thumbImage ? (
          <div
            className="project-visual relative overflow-hidden rounded-md"
            style={{ background: project.color }}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#131313] px-3 py-2">
              <div className="flex shrink-0 gap-1">
                <span className="size-2 rounded-full bg-[#ff5f56]" aria-hidden="true" />
                <span className="size-2 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
                <span className="size-2 rounded-full bg-[#27c93f]" aria-hidden="true" />
              </div>
              <div className="flex flex-1 justify-center">
                <div className="h-3.5 w-24 rounded bg-white/[0.05]" />
              </div>
              <div className="w-[28px] shrink-0" aria-hidden="true" />
            </div>
            <div className="aspect-[16/9] overflow-hidden">
              <img src={project.thumbImage} alt="" className="block h-auto w-full" />
            </div>
            <div
              aria-hidden="true"
              className="project-border-accent pointer-events-none absolute inset-0 rounded-md border border-transparent transition-[border-color] [transition-duration:400ms] [transition-timing-function:var(--ease-out)]"
            />
          </div>
        ) : (
          <div
            className="project-visual relative flex h-[clamp(180px,25vw,280px)] items-center justify-center overflow-hidden rounded-md"
            style={{ background: project.color }}
          >
            <div
              aria-hidden="true"
              className="project-gradient absolute inset-0 opacity-90 transition-[opacity] [transition-duration:400ms] [transition-timing-function:var(--ease-out)]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 30% 40%, ${project.accent}22 0%, transparent 60%),
                  radial-gradient(circle at 70% 70%, ${project.accent}11 0%, transparent 50%)
                `,
              }}
            />
            <div
              aria-hidden="true"
              className="project-ghost-letter relative text-[clamp(3rem,8vw,5rem)] font-light tracking-tighter transition-[transform,opacity] [transition-duration:500ms] [transition-timing-function:var(--ease-out)] select-none"
              style={{ color: project.accent, opacity: 0.15, transformOrigin: "center center" }}
            >
              {project.title.charAt(0)}
            </div>
            <div
              className="project-year absolute top-4 right-4 font-mono text-xs tracking-wider transition-opacity [transition-duration:300ms] [transition-timing-function:var(--ease-out)]"
              style={{ color: `${project.accent}99` }}
              aria-hidden="true"
            >
              {project.year}
            </div>
            <div
              aria-hidden="true"
              className="project-border-accent pointer-events-none absolute inset-0 rounded-md border border-transparent transition-[border-color] [transition-duration:400ms] [transition-timing-function:var(--ease-out)]"
            />
          </div>
        )}

        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs tracking-wider text-text-tertiary uppercase">{project.category}</p>
              <h3 className="font-display text-2xl font-light tracking-tight text-text-primary">{project.title}</h3>
            </div>
            <IconArrowUpRight
              size={20}
              className="project-arrow mt-1 shrink-0 text-text-tertiary transition-colors [transition-duration:var(--duration-base)]"
            />
          </div>

          <p className="mb-5 text-sm leading-relaxed text-text-secondary">{project.proofFit}</p>

          <div className="inline-flex items-center gap-2 rounded-sm border border-accent-muted bg-accent-subtle px-3 py-2 text-xs font-medium text-accent">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
            {project.result}
          </div>
        </div>
      </article>
    </Link>
  );
}
