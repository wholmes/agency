"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Screenshot {
  url: string;
  caption?: string;
}

interface Props {
  screenshots: Screenshot[];
  accent: string;
}

export default function ScreenshotGallery({ screenshots, accent }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => setLightboxIdx(i => (i === null || i === 0 ? screenshots.length - 1 : i - 1)), [screenshots.length]);
  const next = useCallback(() => setLightboxIdx(i => (i === null ? 0 : (i + 1) % screenshots.length)), [screenshots.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, close, prev, next]);

  if (!screenshots.length) return null;

  return (
    <>
      {/* ── Thumbnail strip ───────────────────────────────────────── */}
      <section className="py-12 md:py-16" aria-label="Project screenshots">
        <div className="mx-auto max-w-[1280px] px-8 md:px-16">

          {/* Section overline */}
          <div className="mb-8 flex items-center gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">More pages</p>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          {/* Scrollable row */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" role="list">
            {screenshots.map((shot, idx) => (
              <motion.button
                key={idx}
                role="listitem"
                type="button"
                onClick={() => setLightboxIdx(idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ delay: idx * 0.06, duration: 0.7, ease: EASE_OUT }}
                className="group shrink-0 cursor-pointer focus:outline-none"
                aria-label={shot.caption ? `View screenshot: ${shot.caption}` : `View screenshot ${idx + 1}`}
              >
                {/* Browser chrome card */}
                <div
                  className="overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-[1.02] group-focus-visible:ring-2"
                  style={{
                    width: 280,
                    boxShadow: `0 16px 48px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)`,
                    outline: "none",
                  }}
                >
                  {/* Chrome bar */}
                  <div
                    className="flex items-center gap-2.5 border-b px-3 py-2"
                    style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex shrink-0 gap-1">
                      <span className="size-2 rounded-full bg-[#ff5f56]" />
                      <span className="size-2 rounded-full bg-[#ffbd2e]" />
                      <span className="size-2 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="h-4 w-24 rounded bg-white/[0.05]" />
                  </div>

                  {/* Screenshot */}
                  <div className="aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.url}
                      alt={shot.caption ?? `Page screenshot ${idx + 1}`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                </div>

                {/* Caption */}
                {shot.caption && (
                  <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 transition-colors duration-200 group-hover:text-white/50">
                    {shot.caption}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={close}
          >
            {/* Card — stop propagation so clicking image doesn't close */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="relative w-full max-w-5xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Browser chrome */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ boxShadow: `0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)` }}
              >
                <div
                  className="flex items-center gap-3 border-b px-4 py-2.5"
                  style={{ background: "#111", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex shrink-0 gap-1.5">
                    <span className="size-3 rounded-full bg-[#ff5f56]" />
                    <span className="size-3 rounded-full bg-[#ffbd2e]" />
                    <span className="size-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="h-5 w-40 rounded bg-white/[0.05]" />
                  </div>
                  {/* Counter */}
                  <span className="font-mono text-[10px] text-white/30">
                    {lightboxIdx + 1} / {screenshots.length}
                  </span>
                </div>

                {/* Screenshot — max height so it doesn't overflow viewport */}
                <div className="max-h-[70vh] overflow-auto bg-[#0e0e0e]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshots[lightboxIdx].url}
                    alt={screenshots[lightboxIdx].caption ?? `Screenshot ${lightboxIdx + 1}`}
                    className="block w-full"
                  />
                </div>
              </div>

              {/* Caption */}
              {screenshots[lightboxIdx].caption && (
                <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                  {screenshots[lightboxIdx].caption}
                </p>
              )}

              {/* Prev / Next */}
              {screenshots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); prev(); }}
                    className="absolute -left-14 top-1/2 -translate-y-1/2 hidden size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white md:flex"
                    aria-label="Previous screenshot"
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); next(); }}
                    className="absolute -right-14 top-1/2 -translate-y-1/2 hidden size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white md:flex"
                    aria-label="Next screenshot"
                  >
                    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                      <path d="M4 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Gold accent dot indicator */}
              {screenshots.length > 1 && (
                <div className="mt-5 flex justify-center gap-1.5">
                  {screenshots.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                      className="size-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: i === lightboxIdx ? accent : "rgba(255,255,255,0.2)",
                        transform: i === lightboxIdx ? "scale(1.3)" : "scale(1)",
                      }}
                      aria-label={`Go to screenshot ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
