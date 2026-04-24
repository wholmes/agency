"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { IconArrowUpRight } from "@/components/icons";
import V2CapabilitiesStrip from "@/components/v2/services/V2CapabilitiesStrip";
import type { Capability } from "@prisma/client";

const PanelSkeleton = () => <div className="h-full w-full min-h-[420px] bg-[#131313]" />;

const StudioDashboardPanel = dynamic(() => import("@/components/v2/panels/StudioDashboardPanel"), { ssr: false, loading: () => <PanelSkeleton /> });
const BrandStrategyPanel   = dynamic(() => import("@/components/v2/panels/BrandStrategyPanel"),   { ssr: false, loading: () => <PanelSkeleton /> });
const MessagingPanel       = dynamic(() => import("@/components/v2/panels/MessagingPanel"),       { ssr: false, loading: () => <PanelSkeleton /> });
const AnalyticsPanel       = dynamic(() => import("@/components/v2/panels/AnalyticsPanel"),       { ssr: false, loading: () => <PanelSkeleton /> });
const TagManagerPanel      = dynamic(() => import("@/components/v2/panels/TagManagerPanel"),      { ssr: false, loading: () => <PanelSkeleton /> });
const KanbanPanel          = dynamic(() => import("@/components/v2/panels/KanbanPanel"),          { ssr: false, loading: () => <PanelSkeleton /> });
const BlueprintPanel       = dynamic(() => import("@/components/v2/panels/BlueprintPanel"),       { ssr: false, loading: () => <PanelSkeleton /> });

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Isometric helpers ─────────────────────────────────────────────────────

function pt(ox: number, oy: number, r: number, l: number, u: number): string {
  const x = ox + r * 8.66 - l * 8.66;
  const y = oy + r * 5 + l * 5 - u * 10;
  return `${x},${y}`;
}

function IsoBox({
  ox, oy, W, D, H,
  topFill = "rgba(255,255,255,0.07)",
  rightFill = "rgba(255,255,255,0.03)",
  leftFill = "rgba(255,255,255,0.05)",
  stroke = "rgba(255,255,255,0.5)",
  strokeWidth = 1.2,
  goldTop = false,
}: {
  ox: number; oy: number; W: number; D: number; H: number;
  topFill?: string; rightFill?: string; leftFill?: string;
  stroke?: string; strokeWidth?: number; goldTop?: boolean;
}) {
  const top   = [pt(ox,oy,0,0,H), pt(ox,oy,W,0,H), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  const right = [pt(ox,oy,W,0,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,W,0,H)].join(" ");
  const left  = [pt(ox,oy,0,D,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  const tFill = goldTop ? "rgba(201,165,90,0.2)" : topFill;
  const tStroke = goldTop ? "rgba(201,165,90,0.85)" : stroke;
  return (
    <g>
      <polygon points={right} fill={rightFill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={left}  fill={leftFill}  stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={top}   fill={tFill}     stroke={tStroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

function iso(ox: number, oy: number, r: number, l: number, u: number): [number, number] {
  return [ox + r * 8.66 - l * 8.66, oy + r * 5 + l * 5 - u * 10];
}

// ─── Web Services process icons ────────────────────────────────────────────

// Step 1 — Discovery & Moodboard: stacked image frames as iso slabs
function IsoDiscovery() {
  const ox = 80; const oy = 72;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      <IsoBox ox={ox} oy={oy} W={6} D={5} H={1} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      <IsoBox ox={ox} oy={oy} W={2} D={5} H={3} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      <IsoBox ox={ox + 8.66*2} oy={oy + 5} W={2} D={5} H={4} topFill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      <IsoBox ox={ox + 8.66*4} oy={oy + 10} W={2} D={5} H={5} goldTop stroke="rgba(201,165,90,0.7)" strokeWidth={1.2} />
      <IsoBox ox={ox + 8.66*5} oy={oy + 10 - 50 + 8} W={1} D={1} H={1} goldTop stroke="rgba(201,165,90,0.9)" strokeWidth={1} />
    </svg>
  );
}

// Step 2 — Wireframe & Prototype: iso monitor/screen with layout lines
function IsoWireframeStep() {
  const ox = 78; const oy = 78;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      <IsoBox ox={ox} oy={oy} W={7} D={1} H={5} topFill="rgba(255,255,255,0.05)" rightFill="rgba(255,255,255,0.02)" leftFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.55)" strokeWidth={1.3} />
      {[1,2,3].map((u) => {
        const [x1,y1] = iso(ox,oy,0.3,1,u);
        const [x2,y2] = iso(ox,oy,6.7,1,u);
        return <line key={u} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />;
      })}
      {(() => { const [x1,y1]=iso(ox,oy,1,1,4); const [x2,y2]=iso(ox,oy,5,1,4); return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,165,90,0.6)" strokeWidth="1" />; })()}
      <IsoBox ox={ox + 8.66*3} oy={oy + 5*3} W={1} D={1} H={1} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
    </svg>
  );
}

// Step 3 — Build & Ship: nested component blocks with gold cap
function IsoBuildShip() {
  const ox = 80; const oy = 75;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      <IsoBox ox={ox} oy={oy} W={6} D={4} H={2} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.2} />
      {(() => { const [bx,by]=iso(ox,oy,0,0,2); return (
        <IsoBox ox={bx} oy={by} W={3} D={4} H={2} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.1} />
      );})()} 
      {(() => { const [bx,by]=iso(ox,oy,0,0,4); return (
        <IsoBox ox={bx} oy={by} W={2} D={2} H={2} goldTop stroke="rgba(201,165,90,0.8)" strokeWidth={1.2} />
      );})()} 
      {(() => { const [cx,cy]=iso(ox,oy,1,1,4); return <circle cx={cx} cy={cy} r="2.5" fill="rgba(201,165,90,0.5)" />; })()}
    </svg>
  );
}

const WEB_PROCESS_STEPS = [
  {
    Icon: IsoDiscovery,
    heading: "Discovery & Moodboard",
    body: "We audit your brand, competitive set, and audience. Visual directions emerge from research, not guesswork.",
  },
  {
    Icon: IsoWireframeStep,
    heading: "Wireframe & Prototype",
    body: "Every layout is logic before it's aesthetic. We map information hierarchy, user flows, and conversion moments.",
  },
  {
    Icon: IsoBuildShip,
    heading: "Build & Ship",
    body: "Atomic components in Next.js, typed and tested. Lighthouse ≥ 90 and full codebase handoff on every project.",
  },
];

function WebProcessSection() {
  return (
    <section className="relative border-t border-white/[0.05] py-24">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
        {/* Label row */}
        <motion.div
          className="mb-10 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">How we build it</p>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </motion.div>

        {/* 3-col timeline */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {WEB_PROCESS_STEPS.map(({ Icon, heading, body }, si) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: si * 0.1, ease: EASE }}
              className="relative flex items-start gap-5"
            >
              {/* Step number */}
              <div className="shrink-0 pt-1">
                <span className="font-mono text-[11px] text-white/35">{String(si + 1).padStart(2, "0")}</span>
              </div>
              {/* Icon + text */}
              <div className="flex flex-col">
                <div className="mb-4 opacity-80">
                  <Icon />
                </div>
                <h3 className="mb-1.5 font-body text-[14px] font-semibold text-white/75">{heading}</h3>
                <p className="text-[12px] leading-relaxed text-white/30">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Strategy process ────────────────────────────────────────────────

// Step 1 — Brand Audit: stacked doc slabs with checkmark
function IsoBrandAudit() {
  const ox = 80; const oy = 80;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      {[0,1,2,3].map((i) => {
        const [bx,by] = iso(ox,oy, i*0.3, i*0.3, i*0.8);
        const isTop = i === 3;
        return (
          <IsoBox key={i} ox={bx} oy={by} W={5} D={3.5} H={0.6}
            goldTop={isTop}
            topFill={isTop ? "rgba(201,165,90,0.1)" : `rgba(255,255,255,${0.03 + i*0.01})`}
            stroke={isTop ? "rgba(201,165,90,0.7)" : "rgba(255,255,255,0.4)"}
            strokeWidth={isTop ? 1.3 : 1.0}
          />
        );
      })}
      {(() => {
        const [cx,cy] = iso(ox,oy, 1.5, 1.2, 3.2);
        return <polyline points={`${cx-6},${cy} ${cx-2},${cy+4} ${cx+7},${cy-5}`} stroke="rgba(201,165,90,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      })()}
    </svg>
  );
}

// Step 2 — Positioning Map: 2×2 matrix with competitor dots and gold "Us" pin
function IsoPositioningMap() {
  const ox = 80; const oy = 80;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      <IsoBox ox={ox} oy={oy} W={3} D={3} H={0.5} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.1} />
      <IsoBox ox={iso(ox,oy,3,0,0)[0]} oy={iso(ox,oy,3,0,0)[1]} W={3} D={3} H={0.5} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.1} />
      <IsoBox ox={iso(ox,oy,0,3,0)[0]} oy={iso(ox,oy,0,3,0)[1]} W={3} D={3} H={0.5} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.1} />
      <IsoBox ox={iso(ox,oy,3,3,0)[0]} oy={iso(ox,oy,3,3,0)[1]} W={3} D={3} H={0.5} goldTop stroke="rgba(201,165,90,0.7)" strokeWidth={1.2} />
      {([[1.5,1.5],[4.5,1.5],[1.5,4.5]] as [number,number][]).map(([r,l],i) => {
        const [cx,cy] = iso(ox,oy,r,l,0.5);
        return <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />;
      })}
      {(() => {
        const [bx,by] = iso(ox,oy,4,4,0.5);
        const [cx,cy] = iso(ox,oy,4.5,4.5,0.5);
        return (<>
          <IsoBox ox={bx} oy={by} W={1} D={1} H={2} goldTop stroke="rgba(201,165,90,0.9)" strokeWidth={1.3} />
          <circle cx={cx} cy={cy-20} r="3.5" fill="rgba(201,165,90,0.7)" />
        </>);
      })()}
    </svg>
  );
}

// Step 3 — Voice & Messaging: staggered message slabs with gold top layer
function IsoVoiceMessaging() {
  const ox = 80; const oy = 78;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      <IsoBox ox={ox} oy={oy} W={6} D={2} H={0.8} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.0} />
      {(() => { const [bx,by]=iso(ox,oy,-0.5,0,1.2); return (
        <IsoBox ox={bx} oy={by} W={6} D={2} H={0.8} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      );})()} 
      {(() => { const [bx,by]=iso(ox,oy,-1,0,2.4); return (
        <IsoBox ox={bx} oy={by} W={6} D={2} H={0.8} goldTop stroke="rgba(201,165,90,0.75)" strokeWidth={1.2} />
      );})()} 
      {(() => {
        const [x1,y1]=iso(ox,oy,-0.8,0.3,3.2+0.8);
        const [x2,y2]=iso(ox,oy,2.5,0.3,3.2+0.8);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,165,90,0.9)" strokeWidth="1.2" strokeLinecap="round" />;
      })()}
    </svg>
  );
}

const BRAND_PROCESS_STEPS = [
  {
    Icon: IsoBrandAudit,
    heading: "Brand Audit",
    body: "We map every customer touchpoint and grade it against your positioning promises. Gaps become the brief.",
  },
  {
    Icon: IsoPositioningMap,
    heading: "Positioning Map",
    body: "We plot you against competitors across dimensions that matter to your buyers, then find the defensible white space.",
  },
  {
    Icon: IsoVoiceMessaging,
    heading: "Voice & Messaging",
    body: "Tone of voice, key messages, and a copy framework your whole team can use — from homepage to cold email.",
  },
];

function BrandProcessSection() {
  return (
    <section className="relative border-t border-white/[0.05] py-24">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
        <motion.div
          className="mb-10 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">How we work</p>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BRAND_PROCESS_STEPS.map(({ Icon, heading, body }, si) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: si * 0.1, ease: EASE }}
              className="relative flex items-start gap-5"
            >
              <div className="shrink-0 pt-1">
                <span className="font-mono text-[11px] text-white/35">{String(si + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 opacity-80"><Icon /></div>
                <h3 className="mb-1.5 font-body text-[14px] font-semibold text-white/75">{heading}</h3>
                <p className="text-[12px] leading-relaxed text-white/30">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Analytics & Growth process ────────────────────────────────────────────

// Step 1 — Conversion Tracking: narrowing funnel blocks
function IsoFunnelLocal() {
  const ox = 80; const oy = 68;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      {([
        { W:6, D:4, H:1.2, gold:false },
        { W:5, D:3.5, H:1.2, gold:false },
        { W:4, D:3, H:1.2, gold:false },
        { W:2.5, D:2, H:1.5, gold:true },
      ] as {W:number;D:number;H:number;gold:boolean}[]).reduce<{ layers: React.ReactNode[]; curY: number }>((acc, { W, D, H, gold }, i) => {
        const bx = ox - W*8.66/2;
        acc.layers.push(
          <IsoBox key={i} ox={bx} oy={acc.curY} W={W} D={D} H={H}
            goldTop={gold}
            topFill={gold ? "rgba(201,165,90,0.15)" : `rgba(255,255,255,${0.04+i*0.01})`}
            stroke={gold ? "rgba(201,165,90,0.85)" : "rgba(255,255,255,0.45)"}
            strokeWidth={gold ? 1.3 : 1.1}
          />
        );
        acc.curY = iso(bx, acc.curY, 0, 0, H)[1];
        return acc;
      }, { layers: [], curY: oy }).layers}
    </svg>
  );
}

// Step 2 — Growth Modelling: isometric bar chart
function IsoBarChart() {
  const ox = 80; const oy = 80;
  const bars = [1.5, 2.5, 3.5, 5, 4];
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      <IsoBox ox={ox} oy={oy} W={bars.length*1.6} D={3} H={0.4} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.0} />
      {bars.map((h, i) => {
        const isGold = h === Math.max(...bars);
        const [bx,by] = iso(ox, oy, i*1.6 + 0.3, 0.5, 0.4);
        return (
          <IsoBox key={i} ox={bx} oy={by} W={1} D={2} H={h}
            goldTop={isGold}
            topFill={isGold ? "rgba(201,165,90,0.2)" : "rgba(255,255,255,0.07)"}
            rightFill={isGold ? "rgba(201,165,90,0.08)" : "rgba(255,255,255,0.03)"}
            leftFill={isGold ? "rgba(201,165,90,0.05)" : "rgba(255,255,255,0.05)"}
            stroke={isGold ? "rgba(201,165,90,0.85)" : "rgba(255,255,255,0.45)"}
            strokeWidth={isGold ? 1.3 : 1.1}
          />
        );
      })}
    </svg>
  );
}

// Step 3 — Behaviour Analysis: isometric heatmap grid
function IsoHeatmapLocal() {
  const ox = 80; const oy = 72;
  const opacities: number[][] = [
    [0.6,0.3,0.15,0.08],
    [0.4,0.7,0.55,0.2],
    [0.2,0.45,0.8,0.5],
    [0.1,0.15,0.3,0.4],
  ];
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none" aria-hidden="true">
      {opacities.map((row, ri) =>
        row.map((o, ci) => {
          const [bx,by] = iso(ox, oy, ci*1.5, ri*1.5, 0);
          const isHot = o >= 0.7;
          return (
            <IsoBox key={`${ri}-${ci}`} ox={bx} oy={by} W={1.4} D={1.4} H={o * 3}
              goldTop={isHot}
              topFill={`rgba(201,165,90,${o * 0.7})`}
              rightFill={`rgba(201,165,90,${o * 0.3})`}
              leftFill={`rgba(201,165,90,${o * 0.4})`}
              stroke={isHot ? "rgba(201,165,90,0.8)" : `rgba(255,255,255,${0.2 + o*0.3})`}
              strokeWidth={isHot ? 1.2 : 0.9}
            />
          );
        })
      )}
    </svg>
  );
}

const ANALYTICS_PROCESS_STEPS = [
  {
    Icon: IsoFunnelLocal,
    heading: "Conversion Tracking",
    body: "Every form, click, and scroll mapped to a business outcome. No vanity metrics — only events that drive decisions.",
  },
  {
    Icon: IsoBarChart,
    heading: "Growth Modelling",
    body: "We build dashboards that surface compounding trends early — before your team notices them in revenue.",
  },
  {
    Icon: IsoHeatmapLocal,
    heading: "Behaviour Analysis",
    body: "Heatmaps, session recordings, and drop-off maps — we trace the exact moment users lose confidence and fix it.",
  },
];

function AnalyticsProcessSection() {
  return (
    <section className="relative border-t border-white/[0.05] py-24">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
        <motion.div
          className="mb-10 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">How we track it</p>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ANALYTICS_PROCESS_STEPS.map(({ Icon, heading, body }, si) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: si * 0.1, ease: EASE }}
              className="relative flex items-start gap-5"
            >
              <div className="shrink-0 pt-1">
                <span className="font-mono text-[11px] text-white/35">{String(si + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 opacity-80"><Icon /></div>
                <h3 className="mb-1.5 font-body text-[14px] font-semibold text-white/75">{heading}</h3>
                <p className="text-[12px] leading-relaxed text-white/30">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



// ─── Section label row (matches v2 process style) ──────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{children}</span>
      <span className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

// ─── Who-for card ───────────────────────────────────────────────────────────

function WhoCard({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: EASE }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.05]"
    >
      <span className="absolute left-0 top-4 bottom-4 w-[2px] origin-center scale-y-0 rounded-full bg-[#c9a55a] transition-transform duration-300 group-hover:scale-y-100" />
      <div className="flex items-start gap-4">
        <span className="mt-[6px] size-1.5 shrink-0 rounded-full bg-[#c9a55a] opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
        <p className="text-sm leading-relaxed text-white/60">{text}</p>
      </div>
    </motion.div>
  );
}

// ─── Inclusion card ─────────────────────────────────────────────────────────

function InclusionCard({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: EASE }}
      className="group flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]"
    >
      <div className="mt-[3px] flex size-5 shrink-0 items-center justify-center rounded-full border border-[#c9a55a]/30 bg-[#c9a55a]/10 transition-colors duration-200 group-hover:border-[#c9a55a]/60 group-hover:bg-[#c9a55a]/15">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4l2 2 3-3" stroke="rgba(201,165,90,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-sm leading-relaxed text-white/70 transition-colors duration-200 group-hover:text-white/85">{text}</span>
    </motion.div>
  );
}

// ─── FAQ item ───────────────────────────────────────────────────────────────

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  return (
    <motion.details
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: EASE }}
      className="group border-b border-white/[0.06] py-6 transition-[border-color] duration-300 ease-out hover:border-white/[0.1]"
    >
      <summary className="relative flex cursor-pointer list-none items-center justify-between gap-6 rounded-xl py-2.5 pl-5 pr-2 -mx-2 select-none transition-[background-color,box-shadow] duration-300 ease-out hover:bg-white/[0.04] hover:shadow-[inset_0_0_0_1px_rgba(201,165,90,0.14),0_0_28px_-8px_rgba(201,165,90,0.12)] group-open:bg-white/[0.05] group-open:shadow-[inset_0_0_0_1px_rgba(201,165,90,0.18),0_0_32px_-6px_rgba(201,165,90,0.14)] [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute left-2 top-2.5 bottom-2.5 w-[2px] rounded-full bg-gradient-to-b from-[#c9a55a] via-[#c9a55a]/80 to-[#c9a55a]/15 opacity-0 shadow-[0_0_14px_rgba(201,165,90,0.45)] transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(201,165,90,0.55)] group-open:opacity-100"
        />
        <span className="relative z-[1] min-w-0 flex-1 font-body text-base font-medium leading-snug tracking-normal text-white/85 transition-colors duration-300 ease-out group-hover:text-white group-open:text-white">
          {question}
        </span>
        <span
          aria-hidden="true"
          className="relative z-[1] inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.02] font-mono text-lg font-light text-[#c9a55a] transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-[#c9a55a]/50 group-hover:bg-[#c9a55a]/12 group-hover:shadow-[0_0_18px_rgba(201,165,90,0.28)] group-open:rotate-45 group-open:border-[#c9a55a]/55 group-open:bg-[#c9a55a]/16 group-open:shadow-[0_0_22px_rgba(201,165,90,0.32)]"
        >
          +
        </span>
      </summary>
      <p className="mt-5 max-w-[640px] pl-3 text-sm leading-relaxed text-white/45 transition-colors duration-300 group-open:text-white/50">
        {answer}
      </p>
    </motion.details>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

export type ServiceDetailClientProps = {
  slug: string;
  heroOverline: string;
  heroTitle: string;
  heroBody: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  backLinkLabel: string;
  backLinkHref: string;
  whoForHeading: string;
  whoForBullets: string[];
  includedHeading: string;
  includedOverline: string;
  inclusions: string[];
  faqHeading: string;
  faqOverline: string;
  faqs: { question: string; answer: string }[];
  capabilities?: Capability[];
};

export default function ServiceDetailClient({
  slug,
  heroOverline,
  heroTitle,
  heroBody,
  primaryCtaLabel,
  primaryCtaHref,
  backLinkLabel,
  backLinkHref,
  whoForBullets,
  whoForHeading,
  includedHeading,
  includedOverline,
  inclusions,
  faqHeading,
  faqOverline,
  faqs,
  capabilities = [],
}: ServiceDetailClientProps) {

  return (
    <div className="relative min-h-screen bg-[#0e0e0e]">
      {/* Noise grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[calc(var(--nav-height)+5rem)]">
        {/* Gold radial bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-2/3"
          style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(201,165,90,0.07) 0%, transparent 60%)" }}
        />
        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-[1] mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
          <div className="relative grid grid-cols-1 items-start lg:grid-cols-[480px_1fr]">
            {/* Left — text */}
            <div className="relative z-10 pb-28 pt-0 lg:pr-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-8"
              >
                <Link
                  href={backLinkHref}
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 no-underline transition-colors duration-200 hover:text-white/60"
                >
                  ← {backLinkLabel}
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#c9a55a]/70"
              >
                {heroOverline}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
                className="font-display mb-6 text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-[0.96] tracking-[-0.03em] text-white"
              >
                {heroTitle}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
                className="mb-10 max-w-[440px] text-base leading-[1.7] text-white/50"
              >
                {heroBody}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[#c9a55a] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#0e0e0e] transition-all duration-300 hover:bg-[#d4b46a] hover:shadow-[0_8px_32px_rgba(201,165,90,0.25)]"
                >
                  {primaryCtaLabel}
                  <IconArrowUpRight size={13} />
                </Link>
              </motion.div>
            </div>

            {/* Right — studio dashboard panel, bleeds to viewport right edge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="relative hidden lg:block"
            >
              {/* Gold hairline above panel */}
              <div className="relative mb-0">
                <div className="h-px bg-white/[0.06]" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.2) 50%, transparent 100%)" }}
                />
              </div>
              {/* Panel — overflows right beyond the container */}
              <div
                className="relative overflow-hidden rounded-tl-2xl border-l border-t border-white/[0.08] shadow-[0_-20px_80px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]"
                style={{ marginRight: "calc(-50vw + 50%)" }}
              >
                <div className="h-[460px]">
                  {slug === "brand-strategy" ? <BrandStrategyPanel /> : slug === "analytics-integration" ? <AnalyticsPanel /> : <StudioDashboardPanel />}
                </div>
                {/* Fade bottom */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
                  style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
                />
                {/* Fade right edge */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 right-0 bottom-0 w-32"
                  style={{ background: "linear-gradient(to left, #0e0e0e 0%, transparent 100%)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Web process steps (web-design only) ──────────────────────────── */}
      {slug === "web-design" && <WebProcessSection />}

      {/* ── Brand process steps (brand-strategy only) ─────────────────────── */}
      {slug === "brand-strategy" && <BrandProcessSection />}

      {/* ── Analytics process steps (analytics-integration only) ──────────── */}
      {slug === "analytics-integration" && <AnalyticsProcessSection />}

      {/* ── Capabilities strip (web-design + analytics-integration) ─────────── */}
      {capabilities.length > 0 && <V2CapabilitiesStrip capabilities={capabilities} />}

      {/* ── Kanban panel breakout (web-design only) ───────────────────────── */}
      {slug === "web-design" && (
        <motion.section
          className="relative border-t border-white/[0.05]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Gold hairline glow */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.25) 40%, rgba(201,165,90,0.25) 60%, transparent 100%)" }}
            />
          </div>

          {/* Panel container — full width, bleeds edge to edge */}
          <div className="relative mx-8 md:mx-16">
            {/* Main panel — KanbanPanel */}
            <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] shadow-[0_-20px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="h-[520px] md:h-[580px]">
                <KanbanPanel />
              </div>
              {/* Bottom fade */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
                style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
              />
            </div>

            {/* Floating BlueprintPanel overlay */}
            <motion.div
              className="pointer-events-none absolute right-[3%] top-[160px] hidden w-[40%] overflow-hidden rounded-xl border border-white/[0.1] md:block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.4, ease: EASE }}
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              {/* Specular top edge */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(201,165,90,0.12) 60%, transparent 100%)" }}
              />
              <div className="h-[300px] md:h-[340px]">
                <BlueprintPanel />
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ── MessagingPanel breakout (brand-strategy only) ─────────────────── */}
      {slug === "brand-strategy" && (
        <motion.section
          className="relative border-t border-white/[0.05]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.25) 40%, rgba(201,165,90,0.25) 60%, transparent 100%)" }}
          />
          <div className="relative mx-8 md:mx-16">
            {/* Main panel — BrandStrategyPanel full-width */}
            <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] shadow-[0_-20px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="h-[520px] md:h-[580px]">
                <BrandStrategyPanel />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
                style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
              />
            </div>
            {/* Floating MessagingPanel overlay */}
            <motion.div
              className="pointer-events-none absolute right-[3%] top-[140px] hidden w-[38%] overflow-hidden rounded-xl border border-white/[0.1] md:block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.4, ease: EASE }}
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(201,165,90,0.12) 60%, transparent 100%)" }}
              />
              <div className="h-[300px] md:h-[340px]">
                <MessagingPanel />
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ── TerminalPanel breakout (analytics-integration only) ────────────── */}
      {slug === "analytics-integration" && (
        <motion.section
          className="relative border-t border-white/[0.05]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.25) 40%, rgba(201,165,90,0.25) 60%, transparent 100%)" }}
          />
          <div className="relative mx-8 md:mx-16">
            {/* Main panel — AnalyticsPanel full-width */}
            <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] shadow-[0_-20px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="h-[520px] md:h-[580px]">
                <AnalyticsPanel />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
                style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
              />
            </div>
            {/* Floating TerminalPanel overlay */}
            <motion.div
              className="pointer-events-none absolute right-[3%] top-[120px] hidden w-[42%] overflow-hidden rounded-xl border border-white/[0.1] md:block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.4, ease: EASE }}
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(201,165,90,0.12) 60%, transparent 100%)" }}
              />
              <div className="h-[320px] md:h-[360px]">
                <TagManagerPanel />
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ── Who it's for ──────────────────────────────────────────────────── */}
      {whoForBullets.length > 0 && (
        <section className="relative border-t border-white/[0.05] py-24">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
            <SectionLabel>{whoForHeading || "Right for you if"}</SectionLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {whoForBullets.map((item, i) => (
                <WhoCard key={i} text={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── What's included ───────────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.05] py-24">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
          <SectionLabel>{includedOverline || "Scope"}</SectionLabel>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-display mb-12 max-w-[560px] text-[clamp(1.6rem,3.5vw,2.8rem)] font-light leading-[1.05] tracking-[-0.025em] text-white"
          >
            {includedHeading}
          </motion.h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inclusions.map((item, i) => (
              <InclusionCard key={i} text={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="relative border-t border-white/[0.05] py-24">
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
            <SectionLabel>{faqOverline || "FAQ"}</SectionLabel>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-display mb-12 text-[clamp(1.6rem,3.5vw,2.8rem)] font-light leading-[1.05] tracking-[-0.025em] text-white"
            >
              {faqHeading}
            </motion.h2>

            <div className="max-w-[760px]">
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
