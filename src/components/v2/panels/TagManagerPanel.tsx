"use client";

import { motion } from "framer-motion";

const BG      = "#16161a";
const SURFACE = "#1c1c22";
const BORDER  = "rgba(255,255,255,0.07)";
const GOLD    = "#c9a55a";
const EASE: [number,number,number,number] = [0.16, 1, 0.3, 1];

type TagStatus = "live" | "paused" | "draft";

interface Tag {
  name: string;
  type: string;
  trigger: string;
  status: TagStatus;
  fires: number;
}

const TAGS: Tag[] = [
  { name: "GA4 — Page View",          type: "GA4",      trigger: "All Pages",           status: "live",   fires: 14820 },
  { name: "GA4 — Form Submit",         type: "GA4",      trigger: "Form Submission",     status: "live",   fires: 632   },
  { name: "Meta Pixel — Purchase",     type: "Meta",     trigger: "Thank You Page",      status: "live",   fires: 211   },
  { name: "Segment — Identify",        type: "Segment",  trigger: "Sign Up Complete",    status: "live",   fires: 408   },
  { name: "GA4 — Scroll Depth 50%",   type: "GA4",      trigger: "Scroll 50%",          status: "paused", fires: 0     },
  { name: "LinkedIn — Lead Event",     type: "LinkedIn", trigger: "Contact Form",        status: "draft",  fires: 0     },
];

const STATUS_COLOR: Record<TagStatus, { bg: string; text: string; dot: string }> = {
  live:   { bg: "rgba(77,175,124,0.12)", text: "#4daf7c", dot: "#4daf7c" },
  paused: { bg: "rgba(245,166,35,0.1)",  text: "#f5a623", dot: "#f5a623" },
  draft:  { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.35)", dot: "rgba(255,255,255,0.3)" },
};

const TYPE_COLOR: Record<string, string> = {
  GA4:      "#c9a55a",
  Meta:     "#60a5fa",
  Segment:  "#a78bfa",
  LinkedIn: "#38bdf8",
};

const WORKSPACE = "Vault Finance · Production";

export default function TagManagerPanel() {
  return (
    <div
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
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${BORDER}`,
          padding: "9px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.07em" }}>
            Tag Manager
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", margin: "0 4px" }}>·</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
            {WORKSPACE}
          </span>
        </div>
        <div
          style={{
            fontSize: 9,
            padding: "2px 8px",
            borderRadius: 10,
            background: "rgba(77,175,124,0.12)",
            border: "1px solid rgba(77,175,124,0.25)",
            color: "#4daf7c",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Published
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        {[
          { label: "Tags", value: "6", sub: "4 live" },
          { label: "Triggers", value: "8", sub: "all active" },
          { label: "Variables", value: "12", sub: "built-in + custom" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "10px 14px",
              borderRight: i < 2 ? `1px solid ${BORDER}` : undefined,
            }}
          >
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 2 }}>{s.value}</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 70px 100px 60px",
          padding: "6px 14px",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        {["Tag name", "Type", "Trigger", "Fires"].map((h) => (
          <span
            key={h}
            style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.12em" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Tag rows */}
      <div style={{ flex: 1, overflowY: "hidden", display: "flex", flexDirection: "column" }}>
        {TAGS.map((tag, i) => {
          const sc = STATUS_COLOR[tag.status];
          const tc = TYPE_COLOR[tag.type] ?? "rgba(255,255,255,0.4)";
          return (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.15, duration: 0.45, ease: EASE }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 70px 100px 60px",
                padding: "8px 14px",
                borderBottom: `1px solid ${BORDER}`,
                alignItems: "center",
                background: tag.status === "live" ? "rgba(255,255,255,0.01)" : "transparent",
              }}
            >
              {/* Name + status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: sc.dot,
                    flexShrink: 0,
                    boxShadow: tag.status === "live" ? `0 0 5px ${sc.dot}` : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: 10.5,
                    color: tag.status === "live" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag.name}
                </span>
              </div>

              {/* Type pill */}
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: `${tc}18`,
                  color: tc,
                  border: `1px solid ${tc}30`,
                  letterSpacing: "0.05em",
                  width: "fit-content",
                }}
              >
                {tag.type}
              </span>

              {/* Trigger */}
              <span
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.3)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {tag.trigger}
              </span>

              {/* Fire count */}
              <span
                style={{
                  fontSize: 10,
                  color: tag.fires > 0 ? GOLD : "rgba(255,255,255,0.18)",
                  fontWeight: tag.fires > 0 ? 600 : 400,
                  textAlign: "right",
                }}
              >
                {tag.fires > 0 ? tag.fires.toLocaleString() : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer — last published */}
      <div
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: "7px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
          Last published: 2 hours ago
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#4daf7c",
              boxShadow: "0 0 5px #4daf7c",
            }}
          />
          <span style={{ fontSize: 9, color: "#4daf7c" }}>All tags firing</span>
        </div>
      </div>
    </div>
  );
}
