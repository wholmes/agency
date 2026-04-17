"use client";

/**
 * DnaCanvas — Canvas 2D animated double-helix background.
 *
 * Two sinusoidal backbones scroll upward in perspective, connected by
 * evenly-spaced base-pair rungs. A soft gold/teal palette sits on the
 * site's dark background.
 *
 * Interactivity:
 *  - Mouse X  → helix tilts / rotates slightly toward cursor
 *  - Scroll   → scroll speed increases
 */

import { useLayoutEffect, useRef } from "react";

const FRAME_MS = 1000 / 45;

const GOLD  = [201, 165, 90]  as const;
const TEAL  = [90,  210, 190] as const;
const PALE  = [220, 200, 160] as const;

function rgba([r, g, b]: readonly [number, number, number], a: number) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

export default function DnaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed  = false;
    let rafId     = 0;
    let lastFrame = 0;
    let W = 0, H = 0;

    /* ── Tab visibility ──────────────────────────────────────────────── */
    let tabVisible  = !document.hidden;
    let accHiddenMs = 0;
    let hiddenAt    = 0;
    const onVisibility = () => {
      const now = performance.now();
      if (document.hidden) {
        hiddenAt = now;
      } else if (hiddenAt > 0) {
        accHiddenMs += now - hiddenAt;
        hiddenAt = 0;
      }
      tabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* ── Mouse tracking ──────────────────────────────────────────────── */
    const mouse = { x: 0.5 };
    const smoothMouse = { x: 0.5 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    /* ── Scroll ──────────────────────────────────────────────────────── */
    const scroll = { y: 0 };
    const onScroll = () => { scroll.y = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Resize ──────────────────────────────────────────────────────── */
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.clientWidth  || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();

    /* ── Draw ─────────────────────────────────────────────────────────── */
    const draw = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(draw);
      if (!tabVisible || now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;

      const heroH   = canvas.clientHeight || window.innerHeight;
      const scrollT = Math.min(scroll.y / Math.max(heroH, 1), 1);
      const speed   = 0.12 + scrollT * 0.10;

      const elapsed = (now - t0 - accHiddenMs) * 0.001;
      const phase   = elapsed * speed;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0c0c0b";
      ctx.fillRect(0, 0, W, H);

      /* Helix lives in the right 55% of the canvas, centered slightly right */
      const helixCX = W * (0.62 + (smoothMouse.x - 0.5) * 0.06);
      const helixW  = Math.min(W * 0.22, 180); /* half-width of helix */
      const RUNGS   = 18;
      const rungSpacing = H / RUNGS;

      /* Two backbone points at rung i */
      const strandA = (i: number) => {
        const y = ((i / RUNGS + phase) % 1) * H;
        const angle = (i / RUNGS + phase) * Math.PI * 2 * 2.5;
        const x = helixCX + Math.cos(angle) * helixW;
        /* perspective scale: larger near bottom */
        const depth = (y / H) * 0.6 + 0.4;
        return { x, y, depth, angle };
      };
      const strandB = (i: number) => {
        const y = ((i / RUNGS + phase) % 1) * H;
        const angle = (i / RUNGS + phase) * Math.PI * 2 * 2.5 + Math.PI;
        const x = helixCX + Math.cos(angle) * helixW;
        const depth = (y / H) * 0.6 + 0.4;
        return { x, y, depth, angle };
      };

      /* ── Draw rungs (behind strands) ──────────────────────────────── */
      for (let i = 0; i < RUNGS * 3; i++) {
        const a = strandA(i / 3);
        const b = strandB(i / 3);
        if (a.y < -rungSpacing || a.y > H + rungSpacing) continue;

        const depth   = a.depth;
        const isMinor = i % 3 !== 0;
        if (isMinor) continue; /* only draw at whole rungs */

        /* Rung colour alternates between gold and teal pairs */
        const pairIdx = Math.floor(i / 3) % 4;
        const col = pairIdx < 2 ? GOLD : TEAL;
        const alpha = depth * 0.55;

        /* Rung line */
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = rgba(col, alpha);
        ctx.lineWidth   = depth * 2;
        ctx.stroke();

        /* Node dots at each end */
        const r = depth * 4;
        ctx.beginPath();
        ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, alpha * 1.4);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(PALE, alpha * 0.8);
        ctx.fill();
      }

      /* ── Draw backbones ───────────────────────────────────────────── */
      const drawBackbone = (getPoint: (i: number) => { x: number; y: number; depth: number }, color: readonly [number, number, number]) => {
        const STEPS = RUNGS * 6;
        ctx.beginPath();
        for (let i = 0; i <= STEPS; i++) {
          const { x, y } = getPoint(i / 6);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        /* Gradient along the full height */
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0,   rgba(color, 0));
        grad.addColorStop(0.1, rgba(color, 0.5));
        grad.addColorStop(0.5, rgba(color, 0.75));
        grad.addColorStop(0.9, rgba(color, 0.5));
        grad.addColorStop(1,   rgba(color, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 2;
        ctx.stroke();
      };

      drawBackbone(i => strandA(i), GOLD);
      drawBackbone(i => strandB(i), TEAL);

      /* ── Ambient glow at helix centre ─────────────────────────────── */
      const glow = ctx.createRadialGradient(helixCX, H * 0.45, 0, helixCX, H * 0.45, H * 0.45);
      glow.addColorStop(0,   rgba(GOLD, 0.07));
      glow.addColorStop(0.5, rgba(GOLD, 0.02));
      glow.addColorStop(1,   rgba(GOLD, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      /* ── Top & bottom fades ────────────────────────────────────────── */
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.28);
      topFade.addColorStop(0, "#0c0c0b");
      topFade.addColorStop(1, "rgba(12,12,11,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, W, H * 0.28);

      const botFade = ctx.createLinearGradient(0, H * 0.78, 0, H);
      botFade.addColorStop(0, "rgba(12,12,11,0)");
      botFade.addColorStop(1, "#0c0c0b");
      ctx.fillStyle = botFade;
      ctx.fillRect(0, H * 0.78, W, H * 0.22);

      /* ── Left content fade so text stays readable ─────────────────── */
      const leftFade = ctx.createLinearGradient(0, 0, W * 0.55, 0);
      leftFade.addColorStop(0,   "#0c0c0b");
      leftFade.addColorStop(0.6, "rgba(12,12,11,0.6)");
      leftFade.addColorStop(1,   "rgba(12,12,11,0)");
      ctx.fillStyle = leftFade;
      ctx.fillRect(0, 0, W * 0.55, H);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",           resize);
      window.removeEventListener("mousemove",        onMouseMove);
      window.removeEventListener("scroll",           onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
