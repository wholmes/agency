"use client";

import { motion } from "framer-motion";

const BG     = "#16161a";
const SURFACE = "#1c1c22";
const BORDER  = "rgba(255,255,255,0.07)";
const GOLD    = "#c9a55a";

const MESSAGES = [
  {
    tier: "Tagline",
    text: "Where precision meets performance.",
    approved: true,
  },
  {
    tier: "Hero headline",
    text: "Analytics built for the teams that hate dashboards.",
    approved: true,
  },
  {
    tier: "Value prop",
    text: "Stop guessing. Start knowing. Every conversion tracked, attributed, and acted on — in real time.",
    approved: false,
  },
  {
    tier: "CTA",
    text: "See it in your stack →",
    approved: true,
  },
];

const TONE_ATTRS = [
  { label: "Direct",     pct: 90 },
  { label: "Confident",  pct: 85 },
  { label: "Technical",  pct: 70 },
  { label: "Warm",       pct: 45 },
  { label: "Playful",    pct: 20 },
];

export default function MessagingPanel() {
  return (
    <div style={{ background: BG, width: "100%", height: "100%", fontFamily: "var(--font-mono, monospace)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>messaging-framework.md</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>v1.3 · Draft</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left — Message hierarchy */}
        <div style={{ flex: 1, padding: 16, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Message Hierarchy</span>
          {MESSAGES.map(({ tier, text, approved }, i) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.45 }}
              style={{
                background: SURFACE,
                border: `1px solid ${approved ? "rgba(201,165,90,0.2)" : BORDER}`,
                borderRadius: 6,
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{tier}</span>
                <span style={{
                  fontSize: 8,
                  padding: "2px 7px",
                  borderRadius: 10,
                  background: approved ? "rgba(77,175,124,0.15)" : "rgba(245,166,35,0.1)",
                  color: approved ? "#4daf7c" : "#f5a623",
                  letterSpacing: "0.08em",
                }}>
                  {approved ? "Approved" : "In review"}
                </span>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, margin: 0, fontFamily: "serif", fontStyle: "italic" }}>
                "{text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right — Tone of voice */}
        <div style={{ width: 160, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Tone of voice</span>
          {TONE_ATTRS.map(({ label, pct }, i) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{label}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{pct}%</span>
              </div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.1 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: 2, borderRadius: 2, background: pct > 70 ? GOLD : "rgba(255,255,255,0.25)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
