"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { marked } from "marked";

interface Props {
  note: string;
}

export default function CaseStudyNoteModal({ note }: Props) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const html = (() => {
    try {
      const result = marked.parse(note, { async: false });
      return typeof result === "string" ? result : "";
    } catch {
      return note;
    }
  })();

  // Escape key + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus close button when modal opens
  useEffect(() => {
    if (open) setTimeout(() => closeRef.current?.focus(), 50);
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300"
        style={{
          background: "rgba(201,165,90,0.07)",
          border: "1px solid rgba(201,165,90,0.18)",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,165,90,0.13)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,165,90,0.07)")}
      >
        <span
          className="inline-block size-1.5 rounded-full bg-accent/70 transition-all duration-300 group-hover:bg-accent"
          aria-hidden="true"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent/80 transition-colors duration-300 group-hover:text-accent">
          A note on this project
        </span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

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
              className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="A note on this project"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[10vh] z-[901] mx-auto max-w-2xl overflow-hidden rounded-2xl"
              style={{
                background: "rgba(14,14,13,0.92)",
                border: "1px solid rgba(201,165,90,0.12)",
                boxShadow: "0 0 0 1px rgba(201,165,90,0.06), 0 40px 100px -20px rgba(0,0,0,0.8)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Gold top line */}
              <div
                className="h-px w-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(201,165,90,0.4), transparent)" }}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-6 pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/70">
                  Project note
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-7 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div
                className="case-study-note-prose max-h-[65vh] overflow-y-auto px-8 pb-8"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
