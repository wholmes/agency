"use client";

import { useEffect, useRef, useState } from "react";

interface Segment {
  id: string;
  progress: number;
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

      const update = () => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const raw = (vh - rect.top) / (rect.height + vh);
        const clamped = Math.max(0, Math.min(1, raw));
        setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, progress: clamped } : s)));
      };

      window.addEventListener("scroll", update, { passive: true });
      update();

      observersRef.current.push({
        disconnect: () => window.removeEventListener("scroll", update),
      } as unknown as IntersectionObserver);
    });

    return () => observersRef.current.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-1/2 left-[clamp(12px,2vw,24px)] z-50 flex -translate-y-1/2 flex-col gap-1 transition-opacity duration-[600ms] ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {segments.map((seg) => (
        <div
          key={seg.id}
          className="relative h-8 w-0.5 overflow-hidden rounded-full bg-border"
        >
          <div
            className="absolute top-0 right-0 left-0 rounded-full bg-accent [transition:height_100ms_linear]"
            style={{ height: `${seg.progress * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}
