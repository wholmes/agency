"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    /* Contextual label detection */
    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "hover";

      if (interactive) {
        setIsHovering(true);
        /* Walk up to find the nearest data-cursor-label */
        const el =
          (target.dataset.cursorLabel
            ? target
            : target.closest("[data-cursor-label]")) as HTMLElement | null;
        setLabel(el?.dataset.cursorLabel ?? "");
      } else {
        setIsHovering(false);
        setLabel("");
      }
    };

    document.addEventListener("mouseover", handlePointerOver);

    /* RAF lerp for ring */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

      const size = label ? 72 : isHovering ? 48 : 32;
      const offset = size / 2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - offset}px, ${ring.current.y - offset}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handlePointerOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isHovering, label]);

  const ringSize = label ? 72 : isHovering ? 48 : 32;

  return (
    <>
      {/* Dot — hidden when label is showing */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--color-accent)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: isVisible && !label ? 1 : 0,
          transition: "opacity 200ms ease",
          willChange: "transform",
        }}
      />

      {/* Ring + optional label */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `1px solid ${isHovering ? "rgba(201,165,90,0.6)" : "rgba(201,165,90,0.3)"}`,
          backgroundColor: label ? "rgba(201,165,90,0.08)" : "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition:
            "opacity 300ms ease, width 280ms cubic-bezier(0.16,1,0.3,1), height 280ms cubic-bezier(0.16,1,0.3,1), background-color 200ms ease, border-color 200ms ease",
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            opacity: label ? 1 : 0,
            transition: "opacity 200ms ease",
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      </div>
    </>
  );
}
