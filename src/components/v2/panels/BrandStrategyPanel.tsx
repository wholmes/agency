"use client";

import { motion } from "framer-motion";

const BG     = "#16161a";
const SURFACE = "#222228";
const BORDER  = "rgba(255,255,255,0.10)";
const GOLD    = "#c9a55a";

const BRAND_PILLARS = [
  { label: "Purpose",     value: "We build tools that give analysts their time back.",       score: 92 },
  { label: "Positioning", value: "Premium-tier analytics for mid-market B2B SaaS.",          score: 88 },
  { label: "Personality", value: "Precise. Direct. A little obsessive about quality.",       score: 95 },
  { label: "Promise",     value: "Every insight surfaces in under 90 seconds.",              score: 79 },
];

const COMP_MAP = [
  { name: "Us",          x: 78, y: 22, gold: true,  r: 9  },
  { name: "Agency A",    x: 32, y: 68, gold: false, r: 6  },
  { name: "Agency B",    x: 55, y: 58, gold: false, r: 7  },
  { name: "Freelancer",  x: 18, y: 82, gold: false, r: 5  },
  { name: "Platform",    x: 68, y: 72, gold: false, r: 6  },
];

const PALETTE = [
  { name: "Gold",    hex: "#c9a55a" },
  { name: "Ink",     hex: "#080808" },
  { name: "Slate",   hex: "#16161a" },
  { name: "Frost",   hex: "#e8eaf0" },
  { name: "Muted",   hex: "#4a4a5a" },
];

export default function BrandStrategyPanel() {
  return (
    <div style={{ background: BG, width: "100%", height: "100%", fontFamily: "var(--font-mono, monospace)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>Brand Strategy — Vault Finance</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Phase 2 / 3</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left — Brand pillars */}
        <div style={{ flex: 1, padding: 16, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Brand Pillars</span>

          {BRAND_PILLARS.map(({ label, value, score }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
              style={{ background: SURFACE, borderRadius: 6, padding: "10px 12px", border: `1px solid ${BORDER}` }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                <span style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>{score}%</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 8 }}>{value}</div>
              {/* Score bar */}
              <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: i * 0.15 + 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${GOLD}, rgba(201,165,90,0.5))` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right — Positioning map + palette */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Positioning map */}
          <div style={{ flex: 1, padding: 14, borderBottom: `1px solid ${BORDER}`, position: "relative" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 8 }}>Positioning</span>
            <div style={{ position: "relative", width: "100%", height: 140 }}>
              {/* Axes */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.12)" }} />
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.12)" }} />
              {/* Axis labels */}
              <span style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Premium</span>
              <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Commodity</span>
              <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>Broad</span>
              <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>Niche</span>

              {/* Competitor dots */}
              {COMP_MAP.map(({ name, x, y, gold, r }) => (
                <motion.div
                  key={name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + COMP_MAP.findIndex(c => c.name === name) * 0.1, type: "spring", stiffness: 300 }}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    width: r * 2,
                    height: r * 2,
                    borderRadius: "50%",
                    background: gold ? GOLD : "rgba(255,255,255,0.22)",
                    border: gold ? `1.5px solid rgba(201,165,90,0.9)` : `1px solid rgba(255,255,255,0.3)`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: gold ? `0 0 16px rgba(201,165,90,0.5)` : "none",
                  }}
                  title={name}
                />
              ))}
            </div>
          </div>

          {/* Colour palette strip */}
          <div style={{ padding: 14 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>Palette</span>
            <div style={{ display: "flex", gap: 6 }}>
              {PALETTE.map(({ name, hex }) => (
                <div key={name} title={name} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ height: 32, borderRadius: 4, background: hex, border: `1px solid rgba(255,255,255,0.12)` }} />
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", textAlign: "center", letterSpacing: "0.05em" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
