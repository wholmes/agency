"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { registerLenis } from "@/lib/lenis-instance";

/**
 * Lenis smooth scroll — loaded after idle so it does not compete with
 * first paint / main-thread metrics (Lighthouse TBT, Script Evaluation).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let lenisInstance: Lenis | null = null;
    let rafId = 0;

    async function boot() {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      registerLenis(lenisInstance);

      function raf(time: number) {
        if (!lenisInstance || cancelled) return;
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    let idleCbId: ReturnType<typeof requestIdleCallback> | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    if (typeof requestIdleCallback === "function") {
      idleCbId = requestIdleCallback(() => void boot(), { timeout: 2500 });
    } else {
      timeoutHandle = setTimeout(() => void boot(), 400);
    }

    return () => {
      cancelled = true;
      if (idleCbId !== undefined) cancelIdleCallback(idleCbId);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      cancelAnimationFrame(rafId);
      registerLenis(null);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
