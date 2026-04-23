// Isometric icons for the About Values section

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
  const tFill = goldTop ? "rgba(201,165,90,0.2)"  : topFill;
  const tStroke = goldTop ? "rgba(201,165,90,0.85)" : stroke;
  return (
    <g>
      <polygon points={right} fill={rightFill} stroke={stroke}   strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={left}  fill={leftFill}  stroke={stroke}   strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={top}   fill={tFill}     stroke={tStroke}  strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

// 1. Design is a business discipline
// Three bar-chart columns rising — design as measurable impact
export function IsoDesignDiscipline() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* Platform */}
      <IsoBox ox={62} oy={95} W={9} D={5} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" />
      {/* Short bar */}
      <IsoBox ox={62} oy={95} W={2} D={5} H={3} stroke="rgba(255,255,255,0.4)" />
      {/* Medium bar */}
      <IsoBox ox={79.9} oy={100} W={2} D={5} H={6} stroke="rgba(255,255,255,0.45)" />
      {/* Tall bar — gold */}
      <IsoBox ox={97.8} oy={105} W={2} D={5} H={9} goldTop stroke="rgba(201,165,90,0.75)" strokeWidth={1.1} />
    </svg>
  );
}

// 2. Code quality is not optional
// Three stacked server slabs with a gold status LED on top
export function IsoCodeQuality() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* Bottom slab */}
      <IsoBox ox={65} oy={100} W={7} D={4} H={2} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" />
      {/* Middle slab */}
      <IsoBox ox={65} oy={80}  W={7} D={4} H={2} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.42)" />
      {/* Top slab — gold */}
      <IsoBox ox={65} oy={60}  W={7} D={4} H={2} goldTop stroke="rgba(201,165,90,0.75)" strokeWidth={1.1} />
      {/* LED dot */}
      <IsoBox ox={112} oy={49} W={1} D={1} H={1} goldTop stroke="rgba(201,165,90,1)" strokeWidth={1} />
    </svg>
  );
}

// 3. Clarity over cleverness
// A single tall clean column — minimal, confident
export function IsoClarityOverCleverness() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* Wide base */}
      <IsoBox ox={68} oy={105} W={7} D={5} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" />
      {/* Shaft */}
      <IsoBox ox={77} oy={102} W={5} D={5} H={8} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      {/* Gold cap */}
      <IsoBox ox={77} oy={22}  W={5} D={5} H={1} goldTop stroke="rgba(201,165,90,0.85)" strokeWidth={1.2} />
    </svg>
  );
}

// 4. The brief is a starting point
// Open book / document with a gold block rising from the page
export function IsoBriefStartingPoint() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* Left page */}
      <IsoBox ox={60} oy={98} W={4} D={5} H={1} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.4)" />
      {/* Spine */}
      <IsoBox ox={95} oy={103} W={1} D={5} H={2} topFill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.5)" />
      {/* Right page */}
      <IsoBox ox={104} oy={108} W={4} D={5} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" />
      {/* Rising gold idea block */}
      <IsoBox ox={69}  oy={84}  W={2} D={3} H={5} goldTop stroke="rgba(201,165,90,0.75)" strokeWidth={1.1} />
      {/* Tiny cap on top */}
      <IsoBox ox={69}  oy={34}  W={2} D={3} H={1} goldTop stroke="rgba(201,165,90,1)" strokeWidth={1} />
    </svg>
  );
}
