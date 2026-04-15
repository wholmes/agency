"use client";

import { useMemo } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export type RadarItem = { name: string; value: number };

// ─── Maths ────────────────────────────────────────────────────────────────────

function polarToXY(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
): [number, number] {
  return [
    cx + radius * Math.cos(angleRad),
    cy + radius * Math.sin(angleRad),
  ];
}

function pointsForItems(
  items: RadarItem[],
  cx: number,
  cy: number,
  maxR: number,
  progress: number,
): string {
  const n = items.length;
  return items
    .map((item, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const r = ((item.value / 100) * maxR * progress);
      const [x, y] = polarToXY(cx, cy, r, angle);
      return `${x},${y}`;
    })
    .join(" ");
}

function ringPoints(
  n: number,
  cx: number,
  cy: number,
  r: number,
): string {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const [x, y] = polarToXY(cx, cy, r, angle);
    return `${x},${y}`;
  }).join(" ");
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RadarChartProps {
  items: RadarItem[];
  size?: number;
  className?: string;
}

export default function RadarChart({ items, size = 280, className }: RadarChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  // Animate progress 0 → 1 when in view
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // ease-out-quart
    const frame = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      setProgress(ease(t));
      if (t < 1) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [inView]);

  const n = items.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const labelR = maxR + size * 0.115;
  const RINGS = [0.25, 0.5, 0.75, 1.0];

  const dataPoints = useMemo(
    () => pointsForItems(items, cx, cy, maxR, progress),
    [items, cx, cy, maxR, progress],
  );

  if (n < 3) return null;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        {/* Radial glow for data polygon */}
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,165,90,0.22)" />
          <stop offset="100%" stopColor="rgba(201,165,90,0.04)" />
        </radialGradient>

        {/* Glow filter for the stroke + dots */}
        <filter id="radar-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft glow on dot */}
        <filter id="dot-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id="radar-clip">
          <circle cx={cx} cy={cy} r={maxR + 4} />
        </clipPath>
      </defs>

      {/* ── Concentric rings ── */}
      {RINGS.map((fraction, ri) => (
        <polygon
          key={ri}
          points={ringPoints(n, cx, cy, maxR * fraction)}
          fill="none"
          stroke="rgba(201,165,90,0.10)"
          strokeWidth={fraction === 1 ? 0.75 : 0.5}
        />
      ))}

      {/* ── Axis lines ── */}
      {items.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const [x2, y2] = polarToXY(cx, cy, maxR, angle);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="rgba(201,165,90,0.14)"
            strokeWidth={0.75}
          />
        );
      })}

      {/* ── Center dot ── */}
      <circle cx={cx} cy={cy} r={2} fill="rgba(201,165,90,0.35)" />

      {/* ── Data polygon fill ── */}
      <polygon
        points={dataPoints}
        fill="url(#radar-fill)"
        clipPath="url(#radar-clip)"
      />

      {/* ── Data polygon stroke ── */}
      <polygon
        points={dataPoints}
        fill="none"
        stroke="rgba(201,165,90,0.75)"
        strokeWidth={1.25}
        strokeLinejoin="round"
        filter="url(#radar-glow)"
      />

      {/* ── Vertex dots ── */}
      {items.map((item, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const r = (item.value / 100) * maxR * progress;
        const [x, y] = polarToXY(cx, cy, r, angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.5}
            fill="rgba(201,165,90,0.9)"
            filter="url(#dot-glow)"
          />
        );
      })}

      {/* ── Axis labels ── */}
      {items.map((item, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const [lx, ly] = polarToXY(cx, cy, labelR, angle);

        // Horizontal anchor: left half → end, right half → start, top/bottom → middle
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const textAnchor =
          Math.abs(cos) < 0.15 ? "middle" : cos > 0 ? "start" : "end";

        // Split long labels onto two lines
        const words = item.name.split(" ");
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
        const lineHeight = 9.5;
        const dyOffset = line2 ? -lineHeight / 2 : 0;

        return (
          <g key={i} opacity={progress}>
            {line2 ? (
              <>
                <text
                  x={lx}
                  y={ly + dyOffset}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fill="rgba(201,165,90,0.55)"
                  fontSize={8.5}
                  fontFamily="var(--font-mono, monospace)"
                  letterSpacing="0.06em"
                  style={{ textTransform: "uppercase" }}
                >
                  {line1}
                </text>
                <text
                  x={lx}
                  y={ly + dyOffset + lineHeight}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fill="rgba(201,165,90,0.55)"
                  fontSize={8.5}
                  fontFamily="var(--font-mono, monospace)"
                  letterSpacing="0.06em"
                  style={{ textTransform: "uppercase" }}
                >
                  {line2}
                </text>
              </>
            ) : (
              <text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fill="rgba(201,165,90,0.55)"
                fontSize={8.5}
                fontFamily="var(--font-mono, monospace)"
                letterSpacing="0.06em"
                style={{ textTransform: "uppercase" }}
              >
                {item.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export function parseCapabilities(raw: string): RadarItem[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const colon = entry.lastIndexOf(":");
      if (colon === -1) return { name: entry.trim(), value: 75 };
      const name = entry.slice(0, colon).trim();
      const value = Math.max(0, Math.min(100, Number(entry.slice(colon + 1).trim()) || 75));
      return { name, value };
    })
    .filter((item) => item.name.length > 0);
}
