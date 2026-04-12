"use client";

import { useEffect, useRef, useState } from "react";

/** Time to complete the ring (ms) */
const HOVER_FILL_MS = 1700;

/** Shrink + fade after fill completes (purely ornamental). */
const EXIT_SHRINK_MS = 400;

/** Maps linear time 0→1 to eased progress; fast start, gentle finish (good for “dwell” UI). */
function easeOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

function easeInCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  /** False until first mousemove — avoids ring/dot stuck at 0,0 before pointer sync */
  const pointerReadyRef = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const interactiveRootRef = useRef<Element | null>(null);
  const hoverStartRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const hoverLabelRef = useRef("");
  const reducedMotionRef = useRef(false);

  /** Playing shrink/fade after fill. */
  const ringExitingRef = useRef(false);
  const ringExitStartRef = useRef<number | null>(null);
  /** Fill finished + exit done; hide ring until pointer leaves this control. */
  const ringDwellSettledRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const getInteractiveRoot = (target: HTMLElement): Element | null => {
      if (target.dataset.cursor === "hover") return target;
      return target.closest("a, button");
    };

    const isInteractive = (target: HTMLElement): boolean => {
      return (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        target.dataset.cursor === "hover"
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!pointerReadyRef.current) {
        pointerReadyRef.current = true;
        mouse.current = { x: e.clientX, y: e.clientY };
        ring.current = { x: e.clientX, y: e.clientY };
      } else {
        mouse.current = { x: e.clientX, y: e.clientY };
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
    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!isInteractive(target)) {
        interactiveRootRef.current = null;
        hoverStartRef.current = null;
        isHoveringRef.current = false;
        ringExitingRef.current = false;
        ringExitStartRef.current = null;
        ringDwellSettledRef.current = false;
        if (ringInnerRef.current) {
          ringInnerRef.current.style.transform = "scale(1)";
          ringInnerRef.current.style.opacity = "1";
        }
        setIsHovering(false);
        setLabel("");
        hoverLabelRef.current = "";
        return;
      }

      const root = getInteractiveRoot(target);
      if (root && root !== interactiveRootRef.current) {
        interactiveRootRef.current = root;
        hoverStartRef.current = performance.now();
        ringDwellSettledRef.current = false;
        ringExitingRef.current = false;
        ringExitStartRef.current = null;
      }

      isHoveringRef.current = true;
      setIsHovering(true);

      const labelEl = (target.dataset.cursorLabel
        ? target
        : target.closest("[data-cursor-label]")) as HTMLElement | null;
      const nextLabel = labelEl?.dataset.cursorLabel ?? "";
      hoverLabelRef.current = nextLabel;
      setLabel(nextLabel);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handlePointerOver);

    const handleMouseOut = (e: MouseEvent) => {
      const root = interactiveRootRef.current;
      if (!root) return;
      const related = e.relatedTarget as Node | null;
      if (!(e.target instanceof Node) || !root.contains(e.target)) return;
      if (related && root.contains(related)) return;
      interactiveRootRef.current = null;
      hoverStartRef.current = null;
      isHoveringRef.current = false;
      ringExitingRef.current = false;
      ringExitStartRef.current = null;
      ringDwellSettledRef.current = false;
      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform = "scale(1)";
        ringInnerRef.current.style.opacity = "1";
      }
      setIsHovering(false);
      setLabel("");
      hoverLabelRef.current = "";
    };
    document.addEventListener("mouseout", handleMouseOut);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

      const hasLabel = !!hoverLabelRef.current;
      const hovering = isHoveringRef.current;
      const size = hasLabel ? 72 : hovering ? 48 : 32;
      const offset = size / 2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - offset}px, ${ring.current.y - offset}px)`;
      }

      const inner = ringInnerRef.current;
      const circle = progressCircleRef.current;

      if (circle) {
        const strokeWidth = 2;
        const r = Math.max(4, size / 2 - strokeWidth - 3);
        const circumference = 2 * Math.PI * r;

        if (reducedMotionRef.current) {
          if (ringDwellSettledRef.current && hovering) {
            circle.setAttribute("stroke-dashoffset", String(circumference));
          } else {
            circle.setAttribute(
              "stroke-dashoffset",
              String(hovering || hasLabel ? 0 : circumference),
            );
          }
          if (hovering && hoverStartRef.current !== null && !ringDwellSettledRef.current) {
            const elapsed = performance.now() - hoverStartRef.current;
            if (elapsed >= HOVER_FILL_MS) {
              ringDwellSettledRef.current = true;
            }
          }
        } else if (ringExitingRef.current) {
          circle.setAttribute("stroke-dashoffset", "0");
        } else if (ringDwellSettledRef.current && hovering) {
          circle.setAttribute("stroke-dashoffset", String(circumference));
        } else if (hovering && hoverStartRef.current !== null) {
          const elapsed = performance.now() - hoverStartRef.current;
          const linearT = Math.min(1, elapsed / HOVER_FILL_MS);
          if (linearT >= 1 && !ringDwellSettledRef.current) {
            ringExitingRef.current = true;
            ringExitStartRef.current = performance.now();
            circle.setAttribute("stroke-dashoffset", "0");
          } else {
            const t = easeOutCubic(linearT);
            const dashOffset = circumference * (1 - t);
            circle.setAttribute("stroke-dashoffset", String(dashOffset));
          }
        } else {
          circle.setAttribute("stroke-dashoffset", String(circumference));
        }
      }

      if (inner) {
        if (reducedMotionRef.current && ringDwellSettledRef.current && hovering) {
          inner.style.transform = "scale(1)";
          inner.style.opacity = "0";
        } else if (ringExitingRef.current && ringExitStartRef.current !== null) {
          const elapsed = performance.now() - ringExitStartRef.current;
          const p = Math.min(1, elapsed / EXIT_SHRINK_MS);
          const scale = 1 - easeInCubic(p);
          const opacity = 1 - p;
          inner.style.transform = `scale(${scale})`;
          inner.style.opacity = String(opacity);
          if (p >= 1) {
            ringExitingRef.current = false;
            ringExitStartRef.current = null;
            ringDwellSettledRef.current = true;
            inner.style.transform = "scale(1)";
            inner.style.opacity = "0";
          }
        } else if (ringDwellSettledRef.current && hovering) {
          inner.style.transform = "scale(1)";
          inner.style.opacity = "0";
        } else {
          inner.style.transform = "scale(1)";
          inner.style.opacity = "1";
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ringSize = label ? 72 : isHovering ? 48 : 32;
  const strokeWidth = 2;
  const r = Math.max(4, ringSize / 2 - strokeWidth - 3);
  const circumference = 2 * Math.PI * r;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] size-2 rounded-full bg-accent transition-opacity [transition-duration:200ms] ease-linear will-change-transform select-none"
        style={{ opacity: isVisible && !label ? 1 : 0 }}
      />

      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center overflow-visible rounded-full transition-[opacity,width,height,background-color] [transition-duration:300ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] will-change-transform select-none"
        style={{
          width: ringSize,
          height: ringSize,
          backgroundColor: label ? "rgba(201,165,90,0.08)" : "transparent",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          ref={ringInnerRef}
          className="flex size-full items-center justify-center will-change-transform [transform-origin:center]"
        >
          {/* Hover progress ring — stroke fills clockwise from top */}
          <svg
            className="absolute inset-0 -rotate-90"
            width={ringSize}
            height={ringSize}
            aria-hidden="true"
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke="rgba(201,165,90,0.18)"
              strokeWidth={strokeWidth}
            />
            <circle
              ref={progressCircleRef}
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className="transition-none"
            />
          </svg>

          <span
            className="relative z-[1] text-[9px] leading-none font-semibold tracking-wider text-accent uppercase opacity-0 transition-opacity [transition-duration:200ms] ease-linear whitespace-nowrap select-none"
            style={{ opacity: label ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
    </>
  );
}
