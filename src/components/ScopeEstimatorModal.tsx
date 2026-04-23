"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { ScopeEstimatorData } from "@/lib/cms/scope-estimator-types";

const ScopeEstimator = dynamic(() => import("@/components/ScopeEstimator"), { ssr: false });

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ScopeEstimatorModal({ data }: { data: ScopeEstimatorData }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Floating trigger — bottom-left */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open project cost estimator"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
        className="group fixed bottom-6 left-6 z-[900] flex items-center gap-2.5 rounded-full border border-white/[0.12] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md transition-all duration-300 hover:border-[#c9a55a]/40 hover:text-[#c9a55a]"
        style={{ background: "rgba(14,14,14,0.85)" }}
      >
        {/* Pulsing dot */}
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c9a55a] opacity-50 [animation-duration:2s]" />
          <span className="relative inline-flex size-1.5 rounded-full bg-[#c9a55a] opacity-70" />
        </span>
        Ballpark estimate
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[950] bg-black/70 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />

            {/* Panel — slides up from bottom-left */}
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Project cost estimator"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed bottom-20 left-6 z-[960] w-[min(480px,calc(100vw-3rem))]"
            >
              {/* Header */}
              <div
                className="mb-0 flex items-center justify-between rounded-t-2xl border border-b-0 border-white/[0.08] px-6 py-4"
                style={{ background: "rgba(14,14,14,0.98)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#c9a55a] opacity-70" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                    Ballpark Estimator
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close estimator"
                  className="flex size-6 items-center justify-center rounded-full border border-white/[0.08] text-white/30 transition-colors hover:border-white/[0.2] hover:text-white/60"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Estimator */}
              <div className="rounded-b-2xl">
                <ScopeEstimator data={data} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
