"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type TeamMember = {
  id: number;
  name: string;
  role: string;
  philosophy: string;
  bio: string;
  skills: string[];
  brandCodeBalance: number;
  featured: boolean;
  showBio: boolean;
  showTags: boolean;
  showBalance: boolean;
  photoUrl: string;
  capabilities: string;
};

// ─── Capability helpers ───────────────────────────────────────────────────────

function parseCaps(raw: string): Record<string, number> {
  return Object.fromEntries(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [name, val] = s.split(":");
        return [name?.trim() ?? "", Number(val?.trim() ?? 0)] as [string, number];
      })
      .filter(([n]) => n),
  );
}

function collectAxes(members: TeamMember[]): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const m of members) {
    for (const k of Object.keys(parseCaps(m.capabilities))) {
      if (!seen.has(k)) { seen.add(k); order.push(k); }
    }
  }
  return order;
}

// ─── Radar geometry ───────────────────────────────────────────────────────────

const CX = 180, CY = 180, MAX_R = 130, LABEL_R = 158;

function point(i: number, n: number, r: number) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a), a };
}

function radarD(axes: string[], caps: Record<string, number>): string {
  if (!axes.length) return "";
  const n = axes.length;
  const pts = axes.map((ax, i) => {
    const v = Math.max(0, Math.min(100, caps[ax] ?? 0)) / 100;
    return point(i, n, v * MAX_R);
  });
  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ") + " Z";
}

function ringD(axes: string[], pct: number): string {
  if (!axes.length) return "";
  const n = axes.length;
  const pts = axes.map((_, i) => point(i, n, pct * MAX_R));
  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ") + " Z";
}

// ─── Radar chart ──────────────────────────────────────────────────────────────

const SPRING = { type: "spring" as const, stiffness: 180, damping: 26 };
const EASE   = [0.16, 1, 0.3, 1] as const;

// ─── Dust motes (drift through the sun ray) ───────────────────────────────────

const DUST_MOTES = [
  { left: "14%", top: "44%", size: 2,   drift: 38, bob: -6, duration: 5.8, delay: 0.0 },
  { left: "26%", top: "55%", size: 1.5, drift: 30, bob:  5, duration: 4.6, delay: 1.2 },
  { left: "40%", top: "47%", size: 2.5, drift: 44, bob: -4, duration: 6.4, delay: 0.6 },
  { left: "54%", top: "52%", size: 1.5, drift: 28, bob:  6, duration: 5.2, delay: 2.0 },
  { left: "68%", top: "46%", size: 2,   drift: 36, bob: -5, duration: 5.6, delay: 1.6 },
  { left: "80%", top: "53%", size: 1.5, drift: 24, bob:  4, duration: 4.8, delay: 0.4 },
  { left: "90%", top: "49%", size: 2,   drift: 20, bob: -3, duration: 5.0, delay: 2.4 },
] as const;

function RadarChart({
  members,
  allAxes,
  parsedCaps,
  hoveredId,
}: {
  members: TeamMember[];
  allAxes: string[];
  parsedCaps: Map<number, Record<string, number>>;
  hoveredId: number | null;
}) {
  const n = allAxes.length;
  if (!n) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          No capabilities data yet
        </p>
      </div>
    );
  }

  const hovered = hoveredId !== null ? members.find((m) => m.id === hoveredId) : null;
  const activeCaps = hovered ? (parsedCaps.get(hovered.id) ?? {}) : {};
  const activeD    = radarD(allAxes, activeCaps);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 360 360"
        width="100%"
        style={{ maxWidth: 360, overflow: "visible" }}
        aria-hidden
      >
        {/* Background rings */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <path
            key={pct}
            d={ringD(allAxes, pct)}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={pct === 1 ? 1 : 0.75}
          />
        ))}

        {/* Axis spokes */}
        {allAxes.map((_, i) => {
          const outer = point(i, n, MAX_R);
          return (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={0.75}
            />
          );
        })}

        {/* Ghost shapes — all members at low opacity */}
        {members.map((m) => (
          <motion.path
            key={m.id}
            d={radarD(allAxes, parsedCaps.get(m.id) ?? {})}
            animate={{
              opacity: hoveredId === null ? 0.30 : (hoveredId === m.id ? 0 : 0.06),
            }}
            transition={{ duration: 0.3 }}
            fill="rgba(201,165,90,0.08)"
            stroke="rgba(201,165,90,0.35)"
            strokeWidth={1}
          />
        ))}

        {/* Active / hovered shape */}
        <AnimatePresence>
          {hovered && (
            <motion.path
              key={hovered.id}
              d={activeD}
              animate={{ d: activeD, opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              fill="rgba(201,165,90,0.14)"
              stroke="rgba(201,165,90,0.80)"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          )}
        </AnimatePresence>

        {/* Vertex dots for hovered shape */}
        {hovered &&
          allAxes.map((ax, i) => {
            const v = Math.max(0, Math.min(100, (parsedCaps.get(hovered.id) ?? {})[ax] ?? 0)) / 100;
            const p = point(i, n, v * MAX_R);
            return (
              <motion.circle
                key={ax}
                cx={p.x} cy={p.y} r={3}
                animate={{ cx: p.x, cy: p.y, opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={SPRING}
                fill="#c9a55a"
                stroke="rgba(201,165,90,0.3)"
                strokeWidth={4}
              />
            );
          })}

        {/* Axis labels */}
        {allAxes.map((ax, i) => {
          const { x, y, a } = point(i, n, LABEL_R);
          const anchor =
            Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
          const isActive = hovered
            ? (parsedCaps.get(hovered.id) ?? {})[ax] > 0
            : false;
          return (
            <text
              key={ax}
              x={x} y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={9}
              fontFamily='"DM Mono", monospace'
              letterSpacing="0.06em"
              fill={isActive ? "rgba(201,165,90,0.85)" : "rgba(255,255,255,0.30)"}
              style={{ transition: "fill 0.3s" }}
            >
              {ax.toUpperCase()}
            </text>
          );
        })}
      </svg>

      {/* Member name / role label below chart */}
      <div className="mt-2 h-9 text-center">
        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <p className="text-sm font-medium text-text-primary">{hovered.name}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                {hovered.role}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary"
            >
              Explore the team
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ member, isHovered }: { member: TeamMember; isHovered: boolean }) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const ring = isHovered
    ? "0 0 0 1px rgba(242,218,114,0.45), 0 0 18px rgba(242,218,114,0.22), 0 2px 8px rgba(0,0,0,0.4)"
    : "0 0 0 1px rgba(201,165,90,0.18), 0 2px 8px rgba(0,0,0,0.4)";

  if (member.photoUrl) {
    return (
      <div
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full transition-[box-shadow] duration-500"
        style={{ boxShadow: ring }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
        {/* Warm sunlight wash — angled to feel like the ray actually lands here */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,228,150,0.55) 0%, rgba(242,218,114,0.18) 45%, transparent 75%)",
            mixBlendMode: "overlay",
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-medium transition-[box-shadow,color] duration-500"
      style={{
        background: "linear-gradient(135deg, #2a2010, #1a1208)",
        color: isHovered ? "#f2da72" : "#c9a55a",
        boxShadow: ring,
      }}
    >
      <span className="relative z-10">{initials}</span>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,228,150,0.35) 0%, rgba(242,218,114,0.10) 50%, transparent 80%)",
          mixBlendMode: "screen",
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
}

// ─── Member card ──────────────────────────────────────────────────────────────

function MemberCard({
  member,
  isHovered,
  anyHovered,
  cardRef,
  onEnter,
  onLeave,
}: {
  member: TeamMember;
  isHovered: boolean;
  anyHovered: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      ref={cardRef}
      className="relative z-10 flex cursor-default items-start gap-4 border-t py-6 transition-opacity duration-300"
      style={{
        borderColor: "rgba(201,165,90,0.12)",
        opacity: !anyHovered || isHovered ? 1 : 0.32,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Avatar member={member} isHovered={isHovered} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className="text-base font-medium leading-tight transition-colors duration-200"
            style={{ color: isHovered ? "#f5f1e8" : "rgba(245,241,232,0.80)" }}
          >
            {member.name}
          </p>
          {member.featured && (
            <span
              className="shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest"
              style={{
                background: "rgba(201,165,90,0.10)",
                color: "rgba(201,165,90,0.70)",
                border: "1px solid rgba(201,165,90,0.18)",
              }}
            >
              Lead
            </span>
          )}
        </div>
        <p
          className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
          style={{ color: isHovered ? "#c9a55a" : "rgba(201,165,90,0.60)" }}
        >
          {member.role}
        </p>
        {member.philosophy && (
          <p className="mt-2 line-clamp-2 text-xs italic leading-relaxed text-text-secondary">
            &ldquo;{member.philosophy}&rdquo;
          </p>
        )}
        {member.showBio && member.bio && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-tertiary">
            {member.bio}
          </p>
        )}
        {member.showTags && member.skills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {member.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-text-tertiary"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {member.showBalance && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.16em]">
              <span style={{ color: "rgba(201,165,90,0.75)" }}>
                Brand {member.brandCodeBalance}
              </span>
              <span className="text-text-tertiary">
                Code {100 - member.brandCodeBalance}
              </span>
            </div>
            <div
              className="mt-1 h-[2px] w-full overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${member.brandCodeBalance}%`,
                  background:
                    "linear-gradient(to right, rgba(201,165,90,0.95), rgba(201,165,90,0.4))",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TeamSection({ members: raw }: { members: TeamMember[] }) {
  if (!raw.length) return null;

  const all      = [...raw.filter((m) => m.featured), ...raw.filter((m) => !m.featured)];
  const allAxes  = collectAxes(all);
  const capsMap  = new Map(all.map((m) => [m.id, parseCaps(m.capabilities)]));

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [scrollFocusId, setScrollFocusId] = useState<number | null>(null);
  const [beam, setBeam] = useState<{
    sourceX: number; sourceY: number;
    targetX: number; targetY: number;
    angle: number; distance: number;
  } | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // What the radar actually shows: hover wins on desktop; scroll drives on touch.
  const radarActiveId = hoveredId ?? scrollFocusId;

  // Touch/no-hover devices: track the card closest to viewport center while the
  // section is visible, and drive the radar with it. Spotlight stays hover-only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(hover: none)");
    if (!mql.matches) return;

    const section = sectionRef.current;
    if (!section) return;

    let sectionVisible = false;
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!sectionVisible) return;
      const vhCenter = window.innerHeight / 2;
      let bestId: number | null = null;
      let bestDist = Infinity;
      cardRefs.current.forEach((el, id) => {
        const r = el.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        const d = Math.abs(cy - vhCenter);
        if (d < bestDist) { bestDist = d; bestId = id; }
      });
      setScrollFocusId((prev) => (prev === bestId ? prev : bestId));
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const sectionObs = new IntersectionObserver(
      ([entry]) => {
        sectionVisible = entry.isIntersecting;
        if (sectionVisible) schedule();
        else setScrollFocusId(null);
      },
      { threshold: 0 },
    );
    sectionObs.observe(section);

    window.addEventListener("scroll",  schedule, { passive: true });
    window.addEventListener("resize",  schedule);

    return () => {
      sectionObs.disconnect();
      window.removeEventListener("scroll",  schedule);
      window.removeEventListener("resize",  schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useLayoutEffect(() => {
    if (hoveredId === null || !gridRef.current) {
      setBeam(null);
      return;
    }
    const card = cardRefs.current.get(hoveredId);
    if (!card) return;
    const grid = gridRef.current.getBoundingClientRect();
    const r    = card.getBoundingClientRect();

    const targetX = r.left - grid.left + r.width / 2;
    const targetY = r.top  - grid.top  + r.height / 2;

    // Sun lives off the upper-right corner
    const sourceX = grid.width + 30;
    const sourceY = -90;

    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    setBeam({
      sourceX, sourceY,
      targetX, targetY,
      angle:    Math.atan2(dy, dx) * (180 / Math.PI),
      distance: Math.hypot(dx, dy),
    });
  }, [hoveredId]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="section border-b border-border"
      style={{
        background: "linear-gradient(160deg, #0f0e0a 0%, #0b0a07 50%, #0f0e0a 100%)",
      }}
    >
      <div className="container">
        {/* Heading */}
        <div className="mb-14">
          <motion.p
            className="text-overline mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            The Team
          </motion.p>
          <motion.h2
            id="team-heading"
            className="text-h2 max-w-[540px]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          >
            People built at the intersection of{" "}
            <em className="italic-display text-accent">brand and code</em>
          </motion.h2>
          <motion.p
            className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
          >
            The best products sit at the edge of disciplines. So do the people who build them.
          </motion.p>
        </div>

        {/* Display case */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden rounded-lg"
        >
          <div className="flex flex-col lg:flex-row">
            {/* ── Left: radar chart ─────────────────────────────────────── */}
            <div
              className="flex shrink-0 flex-col items-center justify-center lg:border-r"
              style={{
                borderColor: "rgba(201,165,90,0.08)",
                padding: "clamp(2rem, 4vw, 3rem)",
                minWidth: 300,
              }}
            >
              <p
                className="mb-5 self-start font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(201,165,90,0.45)" }}
              >
                Capabilities
              </p>
              <RadarChart
                members={all}
                allAxes={allAxes}
                parsedCaps={capsMap}
                hoveredId={radarActiveId}
              />
            </div>

            {/* ── Right: team grid ───────────────────────────────────────── */}
            <div
              className="flex flex-1 flex-col justify-center"
              style={{ padding: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              <p
                className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(201,165,90,0.5)" }}
              >
                Who we are
              </p>
              <div
                ref={gridRef}
                className="relative grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
                  columnGap: "2.5rem",
                }}
              >
                {/* Sun ray — angled beam from upper-right toward the hovered card */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  initial={false}
                  animate={{
                    width:   beam ? beam.distance : 0,
                    rotate:  beam ? beam.angle    : 0,
                    opacity: beam ? 1 : 0,
                  }}
                  transition={{
                    width:   { type: "spring", stiffness: 240, damping: 32 },
                    rotate:  { type: "spring", stiffness: 240, damping: 32 },
                    opacity: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
                  }}
                  style={{
                    top:  beam ? beam.sourceY : 0,
                    left: beam ? beam.sourceX : 0,
                    height: 260,
                    marginTop: -130,
                    transformOrigin: "0% 50%",
                    background:
                      "radial-gradient(ellipse 70% 35% at 70% 50%, rgba(242,218,114,0.22) 0%, rgba(242,218,114,0.08) 35%, rgba(242,218,114,0.02) 60%, transparent 78%)",
                    filter: "blur(10px)",
                    zIndex: 0,
                  }}
                />

                {/* Dust motes — drift through the beam */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  initial={false}
                  animate={{
                    width:   beam ? beam.distance : 0,
                    rotate:  beam ? beam.angle    : 0,
                    opacity: beam ? 1 : 0,
                  }}
                  transition={{
                    width:   { type: "spring", stiffness: 240, damping: 32 },
                    rotate:  { type: "spring", stiffness: 240, damping: 32 },
                    opacity: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
                  }}
                  style={{
                    top:  beam ? beam.sourceY : 0,
                    left: beam ? beam.sourceX : 0,
                    height: 120,
                    marginTop: -60,
                    transformOrigin: "0% 50%",
                    zIndex: 0,
                  }}
                >
                  {beam && DUST_MOTES.map((m, i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        left: m.left,
                        top:  m.top,
                        width:  m.size,
                        height: m.size,
                        background: "rgba(255,240,180,0.9)",
                        boxShadow: "0 0 6px rgba(255,228,150,0.7)",
                      }}
                      animate={{
                        x: [0, m.drift, m.drift * 1.4],
                        y: [0, m.bob, 0],
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: m.duration,
                        delay:    m.delay,
                        repeat:   Infinity,
                        ease:     "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>

                {/* Landing pool — soft warm halo where the ray meets the card */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  initial={false}
                  animate={{
                    x: beam ? beam.targetX - 180 : 0,
                    y: beam ? beam.targetY - 110 : 0,
                    opacity: beam ? 1 : 0,
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 280, damping: 32 },
                    y: { type: "spring", stiffness: 280, damping: 32 },
                    opacity: { duration: 0.35 },
                  }}
                  style={{
                    top: 0, left: 0,
                    width: 360, height: 220,
                    background:
                      "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(242,218,114,0.18) 0%, rgba(201,165,90,0.06) 40%, transparent 75%)",
                    filter: "blur(4px)",
                    zIndex: 0,
                  }}
                />

                {all.map((m) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    isHovered={hoveredId === m.id}
                    anyHovered={hoveredId !== null}
                    cardRef={(el) => {
                      if (el) cardRefs.current.set(m.id, el);
                      else    cardRefs.current.delete(m.id);
                    }}
                    onEnter={() => setHoveredId(m.id)}
                    onLeave={() => setHoveredId(null)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
