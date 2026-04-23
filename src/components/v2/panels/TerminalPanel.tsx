"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const BG      = "#111116";
const SIDEBAR = "#0e0e13";
const SURFACE = "#1a1a22";
const BORDER  = "rgba(255,255,255,0.09)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Line =
  | { type: "cmd";     text: string }
  | { type: "success"; text: string }
  | { type: "warn";    text: string }
  | { type: "muted";   text: string }
  | { type: "gold";    text: string }
  | { type: "blank" };

const SCRIPT: Line[] = [
  { type: "cmd",     text: "$ npm run build" },
  { type: "blank" },
  { type: "muted",   text: "▶ Next.js 15.3 — production" },
  { type: "muted",   text: "  Linting & type-checking…" },
  { type: "success", text: "  ✓ No TypeScript errors" },
  { type: "success", text: "  ✓ ESLint passed (0 warnings)" },
  { type: "blank" },
  { type: "muted",   text: "  Compiling 47 modules…" },
  { type: "success", text: "  ✓ Compiled successfully" },
  { type: "blank" },
  { type: "muted",   text: "  Route (app)               Size" },
  { type: "muted",   text: "  ──────────────────────────────" },
  { type: "muted",   text: "  ○ /                      4.2 kB" },
  { type: "muted",   text: "  ○ /work/[id]             6.1 kB" },
  { type: "muted",   text: "  ○ /services/[slug]       3.8 kB" },
  { type: "muted",   text: "  ƒ /api/contact             512 B" },
  { type: "blank" },
  { type: "muted",   text: "  Deploying to Vercel…" },
  { type: "gold",    text: "  ✓ horizon.vercel.app" },
  { type: "gold",    text: "  ✓ Deploy: 34s · Build: 12s" },
  { type: "blank" },
  { type: "success", text: "  Done in 46.2s" },
  { type: "blank" },
  { type: "cmd",     text: "$ _" },
];

const COLOR: Record<Line["type"], string> = {
  cmd:     "#c9a55a",
  success: "#5dca8e",
  warn:    "#f5a623",
  muted:   "rgba(255,255,255,0.5)",
  gold:    "#d4b46a",
  blank:   "transparent",
};

const DELAYS: number[] = SCRIPT.reduce<number[]>((acc, line) => {
  const prev = acc[acc.length - 1] ?? 0;
  const gap =
    line.type === "blank"   ? 70  :
    line.type === "cmd"     ? 350 :
    line.type === "muted" && acc.length > 6 ? 160 :
    100;
  acc.push(prev + gap);
  return acc;
}, []);

const SCORES = [
  { label: "Performance",    score: 98,  color: "#5dca8e" },
  { label: "Accessibility",  score: 100, color: "#5dca8e" },
  { label: "Best Practices", score: 100, color: "#5dca8e" },
  { label: "SEO",            score: 100, color: "#5dca8e" },
];

const FILES = [
  { name: "app/",          indent: 0, color: "rgba(255,255,255,0.5)" },
  { name: "page.tsx",      indent: 1, color: "#60a5fa" },
  { name: "layout.tsx",    indent: 1, color: "#60a5fa" },
  { name: "work/",         indent: 1, color: "rgba(255,255,255,0.4)" },
  { name: "[id]/",         indent: 2, color: "rgba(255,255,255,0.35)" },
  { name: "page.tsx",      indent: 2, color: "#60a5fa" },
  { name: "components/",   indent: 0, color: "rgba(255,255,255,0.5)" },
  { name: "Navigation.tsx",indent: 1, color: "#a78bfa" },
  { name: "Hero.tsx",      indent: 1, color: "#a78bfa" },
  { name: "lib/",          indent: 0, color: "rgba(255,255,255,0.5)" },
  { name: "cms/",          indent: 1, color: "rgba(255,255,255,0.4)" },
  { name: "queries.ts",    indent: 2, color: "#fbbf24" },
];

export default function TerminalPanel() {
  const [visible, setVisible] = useState(0);
  const [blink, setBlink]     = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.2 });

  useEffect(() => {
    if (inView) setVisible(0);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    if (visible >= SCRIPT.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), DELAYS[visible] ?? 100);
    return () => clearTimeout(t);
  }, [visible, inView]);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  // Show scores after terminal finishes
  const scoresVisible = visible >= SCRIPT.length - 2;

  return (
    <div
      ref={containerRef}
      style={{
        background: BG,
        width: "100%",
        height: "100%",
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#f87171", "#f5a623", "#4daf7c"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", marginLeft: 4 }}>
            horizon-saas — zsh
          </span>
        </div>
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1c2e20", border: "1px solid #2d5a3d", borderRadius: 6, padding: "3px 8px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4daf7c", display: "inline-block", boxShadow: "0 0 6px #4daf7c" }} />
          <span style={{ fontSize: 10, color: "#5dca8e" }}>Building</span>
        </div>
      </div>

      {/* Body: sidebar + terminal + scores */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* File tree sidebar */}
        <div style={{ width: 140, background: SIDEBAR, borderRight: `1px solid ${BORDER}`, padding: "12px 0", flexShrink: 0, overflowY: "hidden" }}>
          <div style={{ padding: "0 10px 8px", fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Explorer</div>
          {FILES.map(({ name, indent, color }, i) => (
            <div
              key={i}
              style={{
                padding: `2px 10px 2px ${10 + indent * 12}px`,
                fontSize: 10.5,
                color,
                lineHeight: 1.7,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {indent > 0 ? "  " : ""}{name}
            </div>
          ))}
        </div>

        {/* Right: terminal output + lighthouse scores */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Terminal output */}
          <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {SCRIPT.slice(0, visible).map((line, i) => {
              const isLastCmd = line.type === "cmd" && i === SCRIPT.length - 1;
              const text = isLastCmd
                ? line.text.replace("_", blink ? "█" : " ")
                : line.type === "blank" ? "\u00A0" : line.text;
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    color: COLOR[line.type],
                    whiteSpace: "pre",
                    fontWeight: line.type === "cmd" ? 600 : 400,
                  }}
                >
                  {text}
                </div>
              );
            })}
          </div>

          {/* Lighthouse score cards — animate in when build completes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: scoresVisible ? 1 : 0, y: scoresVisible ? 0 : 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ borderTop: `1px solid ${BORDER}`, padding: "10px 16px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, flexShrink: 0 }}
          >
            {SCORES.map(({ label, score, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: scoresVisible ? 1 : 0, scale: scoresVisible ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                style={{ background: SURFACE, borderRadius: 6, padding: "8px 6px", border: `1px solid ${BORDER}`, textAlign: "center" }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{score}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", lineHeight: 1.3, letterSpacing: "0.04em" }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
