"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Isometric helpers ────────────────────────────────────────────────────────
// All icons use true isometric projection:
//   right-x:  (+cos30°, +sin30°) = (+0.866, +0.5) per unit
//   left-x:   (-0.866,  +0.5)    per unit
//   y (up):   (0, -1)            per unit
// Each unit = 10px. Origin placed at visual centre of each icon.

// Convert isometric (r, l, u) offsets from an origin (ox, oy) to SVG x,y
// r = steps right-face, l = steps left-face, u = steps up
function iso(ox: number, oy: number, r: number, l: number, u: number): [number, number] {
  return [ox + r * 8.66 - l * 8.66, oy + r * 5 + l * 5 - u * 10];
}
function pt(ox: number, oy: number, r: number, l: number, u: number): string {
  const [x, y] = iso(ox, oy, r, l, u);
  return `${x},${y}`;
}

// Draw a solid isometric box (W wide, D deep, H tall) from its front-bottom corner
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
  // Top face: (0,0,H) → (W,0,H) → (W,D,H) → (0,D,H)
  const top = [pt(ox,oy,0,0,H), pt(ox,oy,W,0,H), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  // Right face: (W,0,0) → (W,D,0) → (W,D,H) → (W,0,H)
  const right = [pt(ox,oy,W,0,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,W,0,H)].join(" ");
  // Left face: (0,D,0) → (W,D,0) → (W,D,H) → (0,D,H)
  const left = [pt(ox,oy,0,D,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  return (
    <g>
      <polygon points={right} fill={rightFill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={left} fill={leftFill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={top} fill={goldTop ? "rgba(201,165,90,0.18)" : topFill} stroke={goldTop ? "rgba(201,165,90,0.8)" : stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

// ─── Design Process Icons ─────────────────────────────────────────────────────

// Moodboard: stacked image frames as iso slabs
function IsoMoodboard() {
  const ox = 80; const oy = 72;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Base platform */}
      <IsoBox ox={ox} oy={oy} W={6} D={5} H={1} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      {/* Three image slabs side by side */}
      <IsoBox ox={ox} oy={oy} W={2} D={5} H={3} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      <IsoBox ox={ox + 8.66*2} oy={oy + 5} W={2} D={5} H={4} topFill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      <IsoBox ox={ox + 8.66*4} oy={oy + 10} W={2} D={5} H={5} goldTop topFill="rgba(201,165,90,0.15)" stroke="rgba(201,165,90,0.7)" strokeWidth={1.2} />
      {/* Small accent cube on tallest */}
      <IsoBox ox={ox + 8.66*5} oy={oy + 10 - 50 + 8} W={1} D={1} H={1} goldTop stroke="rgba(201,165,90,0.9)" strokeWidth={1} />
    </svg>
  );
}

// Wireframe: iso monitor/screen
function IsoWireframe() {
  const ox = 78; const oy = 78;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Screen body */}
      <IsoBox ox={ox} oy={oy} W={7} D={1} H={5} topFill="rgba(255,255,255,0.05)" rightFill="rgba(255,255,255,0.02)" leftFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.55)" strokeWidth={1.3} />
      {/* Screen face — front panel detail lines */}
      {[1,2,3].map((u) => {
        const [x1,y1] = iso(ox,oy,0.3,1,u);
        const [x2,y2] = iso(ox,oy,6.7,1,u);
        return <line key={u} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />;
      })}
      {/* Gold highlight line near top */}
      {(() => { const [x1,y1]=iso(ox,oy,1,1,4); const [x2,y2]=iso(ox,oy,5,1,4); return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,165,90,0.6)" strokeWidth="1" />; })()}
      {/* Stand base */}
      <IsoBox ox={ox + 8.66*3} oy={oy + 5*3} W={1} D={1} H={1} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
    </svg>
  );
}

// Design System: iso token swatch tower
function IsoTypography() {
  const ox = 80; const oy = 80;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Four stacked colour slabs — type scale */}
      <IsoBox ox={ox} oy={oy} W={5} D={3} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.1} />
      <IsoBox ox={ox} oy={oy} W={4} D={3} H={1} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      {/* Shift up one unit */}
      {(() => { const [bx,by]=iso(ox,oy,0,0,1); return (
        <>
          <IsoBox ox={bx} oy={by} W={3} D={3} H={1} topFill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
          {(() => { const [cx,cy]=iso(bx,by,0,0,1); return (
            <IsoBox ox={cx} oy={cy} W={2} D={3} H={1} goldTop stroke="rgba(201,165,90,0.8)" strokeWidth={1.3} />
          );})()} 
          {(() => { const [cx,cy]=iso(bx,by,0,0,2); return (
            <IsoBox ox={cx} oy={cy} W={1} D={3} H={1} goldTop stroke="rgba(201,165,90,0.9)" strokeWidth={1.2} />
          );})()} 
        </>
      );})()} 
    </svg>
  );
}

// ─── Development Process Icons ────────────────────────────────────────────────

// Component Architecture: iso building blocks (nested cubes)
function IsoComponentTree() {
  const ox = 80; const oy = 75;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Large base block */}
      <IsoBox ox={ox} oy={oy} W={6} D={4} H={2} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.2} />
      {/* Medium block on top-left */}
      {(() => { const [bx,by]=iso(ox,oy,0,0,2); return (
        <IsoBox ox={bx} oy={by} W={3} D={4} H={2} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.1} />
      );})()} 
      {/* Small gold block on top of medium */}
      {(() => { const [bx,by]=iso(ox,oy,0,0,4); return (
        <IsoBox ox={bx} oy={by} W={2} D={2} H={2} goldTop stroke="rgba(201,165,90,0.8)" strokeWidth={1.2} />
      );})()} 
      {/* Connector dot */}
      {(() => { const [cx,cy]=iso(ox,oy,1,1,4); return <circle cx={cx} cy={cy} r="2.5" fill="rgba(201,165,90,0.5)" />; })()}
    </svg>
  );
}

// CI/CD Pipeline: iso conveyor/steps
function IsoBuildPipeline() {
  const ox = 80; const oy = 72;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* 4 pipeline stage blocks at increasing heights */}
      {[0,1,2,3].map((i) => {
        const [bx,by] = iso(ox,oy, i*2, i*1.5, i);
        const isLast = i === 3;
        return (
          <IsoBox key={i} ox={bx} oy={by} W={1.5} D={1.5} H={1.5}
            goldTop={isLast}
            topFill={isLast ? "rgba(201,165,90,0.15)" : "rgba(255,255,255,0.06)"}
            stroke={isLast ? "rgba(201,165,90,0.8)" : "rgba(255,255,255,0.45)"}
            strokeWidth={isLast ? 1.3 : 1.1}
          />
        );
      })}
      {/* Connecting dashed lines between blocks */}
      {[0,1,2].map((i) => {
        const [x1,y1] = iso(ox,oy, i*2+1.5, i*1.5+0.75, i+0.75);
        const [x2,y2] = iso(ox,oy, (i+1)*2, (i+1)*1.5, i+1+0.75);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="3 2" />;
      })}
    </svg>
  );
}

// Performance: iso speedometer dial as layered rings
function IsoPerformance() {
  const ox = 80; const oy = 82;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Concentric iso ring platforms */}
      <IsoBox ox={ox} oy={oy} W={7} D={5} H={1} topFill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.0} />
      {(() => { const [bx,by]=iso(ox,oy,1,0.5,1); return (
        <IsoBox ox={bx} oy={by} W={5} D={4} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.1} />
      );})()} 
      {(() => { const [bx,by]=iso(ox,oy,2,1,2); return (
        <IsoBox ox={bx} oy={by} W={3} D={3} H={1} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      );})()} 
      {/* Gold needle block on top */}
      {(() => { const [bx,by]=iso(ox,oy,3,1.5,3); return (
        <IsoBox ox={bx} oy={by} W={1} D={2} H={3} goldTop stroke="rgba(201,165,90,0.85)" strokeWidth={1.3} />
      );})()} 
      {/* Score text */}
      {(() => { const [tx,ty]=iso(ox,oy,2.5,2.5,2); return (
        <text x={tx} y={ty} textAnchor="middle" fontSize="9" fontWeight="300" fill="rgba(255,255,255,0.7)" fontFamily="monospace">98</text>
      );})()} 
    </svg>
  );
}

// ─── Brand Strategy Icons ─────────────────────────────────────────────────────

// Brand Audit: iso checklist stack
function IsoAudit() {
  const ox = 80; const oy = 80;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Stack of 4 doc slabs */}
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
      {/* Checkmark on top face */}
      {(() => {
        const [cx,cy] = iso(ox,oy, 1.5, 1.2, 3.2);
        return <polyline points={`${cx-6},${cy} ${cx-2},${cy+4} ${cx+7},${cy-5}`} stroke="rgba(201,165,90,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      })()}
    </svg>
  );
}

// Positioning: iso 2x2 matrix platform with dots
function IsoPositioning() {
  const ox = 80; const oy = 80;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* 2x2 flat grid platform */}
      <IsoBox ox={ox} oy={oy} W={3} D={3} H={0.5} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.1} />
      <IsoBox ox={iso(ox,oy,3,0,0)[0]} oy={iso(ox,oy,3,0,0)[1]} W={3} D={3} H={0.5} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.1} />
      <IsoBox ox={iso(ox,oy,0,3,0)[0]} oy={iso(ox,oy,0,3,0)[1]} W={3} D={3} H={0.5} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.1} />
      <IsoBox ox={iso(ox,oy,3,3,0)[0]} oy={iso(ox,oy,3,3,0)[1]} W={3} D={3} H={0.5} goldTop stroke="rgba(201,165,90,0.7)" strokeWidth={1.2} />
      {/* Competitor dots (small cylinders) */}
      {[[1.5,1.5],[4.5,1.5],[1.5,4.5]].map(([r,l],i) => {
        const [cx,cy] = iso(ox,oy,r,l,0.5);
        return <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />;
      })}
      {/* Our position — gold dot, taller */}
      {(() => { const [cx,cy]=iso(ox,oy,4.5,4.5,0.5); return (
        <>
          <IsoBox ox={iso(ox,oy,4,4,0.5)[0]} oy={iso(ox,oy,4,4,0.5)[1]} W={1} D={1} H={2} goldTop stroke="rgba(201,165,90,0.9)" strokeWidth={1.3} />
          <circle cx={cx} cy={cy-20} r="3.5" fill="rgba(201,165,90,0.7)" />
        </>
      );})()} 
    </svg>
  );
}

// Voice & Messaging: iso speech/layers
function IsoVoice() {
  const ox = 80; const oy = 78;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Three message slab layers */}
      <IsoBox ox={ox} oy={oy} W={6} D={2} H={0.8} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.0} />
      {(() => { const [bx,by]=iso(ox,oy,-0.5,0,1.2); return (
        <IsoBox ox={bx} oy={by} W={6} D={2} H={0.8} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      );})()} 
      {(() => { const [bx,by]=iso(ox,oy,-1,0,2.4); return (
        <IsoBox ox={bx} oy={by} W={6} D={2} H={0.8} goldTop stroke="rgba(201,165,90,0.75)" strokeWidth={1.2} />
      );})()} 
      {/* Gold accent line on top slab face */}
      {(() => {
        const [x1,y1]=iso(ox,oy,-0.8,0.3,3.2+0.8);
        const [x2,y2]=iso(ox,oy,2.5,0.3,3.2+0.8);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,165,90,0.9)" strokeWidth="1.2" strokeLinecap="round" />;
      })()}
    </svg>
  );
}

// ─── Analytics & Growth Icons ─────────────────────────────────────────────────

// Conversion Tracking: iso funnel as narrowing blocks
function IsoFunnel() {
  const ox = 80; const oy = 68;
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {[
        { W:6, D:4, H:1.2, gold:false },
        { W:5, D:3.5, H:1.2, gold:false },
        { W:4, D:3, H:1.2, gold:false },
        { W:2.5, D:2, H:1.5, gold:true },
      ].reduce<{ layers: React.ReactNode[]; curY: number }>((acc, { W, D, H, gold }, i) => {
        const [bx,by] = [ox - W*8.66/2 + (i===0?0:0), acc.curY];
        acc.layers.push(
          <IsoBox key={i} ox={bx} oy={by} W={W} D={D} H={H}
            goldTop={gold}
            topFill={gold ? "rgba(201,165,90,0.15)" : `rgba(255,255,255,${0.04+i*0.01})`}
            stroke={gold ? "rgba(201,165,90,0.85)" : "rgba(255,255,255,0.45)"}
            strokeWidth={gold ? 1.3 : 1.1}
          />
        );
        const [,nextY] = iso(bx,by,0,0,H);
        acc.curY = nextY;
        return acc;
      }, { layers: [], curY: oy }).layers}
    </svg>
  );
}

// Growth Modelling: iso bar chart
function IsoLineChart() {
  const ox = 80; const oy = 80;
  const bars = [1.5, 2.5, 3.5, 5, 4];
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
      {/* Base platform */}
      <IsoBox ox={ox} oy={oy} W={bars.length*1.6} D={3} H={0.4} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.0} />
      {/* Bars */}
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

// Behaviour Analysis: iso grid/heatmap platform
function IsoHeatmap() {
  const ox = 80; const oy = 72;
  const opacities = [
    [0.6,0.3,0.15,0.08],
    [0.4,0.7,0.55,0.2],
    [0.2,0.45,0.8,0.5],
    [0.1,0.15,0.3,0.4],
  ];
  return (
    <svg width="160" height="134" viewBox="0 0 160 134" fill="none">
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

// ─── Section data ─────────────────────────────────────────────────────────────

const ROWS = [
  {
    label: "01 — Design",
    steps: [
      { Icon: IsoMoodboard, heading: "Discovery & Moodboard", body: "We audit your brand, competitive set, and audience. Visual directions emerge from research, not guesswork." },
      { Icon: IsoWireframe, heading: "Wireframe & Prototype", body: "Every layout is logic before it's aesthetic. We map information hierarchy, user flows, and conversion moments." },
      { Icon: IsoTypography, heading: "Visual Design System", body: "Typography, colour, spacing, and motion — defined once, applied everywhere. Your brand becomes a system." },
    ],
  },
  {
    label: "02 — Development",
    steps: [
      { Icon: IsoComponentTree, heading: "Component Architecture", body: "Atomic design meets Next.js. Every UI element is reusable, typed, and documented — ready to scale." },
      { Icon: IsoBuildPipeline, heading: "CI/CD Pipeline", body: "Code review, automated tests, and preview deployments on every push. Nothing ships without passing the bar." },
      { Icon: IsoPerformance, heading: "Performance Tuning", body: "Lighthouse ≥ 90 is a baseline, not a goal. Core Web Vitals, edge caching, and image optimisation ship by default." },
    ],
  },
  {
    label: "03 — Brand Strategy",
    steps: [
      { Icon: IsoAudit, heading: "Brand Audit", body: "We map every customer touchpoint and grade it against your positioning promises. Gaps become the brief." },
      { Icon: IsoPositioning, heading: "Positioning Map", body: "We plot you against competitors across dimensions that matter to your buyers, then find the defensible white space." },
      { Icon: IsoVoice, heading: "Voice & Messaging", body: "Tone of voice, key messages, and a copy framework your whole team can use — from homepage to cold email." },
    ],
  },
  {
    label: "04 — Analytics & Growth",
    steps: [
      { Icon: IsoFunnel, heading: "Conversion Tracking", body: "Every form, click, and scroll mapped to a business outcome. No vanity metrics — only events that drive decisions." },
      { Icon: IsoLineChart, heading: "Growth Modelling", body: "We build dashboards that surface compounding trends early — before your team notices them in revenue." },
      { Icon: IsoHeatmap, heading: "Behaviour Analysis", body: "Heatmaps, session recordings, and A/B tests close the loop between design hypotheses and real user behaviour." },
    ],
  },
];

// B — Horizontal timeline for Design (0) and Development (1)
function TimelineRow({ index }: { index: number }) {
  const row = ROWS[index];
  if (!row) return null;
  return (
    <div className={index === 0 ? "" : "border-t border-white/[0.05]"}>
      <div className={`mx-auto max-w-[1280px] px-8 pb-4 md:px-16 ${index === 0 ? "pt-12" : "pt-14"}`}>

        {/* Label */}
        <motion.div
          className="mb-8 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            {row.label}
          </p>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {row.steps.map(({ Icon, heading, body }, si) => (
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
                  <h3 className="mb-1.5 font-body text-[14px] font-semibold text-white/75">
                    {heading}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-white/30">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProcessRow({ index }: { index: number }) {
  // C — Strategy (2) and Growth (3) skip the process row entirely
  if (index >= 2) {
    return (
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-[1280px] px-8 pt-14 pb-0 md:px-16">
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              {ROWS[index]?.label}
            </p>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </motion.div>
        </div>
      </div>
    );
  }

  // B — Design and Development get the timeline
  return <TimelineRow index={index} />;
}
