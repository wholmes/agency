"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import RadarChart, { parseCapabilities } from "@/components/RadarChart";

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

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Shared: circle headshot ──────────────────────────────────────────────────

function Headshot({
  photoUrl,
  name,
  size = 96,
}: {
  photoUrl: string;
  name: string;
  size?: number;
}) {
  const initial = name.charAt(0).toUpperCase();
  const px = `${size}px`;

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-accent/25 transition-[box-shadow] duration-500 group-hover:ring-accent/50 group-hover:shadow-[0_0_20px_rgba(201,165,90,0.2)]"
      style={{ width: px, height: px }}
    >
      {/* bg for monogram case */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #1e1a10 0%, #13110a 60%, #0e0c08 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,165,90,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,90,0.05) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center font-display font-extralight text-accent select-none transition-opacity duration-500 opacity-60 group-hover:opacity-80"
          style={{ fontSize: size * 0.42 }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}

// ─── Brand/Code balance bar ───────────────────────────────────────────────────

function BalanceBar({ balance, inView }: { balance: number; inView: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.15em] text-text-tertiary uppercase">Brand</span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-text-tertiary uppercase">Code</span>
      </div>
      <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${balance}%` : "0%" }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
          style={{
            background: "linear-gradient(to right, rgba(201,165,90,0.95), rgba(201,165,90,0.35))",
          }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <motion.span
          className="font-mono text-[9px] text-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          {balance}%
        </motion.span>
        <motion.span
          className="font-mono text-[9px] text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          {100 - balance}%
        </motion.span>
      </div>
    </div>
  );
}

// ─── Shared cursor-following tag pill ─────────────────────────────────────────

function useTagPill(tags: string[], enabled: boolean) {
  const [isHovered, setIsHovered] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);
  const pillX = useMotionValue(-300);
  const pillY = useMotionValue(-300);
  const springPillX = useSpring(pillX, { stiffness: 380, damping: 26 });
  const springPillY = useSpring(pillY, { stiffness: 380, damping: 26 });

  useEffect(() => {
    if (!enabled || tags.length < 2) return;
    const id = setInterval(() => setTagIdx((i) => (i + 1) % tags.length), 1000);
    return () => clearInterval(id);
  }, [enabled, tags.length]);

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      pillX.set(e.clientX + 14);
      pillY.set(e.clientY + 18);
    },
    [pillX, pillY],
  );
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  const pill =
    enabled && tags.length > 0 && typeof document !== "undefined"
      ? createPortal(
          <motion.div
            aria-hidden
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.88 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: springPillX,
              y: springPillY,
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 9998,
            }}
            className="rounded border border-accent-muted bg-surface-2 px-3 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(201,165,90,0.12)]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={tagIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="block whitespace-nowrap font-mono text-[10px] tracking-wider text-accent"
              >
                {tags[tagIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.div>,
          document.body,
        )
      : null;

  return { isHovered, onMouseEnter, onMouseMove, onMouseLeave, pill };
}

// ─── Featured card ─────────────────────────────────────────────────────────────
// Full-width, architectural dark bg, large ghost name, circle headshot top-right,
// radar chart right-side, balance bar at bottom.

function CinematicCard({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  const [hovered, setHovered] = useState(false);

  const { onMouseEnter, onMouseMove, onMouseLeave, pill } = useTagPill(
    member.skills,
    member.showTags,
  );

  const radarItems = parseCapabilities(member.capabilities);
  const words = member.name.split(" ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, ease: EASE, delay: index * 0.08 }}
      onMouseEnter={() => { setHovered(true); onMouseEnter(); }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); onMouseLeave(); }}
      className="group relative overflow-hidden rounded-2xl border border-border lg:col-span-2 transition-[border-color,box-shadow] duration-500 hover:border-accent-muted hover:shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
      style={{
        background: "linear-gradient(145deg, #1a1710 0%, #0f0d09 55%, #0a0907 100%)",
        minHeight: "460px",
      }}
    >
      {/* Architectural grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,165,90,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,90,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ghost first-name typography art */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
      >
        <motion.span
          className="font-display font-black leading-none tracking-[-0.05em] select-none text-white"
          animate={{ opacity: hovered ? 0.06 : 0.03 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: "clamp(8rem, 20vw, 20rem)", marginLeft: "-0.04em" }}
        >
          {words[0]}
        </motion.span>
      </div>

      {/* Corner accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-bl-full opacity-30 transition-opacity duration-700 group-hover:opacity-50"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(201,165,90,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Main layout: content left, radar right */}
      <div className="relative z-10 flex h-full min-h-[460px] items-stretch">
        {/* Left: identity + philosophy */}
        <div className="flex flex-1 flex-col justify-between p-10 lg:p-14">
          <div className="flex flex-col gap-7 pr-4">
            <motion.p
              className="font-mono text-[10px] tracking-[0.28em] text-accent uppercase"
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
            >
              {member.role}
            </motion.p>

            <div className="flex flex-col">
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="font-display font-light leading-[0.92] tracking-tight text-text-primary"
                  style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.24 + i * 0.07 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {member.philosophy && (
              <motion.p
                className="max-w-[400px] text-base italic leading-relaxed text-text-secondary"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
              >
                &ldquo;{member.philosophy}&rdquo;
              </motion.p>
            )}
          </div>

          {/* Balance bar at bottom of left column */}
          {member.showBalance && (
            <motion.div
              className="mt-10 max-w-[300px]"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
            >
              <BalanceBar balance={member.brandCodeBalance} inView={inView} />
            </motion.div>
          )}
        </div>

        {/* Right: headshot corner + radar */}
        <div className="relative hidden flex-col items-center justify-between py-10 pr-10 lg:flex" style={{ width: "320px" }}>
          {/* Circle headshot — top right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <Headshot photoUrl={member.photoUrl} name={member.name} size={96} />
          </motion.div>

          {/* Radar chart */}
          {radarItems.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.0, ease: EASE, delay: 0.55 }}
            >
              <RadarChart items={radarItems} size={248} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: headshot floats top-right */}
      <div className="absolute top-6 right-6 lg:hidden z-20">
        <Headshot photoUrl={member.photoUrl} name={member.name} size={72} />
      </div>

      {pill}
    </motion.div>
  );
}

// ─── Portrait card (non-featured) ────────────────────────────────────────────
// Compact card: circle headshot in top-right corner, name/role top-left,
// philosophy, radar, optional balance bar.

function PortraitCard({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 22 });
  // Subtle parallax on the headshot
  const hsX = useTransform(springX, [0, 1], ["-5px", "5px"]);
  const hsY = useTransform(springY, [0, 1], ["-4px", "4px"]);

  const { onMouseEnter, onMouseMove: onPillMove, onMouseLeave: onPillLeave, pill } = useTagPill(
    member.skills,
    member.showTags,
  );

  const radarItems = parseCapabilities(member.capabilities);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
    onPillMove(e);
  };
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    onPillLeave();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.1 }}
      onMouseEnter={onMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-border transition-[border-color,box-shadow] duration-500 hover:border-accent-muted hover:shadow-[0_16px_56px_rgba(0,0,0,0.45)]"
      style={{
        background: "linear-gradient(150deg, #181510 0%, #100e09 60%, #0a0907 100%)",
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,165,90,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,90,0.035) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Diagonal glint on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 translate-x-[-115%] transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-[230%]"
        style={{
          background:
            "linear-gradient(108deg, transparent 30%, rgba(255,248,220,0.04) 45%, rgba(255,255,255,0.07) 50%, rgba(255,248,220,0.04) 55%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col p-8">
        {/* Top row: role+name left, headshot right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <motion.p
              className="font-mono text-[9px] tracking-[0.24em] text-accent uppercase"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            >
              {member.role}
            </motion.p>
            <motion.h3
              className="font-display font-light text-[1.85rem] leading-[1.0] tracking-tight text-text-primary"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            >
              {member.name}
            </motion.h3>
          </div>

          {/* Circle headshot with subtle parallax */}
          <motion.div
            style={{ x: hsX, y: hsY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            className="shrink-0"
          >
            <Headshot photoUrl={member.photoUrl} name={member.name} size={76} />
          </motion.div>
        </div>

        {/* Philosophy */}
        {member.philosophy && (
          <motion.p
            className="mt-5 text-sm italic leading-relaxed text-text-secondary"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          >
            &ldquo;{member.philosophy}&rdquo;
          </motion.p>
        )}

        {/* Radar chart */}
        {radarItems.length >= 3 && (
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.0, ease: EASE, delay: 0.35 }}
          >
            <RadarChart items={radarItems} size={210} />
          </motion.div>
        )}

        {/* Balance bar */}
        {member.showBalance && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
          >
            <BalanceBar balance={member.brandCodeBalance} inView={inView} />
          </motion.div>
        )}
      </div>

      {pill}
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TeamSection({ members: raw }: { members: TeamMember[] }) {
  if (!raw.length) return null;

  const featured = raw.filter((m) => m.featured);
  const others = raw.filter((m) => !m.featured);

  return (
    <section
      aria-labelledby="team-heading"
      className="section border-b border-border bg-surface"
    >
      <div className="container">
        <div className="mb-16">
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
        </div>

        {featured.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {featured.map((m, i) => (
              <CinematicCard key={m.id} member={m} index={i} />
            ))}
          </div>
        )}

        {others.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((m, i) => (
              <PortraitCard key={m.id} member={m} index={i + featured.length} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
