"use client";

import { motion } from "framer-motion";

// Linear-quality Kanban — cool blue-tinted dark surface, high contrast chips, dense layout

const BG = "#16161a";      // panel background — cool dark, not warm
const CARD_BG = "#1c1c22"; // card surface — 1 stop lighter
const BORDER = "rgba(255,255,255,0.07)";

const COLS = [
  { id: "todo",        label: "Todo",        count: 71, dot: "#666672" },
  { id: "in-progress", label: "In Progress", count: 3,  dot: "#f5a623" },
  { id: "in-review",   label: "In Review",   count: 5,  dot: "#7c6fcd" },
  { id: "done",        label: "Done",        count: 28, dot: "#4daf7c" },
];

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Bug:         { bg: "#3d1c1c", text: "#f87171" },
  Design:      { bg: "#1e1c3d", text: "#a78bfa" },
  AI:          { bg: "#1c2d1e", text: "#4ade80" },
  Performance: { bg: "#2d2010", text: "#fbbf24" },
  Feature:     { bg: "#1c2433", text: "#60a5fa" },
};

type Card = {
  id: string; title: string; tag: string;
  meta: string; avatar: string; avatarColor: string;
  priority?: "urgent" | "high" | "medium";
};

const CARDS: Record<string, Card[]> = {
  "todo": [
    { id: "t1", title: "Remove UI Inconsistencies",  tag: "Bug",    meta: "ENG-826",  avatar: "JK", avatarColor: "#5865f2" },
    { id: "t2", title: "Optimize load times",        tag: "Performance", meta: "ENG-1682", avatar: "AL", avatarColor: "#ec4899" },
    { id: "t3", title: "Add dark mode toggle",       tag: "Design", meta: "ENG-2103", avatar: "MR", avatarColor: "#f59e0b" },
  ],
  "in-progress": [
    { id: "ip1", title: "Server-side GA4 tracking",  tag: "Feature", meta: "ENG-1687", avatar: "RB", avatarColor: "#10b981", priority: "high" },
    { id: "ip2", title: "TypeError: Cannot read properties", tag: "Bug", meta: "ENG-2088", avatar: "DL", avatarColor: "#ef4444", priority: "urgent" },
    { id: "ip3", title: "Launch page assets",        tag: "Design",  meta: "MKT-1028", avatar: "JO", avatarColor: "#8b5cf6" },
  ],
  "in-review": [
    { id: "ir1", title: "Upgrade to Claude Opus 4.5", tag: "AI",   meta: "ENG-924",  avatar: "WH", avatarColor: "#06b6d4" },
    { id: "ir2", title: "Prevent duplicate requests", tag: "Bug",  meta: "ENG-2187", avatar: "KL", avatarColor: "#f43f5e", priority: "high" },
  ],
  "done": [
    { id: "d1", title: "GTM container export v1.4", tag: "Feature", meta: "ENG-682", avatar: "WH", avatarColor: "#06b6d4" },
    { id: "d2", title: "Consent mode v2 integration", tag: "Feature", meta: "ENG-701", avatar: "RB", avatarColor: "#10b981" },
  ],
};

const PRIORITY_DOT: Record<string, string> = {
  urgent: "#ef4444",
  high:   "#f97316",
  medium: "#eab308",
};

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex size-[18px] shrink-0 items-center justify-center rounded-full text-[7px] font-semibold text-white"
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

function KCard({ card, delay }: { card: Card; delay: number }) {
  const tag = TAG_STYLES[card.tag] ?? { bg: "#222", text: "#aaa" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-lg p-3"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      {/* Title */}
      <p className="mb-2.5 text-[11px] font-medium leading-snug text-white/85">
        {card.title}
      </p>
      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="rounded px-1.5 py-0.5 text-[9px] font-medium" style={{ background: tag.bg, color: tag.text }}>
            {card.tag}
          </span>
          {card.priority && (
            <span className="size-1.5 rounded-full" style={{ background: PRIORITY_DOT[card.priority] }} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/25">{card.meta}</span>
          <Avatar initials={card.avatar} color={card.avatarColor} />
        </div>
      </div>
    </motion.div>
  );
}

export default function KanbanPanel() {
  return (
    <div
      className="relative h-full w-full select-none overflow-hidden font-sans text-white"
      style={{ background: BG }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#ffbd2e]" />
            <span className="size-3 rounded-full bg-[#28ca41]" />
          </div>
          <div className="h-4 w-px mx-2" style={{ background: BORDER }} />
          <div className="flex items-center gap-1">
            <div className="size-4 rounded bg-[#5865f2] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">B</span>
            </div>
            <span className="text-[11px] font-medium text-white/50">BrandMeetsCode</span>
          </div>
          <span className="text-white/20 text-[11px]">/</span>
          <span className="text-[11px] text-white/80">DataLayer Tracker</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }}>
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-white/50">Active sprint</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] text-white/40" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}>
            Filters
          </div>
        </div>
      </div>

      {/* ── Layout: sidebar + board ── */}
      <div className="flex h-[calc(100%-45px)]">

        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 flex-col border-r p-3 sm:flex" style={{ borderColor: BORDER }}>
          {[
            { icon: "◎", label: "Inbox",     active: false },
            { icon: "◉", label: "My Issues", active: false },
            { icon: "◈", label: "Reviews",   active: false },
            { icon: "◇", label: "Pulse",     active: false },
            { icon: "≡", label: "All Issues", active: true  },
          ].map(({ icon, label, active }) => (
            <div
              key={label}
              className={`mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] ${active ? "text-white/90" : "text-white/35"}`}
              style={active ? { background: "rgba(255,255,255,0.07)" } : {}}
            >
              <span className="w-3 text-center opacity-60">{icon}</span>
              {label}
            </div>
          ))}
          <div className="my-3 h-px" style={{ background: BORDER }} />
          <p className="mb-2 px-2.5 text-[9px] uppercase tracking-widest text-white/20">Workspace</p>
          {["Initiatives","Roadmap","Projects","Members"].map((item) => (
            <div key={item} className="mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] text-white/25">
              <span className="w-3 text-center">·</span>
              {item}
            </div>
          ))}
        </div>

        {/* Board columns */}
        <div className="flex flex-1 gap-4 overflow-x-auto p-4">
          {COLS.map((col) => {
            const cards = CARDS[col.id] ?? [];
            return (
              <div key={col.id} className="flex w-[220px] shrink-0 flex-col gap-2">
                {/* Col header */}
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: col.dot }} />
                    <span className="text-[11px] font-medium text-white/60">{col.label}</span>
                    <span className="rounded px-1.5 py-0.5 text-[9px] text-white/30" style={{ background: "rgba(255,255,255,0.05)" }}>{col.count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/20">
                    <span className="text-[13px] leading-none">+</span>
                    <span className="text-[13px] leading-none">⋯</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {cards.map((card, ci) => (
                    <KCard key={card.id} card={card} delay={ci * 0.06} />
                  ))}
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-2 text-[10px] text-white/20 hover:text-white/40 cursor-pointer">
                    <span>+</span><span>Add item</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
