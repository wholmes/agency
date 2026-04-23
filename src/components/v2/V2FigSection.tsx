"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Isometric wireframe SVGs — hand-coded to match Linear's "FIG 0.x" aesthetic
// Thin white strokes on dark, 3D extruded feel

function IsoStackedLayers() {
  // Stacked flat layers — represents DataLayer Tracker / analytics layers
  const W = 160;
  const H = 140;
  const layers = [
    { y: 0, opacity: 0.5 },
    { y: 16, opacity: 0.35 },
    { y: 32, opacity: 0.2 },
  ];
  // Iso projection for a flat diamond
  const top = (cx: number, cy: number, w: number, h: number) => {
    const hw = w / 2, hh = h / 4;
    return `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;
  };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      {layers.map((l, i) => (
        <g key={i} transform={`translate(0, ${l.y})`} opacity={l.opacity + (i === 0 ? 0.15 : 0)}>
          <polygon
            points={top(80, 50, 110, 54)}
            stroke="white"
            strokeWidth="0.7"
            fill="none"
          />
          {/* Left face */}
          <polygon
            points={`25,77 25,${77 + 18} 80,${68 + 18} 80,68`}
            stroke="white"
            strokeWidth="0.7"
            fill="rgba(255,255,255,0.02)"
          />
          {/* Right face */}
          <polygon
            points={`135,77 135,${77 + 18} 80,${68 + 18} 80,68`}
            stroke="white"
            strokeWidth="0.7"
            fill="rgba(255,255,255,0.015)"
          />
        </g>
      ))}
      {/* Accent stripe on top layer */}
      <line x1="46" y1="50" x2="114" y2="50" stroke="rgba(201,165,90,0.4)" strokeWidth="0.8" strokeDasharray="4 3" />
    </svg>
  );
}

function IsoModularBlocks() {
  // 3 cubes arranged — Blueprint / modular toolkit
  const cube = (ox: number, oy: number, s: number, bright: number) => {
    const top = `${ox},${oy} ${ox + s},${oy + s * 0.5} ${ox},${oy + s} ${ox - s},${oy + s * 0.5}`;
    const left = `${ox - s},${oy + s * 0.5} ${ox},${oy + s} ${ox},${oy + s * 1.5} ${ox - s},${oy + s}`;
    const right = `${ox + s},${oy + s * 0.5} ${ox},${oy + s} ${ox},${oy + s * 1.5} ${ox + s},${oy + s}`;
    return (
      <g key={`${ox}-${oy}`}>
        <polygon points={top} stroke="white" strokeWidth="0.65" fill="rgba(255,255,255,0.03)" opacity={bright} />
        <polygon points={left} stroke="white" strokeWidth="0.65" fill="rgba(255,255,255,0.015)" opacity={bright} />
        <polygon points={right} stroke="white" strokeWidth="0.65" fill="rgba(255,255,255,0.02)" opacity={bright * 0.8} />
      </g>
    );
  };
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
      {cube(80, 10, 28, 0.9)}
      {cube(46, 38, 28, 0.6)}
      {cube(114, 38, 28, 0.55)}
    </svg>
  );
}

function IsoFanStack() {
  // Fanned stacked cards — represents Arcade / game library
  const card = (i: number) => {
    const x = 40 + i * 10;
    const y = 20 + i * 12;
    const w = 80 - i * 6;
    const h = 54 - i * 5;
    const r = 3;
    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        stroke="white"
        strokeWidth="0.65"
        fill="rgba(255,255,255,0.02)"
        opacity={1 - i * 0.18}
      />
    );
  };
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
      {[4, 3, 2, 1, 0].map((i) => card(i))}
      {/* Dot detail on top card */}
      <circle cx="55" cy="37" r="3" stroke="rgba(201,165,90,0.5)" strokeWidth="0.7" fill="none" />
      <line x1="64" y1="37" x2="108" y2="37" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <line x1="64" y1="43" x2="95" y2="43" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
    </svg>
  );
}

const FIGS = [
  {
    num: "FIG 0.2",
    title: "Built for purpose",
    body: "Every project starts with strategy. We define objectives, audiences, and outcomes before a single line of code.",
    Illustration: IsoStackedLayers,
  },
  {
    num: "FIG 0.3",
    title: "Modular by design",
    body: "Systems built to scale. From analytics frameworks to design systems — composable, documented, yours to own.",
    Illustration: IsoModularBlocks,
  },
  {
    num: "FIG 0.4",
    title: "Shipped with speed",
    body: "14-day delivery cycles, Lighthouse ≥ 90, zero technical debt hand-offs. Fast without cutting corners.",
    Illustration: IsoFanStack,
  },
];

export default function V2FigSection() {
  return (
    <section className="relative z-10 -mt-32 bg-[#080808]">
      {/* Top fade — blends up into the hero panel's dissolve */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, #080808 0%, transparent 100%)" }}
      />
      <div className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-[1280px] px-8 pb-24 pt-20 md:px-16">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {FIGS.map((fig, i) => (
              <motion.div
                key={fig.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              >
                {/* Fig label */}
                <p className="mb-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/15">
                  {fig.num}
                </p>

                {/* Isometric illustration */}
                <div className="mb-10 flex items-center justify-start">
                  <fig.Illustration />
                </div>

                {/* Title */}
                <h3 className="mb-3 font-body text-[15px] font-medium text-white/80">
                  {fig.title}
                </h3>

                {/* Body */}
                <p className="text-[13px] leading-relaxed text-white/30">
                  {fig.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
