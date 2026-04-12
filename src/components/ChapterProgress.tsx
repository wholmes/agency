"use client";

import { useEffect, useRef, useState } from "react";

interface Segment {
  id: string;
  progress: number; // 0–1
}

interface Props {
  sectionIds: string[];
}

export default function ChapterProgress({ sectionIds }: Props) {
  const [segments, setSegments] = useState<Segment[]>(() =>
    sectionIds.map((id) => ({ id, progress: 0 }))
  );
  const [visible, setVisible] = useState(false);
  const observersRef = useRef<IntersectionObserver[]>([]);

  useEffect(() => {
    /* Only show after first scroll past hero */
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    observersRef.current.forEach((o) => o.disconnect());
    observersRef.current = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      /* Use scroll position to compute per-section fill */
      const update = () => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        /* progress = how far through the section we've scrolled */
        const raw = (vh - rect.top) / (rect.height + vh);
        const clamped = Math.max(0, Math.min(1, raw));
        setSegments((prev) =>
          prev.map((s) => (s.id === id ? { ...s, progress: clamped } : s))
        );
      };

      window.addEventListener("scroll", update, { passive: true });
      update();

      /* Store cleanup */
      observersRef.current.push({
        disconnect: () => window.removeEventListener("scroll", update),
      } as unknown as IntersectionObserver);
    });

    return () => observersRef.current.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "clamp(12px, 2vw, 24px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease",
        pointerEvents: "none",
      }}
    >
      {segments.map((seg) => (
        <div
          key={seg.id}
          style={{
            width: 2,
            height: 32,
            borderRadius: 999,
            background: "var(--color-border)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${seg.progress * 100}%`,
              background: "var(--color-accent)",
              borderRadius: 999,
              transition: "height 100ms linear",
            }}
          />
        </div>
      ))}
    </div>
  );
}
