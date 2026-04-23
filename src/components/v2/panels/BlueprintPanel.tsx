"use client";

import { motion } from "framer-motion";

const BG      = "#16161a";
const ROW_BG  = "#1c1c22";
const BORDER  = "rgba(255,255,255,0.07)";

const EVENTS = [
  { name: "purchase",        objective: "Conversion", platform: "GA4 + GTM", status: "live",    params: "transaction_id, revenue, currency" },
  { name: "generate_lead",   objective: "Conversion", platform: "GA4",       status: "live",    params: "form_id, source, medium" },
  { name: "page_view",       objective: "Awareness",  platform: "GTM",       status: "live",    params: "page_path, page_title" },
  { name: "view_item",       objective: "Consider.",  platform: "GA4 + GTM", status: "review",  params: "item_id, item_name, price" },
  { name: "session_start",   objective: "Retention",  platform: "GA4",       status: "draft",   params: "session_id, engaged_session" },
  { name: "add_to_cart",     objective: "Conversion", platform: "GA4 + GTM", status: "live",    params: "item_id, value, currency" },
];

const STATUS: Record<string, { bg: string; text: string; label: string }> = {
  live:   { bg: "#1c3626", text: "#4ade80", label: "Live" },
  review: { bg: "#2c2510", text: "#fbbf24", label: "Review" },
  draft:  { bg: "#1e1e26", text: "#94a3b8", label: "Draft" },
};

export default function BlueprintPanel() {
  return (
    <div className="h-full w-full overflow-hidden font-sans" style={{ background: BG }}>
      {/* Chrome */}
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#28ca41]" />
        </div>
        <span className="ml-3 text-[11px] font-medium text-white/60">Blueprint Toolkit</span>
        <span className="text-white/20 text-[11px]">—</span>
        <span className="text-[11px] text-white/40">Measurement Framework</span>
        <div className="ml-auto flex items-center gap-1.5 rounded px-2 py-1 text-[9px] text-emerald-400" style={{ background: "#1c3626" }}>
          <span className="size-1.5 rounded-full bg-emerald-400" />
          GA4 connected
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: BORDER }}>
        {["Framework", "GTM Integration", "Implementation Guide", "GA4 Audit"].map((t, i) => (
          <button key={t} className={`px-4 py-2.5 text-[11px] border-b-2 ${i === 0 ? "border-[#c9a55a] text-white/80 font-medium" : "border-transparent text-white/30"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] text-white/50" style={{ background: ROW_BG, border: `1px solid ${BORDER}` }}>
            Template (by options)
            <span className="ml-1 text-white/25">▾</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] text-emerald-400" style={{ background: "#1c3626" }}>
            {EVENTS.length} events
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md px-2.5 py-1.5 text-[10px] text-white/35" style={{ background: ROW_BG, border: `1px solid ${BORDER}` }}>
            Export CSV
          </button>
          <button className="rounded-md px-2.5 py-1.5 text-[10px] font-medium text-[#c9a55a]" style={{ background: "rgba(201,165,90,0.12)", border: "1px solid rgba(201,165,90,0.2)" }}>
            Generate Guide →
          </button>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_100px_90px_80px_70px] gap-3 border-b px-4 py-2" style={{ borderColor: BORDER }}>
        {["Event Name", "Objective", "Platform", "Params", "Status"].map((h) => (
          <span key={h} className="text-[9px] font-semibold uppercase tracking-widest text-white/25">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {EVENTS.map((ev, i) => {
          const s = STATUS[ev.status];
          return (
            <motion.div
              key={ev.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="grid grid-cols-[1fr_100px_90px_80px_70px] items-center gap-3 border-b px-4 py-2.5 hover:bg-white/[0.02] cursor-default"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span className="font-mono text-[11px] font-medium text-white/75">{ev.name}</span>
              <span className="text-[10px] text-white/40">{ev.objective}</span>
              <span className="text-[10px] text-white/40">{ev.platform}</span>
              <span className="truncate text-[9px] text-white/25">{ev.params}</span>
              <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[9px] font-medium" style={{ background: s.bg, color: s.text }}>
                {s.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t px-4 py-3" style={{ borderColor: BORDER, background: BG }}>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] text-white/35">Implementation Progress</span>
          <span className="font-mono text-[10px] text-[#c9a55a]">68% complete</span>
        </div>
        <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#c9a55a" }}
            initial={{ width: 0 }}
            animate={{ width: "68%" }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

    </div>
  );
}
