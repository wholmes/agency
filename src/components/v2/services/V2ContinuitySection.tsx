"use client";

import { motion } from "framer-motion";
import type { ServicesContinuityIntro, ContinuityBlock } from "@prisma/client";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Isometric helpers (same as V2ProcessSection) ─────────────────────────────

function iso(ox: number, oy: number, r: number, l: number, u: number): [number, number] {
  return [ox + r * 8.66 - l * 8.66, oy + r * 5 + l * 5 - u * 10];
}
function pt(ox: number, oy: number, r: number, l: number, u: number): string {
  const [x, y] = iso(ox, oy, r, l, u);
  return `${x},${y}`;
}

function IsoBox({
  ox, oy, W, D, H,
  topFill = "rgba(255,255,255,0.07)",
  rightFill = "rgba(255,255,255,0.03)",
  leftFill = "rgba(255,255,255,0.05)",
  stroke = "rgba(255,255,255,0.55)",
  strokeWidth = 1.2,
  goldTop = false,
}: {
  ox: number; oy: number; W: number; D: number; H: number;
  topFill?: string; rightFill?: string; leftFill?: string;
  stroke?: string; strokeWidth?: number; goldTop?: boolean;
}) {
  const top = [pt(ox,oy,0,0,H), pt(ox,oy,W,0,H), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  const right = [pt(ox,oy,W,0,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,W,0,H)].join(" ");
  const left = [pt(ox,oy,0,D,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  return (
    <g>
      <polygon points={right} fill={rightFill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={left} fill={leftFill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={top} fill={goldTop ? "rgba(201,165,90,0.18)" : topFill} stroke={goldTop ? "rgba(201,165,90,0.8)" : stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

// ─── Continuity Icons — isometric ─────────────────────────────────────────────

// Retainer: iso calendar — a flat platform with repeating row slabs
function IsoRetainer() {
  const ox = 80; const oy = 74;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      {/* Base platform */}
      <IsoBox ox={ox} oy={oy} W={7} D={5} H={0.6} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.1} />
      {/* Four row slabs — week rows */}
      {[0,1,2,3].map((i) => {
        const [bx,by] = iso(ox, oy, 0.3, 0.3, 0.6 + i * 1.1);
        const isActive = i === 1;
        return (
          <IsoBox key={i} ox={bx} oy={by} W={6.4} D={4.4} H={0.7}
            goldTop={isActive}
            topFill={isActive ? "rgba(201,165,90,0.14)" : `rgba(255,255,255,${0.03 + i*0.01})`}
            stroke={isActive ? "rgba(201,165,90,0.75)" : "rgba(255,255,255,0.38)"}
            strokeWidth={isActive ? 1.3 : 1.0}
          />
        );
      })}
      {/* Header slab — top bar */}
      {(() => { const [bx,by] = iso(ox,oy, 0.3, 0.3, 0.6+4*1.1); return (
        <IsoBox ox={bx} oy={by} W={6.4} D={4.4} H={0.9} goldTop stroke="rgba(201,165,90,0.6)" strokeWidth={1.1} topFill="rgba(201,165,90,0.08)" />
      );})()} 
      {/* Accent dot on active row */}
      {(() => { const [cx,cy] = iso(ox,oy, 1, 1, 0.6+1.1+0.7); return (
        <circle cx={cx} cy={cy} r="2.5" fill="rgba(201,165,90,0.65)" />
      );})()} 
    </svg>
  );
}

// Support: iso server rack — stacked slabs with status light
function IsoSupport() {
  const ox = 80; const oy = 80;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      {/* Server rack body — tall back */}
      <IsoBox ox={ox} oy={oy} W={5} D={3} H={7} topFill="rgba(255,255,255,0.05)" rightFill="rgba(255,255,255,0.02)" leftFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.3} />
      {/* Three drive slabs */}
      {[1,3,5].map((u, i) => {
        const [bx,by] = iso(ox,oy, 0.3, 2.8, u);
        const isActive = i === 1;
        return (
          <IsoBox key={u} ox={bx} oy={by} W={4.4} D={0.15} H={1.5}
            goldTop={isActive}
            topFill={isActive ? "rgba(201,165,90,0.12)" : "rgba(255,255,255,0.04)"}
            stroke={isActive ? "rgba(201,165,90,0.7)" : "rgba(255,255,255,0.35)"}
            strokeWidth={isActive ? 1.2 : 0.9}
          />
        );
      })}
      {/* Status indicator lights on right face */}
      {[1.5, 3.5, 5.5].map((u, i) => {
        const [cx,cy] = iso(ox,oy, 5, 0.3, u);
        const colors = ["rgba(80,200,80,0.8)", "rgba(201,165,90,0.8)", "rgba(80,200,80,0.6)"];
        return <circle key={u} cx={cx} cy={cy} r="2" fill={colors[i]} />;
      })}
    </svg>
  );
}

// Growth Loop: iso stepped ramp — ascending blocks in a loop shape
function IsoGrowthLoop() {
  const ox = 80; const oy = 75;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      {/* Rising step blocks — clockwise loop */}
      {[
        { r:0,   l:4,   W:2, D:2, H:1,   gold:false },
        { r:2,   l:3,   W:2, D:2, H:2,   gold:false },
        { r:4,   l:2,   W:2, D:2, H:3,   gold:false },
        { r:4,   l:0,   W:2, D:2, H:4,   gold:true  },
        { r:2,   l:-0.5,W:2, D:2, H:3,   gold:false },
        { r:0,   l:-1,  W:2, D:2, H:2,   gold:false },
      ].map(({ r, l, W, D, H, gold }, i) => {
        const [bx,by] = iso(ox, oy, r, l, 0);
        return (
          <IsoBox key={i} ox={bx} oy={by} W={W} D={D} H={H}
            goldTop={gold}
            topFill={gold ? "rgba(201,165,90,0.18)" : "rgba(255,255,255,0.06)"}
            rightFill={gold ? "rgba(201,165,90,0.07)" : "rgba(255,255,255,0.02)"}
            leftFill={gold ? "rgba(201,165,90,0.1)" : "rgba(255,255,255,0.04)"}
            stroke={gold ? "rgba(201,165,90,0.85)" : "rgba(255,255,255,0.42)"}
            strokeWidth={gold ? 1.3 : 1.1}
          />
        );
      })}
      {/* Apex dot */}
      {(() => { const [cx,cy] = iso(ox,oy, 5, 1, 4); return (
        <circle cx={cx} cy={cy} r="3" fill="rgba(201,165,90,0.7)" />
      );})()} 
    </svg>
  );
}

const BLOCK_ICONS = [IsoRetainer, IsoSupport, IsoGrowthLoop];

export default function V2ContinuitySection({
  intro,
  blocks,
}: {
  intro: ServicesContinuityIntro;
  blocks: ContinuityBlock[];
}) {
  return (
    <section aria-labelledby="continuity-heading" className="border-t border-white/[0.05] bg-[#0e0e0e]">
      <div className="mx-auto max-w-[1280px] px-8 py-16 md:px-16 md:py-20">

        {/* Intro — matches ProcessRow label style */}
        <motion.div
          className="mb-12 flex items-center gap-6 border-b border-white/[0.05] pb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              {intro.overline}
            </p>
            <motion.h2
              id="continuity-heading"
              className="font-display text-[clamp(2rem,4vw,4rem)] font-light leading-[0.93] tracking-[-0.03em] text-white"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              {intro.heading}
            </motion.h2>
          </div>
          <div className="hidden h-px flex-1 bg-white/[0.05] md:block" />
          {intro.body && (
            <motion.p
              className="hidden max-w-[320px] shrink-0 text-[13px] leading-relaxed text-white/35 md:block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              {intro.body}
            </motion.p>
          )}
        </motion.div>

        {/* 3-col icon grid — same as TimelineRow in V2ProcessSection */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {blocks.map((block, i) => {
            const Icon = BLOCK_ICONS[i % BLOCK_ICONS.length];
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="relative flex items-start gap-5"
              >
                {/* Step number */}
                <div className="shrink-0 pt-1">
                  <span className="font-mono text-[11px] text-white/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Icon + text */}
                <div className="flex flex-col">
                  <div className="mb-4 opacity-80">
                    <Icon />
                  </div>
                  <h3 className="mb-1.5 font-body text-[14px] font-semibold text-white/75">
                    {block.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-white/30">
                    {block.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
