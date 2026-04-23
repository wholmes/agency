"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

const BG     = "#16161a";
const CARD   = "#1c1c22";
const BORDER = "rgba(255,255,255,0.07)";

type StreamRow = { event: string; dest: string; latency: string; status: "fired" | "queued" };

const BASE_STREAM: StreamRow[] = [
  { event: "page_view",       dest: "GA4",       latency: "0ms",  status: "fired"  },
  { event: "add_to_cart",     dest: "Meta CAPI",  latency: "2ms",  status: "fired"  },
  { event: "checkout_start",  dest: "GA4",       latency: "2ms",  status: "fired"  },
  { event: "purchase",        dest: "TikTok",    latency: "3ms",  status: "fired"  },
  { event: "form_submit",     dest: "Klaviyo",   latency: "1ms",  status: "queued" },
  { event: "session_start",   dest: "GA4",       latency: "0ms",  status: "fired"  },
  { event: "view_item",       dest: "Meta CAPI",  latency: "4ms",  status: "fired"  },
];

const CONSENT_BARS = [
  { region: "GDPR — EU",      pct: 94,  color: "#4ade80" },
  { region: "CCPA — CA",      pct: 100, color: "#4ade80" },
  { region: "LGPD — Brazil",  pct: 88,  color: "#fbbf24" },
  { region: "PDPA — Thailand",pct: 100, color: "#4ade80" },
];

const CHART_DATA = [55, 62, 48, 70, 65, 80, 72, 88, 76, 95, 88, 100];

export default function IntentlyPanel() {
  const [activeRow, setActiveRow] = useState(0);
  const tickRef = useRef(0);

  useAnimationFrame((t) => {
    const tick = Math.floor(t / 1100);
    if (tick !== tickRef.current) {
      tickRef.current = tick;
      setActiveRow((p) => (p + 1) % BASE_STREAM.length);
    }
  });

  return (
    <div className="h-full w-full overflow-hidden font-sans" style={{ background: BG }}>

      {/* Chrome */}
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#28ca41]" />
          </div>
          <div className="h-4 w-px mx-2" style={{ background: BORDER }} />
          <span className="text-[11px] font-medium text-white/60">Intently</span>
          <span className="text-white/20">—</span>
          <span className="text-[11px] text-white/40">Event Pipeline · Live</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px]" style={{ background: "#1c3626", border: "1px solid #2d5a3d" }}>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-emerald-400">4,218 / sec</span>
          </div>
          <span className="rounded-md px-2 py-1.5 text-[10px] text-white/30" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            99.9% uptime
          </span>
        </div>
      </div>

      {/* 3 stat pills */}
      <div className="grid grid-cols-3 border-b" style={{ borderColor: BORDER }}>
        {[
          { label: "Median Latency", value: "47ms",  color: "#4ade80" },
          { label: "Events / Month", value: "8.2B+", color: "#c9a55a" },
          { label: "Uptime SLA",     value: "99.9%", color: "#60a5fa" },
        ].map((m, i) => (
          <div key={m.label} className={`px-4 py-3 ${i < 2 ? "border-r" : ""}`} style={{ borderColor: BORDER }}>
            <p className="mb-0.5 text-[9px] uppercase tracking-widest text-white/25">{m.label}</p>
            <p className="text-[15px] font-semibold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Bottom half: chart left, stream right */}
      <div className="grid h-[calc(100%-110px)] grid-cols-[1fr_1fr]">

        {/* Left: chart + consent bars */}
        <div className="border-r p-4" style={{ borderColor: BORDER }}>
          {/* Mini bar chart */}
          <p className="mb-2 text-[10px] font-medium text-white/65">Capture rate · last 12 days</p>
          <div className="mb-1.5 flex h-16 items-end gap-1">
            {CHART_DATA.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col gap-0.5">
                <motion.div
                  className="w-full rounded-sm"
                  style={{ background: i >= CHART_DATA.length - 3 ? "#c9a55a" : "rgba(255,255,255,0.18)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16,1,0.3,1] }}
                />
              </div>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-3 text-[9px] text-white/25">
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-3 rounded-full bg-[#c9a55a]" /> Intently</span>
            <span className="flex items-center gap-1"><span className="inline-block h-1.5 w-3 rounded-full bg-white/15" /> Client-side</span>
          </div>

          {/* Consent coverage */}
          <p className="mb-3 text-[10px] font-medium text-white/65">Consent Coverage</p>
          {CONSENT_BARS.map((b) => (
            <div key={b.region} className="mb-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-white/60">{b.region}</span>
                <span className="font-mono text-[10px]" style={{ color: b.color }}>{b.pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: b.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16,1,0.3,1] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: live event stream */}
        <div className="flex flex-col p-4">
          <p className="mb-3 text-[10px] font-medium text-white/65">Live Event Stream</p>
          <div className="mb-2 grid grid-cols-[1fr_70px_45px_40px] gap-2 border-b pb-2" style={{ borderColor: BORDER }}>
            {["event","destination","latency",""].map((h) => (
              <span key={h} className="text-[9px] uppercase tracking-widest text-white/20">{h}</span>
            ))}
          </div>
          {BASE_STREAM.map((row, i) => (
            <motion.div
              key={i}
              animate={{
                background: activeRow === i ? "rgba(255,255,255,0.04)" : "transparent",
              }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-[1fr_70px_45px_40px] items-center gap-2 rounded px-1 py-2"
            >
              <span className="font-mono text-[10px] font-medium text-white/80">{row.event}</span>
              <span className="text-[10px] text-white/50">{row.dest}</span>
              <span className="font-mono text-[10px] text-white/40">{row.latency}</span>
              <span
                className="size-2 rounded-full"
                style={{ background: row.status === "fired" ? "#4ade80" : "#fbbf24" }}
              />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
