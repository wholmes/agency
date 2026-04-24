"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Capability } from "@prisma/client";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LED_COLORS = [
  "#c9a55a", // gold
  "#4fd1c5", // teal
  "#a78bfa", // violet
  "#f472b6", // rose
  "#38bdf8", // cyan
  "#a3e635", // lime
  "#fb923c", // amber
  "#f87171", // coral
];

const LED_DURATIONS = [1.1, 1.7, 2.3, 0.9, 1.5, 2.8, 1.3, 2.0];
const LED_DELAYS    = [0.0, 0.4, 1.1, 0.7, 0.2, 1.5, 0.9, 0.3];

export default function V2CapabilitiesStrip({ capabilities }: { capabilities: Capability[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (!capabilities.length) return null;

  return (
    <motion.section
      aria-label="Capabilities"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="border-y border-white/[0.07]"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)" }}
    >
      <div className="mx-auto max-w-[1280px] px-8 md:px-16">

        {/* Header row */}
        <div className="flex items-center justify-between border-b border-white/[0.05] py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Capabilities</p>
          <p className="font-mono text-[10px] text-white/40">{capabilities.length} disciplines</p>
        </div>

        {/* Accordion rows */}
        <div className="divide-y divide-white/[0.05]">
          {capabilities.map((cap, i) => {
            const color    = LED_COLORS[i % LED_COLORS.length];
            const duration = LED_DURATIONS[i % LED_DURATIONS.length];
            const delay    = LED_DELAYS[i % LED_DELAYS.length];
            const isOpen   = openId === cap.id;

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.03, ease: EASE }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : cap.id)}
                  className="group flex w-full items-center gap-5 py-5 text-left transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  {/* LED dot */}
                  <div
                    className="shrink-0 size-1.5 rounded-full"
                    style={{
                      backgroundColor: isOpen ? color : color,
                      boxShadow: isOpen ? `0 0 6px 2px ${color}` : `0 0 4px 1px ${color}`,
                      animation: `ledPulse ${duration}s ease-in-out ${delay}s infinite`,
                    }}
                  />

                  {/* Title + descriptor */}
                  <div className="flex flex-1 items-baseline gap-4 min-w-0">
                    <span className={`font-body text-[14px] font-medium transition-colors duration-200 ${isOpen ? "text-white" : "text-white/70 group-hover:text-white/95"}`}>
                      {cap.title}
                    </span>
                    {cap.descriptor && (
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 md:block">
                        {cap.descriptor}
                      </span>
                    )}
                  </div>

                  {/* Expand / collapse indicator */}
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="shrink-0 size-5 rounded-full border border-white/[0.12] flex items-center justify-center"
                    style={{ background: isOpen ? `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.1)` : "transparent",
                             borderColor: isOpen ? `${color}40` : undefined }}
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M4.5 1v7M1 4.5h7" stroke={isOpen ? color : "rgba(255,255,255,0.4)"} strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </motion.div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-[26px]">
                        {/* Gold accent line */}
                        <div
                          className="mb-4 h-px w-12"
                          style={{ background: `linear-gradient(90deg, ${color} 0%, transparent 100%)` }}
                        />
                        <p className="max-w-[640px] text-[14px] leading-relaxed text-white/55">
                          {cap.detail}
                        </p>
                        {cap.showTags && cap.tags && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {cap.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-white/40"
                                style={{ borderColor: `${color}25`, background: `${color}08` }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>

      <style>{`
        @keyframes ledPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.35); }
        }
      `}</style>
    </motion.section>
  );
}
