"use client";

import { useState } from "react";

// Hotspot positions as percentages of 1024×640 source images.
// Base screen: "PROJECT" badge in app top bar  →  x≈14.6%, y≈18.8%
// Panel screen: close "×" in panel header       →  x≈97.1%, y≈16.9%

type Screen = "base" | "panel";

interface Hotspot {
  x: string;  // CSS left %
  y: string;  // CSS top %
  label: string;
  color: "green" | "white";
  action: Screen;
}

const HOTSPOTS: Record<Screen, Hotspot> = {
  base: {
    x: "14.6%",
    y: "18.8%",
    label: "Open project settings",
    color: "green",
    action: "panel",
  },
  panel: {
    x: "97.1%",
    y: "16.9%",
    label: "Close panel",
    color: "white",
    action: "base",
  },
};

export default function BlueprintDemo() {
  const [screen, setScreen] = useState<Screen>("base");
  const hotspot = HOTSPOTS[screen];

  return (
    <div className="not-prose">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Interactive demo · Blueprint Toolkit
          </p>
        </div>
        <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] tracking-wider text-text-tertiary uppercase">
          {screen === "base" ? "Overview" : "Project panel open"}
        </span>
      </div>

      {/* Demo frame */}
      <div className="relative overflow-hidden rounded-xl border border-border shadow-2xl shadow-black/40">
        {/* Aspect ratio container: 1024 / 640 = 1.6 */}
        <div className="relative w-full" style={{ paddingBottom: "62.5%" }}>

          {/* Base screenshot */}
          <img
            src="/demos/blueprint-base.png"
            alt="Blueprint Toolkit app overview"
            draggable={false}
            className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500 ${
              screen === "base" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Panel-open screenshot */}
          <img
            src="/demos/blueprint-panel.png"
            alt="Blueprint Toolkit with project panel open"
            draggable={false}
            className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500 ${
              screen === "panel" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Hotspot button */}
          <button
            aria-label={hotspot.label}
            onClick={() => setScreen(hotspot.action)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: hotspot.x, top: hotspot.y }}
          >
            {/* Outer ping ring */}
            <span
              className={`absolute inset-[-6px] animate-ping rounded-full opacity-60 ${
                hotspot.color === "green"
                  ? "bg-emerald-400/50"
                  : "bg-white/30"
              }`}
            />
            {/* Inner dot */}
            <span
              className={`relative flex size-4 rounded-full border-2 ${
                hotspot.color === "green"
                  ? "border-emerald-400 bg-emerald-400/30"
                  : "border-white/80 bg-white/20"
              }`}
            />
            {/* Tooltip */}
            <span
              className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur-sm ${
                hotspot.color === "green"
                  ? "border-emerald-700/50 bg-emerald-950/80 text-emerald-300"
                  : "border-white/20 bg-black/70 text-white/90"
              }`}
            >
              {hotspot.label} →
            </span>
          </button>

          {/* Bottom status bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[11px] text-white/70">
                {screen === "base"
                  ? "Click the highlighted element to explore"
                  : "Panel open · click the × to close"}
              </span>
            </div>
            {screen === "panel" && (
              <button
                onClick={() => setScreen("base")}
                className="rounded border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              >
                Reset demo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mt-4 flex items-center gap-3">
        {(["base", "panel"] as Screen[]).map((s, i) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
              screen === s
                ? "border-accent-muted bg-accent-subtle text-accent"
                : "border-border bg-surface text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                screen === s ? "bg-accent" : "bg-border"
              }`}
            />
            {i === 0 ? "Overview" : "Project panel"}
          </button>
        ))}
        <p className="ml-auto text-[11px] text-text-tertiary">
          Blueprint Toolkit · blueprint-toolkit.com
        </p>
      </div>
    </div>
  );
}
