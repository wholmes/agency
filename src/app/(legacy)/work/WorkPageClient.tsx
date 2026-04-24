"use client";

import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/projects";
import { PROJECT_LIVE_URLS } from "@/lib/project-live-urls";
import type { WorkPageHero } from "@prisma/client";
import ExpandableText from "@/components/ExpandableText";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: EASE },
  }),
};

export default function WorkPageClient({
  projects,
  isAdmin = false,
}: {
  projects: Project[];
  workHero?: WorkPageHero;
  isAdmin?: boolean;
}) {
  return (
    <div className="bg-[#0e0e0e]">
      {/* Noise grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.04,
          mixBlendMode: "overlay",
        }}
      />

      {/* Page header */}
      <section className="border-b border-white/[0.06] pt-[calc(var(--nav-height)+5rem)] pb-16">
        <div className="mx-auto max-w-[1280px] px-8 md:px-16">
          <motion.p
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Selected work
          </motion.p>
          <motion.h1
            className="font-display text-[clamp(3rem,6vw,6rem)] font-light leading-[0.93] tracking-[-0.03em] text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          >
            Work that<br />
            <em className="not-italic" style={{ color: "#c9a55a" }}>moves the needle.</em>
          </motion.h1>
        </div>
      </section>

      {/* Case studies */}
      <section aria-label="Case studies" className="py-20">
        <div className="mx-auto max-w-[1280px] px-8 md:px-16">
          <div className="flex flex-col gap-24">
            {projects.map((project, i) => (
              <CaseStudy key={project.id} project={project} isAdmin={isAdmin} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CaseStudy({ project, isAdmin, index }: { project: Project; isAdmin?: boolean; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <article ref={ref} aria-labelledby={`case-${project.id}`} className="border-b border-white/[0.05] pb-24 last:border-0 last:pb-0">

      {/* Header row */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={0}
        variants={cardVariant}
      >
        <div className="mb-10 grid grid-cols-1 items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          {project.coverImage ? (
            <div
              className="overflow-hidden rounded-xl"
              style={{ boxShadow: "0 20px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)" }}
              aria-hidden="true"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#131313] px-3 py-2.5">
                <div className="flex shrink-0 gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex h-5 w-40 items-center gap-1.5 rounded bg-white/[0.06] px-2.5">
                    <span className="size-1 shrink-0 rounded-full bg-white/20" />
                    <div className="h-1 w-24 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="w-10 shrink-0" />
              </div>
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={`${project.title} website`}
                  className="block h-auto w-full transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
            </div>
          ) : (
            <div
              className="relative flex h-[clamp(240px,32vw,420px)] items-center justify-center overflow-hidden rounded-xl"
              style={{
                background: `linear-gradient(135deg, rgba(14,14,14,1) 0%, ${project.color} 100%)`,
                boxShadow: "0 20px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
              aria-hidden="true"
            >
              <span
                className="font-display select-none text-[clamp(4rem,12vw,8rem)] font-light tracking-tighter"
                style={{ color: project.accent, opacity: 0.08 }}
              >
                {project.title.split(" ")[0]}
              </span>
            </div>
          )}

          {/* Meta */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {project.category}
              </span>
              <span className="text-white/15">·</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {project.year}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.15em] text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h2 id={`case-${project.id}`}
              className="mb-5 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[0.95] tracking-[-0.025em] text-white"
            >
              {project.title}
            </h2>

            {/* Result pill */}
            <div className="mb-3 inline-flex items-center gap-2.5 rounded-full border border-[#c9a55a]/25 bg-[#c9a55a]/[0.07] px-4 py-2">
              <span className="size-1.5 shrink-0 rounded-full bg-[#c9a55a]" aria-hidden="true" />
              <span className="font-mono text-[11px] text-[#c9a55a]">{project.result}</span>
            </div>

            <p className="mb-8 text-[13px] leading-relaxed text-white/40">{project.resultDetail}</p>

            <div className="flex items-center gap-4">
              <Link
                href={`/work/${project.id}`}
                className="inline-flex items-center gap-2 font-body text-[13px] font-medium text-white/60 no-underline transition-colors hover:text-white"
              >
                View case study
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              {PROJECT_LIVE_URLS[project.id] && (
                <a
                  href={PROJECT_LIVE_URLS[project.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a55a]/25 bg-[#c9a55a]/[0.06] px-3 py-1 font-mono text-[10px] text-[#c9a55a]/70 no-underline transition-colors hover:border-[#c9a55a]/50 hover:text-[#c9a55a]"
                >
                  Visit site
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              {isAdmin && (
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/35 no-underline transition-colors hover:border-white/20 hover:text-white/60"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problem / Approach cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={1}
        variants={cardVariant}
      >
        {[
          { label: "Problem", body: project.problem },
          { label: "Approach", body: project.approach },
        ].map(({ label, body }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.06] p-7"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a55a]/70">{label}</p>
            <ExpandableText text={body} textClassName="text-[13px] leading-relaxed text-white/45" />
          </div>
        ))}
      </motion.div>
    </article>
  );
}
