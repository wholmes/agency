"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Capability } from "@prisma/client";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LED_COLORS = [
  "#c9a55a", "#4fd1c5", "#a78bfa", "#f472b6",
  "#38bdf8", "#a3e635", "#fb923c", "#f87171",
];
const LED_DURATIONS = [1.1, 1.7, 2.3, 0.9, 1.5, 2.8, 1.3, 2.0];
const LED_DELAYS    = [0.0, 0.4, 1.1, 0.7, 0.2, 1.5, 0.9, 0.3];

// Hardcoded tab grouping by capability title
const TABS = [
  {
    id: "build",
    label: "Build",
    titles: [
      "SaaS Applications",
      "Custom Content Management",
      "WordPress & Drupal",
      "Ecommerce",
      "Gaming & Interactive",
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Data",
    titles: [
      "Data & Analytics",
      "GA4 & GTM",
      "Attribution Modelling",
      "Custom Dashboards",
      "Funnel & Event Tracking",
      "Growth Reporting",
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    titles: ["GMP Consulting"],
  },
];

function CapGrid({ caps }: { caps: (Capability & { colorIdx: number })[] }) {
  const cols = caps.length <= 3 ? caps.length : 4;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${cols === 4 ? "4" : cols === 3 ? "3" : cols === 2 ? "2" : "1"}`}>
      {caps.map((cap, i) => {
        const color    = LED_COLORS[cap.colorIdx % LED_COLORS.length];
        const duration = LED_DURATIONS[cap.colorIdx % LED_DURATIONS.length];
        const delay    = LED_DELAYS[cap.colorIdx % LED_DELAYS.length];
        const isLastInRow = (i + 1) % cols === 0;
        const isLast      = i === caps.length - 1;

        return (
          <div
            key={cap.id}
            className={`group border-b border-white/[0.05] px-6 py-8 ${isLastInRow || isLast ? "" : "border-r border-white/[0.05]"}`}
          >
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
          </div>
        );
      })}
    </div>
  );
}

export default function V2CapabilitiesStrip({ capabilities }: { capabilities: Capability[] }) {
  const [activeTab, setActiveTab] = useState("build");

  if (!capabilities.length) return null;

  // Map each cap to its global index for stable LED colours
  const capsByTitle = Object.fromEntries(
    capabilities.map((cap, i) => [cap.title, { ...cap, colorIdx: i }])
  );

  // Build tab data — filter to caps that actually exist in CMS
  const tabs = TABS.map((tab) => ({
    ...tab,
    caps: tab.titles
      .map((t) => capsByTitle[t])
      .filter(Boolean) as (Capability & { colorIdx: number })[],
  })).filter((tab) => tab.caps.length > 0);

  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0];

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

        {/* Header + tabs row */}
        <div className="flex flex-col gap-4 border-b border-white/[0.05] py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Capabilities</p>

          {/* Tab buttons */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
                  style={{ color: isActive ? "#c9a55a" : "rgba(255,255,255,0.35)" }}
                >
                  {tab.label}
                  {/* Active gold underline */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: "#c9a55a" }}
                      transition={{ duration: 0.25, ease: EASE }}
                    />
                  )}
                  {/* Count badge */}
                  <span
                    className="ml-1.5 font-mono text-[9px]"
                    style={{ color: isActive ? "rgba(201,165,90,0.6)" : "rgba(255,255,255,0.2)" }}
                  >
                    {tab.caps.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content — fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <CapGrid caps={activeTabData.caps} />
          </motion.div>
        </AnimatePresence>

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
