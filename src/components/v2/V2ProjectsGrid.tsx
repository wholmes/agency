"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Isometric helpers (same as V2ProcessSection) ─────────────────────────────
const S = 10; // unit → px scale
function iso(ox: number, oy: number, r: number, l: number, h: number): [number, number] {
  return [ox + (r - l) * S * 0.866, oy + (r + l) * S * 0.5 - h * S];
}
interface BoxProps {
  ox: number; oy: number; W: number; D: number; H: number;
  stroke?: string; strokeWidth?: number;
  topFill?: string; leftFill?: string; rightFill?: string;
}
function IsoBox({ ox, oy, W, D, H, stroke = "rgba(255,255,255,0.18)", strokeWidth = 0.8, topFill = "none", leftFill = "rgba(255,255,255,0.03)", rightFill = "rgba(255,255,255,0.02)" }: BoxProps) {
  const [tl] = [iso(ox,oy,0,0,H)]; const [tr] = [iso(ox,oy,W,0,H)];
  const [tm] = [iso(ox,oy,W,D,H)]; const [tbl] = [iso(ox,oy,0,D,H)];
  const [bl] = [iso(ox,oy,0,0,0)]; const [br] = [iso(ox,oy,W,0,0)];
  const [bm] = [iso(ox,oy,W,D,0)]; const [bbl] = [iso(ox,oy,0,D,0)];
  const top   = `${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${tm[0]},${tm[1]} ${tbl[0]},${tbl[1]}`;
  const left  = `${tl[0]},${tl[1]} ${tbl[0]},${tbl[1]} ${bbl[0]},${bbl[1]} ${bl[0]},${bl[1]}`;
  const right = `${tr[0]},${tr[1]} ${tm[0]},${tm[1]} ${bm[0]},${bm[1]} ${br[0]},${br[1]}`;
  return (<g>
    <polygon points={top}   fill={topFill}   stroke={stroke} strokeWidth={strokeWidth} />
    <polygon points={left}  fill={leftFill}  stroke={stroke} strokeWidth={strokeWidth} />
    <polygon points={right} fill={rightFill} stroke={stroke} strokeWidth={strokeWidth} />
  </g>);
}

// ── Ghost isometric icons ─────────────────────────────────────────────────────

// DataLayer Tracker — stacked analytics layer slabs (large, for featured card)
function GhostDataLayer() {
  const ox = 160; const oy = 180;
  const layers = [
    { dr: 0, dl: 0, dh: 0,   W: 10, D: 6 },
    { dr: -0.4, dl: -0.4, dh: 2.2, W: 9,  D: 5.4 },
    { dr: -0.8, dl: -0.8, dh: 4.4, W: 8,  D: 4.8 },
  ];
  return (
    <svg width="320" height="280" viewBox="0 0 320 280" fill="none" aria-hidden="true" overflow="visible">
      <g opacity="0.55">
        {layers.map((l, i) => {
          const [bx, by] = iso(ox, oy, l.dr, l.dl, l.dh);
          const isTop = i === layers.length - 1;
          return (
            <IsoBox key={i} ox={bx} oy={by} W={l.W} D={l.D} H={0.7}
              stroke={isTop ? "rgba(201,165,90,0.35)" : "rgba(255,255,255,0.14)"}
              strokeWidth={isTop ? 0.9 : 0.7}
              topFill={isTop ? "rgba(201,165,90,0.04)" : "rgba(255,255,255,0.02)"}
              leftFill="rgba(255,255,255,0.015)"
              rightFill="rgba(255,255,255,0.01)"
            />
          );
        })}
        {/* Gold accent line across top slab */}
        {(() => {
          const [x1,y1] = iso(ox,oy,-0.8+1,-0.8+0.5,4.4+0.7+0.1);
          const [x2,y2] = iso(ox,oy,-0.8+5,-0.8+0.5,4.4+0.7+0.1);
          return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,165,90,0.3)" strokeWidth="0.8" strokeLinecap="round" />;
        })()}
      </g>
    </svg>
  );
}

// Blueprint Toolkit — iso blueprint grid platform with 3 rising columns
function GhostBlueprint() {
  const ox = 80; const oy = 75;
  const cols = [1.4, 2.4, 3.0];
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true" overflow="visible">
      <g opacity="0.5">
        {/* Base platform */}
        <IsoBox ox={ox} oy={oy} W={5} D={3.5} H={0.4}
          stroke="rgba(255,255,255,0.14)" strokeWidth={0.7}
          topFill="rgba(255,255,255,0.02)" />
        {/* 3 columns */}
        {cols.map((h, i) => {
          const [bx,by] = iso(ox, oy, i*1.4+0.5, 1, 0.4);
          const isGold = i === cols.length - 1;
          return (
            <IsoBox key={i} ox={bx} oy={by} W={0.9} D={1.5} H={h}
              stroke={isGold ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.14)"}
              strokeWidth={isGold ? 0.9 : 0.7}
              topFill={isGold ? "rgba(96,165,250,0.06)" : "rgba(255,255,255,0.02)"}
              leftFill="rgba(255,255,255,0.01)"
              rightFill="rgba(255,255,255,0.01)"
            />
          );
        })}
      </g>
    </svg>
  );
}

// 10 Speed Arcade — iso game controller shape: 2 stacked slabs + 2 side bumpers
function GhostArcade() {
  const ox = 62; const oy = 72;
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true" overflow="visible">
      <g opacity="0.5">
        {/* Main body */}
        <IsoBox ox={ox} oy={oy} W={5} D={3} H={1.2}
          stroke="rgba(255,255,255,0.16)" strokeWidth={0.8}
          topFill="rgba(255,255,255,0.02)" />
        {/* Left grip */}
        {(() => { const [bx,by]=iso(ox,oy,-0.6,0.8,0); return (
          <IsoBox ox={bx} oy={by} W={1.4} D={1.4} H={2.2}
            stroke="rgba(255,255,255,0.12)" strokeWidth={0.7}
            topFill="rgba(255,255,255,0.015)" />
        );})()} 
        {/* Right grip */}
        {(() => { const [bx,by]=iso(ox,oy,4.2,0.8,0); return (
          <IsoBox ox={bx} oy={by} W={1.4} D={1.4} H={2.2}
            stroke="rgba(74,222,128,0.35)" strokeWidth={0.8}
            topFill="rgba(74,222,128,0.04)" />
        );})()} 
        {/* D-pad cross — two thin slabs */}
        {(() => { const [bx,by]=iso(ox,oy,0.8,1,1.2); return (
          <IsoBox ox={bx} oy={by} W={1.6} D={0.5} H={0.25}
            stroke="rgba(255,255,255,0.2)" strokeWidth={0.7}
            topFill="rgba(255,255,255,0.04)" />
        );})()} 
        {(() => { const [bx,by]=iso(ox,oy,1.15,0.6,1.2); return (
          <IsoBox ox={bx} oy={by} W={0.5} D={1.6} H={0.25}
            stroke="rgba(255,255,255,0.2)" strokeWidth={0.7}
            topFill="rgba(255,255,255,0.04)" />
        );})()} 
      </g>
    </svg>
  );
}

// Intently — iso signal funnel: wide base slab narrowing to tall tower
function GhostIntently() {
  const ox = 62; const oy = 72;
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true" overflow="visible">
      <g opacity="0.5">
        {/* Wide base tier */}
        <IsoBox ox={ox} oy={oy} W={5.5} D={3.5} H={0.5}
          stroke="rgba(255,255,255,0.14)" strokeWidth={0.7}
          topFill="rgba(255,255,255,0.015)" />
        {/* Mid tier — centred, narrower */}
        {(() => { const [bx,by]=iso(ox,oy,1,0.8,0.5); return (
          <IsoBox ox={bx} oy={by} W={3.5} D={1.9} H={0.5}
            stroke="rgba(255,255,255,0.14)" strokeWidth={0.7}
            topFill="rgba(255,255,255,0.015)" />
        );})()} 
        {/* Top tower — signal spike, accent coloured */}
        {(() => { const [bx,by]=iso(ox,oy,2,1.3,1); return (
          <IsoBox ox={bx} oy={by} W={1.5} D={0.9} H={2.2}
            stroke="rgba(232,139,107,0.45)" strokeWidth={0.9}
            topFill="rgba(232,139,107,0.06)"
            leftFill="rgba(232,139,107,0.02)"
            rightFill="rgba(232,139,107,0.015)" />
        );})()} 
      </g>
    </svg>
  );
}

// ArtExhib — iso gallery room: floor platform + 3 wall-hung frame slabs
function GhostGallery() {
  const ox = 55; const oy = 76;
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" aria-hidden="true" overflow="visible">
      <g opacity="0.5">
        {/* Floor platform */}
        <IsoBox ox={ox} oy={oy} W={6} D={4} H={0.3}
          stroke="rgba(255,255,255,0.12)" strokeWidth={0.7}
          topFill="rgba(255,255,255,0.015)" />
        {/* Back wall frame 1 */}
        {(() => { const [bx,by]=iso(ox,oy,0.6,0.3,0.3); return (
          <IsoBox ox={bx} oy={by} W={1.6} D={0.2} H={2.4}
            stroke="rgba(248,113,113,0.4)" strokeWidth={0.85}
            topFill="rgba(248,113,113,0.04)"
            rightFill="rgba(248,113,113,0.03)" />
        );})()} 
        {/* Back wall frame 2 */}
        {(() => { const [bx,by]=iso(ox,oy,2.8,0.3,0.3); return (
          <IsoBox ox={bx} oy={by} W={1.6} D={0.2} H={2.4}
            stroke="rgba(255,255,255,0.16)" strokeWidth={0.75}
            topFill="rgba(255,255,255,0.02)" />
        );})()} 
        {/* Smaller side frame */}
        {(() => { const [bx,by]=iso(ox,oy,0.3,1.6,0.3); return (
          <IsoBox ox={bx} oy={by} W={0.2} D={2} H={1.8}
            stroke="rgba(255,255,255,0.14)" strokeWidth={0.7}
            topFill="rgba(255,255,255,0.015)" />
        );})()} 
      </g>
    </svg>
  );
}

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
    Ghost: GhostDataLayer,
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
    Ghost: GhostBlueprint,
  },
  {
    slug: "arcade",
    title: "10 Speed Arcade",
    summary: "5 browser games, zero backend — built for scale with pure client-side architecture.",
    tag: "Games · WebGL",
    year: "2023",
    href: "https://10speedgames.com",
    featured: false,
    accent: "#4ade80",
    Ghost: GhostArcade,
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
    Ghost: GhostGallery,
  },
  {
    slug: "sable",
    title: "Intently",
    summary: "Behavioral analytics SaaS capturing 35% more signal than client-side tracking alone.",
    tag: "Analytics · SaaS",
    year: "2024",
    href: "https://getintently.io",
    featured: false,
    accent: "#E88B6B",
    Ghost: GhostIntently,
  },
];

function FeaturedCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="md:row-span-2"
    >
      <Link
        href={project.href}
        target="_blank" rel="noopener noreferrer"
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
            View project
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
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: EASE }}
    >
      <Link
        href={project.href}
        target="_blank" rel="noopener noreferrer"
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
            View project →
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
                Work.
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/work" className="font-mono text-[11px] text-white/25 no-underline transition-colors hover:text-white/60">
                All selected work →
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
