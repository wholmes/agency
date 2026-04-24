"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const pointerReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!pointerReadyRef.current) {
        pointerReadyRef.current = true;
      }
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      pointerReadyRef.current = false;
      setIsVisible(false);
    };

    /**
     * Re-entering the page from browser chrome / OS UI: `mouseenter` does not bubble, so listen on
     * `documentElement` (and capture on `document`) so the dot comes back even when the first event is not `mousemove`.
     */
    const handleMouseEnter = (e: MouseEvent) => {
      isVisibleRef.current = true;
      setIsVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[11000] size-2 rounded-full bg-accent transition-opacity [transition-duration:200ms] ease-linear will-change-transform select-none"
      style={{ opacity: isVisible ? 1 : 0 }}
    />
  );
}
