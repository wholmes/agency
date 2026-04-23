// Isometric icons for Industry cards
// All icons share: width=200 height=160 viewBox="-10 -10 220 180" overflow="visible"
// This prevents cropping regardless of geometry height.

function pt(ox: number, oy: number, r: number, l: number, u: number): string {
  const x = ox + r * 8.66 - l * 8.66;
  const y = oy + r * 5 + l * 5 - u * 10;
  return `${x},${y}`;
}

function xy(ox: number, oy: number, r: number, l: number, u: number): [number, number] {
  return [ox + r * 8.66 - l * 8.66, oy + r * 5 + l * 5 - u * 10];
}

function IsoBox({
  ox, oy, W, D, H,
  topFill = "rgba(255,255,255,0.07)",
  rightFill = "rgba(255,255,255,0.03)",
  leftFill = "rgba(255,255,255,0.05)",
  stroke = "rgba(255,255,255,0.5)",
  strokeWidth = 1.2,
  gold = false,
}: {
  ox: number; oy: number; W: number; D: number; H: number;
  topFill?: string; rightFill?: string; leftFill?: string;
  stroke?: string; strokeWidth?: number; gold?: boolean;
}) {
  const top   = [pt(ox,oy,0,0,H), pt(ox,oy,W,0,H), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  const right = [pt(ox,oy,W,0,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,W,0,H)].join(" ");
  const left  = [pt(ox,oy,0,D,0), pt(ox,oy,W,D,0), pt(ox,oy,W,D,H), pt(ox,oy,0,D,H)].join(" ");
  return (
    <g>
      <polygon points={right} fill={gold ? "rgba(201,165,90,0.08)" : rightFill} stroke={gold ? "rgba(201,165,90,0.7)" : stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={left}  fill={gold ? "rgba(201,165,90,0.12)" : leftFill}  stroke={gold ? "rgba(201,165,90,0.7)" : stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <polygon points={top}   fill={gold ? "rgba(201,165,90,0.2)"  : topFill}   stroke={gold ? "rgba(201,165,90,0.85)" : stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

// Shared SVG wrapper — overflow visible so nothing clips
function IsoSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="200" height="160"
      viewBox="0 0 200 160"
      overflow="visible"
      fill="none"
    >
      {children}
    </svg>
  );
}

// ── 1. Startups — rocket on launch pad ───────────────────────────────────────
export function IsoStartups() {
  const ox = 80; const oy = 130;
  const [bx, by] = xy(ox, oy, 2, 1, 4);
  const [tx, ty] = xy(ox, oy, 3, 2, 10);
  return (
    <IsoSvg>
      {/* Launch pad base */}
      <IsoBox ox={ox} oy={oy} W={4} D={4} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.35)" />
      {/* Pad legs */}
      <IsoBox ox={ox} oy={oy} W={1} D={1} H={3} stroke="rgba(255,255,255,0.3)" />
      <IsoBox ox={xy(ox,oy,3,0,0)[0]} oy={xy(ox,oy,3,0,0)[1]} W={1} D={1} H={3} stroke="rgba(255,255,255,0.3)" />
      {/* Rocket body */}
      <IsoBox ox={bx} oy={by} W={2} D={2} H={6} gold strokeWidth={1.1} />
      {/* Nose cone */}
      <polygon
        points={`${tx},${ty} ${tx-8.66},${ty+5} ${tx},${ty+10} ${tx+8.66},${ty+5}`}
        fill="rgba(201,165,90,0.25)" stroke="rgba(201,165,90,0.85)" strokeWidth={1.1} strokeLinejoin="round"
      />
      {/* Exhaust */}
      <ellipse cx={bx+8.66} cy={by+5} rx={5} ry={3} fill="rgba(201,165,90,0.15)" />
    </IsoSvg>
  );
}

// ── 2. Life Sciences — flask on bench ────────────────────────────────────────
export function IsoLifeSciences() {
  const ox = 65; const oy = 125;
  return (
    <IsoSvg>
      {/* Bench */}
      <IsoBox ox={ox} oy={oy} W={8} D={4} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" />
      {/* Flask base */}
      <IsoBox ox={xy(ox,oy,2,1,1)[0]} oy={xy(ox,oy,2,1,1)[1]} W={4} D={3} H={2} topFill="rgba(201,165,90,0.08)" stroke="rgba(255,255,255,0.4)" />
      {/* Liquid */}
      <IsoBox ox={xy(ox,oy,2.5,1.2,1)[0]} oy={xy(ox,oy,2.5,1.2,1)[1]} W={3} D={2} H={1}
        topFill="rgba(201,165,90,0.3)" rightFill="rgba(201,165,90,0.1)" leftFill="rgba(201,165,90,0.15)"
        stroke="rgba(201,165,90,0.6)" strokeWidth={0.8}
      />
      {/* Flask neck */}
      <IsoBox ox={xy(ox,oy,3,1.5,3)[0]} oy={xy(ox,oy,3,1.5,3)[1]} W={2} D={2} H={4} gold strokeWidth={1.1} />
      {/* Vials */}
      <IsoBox ox={xy(ox,oy,6.5,1,1)[0]} oy={xy(ox,oy,6.5,1,1)[1]} W={1} D={1} H={5} stroke="rgba(255,255,255,0.35)" />
      <IsoBox ox={xy(ox,oy,7.5,1,1)[0]} oy={xy(ox,oy,7.5,1,1)[1]} W={1} D={1} H={3} stroke="rgba(255,255,255,0.3)" />
    </IsoSvg>
  );
}

// ── 3. Law Firms — two pillars + crossbeam ───────────────────────────────────
export function IsoLawFirms() {
  const ox = 62; const oy = 148;
  return (
    <IsoSvg>
      {/* Base */}
      <IsoBox ox={ox} oy={oy} W={9} D={5} H={1} topFill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" />
      {/* Left pillar */}
      <IsoBox ox={xy(ox,oy,1,1,1)[0]} oy={xy(ox,oy,1,1,1)[1]} W={2} D={2} H={8} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      {/* Right pillar */}
      <IsoBox ox={xy(ox,oy,6,1,1)[0]} oy={xy(ox,oy,6,1,1)[1]} W={2} D={2} H={8} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      {/* Crossbeam — gold */}
      <IsoBox ox={xy(ox,oy,1,1,9)[0]} oy={xy(ox,oy,1,1,9)[1]} W={7} D={2} H={1} gold strokeWidth={1.2} />
    </IsoSvg>
  );
}

// ── 4. Real Estate — building with windows ───────────────────────────────────
export function IsoRealEstate() {
  const ox = 62; const oy = 152;
  return (
    <IsoSvg>
      {/* Ground */}
      <IsoBox ox={ox} oy={oy} W={10} D={5} H={1} topFill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.25)" />
      {/* Building */}
      <IsoBox ox={xy(ox,oy,2,1,1)[0]} oy={xy(ox,oy,2,1,1)[1]} W={6} D={4} H={9} topFill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
      {/* Rooftop — gold */}
      <IsoBox ox={xy(ox,oy,2,1,10)[0]} oy={xy(ox,oy,2,1,10)[1]} W={6} D={4} H={1} gold strokeWidth={1.2} />
      {/* Windows row 1 */}
      <IsoBox ox={xy(ox,oy,3,1,3)[0]} oy={xy(ox,oy,3,1,3)[1]} W={1} D={0.1} H={1.5}
        topFill="rgba(201,165,90,0.2)" rightFill="rgba(201,165,90,0.1)" leftFill="rgba(201,165,90,0.15)"
        stroke="rgba(201,165,90,0.5)" strokeWidth={0.8}
      />
      <IsoBox ox={xy(ox,oy,5,1,3)[0]} oy={xy(ox,oy,5,1,3)[1]} W={1} D={0.1} H={1.5}
        topFill="rgba(201,165,90,0.2)" rightFill="rgba(201,165,90,0.1)" leftFill="rgba(201,165,90,0.15)"
        stroke="rgba(201,165,90,0.5)" strokeWidth={0.8}
      />
      {/* Windows row 2 */}
      <IsoBox ox={xy(ox,oy,3,1,6)[0]} oy={xy(ox,oy,3,1,6)[1]} W={1} D={0.1} H={1.5}
        topFill="rgba(201,165,90,0.15)" rightFill="rgba(201,165,90,0.08)" leftFill="rgba(201,165,90,0.1)"
        stroke="rgba(201,165,90,0.4)" strokeWidth={0.8}
      />
      <IsoBox ox={xy(ox,oy,5,1,6)[0]} oy={xy(ox,oy,5,1,6)[1]} W={1} D={0.1} H={1.5}
        topFill="rgba(201,165,90,0.15)" rightFill="rgba(201,165,90,0.08)" leftFill="rgba(201,165,90,0.1)"
        stroke="rgba(201,165,90,0.4)" strokeWidth={0.8}
      />
    </IsoSvg>
  );
}

// ── 5. Restaurants & Hospitality — cloche on table ───────────────────────────
export function IsoRestaurants() {
  const ox = 62; const oy = 130;
  const [cx, cy] = xy(ox, oy, 4.5, 2.5, 2);
  return (
    <IsoSvg>
      {/* Table top */}
      <IsoBox ox={ox} oy={oy} W={9} D={5} H={1} topFill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.35)" />
      {/* Legs */}
      <IsoBox ox={xy(ox,oy,0.5,0.5,0)[0]} oy={xy(ox,oy,0.5,0.5,0)[1]} W={1} D={1} H={4} stroke="rgba(255,255,255,0.3)" />
      <IsoBox ox={xy(ox,oy,7.5,0.5,0)[0]} oy={xy(ox,oy,7.5,0.5,0)[1]} W={1} D={1} H={4} stroke="rgba(255,255,255,0.3)" />
      {/* Plate */}
      <IsoBox ox={xy(ox,oy,3,1.5,1)[0]} oy={xy(ox,oy,3,1.5,1)[1]} W={3} D={2} H={0.5}
        topFill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.9}
      />
      {/* Cloche dome */}
      <ellipse cx={cx} cy={cy-10} rx={22} ry={14}
        fill="rgba(201,165,90,0.12)" stroke="rgba(201,165,90,0.75)" strokeWidth={1.1}
      />
      {/* Handle */}
      <circle cx={cx} cy={cy-24} r={3.5}
        fill="rgba(201,165,90,0.3)" stroke="rgba(201,165,90,0.9)" strokeWidth={1}
      />
      {/* Candle */}
      <IsoBox ox={xy(ox,oy,7,1,1)[0]} oy={xy(ox,oy,7,1,1)[1]} W={1} D={1} H={4} gold strokeWidth={0.9} />
    </IsoSvg>
  );
}
