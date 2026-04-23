"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROJECTS = [
  {
    slug: "datalayer-tracker",
    title: "DataLayer Tracker",
    summary: "Server-side analytics for WordPress — GA4, Meta CAPI, and GTM in one framework.",
    tag: "Analytics · WordPress",
    year: "2024",
    href: "https://datalayer-tracker.com",
    featured: true,
    accent: "#c9a55a",
    Ghost: () => (
      <svg width="320" height="280" viewBox="0 0 320 280" fill="none" aria-hidden="true">
        <polygon points="160,30 280,95 160,160 40,95" stroke="white" strokeWidth="1.2" fill="none" opacity="0.07"/>
        <polygon points="160,60 280,125 160,190 40,125" stroke="white" strokeWidth="1" fill="none" opacity="0.05"/>
        <polygon points="160,90 280,155 160,220 40,155" stroke="white" strokeWidth="0.8" fill="none" opacity="0.03"/>
        <line x1="160" y1="30" x2="160" y2="220" stroke="white" strokeWidth="0.6" opacity="0.03"/>
        <line x1="40" y1="95" x2="280" y2="95" stroke="rgba(201,165,90,0.15)" strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    slug: "blueprint-toolkit",
    title: "Blueprint Toolkit",
    summary: "Eliminated 4 hrs per GA4 measurement setup with a guided framework builder.",
    tag: "SaaS · Analytics",
    year: "2024",
    href: "https://blueprint-toolkit.com",
    featured: false,
    accent: "#60a5fa",
    Ghost: () => (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true">
        <rect x="20" y="20" width="120" height="90" rx="4" stroke="white" strokeWidth="1" fill="none" opacity="0.07"/>
        <line x1="20" y1="42" x2="140" y2="42" stroke="white" strokeWidth="0.7" opacity="0.05"/>
        <rect x="32" y="54" width="60" height="5" rx="2" fill="white" opacity="0.05"/>
        <rect x="32" y="66" width="90" height="5" rx="2" fill="white" opacity="0.04"/>
        <rect x="32" y="78" width="45" height="5" rx="2" fill="white" opacity="0.03"/>
      </svg>
    ),
  },
  {
    slug: "arcade",
    title: "10 Speed Arcade",
    summary: "5 browser games, zero backend — built for scale with pure client-side architecture.",
    tag: "Games · WebGL",
    year: "2023",
    href: "https://wholmes.github.io/arcade/",
    featured: false,
    accent: "#4ade80",
    Ghost: () => (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true">
        <circle cx="80" cy="65" r="50" stroke="white" strokeWidth="1" fill="none" opacity="0.06"/>
        <circle cx="80" cy="65" r="30" stroke="white" strokeWidth="0.8" fill="none" opacity="0.04"/>
        <polygon points="68,52 68,80 98,66" stroke="white" strokeWidth="1" fill="none" opacity="0.07"/>
      </svg>
    ),
  },
  {
    slug: "artexhib",
    title: "ArtExhib",
    summary: "Spatial galleries without physical walls — WebGL-powered virtual art exhibitions.",
    tag: "Platform · WebGL",
    year: "2023",
    href: "https://artexhib.com",
    featured: false,
    accent: "#f87171",
    Ghost: () => (
      <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true">
        <rect x="15" y="15" width="130" height="100" stroke="white" strokeWidth="0.8" fill="none" opacity="0.05"/>
        <line x1="15" y1="15" x2="45" y2="15" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="15" y1="15" x2="15" y2="45" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="145" y1="15" x2="115" y2="15" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="145" y1="15" x2="145" y2="45" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="15" y1="115" x2="45" y2="115" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="15" y1="115" x2="15" y2="85" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="145" y1="115" x2="115" y2="115" stroke="white" strokeWidth="2.5" opacity="0.09"/>
        <line x1="145" y1="115" x2="145" y2="85" stroke="white" strokeWidth="2.5" opacity="0.09"/>
      </svg>
    ),
  },
];

function FeaturedCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="md:row-span-2"
    >
      <Link
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full min-h-[480px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e0e0e] p-10 no-underline transition-all duration-500 hover:border-white/[0.14]"
      >
        {/* Ghost watermark */}
        <div className="pointer-events-none absolute right-4 top-4 opacity-100 transition-opacity duration-700 group-hover:opacity-30">
          <project.Ghost />
        </div>

        {/* Accent glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: project.accent }}
        />

        {/* Top meta */}
        <div className="relative z-10 flex items-start justify-between">
          <span className="inline-block rounded-full border border-white/[0.08] px-3 py-1 font-mono text-[10px] text-white/30">
            {project.tag}
          </span>
          <span className="font-mono text-[10px] text-white/20">{project.year}</span>
        </div>

        {/* Bottom content */}
        <div className="relative z-10">
          <div
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: project.accent, opacity: 0.7 }}
          >
            Featured
          </div>
          <h3 className="mb-4 font-display text-[clamp(1.8rem,3vw,2.8rem)] font-light leading-tight tracking-[-0.02em] text-white transition-colors group-hover:text-white">
            {project.title}
          </h3>
          <p className="mb-6 max-w-[360px] text-[14px] leading-relaxed text-white/45">
            {project.summary}
          </p>
          <span
            className="inline-flex items-center gap-2 font-mono text-[11px] transition-all duration-300"
            style={{ color: project.accent, opacity: 0.6 }}
          >
            View case study
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function SmallCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: EASE }}
    >
      <Link
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-xl border border-white/[0.07] bg-[#0e0e0e] p-7 no-underline transition-all duration-500 hover:border-white/[0.14]"
      >
        {/* Ghost */}
        <div className="pointer-events-none absolute right-3 top-3 opacity-100 transition-opacity duration-500 group-hover:opacity-20">
          <project.Ghost />
        </div>

        {/* Accent glow */}
        <div
          className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: project.accent }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <span className="inline-block rounded-full border border-white/[0.07] px-2.5 py-1 font-mono text-[9px] text-white/25">
            {project.tag}
          </span>
          <span className="font-mono text-[9px] text-white/15">{project.year}</span>
        </div>

        <div className="relative z-10">
          <h3 className="mb-2 font-body text-[clamp(1rem,1.5vw,1.2rem)] font-medium leading-snug text-white/80 transition-colors group-hover:text-white">
            {project.title}
          </h3>
          <p className="mb-4 text-[12px] leading-relaxed text-white/35">
            {project.summary}
          </p>
          <span
            className="font-mono text-[10px] opacity-40 transition-all duration-300 group-hover:opacity-80"
            style={{ color: project.accent }}
          >
            View case study →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function V2ProjectsGrid() {
  const [featured, ...rest] = PROJECTS;

  return (
    <section className="bg-[#080808]">
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1280px] px-8 py-24 md:px-16">

          {/* Header */}
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">Work</p>
              <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-white">
                Proud.
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/work" className="font-mono text-[11px] text-white/25 no-underline transition-colors hover:text-white/60">
                All case studies →
              </Link>
            </motion.div>
          </div>

          {/* Asymmetric grid — featured left spanning 2 rows, 3 smaller right + bottom */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
            <FeaturedCard project={featured} />
            {rest.map((p, i) => (
              <SmallCard key={p.slug} project={p} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
