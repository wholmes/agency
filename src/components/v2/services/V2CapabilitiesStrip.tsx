"use client";

import { motion } from "framer-motion";
import type { Capability } from "@prisma/client";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Synth LED palette — gold, teal, violet, rose, cyan, lime, amber, coral
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

// Each dot gets a unique blink speed and offset so they feel independent
const LED_DURATIONS = [1.1, 1.7, 2.3, 0.9, 1.5, 2.8, 1.3, 2.0];
const LED_DELAYS    = [0.0, 0.4, 1.1, 0.7, 0.2, 1.5, 0.9, 0.3];

export default function V2CapabilitiesStrip({ capabilities }: { capabilities: Capability[] }) {
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

        {/* Grid — col count adapts to item count so there's never an orphan row */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${capabilities.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          {capabilities.map((cap, i) => {
            const color    = LED_COLORS[i % LED_COLORS.length];
            const duration = LED_DURATIONS[i % LED_DURATIONS.length];
            const delay    = LED_DELAYS[i % LED_DELAYS.length];
            const cols     = capabilities.length === 5 ? 5 : 4;
            const isLastInRow = (i + 1) % cols === 0;
            const isLast      = i === capabilities.length - 1;

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: EASE }}
                className={`group border-b border-white/[0.05] px-6 py-8 ${isLastInRow || isLast ? "" : "border-r border-white/[0.05]"}`}
              >
                {/* Synth LED dot */}
                <div
                  className="mb-3 size-1.5 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 4px 1px ${color}`,
                    animation: `ledPulse ${duration}s ease-in-out ${delay}s infinite`,
                  }}
                />

                <p className="mb-1 font-body text-[13px] font-medium text-white/70 transition-colors duration-200 group-hover:text-white/95">
                  {cap.title}
                </p>
                {cap.descriptor && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                    {cap.descriptor}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Keyframe — injected once via a style tag */}
      <style>{`
        @keyframes ledPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.35); }
        }
      `}</style>
    </motion.section>
  );
}
