"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const ZOOM_MIN = 1;
const ZOOM_MAX = 4.5;

interface Screenshot {
  url: string;
  caption?: string;
}

interface Props {
  screenshots: Screenshot[];
  accent: string;
}

/** Lightbox image: real overflow scroll for tall full-page shots; zoom by widening the layout (so scroll size grows). */
function LightboxImageArea({ url, alt, resetId }: { url: string; alt: string; resetId: string }) {
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setZoom(1);
    viewportRef.current?.scrollTo(0, 0);
  }, [resetId, url]);

  const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

  const nudgeZoom = useCallback((direction: 1 | -1) => {
    setZoom((z) => {
      const next = direction === 1 ? clampZoom(z * 1.2) : clampZoom(z / 1.2);
      if (next <= 1.01) {
        viewportRef.current?.scrollTo(0, 0);
        return 1;
      }
      return next;
    });
  }, []);

  /** Only Ctrl/Cmd + wheel adjusts zoom; otherwise the browser scrolls the viewport (vertical for long pages). */
  const onViewportWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const sign = e.deltaY < 0 ? 1 : -1;
    setZoom((z) => {
      const next = clampZoom(z * (1 + sign * 0.1));
      if (next <= 1.01) {
        viewportRef.current?.scrollTo(0, 0);
        return 1;
      }
      return next;
    });
  };

  const isZoomed = zoom > 1.001;
  /** Wider “sheet” in % of viewport = zoom level; content gets real width/height so scrollbars work. */
  const contentWidthPercent = Math.round(zoom * 1000) / 10;

  return (
    <div className="min-h-0 min-w-0">
      {/* Controls */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-[#0a0a0a] px-3 py-2"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <p className="max-w-[min(100%,20rem)] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-white/30">
          <span className="text-white/25">Scroll</span> the preview for long pages
          <span className="text-white/20"> · </span>
          <span className="text-white/25">Ctrl</span> + scroll to zoom
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              nudgeZoom(1);
            }}
            className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/50 transition hover:border-white/20 hover:text-white/80"
            aria-label="Zoom in"
            disabled={zoom >= ZOOM_MAX - 0.01}
          >
            +
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              nudgeZoom(-1);
            }}
            className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/50 transition hover:border-white/20 hover:text-white/80"
            aria-label="Zoom out"
            disabled={zoom <= ZOOM_MIN + 0.01}
          >
            −
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setZoom(1);
              viewportRef.current?.scrollTo(0, 0);
            }}
            className="ml-1 rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-white/40 transition hover:border-white/20 hover:text-white/70"
            aria-label="Reset zoom and pan"
            disabled={!isZoomed}
          >
            Fit
          </button>
          <span className="ml-1 font-mono text-[10px] text-white/25" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Native overflow: vertical (and horizontal when zoomed) for full-page captures */}
      <div
        ref={viewportRef}
        onWheel={onViewportWheel}
        className="max-h-[min(70vh,85dvh)] w-full overflow-auto overscroll-contain bg-[#0e0e0e]"
        style={{ touchAction: "pan-x pan-y" }}
        tabIndex={0}
      >
        <div
          className="min-w-0"
          style={{ width: `${contentWidthPercent}%`, margin: "0 auto" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            className="block w-full h-auto"
            style={{ maxWidth: "100%", height: "auto" }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
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
                className="group shrink-0 !cursor-pointer focus:outline-none"
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
            className="fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={close}
          >
            {/* Card — stop propagation so clicking image doesn't close */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="relative w-full max-w-5xl cursor-default"
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

                <LightboxImageArea
                  url={screenshots[lightboxIdx].url}
                  alt={screenshots[lightboxIdx].caption ?? `Screenshot ${lightboxIdx + 1}`}
                  resetId={`${lightboxIdx}-${screenshots[lightboxIdx].url}`}
                />
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
                    className="absolute -left-14 top-1/2 -translate-y-1/2 hidden size-10 !cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white md:flex"
                    aria-label="Previous screenshot"
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); next(); }}
                    className="absolute -right-14 top-1/2 -translate-y-1/2 hidden size-10 !cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white md:flex"
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
                      className="size-1.5 !cursor-pointer rounded-full transition-all duration-200"
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
              className="absolute right-4 top-4 flex size-9 !cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
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
