"use client";

import { useEffect, useState } from "react";

const BG = "#16161a";
const SURFACE = "#1c1c22";
const BORDER = "rgba(255,255,255,0.07)";

const PROJECTS = [
  {
    client: "Horizon SaaS",
    type: "Web Design",
    status: "In Progress",
    statusColor: "#f5a623",
    progress: 68,
    sprint: "Sprint 4",
    tags: [{ label: "Design", bg: "#1e1c3d", text: "#a78bfa" }, { label: "Next.js", bg: "#1c2433", text: "#60a5fa" }],
    avatars: ["#f5a623", "#7c6fcd"],
    updated: "2m ago",
  },
  {
    client: "DataLayer Co.",
    type: "Analytics",
    status: "Live",
    statusColor: "#4daf7c",
    progress: 100,
    sprint: "Shipped",
    tags: [{ label: "GA4", bg: "#1c2d1e", text: "#4ade80" }, { label: "GTM", bg: "#2d2010", text: "#fbbf24" }],
    avatars: ["#60a5fa"],
    updated: "1h ago",
  },
  {
    client: "Vault Finance",
    type: "Brand Strategy",
    status: "In Review",
    statusColor: "#7c6fcd",
    progress: 85,
    sprint: "Sprint 2",
    tags: [{ label: "Brand", bg: "#1e1c3d", text: "#a78bfa" }, { label: "Copy", bg: "#1c2433", text: "#60a5fa" }],
    avatars: ["#f87171", "#f5a623"],
    updated: "4h ago",
  },
  {
    client: "Blueprint Tools",
    type: "Web Development",
    status: "In Progress",
    statusColor: "#f5a623",
    progress: 42,
    sprint: "Sprint 1",
    tags: [{ label: "Next.js", bg: "#1c2433", text: "#60a5fa" }, { label: "API", bg: "#1c2d1e", text: "#4ade80" }],
    avatars: ["#4ade80", "#a78bfa"],
    updated: "12m ago",
  },
];

const METRICS = [
  { label: "Active Projects", value: "12", delta: "+3 this month" },
  { label: "Avg Lighthouse", value: "96", delta: "↑ from 91" },
  { label: "On-Time Delivery", value: "94%", delta: "Last 6 sprints" },
];

function ProgressBar({ pct, color = "#c9a55a" }: { pct: number; color?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 3, width: "100%" }}>
      <div
        style={{
          height: 3,
          borderRadius: 4,
          width: `${width}%`,
          background: color,
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

export default function StudioDashboardPanel() {
  return (
    <div
      style={{
        background: BG,
        width: "100%",
        height: "100%",
        fontFamily: "var(--font-mono), monospace",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4daf7c" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>BrandMeetsCode Studio</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["Projects", "Sprints", "Reports"].map((t) => (
            <span key={t} style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 160, borderRight: `1px solid ${BORDER}`, padding: "16px 0", flexShrink: 0 }}>
          {["All Projects", "In Progress", "In Review", "Shipped", "Archived"].map((item, i) => (
            <div
              key={item}
              style={{
                padding: "6px 16px",
                fontSize: 11,
                color: i === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.25)",
                background: i === 0 ? "rgba(255,255,255,0.04)" : "transparent",
                borderLeft: i === 0 ? "1px solid rgba(201,165,90,0.5)" : "1px solid transparent",
                cursor: "default",
              }}
            >
              {item}
            </div>
          ))}

          {/* Metric strip */}
          <div style={{ marginTop: 20, padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            {METRICS.map(({ label, value, delta }) => (
              <div key={label}>
                <div style={{ fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                <div style={{ fontSize: 9, color: "rgba(201,165,90,0.55)", marginTop: 1 }}>{delta}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: "hidden", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 2fr 0.8fr", gap: 8, padding: "0 8px 8px", borderBottom: `1px solid ${BORDER}` }}>
            {["Client", "Type", "Status", "Progress", "Updated"].map((h) => (
              <span key={h} style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{h}</span>
            ))}
          </div>

          {/* Project rows */}
          {PROJECTS.map((p, i) => (
            <div
              key={p.client}
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1fr 1fr 2fr 0.8fr",
                gap: 8,
                alignItems: "center",
                padding: "10px 8px",
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                borderRadius: 4,
              }}
            >
              {/* Client + sprint */}
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{p.client}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{p.sprint}</div>
              </div>

              {/* Type */}
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.type}</div>

              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: p.statusColor, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: p.statusColor }}>{p.status}</span>
              </div>

              {/* Progress bar + tags */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1 }}>
                    <ProgressBar pct={p.progress} color={p.statusColor === "#4daf7c" ? "#4daf7c" : "#c9a55a"} />
                  </div>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{p.progress}%</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {p.tags.map((tag) => (
                    <span key={tag.label} style={{ fontSize: 9, background: tag.bg, color: tag.text, padding: "1px 6px", borderRadius: 10 }}>{tag.label}</span>
                  ))}
                </div>
              </div>

              {/* Avatars + updated */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <div style={{ display: "flex", gap: -4 }}>
                  {p.avatars.map((color, ai) => (
                    <div key={ai} style={{ width: 18, height: 18, borderRadius: "50%", background: color, border: `1.5px solid ${BG}`, marginLeft: ai > 0 ? -6 : 0 }} />
                  ))}
                </div>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{p.updated}</span>
              </div>
            </div>
          ))}

          {/* Bottom sparkline bar */}
          <div style={{ marginTop: "auto", padding: "12px 8px 0", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>Delivery velocity</span>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3, height: 24 }}>
              {[40, 55, 48, 70, 62, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? "rgba(201,165,90,0.6)" : "rgba(255,255,255,0.1)", borderRadius: "2px 2px 0 0" }} />
              ))}
            </div>
            <span style={{ fontSize: 9, color: "rgba(201,165,90,0.6)", flexShrink: 0 }}>↑ 18% QoQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
