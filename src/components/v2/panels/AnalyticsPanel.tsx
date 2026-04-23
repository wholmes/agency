"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

const BG     = "#16161a";
const CARD   = "#1c1c22";
const BORDER = "rgba(255,255,255,0.07)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Sparkline path helper — builds an SVG polyline from data array
function sparkPath(data: number[], w: number, h: number): string {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// Area fill under sparkline
function areaPath(data: number[], w: number, h: number): string {
  const line = sparkPath(data, w, h);
  return `${line} L${w},${h} L0,${h} Z`;
}

const SESSIONS =   [820, 910, 870, 1050, 980, 1200, 1140, 1380, 1260, 1520, 1480, 1640];
const CONVERSIONS = [24,  28,  22,  35,   30,   42,   39,   51,   46,   58,   54,   63];
const REVENUE =    [1.8, 2.1, 1.9, 2.8,  2.4,  3.6,  3.2,  4.5,  4.0,  5.1,  4.8,  5.7];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CHANNELS = [
  { name: "Organic Search", sessions: 4820, pct: 41, color: "#c9a55a" },
  { name: "Paid Social",    sessions: 2940, pct: 25, color: "#60a5fa" },
  { name: "Direct",         sessions: 1880, pct: 16, color: "#4ade80" },
  { name: "Email",          sessions: 1060, pct:  9, color: "#a78bfa" },
  { name: "Referral",       sessions:  820, pct:  7, color: "#f87171" },
  { name: "Other",          sessions:  240, pct:  2, color: "rgba(255,255,255,0.2)" },
];

export default function AnalyticsPanel() {
  const [activeMetric, setActiveMetric] = useState<"sessions" | "conversions" | "revenue">("sessions");
  const tickRef = useRef(0);
  const [tick, setTick] = useState(0);

  useAnimationFrame((t) => {
    const newTick = Math.floor(t / 3200) % 3;
    if (newTick !== tickRef.current) {
      tickRef.current = newTick;
      setTick(newTick);
      setActiveMetric(newTick === 0 ? "sessions" : newTick === 1 ? "conversions" : "revenue");
    }
  });

  const metricData = activeMetric === "sessions" ? SESSIONS : activeMetric === "conversions" ? CONVERSIONS : REVENUE;
  const metricColor = activeMetric === "sessions" ? "#c9a55a" : activeMetric === "conversions" ? "#4ade80" : "#60a5fa";
  const metricLabel = activeMetric === "sessions" ? "Sessions" : activeMetric === "conversions" ? "Conversions" : "Revenue ($K)";
  const lastVal = metricData[metricData.length - 1];
  const prevVal = metricData[metricData.length - 2];
  const delta = (((lastVal - prevVal) / prevVal) * 100).toFixed(1);

  return (
    <div className="h-full w-full overflow-hidden font-sans" style={{ background: BG }}>

      {/* Chrome bar */}
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#28ca41]" />
          </div>
          <div className="mx-2 h-4 w-px" style={{ background: BORDER }} />
          <span className="text-[11px] font-medium text-white/60">Growth Analytics</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] text-white/35">Q4 2024</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="rounded px-2 py-1 text-[10px] font-medium"
            style={{ background: "#1c3626", border: "1px solid #2d5a3d", color: "#4ade80" }}
          >
            ↑ 18.4% MoM
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 border-b" style={{ borderColor: BORDER }}>
        {[
          { key: "sessions",     label: "Sessions",     value: "11.7K",  delta: "+18%", color: "#c9a55a" },
          { key: "conversions",  label: "Conversions",  value: "63",     delta: "+17%", color: "#4ade80" },
          { key: "revenue",      label: "Revenue",      value: "$5.7K",  delta: "+19%", color: "#60a5fa" },
        ].map((m, i) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key as typeof activeMetric)}
            className={`px-4 py-3 text-left transition-colors ${i < 2 ? "border-r" : ""} ${activeMetric === m.key ? "bg-white/[0.03]" : ""}`}
            style={{ borderColor: BORDER }}
          >
            <p className="mb-0.5 text-[9px] uppercase tracking-widest text-white/25">{m.label}</p>
            <p className="text-[15px] font-semibold leading-none" style={{ color: m.color }}>{m.value}</p>
            <p className="mt-0.5 font-mono text-[9px] text-white/30">{m.delta} vs prior</p>
          </button>
        ))}
      </div>

      {/* Main chart */}
      <div className="border-b px-4 py-3" style={{ borderColor: BORDER }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-medium text-white/50">{metricLabel} · Jan–Dec 2024</span>
          <span className="font-mono text-[10px]" style={{ color: metricColor }}>
            +{delta}% last month
          </span>
        </div>

        {/* SVG area chart */}
        <svg width="100%" height="72" viewBox="0 0 260 72" preserveAspectRatio="none" overflow="visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={metricColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <motion.path
            key={activeMetric + "-area"}
            d={areaPath(metricData, 260, 62)}
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* Line */}
          <motion.path
            key={activeMetric + "-line"}
            d={sparkPath(metricData, 260, 62)}
            fill="none"
            stroke={metricColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          {/* Endpoint dot */}
          <motion.circle
            key={activeMetric + "-dot"}
            cx="260"
            cy={72 - ((metricData[11] - Math.min(...metricData)) / (Math.max(...metricData) - Math.min(...metricData))) * 62}
            r="3"
            fill={metricColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          />
        </svg>

        {/* Month labels */}
        <div className="mt-1 flex justify-between">
          {MONTHS.filter((_, i) => i % 3 === 0).map((m) => (
            <span key={m} className="font-mono text-[8px] text-white/20">{m}</span>
          ))}
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="px-4 pt-3">
        <p className="mb-3 text-[10px] font-medium text-white/50">Traffic by channel</p>
        <div className="space-y-2">
          {CHANNELS.map((ch, i) => (
            <motion.div
              key={ch.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
            >
              <div className="w-[88px] shrink-0">
                <span className="text-[10px] text-white/45">{ch.name}</span>
              </div>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ background: ch.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${ch.pct}%` }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.07, ease: EASE }}
                />
              </div>
              <div className="w-8 shrink-0 text-right font-mono text-[10px] text-white/30">
                {ch.pct}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
