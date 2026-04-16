"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring, useInView, AnimatePresence } from "framer-motion";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  philosophy: string;
  bio: string;
  skills: string[];
  brandCodeBalance: number;
  featured: boolean;
  showTags: boolean;
  showBalance: boolean;
  photoUrl: string;
  capabilities: string;
};

// ─── Arc helpers ─────────────────────────────────────────────────────────────

const DEG = Math.PI / 180;

function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + r * Math.cos(deg * DEG), cy + r * Math.sin(deg * DEG)];
}

/** SVG arc path. angleDeg follows SVG convention (y-down): 0°=right, 90°=bottom, 270°=top */
function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number, sweep: 0 | 1) {
  const [sx, sy] = pt(cx, cy, r, startDeg);
  const [ex, ey] = pt(cx, cy, r, endDeg);
  return `M ${sx},${sy} A ${r},${r} 0 0,${sweep} ${ex},${ey}`;
}

// ─── Ribbon ───────────────────────────────────────────────────────────────────

function Ribbon({ balance, featured }: { balance: number; featured: boolean }) {
  const h = featured ? 76 : 60;
  const w = featured ? 28 : 22;

  const stripe1 = balance >= 60 ? "#c9a55a" : balance <= 40 ? "#7888a0" : "#c9a55a";
  const stripe2 = "#0d0c08";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Mounting hook */}
      <div
        style={{
          width: 7,
          height: 11,
          borderRadius: "0 0 4px 4px",
          background: "linear-gradient(to bottom, #d0b060, #5a3e18)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.7)",
        }}
      />

      {/* Top metal bar */}
      <div
        style={{
          width: w + 12,
          height: 9,
          borderRadius: 3,
          background:
            "linear-gradient(to bottom, #d0b060 0%, #9a7030 35%, #5a3a18 70%, #2e1e0c 100%)",
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,240,160,0.22)",
        }}
      />

      {/* Ribbon fabric */}
      <div
        style={{
          width: w,
          height: h,
          backgroundImage: `repeating-linear-gradient(-50deg, ${stripe1} 0px, ${stripe1} 2.5px, ${stripe2} 2.5px, ${stripe2} 5px)`,
          boxShadow:
            "inset 2px 0 5px rgba(0,0,0,0.3), inset -2px 0 5px rgba(0,0,0,0.3)",
        }}
      />

      {/* Bottom metal bar */}
      <div
        style={{
          width: w + 12,
          height: 9,
          borderRadius: 3,
          background:
            "linear-gradient(to bottom, #d0b060 0%, #9a7030 35%, #5a3a18 70%, #2e1e0c 100%)",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,240,160,0.22)",
        }}
      />
    </div>
  );
}

// ─── Medal SVG ────────────────────────────────────────────────────────────────

function MedalFace({ member, size }: { member: TeamMember; size: number }) {
  const uid = `medal-${member.id}`;
  const cx = size / 2;
  const cy = size / 2;

  // Radius tiers
  const outerR = size * 0.455; // bevel ring
  const faceR  = size * 0.40;  // polished face
  const ring1R = faceR * 0.882; // outer groove
  const ring2R = faceR * 0.742; // middle groove
  const ring3R = faceR * 0.598; // inner groove
  const bossR  = faceR * 0.438; // raised boss
  const wellR  = faceR * 0.336; // recessed center field

  // Text arcs
  // Bottom name: counterclockwise from 130° to 50° passes through 90° (bottom).
  // sweep=0, text baseline on arc, letters point toward center (inward) — classic inscribed coin text.
  const nameArcR = (ring2R + ring3R) / 2;
  const nameArcPath = arc(cx, cy, nameArcR, 130, 50, 0);

  // Top role: clockwise from 220° to 320° passes through 270° (top).
  // sweep=1, text appears outside the arc (toward the outer rim) — letters face upward.
  const roleArcR = (ring1R + faceR) / 2;
  const roleArcPath = arc(cx, cy, roleArcR, 220, 320, 1);

  // 6 decorative dots evenly spaced between ring2 and boss
  const dotR = (ring2R + bossR) / 2;
  const dotAngles = Array.from({ length: 6 }, (_, i) => i * 60 + 0);

  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        {/* Outer bevel ring */}
        <radialGradient id={`${uid}-bevel`} cx="36%" cy="30%" r="64%">
          <stop offset="0%"   stopColor="#7a5c22" />
          <stop offset="28%"  stopColor="#4a3418" />
          <stop offset="62%"  stopColor="#1e1208" />
          <stop offset="100%" stopColor="#0a0704" />
        </radialGradient>

        {/* Main face — multi-stop linear for brushed gold */}
        <linearGradient id={`${uid}-face`} x1="8%" y1="4%" x2="92%" y2="96%">
          <stop offset="0%"   stopColor="#1e1408" />
          <stop offset="8%"   stopColor="#5a4018" />
          <stop offset="20%"  stopColor="#a87838" />
          <stop offset="34%"  stopColor="#d4a848" />
          <stop offset="44%"  stopColor="#e6c45e" />
          <stop offset="50%"  stopColor="#f0d46a" />
          <stop offset="58%"  stopColor="#d0a848" />
          <stop offset="72%"  stopColor="#8a6028" />
          <stop offset="86%"  stopColor="#4a3018" />
          <stop offset="100%" stopColor="#180e04" />
        </linearGradient>

        {/* Boss — convex highlight */}
        <radialGradient id={`${uid}-boss`} cx="33%" cy="27%" r="68%">
          <stop offset="0%"   stopColor="#f0dda0" />
          <stop offset="18%"  stopColor="#c9a550" />
          <stop offset="45%"  stopColor="#7a5820" />
          <stop offset="72%"  stopColor="#3a2410" />
          <stop offset="100%" stopColor="#180e08" />
        </radialGradient>

        {/* Well — recessed dark field */}
        <radialGradient id={`${uid}-well`} cx="42%" cy="36%" r="58%">
          <stop offset="0%"   stopColor="#1a1208" />
          <stop offset="50%"  stopColor="#0e0a04" />
          <stop offset="100%" stopColor="#070504" />
        </radialGradient>

        {/* Specular highlight (top-left light source) */}
        <radialGradient id={`${uid}-spec`} cx="27%" cy="22%" r="54%">
          <stop offset="0%"   stopColor="rgba(255,252,210,0.20)" />
          <stop offset="55%"  stopColor="rgba(255,252,210,0.05)" />
          <stop offset="100%" stopColor="rgba(255,252,210,0)" />
        </radialGradient>

        {/* Boss specular */}
        <radialGradient id={`${uid}-boss-spec`} cx="32%" cy="25%" r="56%">
          <stop offset="0%"   stopColor="rgba(255,252,210,0.30)" />
          <stop offset="100%" stopColor="rgba(255,252,210,0)" />
        </radialGradient>

        {/* Drop shadow */}
        <filter id={`${uid}-shadow`} x="-22%" y="-12%" width="144%" height="144%">
          <feDropShadow dx="0" dy="9" stdDeviation="11" floodColor="#000" floodOpacity="0.7" />
        </filter>

        {/* Text paths */}
        <path id={`${uid}-name`} d={nameArcPath} />
        <path id={`${uid}-role`} d={roleArcPath} />

        {/* Photo clip */}
        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cy} r={wellR - 2} />
        </clipPath>
      </defs>

      <g filter={`url(#${uid}-shadow)`}>
        {/* Outer bevel ring */}
        <circle cx={cx} cy={cy} r={outerR} fill={`url(#${uid}-bevel)`} />

        {/* Main polished face */}
        <circle cx={cx} cy={cy} r={faceR} fill={`url(#${uid}-face)`} />

        {/* Specular overlay */}
        <circle cx={cx} cy={cy} r={faceR} fill={`url(#${uid}-spec)`} />

        {/* Outer groove (shadow + highlight pair) */}
        <circle cx={cx} cy={cy} r={ring1R}       fill="none" stroke="rgba(0,0,0,0.55)"       strokeWidth="2" />
        <circle cx={cx} cy={cy} r={ring1R - 1.5} fill="none" stroke="rgba(255,220,120,0.18)"  strokeWidth="0.75" />

        {/* Middle groove */}
        <circle cx={cx} cy={cy} r={ring2R}     fill="none" stroke="rgba(0,0,0,0.45)"      strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={ring2R - 1} fill="none" stroke="rgba(255,220,120,0.14)" strokeWidth="0.75" />

        {/* Six decorative dots */}
        {dotAngles.map((deg, i) => {
          const [x, y] = pt(cx, cy, dotR, deg);
          return <circle key={i} cx={x} cy={y} r={2.2} fill="rgba(201,165,90,0.42)" />;
        })}

        {/* Inner groove */}
        <circle cx={cx} cy={cy} r={ring3R}       fill="none" stroke="rgba(0,0,0,0.38)"       strokeWidth="1.25" />
        <circle cx={cx} cy={cy} r={ring3R - 0.8} fill="none" stroke="rgba(255,220,120,0.12)"  strokeWidth="0.5" />

        {/* Boss (raised disc) */}
        <circle cx={cx} cy={cy} r={bossR} fill={`url(#${uid}-boss)`} />
        <circle cx={cx} cy={cy} r={bossR} fill={`url(#${uid}-boss-spec)`} />
        <circle cx={cx} cy={cy} r={bossR} fill="none" stroke="rgba(255,240,170,0.28)" strokeWidth="1.5" />

        {/* Well inner groove */}
        <circle cx={cx} cy={cy} r={wellR + 2}   fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={wellR + 0.5} fill="none" stroke="rgba(255,220,120,0.2)" strokeWidth="0.75" />

        {/* Recessed well */}
        <circle cx={cx} cy={cy} r={wellR} fill={`url(#${uid}-well)`} />

        {/* Photo or initials */}
        {member.photoUrl ? (
          <image
            href={member.photoUrl}
            x={cx - wellR}
            y={cy - wellR}
            width={wellR * 2}
            height={wellR * 2}
            clipPath={`url(#${uid}-clip)`}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <text
            x={cx}
            y={cy + faceR * 0.04}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(201,165,90,0.82)"
            fontSize={wellR * 0.88}
            fontFamily="var(--font-fraunces, Georgia, serif)"
            fontWeight="300"
          >
            {initials}
          </text>
        )}

        {/* Name arc (bottom, letters toward center) */}
        <text
          fontFamily="var(--font-dm-mono, monospace)"
          fontSize={faceR * 0.085}
          letterSpacing={faceR * 0.013}
          fill="rgba(201,165,90,0.68)"
        >
          <textPath href={`#${uid}-name`} startOffset="50%" textAnchor="middle">
            {member.name.toUpperCase()}
          </textPath>
        </text>

        {/* Role arc (top, letters toward outer rim) */}
        <text
          fontFamily="var(--font-dm-mono, monospace)"
          fontSize={faceR * 0.072}
          letterSpacing={faceR * 0.01}
          fill="rgba(201,165,90,0.40)"
        >
          <textPath href={`#${uid}-role`} startOffset="50%" textAnchor="middle">
            {member.role.toUpperCase().substring(0, 22)}
          </textPath>
        </text>
      </g>
    </svg>
  );
}

// ─── Full medal with sway ─────────────────────────────────────────────────────

function Medal({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const [hovered, setHovered] = useState(false);

  const rotate = useSpring(0, { stiffness: 50, damping: 10, mass: 1.2 });

  // Entry sway: settle like a just-hung medal
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      rotate.set(-9);
      setTimeout(() => rotate.set(6), 340);
      setTimeout(() => rotate.set(-3.5), 680);
      setTimeout(() => rotate.set(1.5), 1020);
      setTimeout(() => rotate.set(0), 1360);
    }, index * 140 + 250);
    return () => clearTimeout(t);
  }, [inView, index, rotate]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      rotate.set(dx * 0.09);
    },
    [rotate],
  );

  const onMouseLeave = useCallback(() => {
    rotate.set(0);
    setHovered(false);
  }, [rotate]);

  const medalSize = member.featured ? 200 : 160;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center select-none"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      {/* Assembly that swings from the hook */}
      <motion.div
        style={{ rotate, transformOrigin: "50% 0%" }}
        className="flex flex-col items-center"
      >
        <Ribbon balance={member.brandCodeBalance} featured={member.featured} />
        <MedalFace member={member} size={medalSize} />
      </motion.div>

      {/* Name plate */}
      <div className="mt-5 text-center">
        <p
          className="font-display font-light tracking-tight transition-colors duration-300"
          style={{
            fontSize: member.featured ? "var(--text-lg)" : "var(--text-base)",
            color: hovered ? "var(--color-accent)" : "var(--color-text-primary)",
          }}
        >
          {member.name}
        </p>
        <p
          className="mt-1 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {member.role}
        </p>
      </div>

      {/* Philosophy on hover */}
      <AnimatePresence>
        {hovered && member.philosophy && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mt-3 max-w-[190px] text-center text-xs italic leading-relaxed"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            &ldquo;{member.philosophy}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Wall strip with screw details ────────────────────────────────────────────

function WallStrip() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[14px] rounded-t-lg"
      style={{
        background:
          "linear-gradient(to bottom, #3a2e18 0%, #241c0e 60%, #1a1408 100%)",
        boxShadow: "0 3px 10px rgba(0,0,0,0.65)",
      }}
    >
      {/* Screw details */}
      {[14, 50, 86].map((pct) => (
        <div
          key={pct}
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #9a7840, #2a1e0e)",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 2px rgba(255,220,100,0.1)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TeamSection({ members: raw }: { members: TeamMember[] }) {
  if (!raw.length) return null;

  const featured = raw.filter((m) => m.featured);
  const others   = raw.filter((m) => !m.featured);
  const all      = [...featured, ...others];

  return (
    <section
      aria-labelledby="team-heading"
      className="section border-b border-border"
      style={{
        background: "linear-gradient(160deg, #0f0e0a 0%, #0b0a07 50%, #0f0e0a 100%)",
      }}
    >
      <div className="container">
        {/* Section heading */}
        <div className="mb-20">
          <motion.p
            className="text-overline mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            The Team
          </motion.p>
          <motion.h2
            id="team-heading"
            className="text-h2 max-w-[540px]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            People built at the intersection of{" "}
            <em className="italic-display text-accent">brand and code</em>
          </motion.h2>
        </div>

        {/* Medal wall */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-lg px-8 pb-16 pt-10"
          style={{
            background:
              "radial-gradient(ellipse at 55% 25%, rgba(201,165,90,0.04) 0%, transparent 65%), linear-gradient(to bottom, #111009 0%, #0d0c08 100%)",
            border: "1px solid rgba(201,165,90,0.07)",
            boxShadow:
              "inset 0 2px 24px rgba(0,0,0,0.45), 0 12px 40px rgba(0,0,0,0.55)",
          }}
        >
          <WallStrip />

          <div className="flex flex-wrap items-start justify-center gap-x-14 gap-y-12 lg:gap-x-20">
            {all.map((m, i) => (
              <Medal key={m.id} member={m} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
