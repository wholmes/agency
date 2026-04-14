"use client";

/**
 * RunwayCanvas — Canvas 2D perspective runway animation.
 *
 * Interactivity:
 *  - Mouse X/Y  → vanishing point drifts toward cursor (lerped, feels like steering)
 *  - Scroll     → runway speed increases (feels like accelerating down the runway)
 *
 * Uses Canvas 2D (not WebGL). ~50 draw calls per frame, capped at 30 fps.
 */

import { useLayoutEffect, useRef } from "react";

const GOLD   = [201, 165, 90]  as const;
const AMBER  = [230, 190, 110] as const;
const FRAME_MS = 1000 / 30;

/* Base vanishing point as fraction of canvas */
const BASE_CX = 0.62;
const BASE_VY = 0.30;

/* Max mouse influence: VP can drift ±10% W and ±6% H from base */
const MOUSE_X_RANGE = 0.10;
const MOUSE_Y_RANGE = 0.06;

/* Lerp factor per frame (~30fps) — lower = more lag/weight */
const LERP = 0.06;

function rgba([r, g, b]: readonly [number, number, number], a: number) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

export default function RunwayCanvas() {
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

    /* ── Mouse tracking (normalised 0–1) ─────────────────────────────── */
    const mouse = { x: BASE_CX, y: BASE_VY }; /* target */
    const vp    = { x: BASE_CX, y: BASE_VY }; /* current (lerped) */

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      /* Normalise relative to canvas */
      mouse.x = (e.clientX - rect.left)  / rect.width;
      mouse.y = (e.clientY - rect.top)   / rect.height;
    };
    /* Touch support */
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.x = (t.clientX - rect.left) / rect.width;
      mouse.y = (t.clientY - rect.top)  / rect.height;
    };
    /* Canvas is pointer-events-none so listen on window */
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove",  onTouchMove, { passive: true });

    /* ── Scroll speed boost ──────────────────────────────────────────── */
    const scroll = { y: 0 };
    const onScroll = () => { scroll.y = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Canvas resize ───────────────────────────────────────────────── */
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

    /* ── Draw ────────────────────────────────────────────────────────── */
    const draw = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(draw);
      if (!tabVisible || now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      /* Lerp vanishing point toward mouse target */
      const targetX = BASE_CX + (mouse.x - 0.5) * MOUSE_X_RANGE * 2;
      const targetY = BASE_VY + (mouse.y - 0.5) * MOUSE_Y_RANGE * 2;
      vp.x += (targetX - vp.x) * LERP;
      vp.y += (targetY - vp.y) * LERP;

      /* Scroll boosts speed: from base 0.28 up to 0.42 at full scroll */
      const heroH   = canvas.clientHeight || window.innerHeight;
      const scrollT = Math.min(scroll.y / Math.max(heroH, 1), 1.0);
      const speed   = 0.28 + scrollT * 0.14;

      const elapsed = (now - t0 - accHiddenMs) * 0.001;
      const offset  = (elapsed * speed) % 1.0;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0c0c0b";
      ctx.fillRect(0, 0, W, H);

      const cx = vp.x * W;
      const vy = vp.y * H;

      const bLeft  = W * 0.22;
      const bRight = W * 1.08;

      const lx = (t: number) => cx + (bLeft  - cx) * t;
      const rx = (t: number) => cx + (bRight - cx) * t;
      const py = (t: number) => vy + (H - vy) * t;

      /* ── Runway surface ──────────────────────────────────────────────── */
      ctx.beginPath();
      ctx.moveTo(cx, vy);
      ctx.lineTo(bRight, H);
      ctx.lineTo(bLeft,  H);
      ctx.closePath();
      const surfGrad = ctx.createLinearGradient(0, vy, 0, H);
      surfGrad.addColorStop(0,   "rgba(22,20,16,0)");
      surfGrad.addColorStop(0.4, "rgba(22,20,16,0.35)");
      surfGrad.addColorStop(1,   "rgba(22,20,16,0.65)");
      ctx.fillStyle = surfGrad;
      ctx.fill();

      /* ── Edge lines ──────────────────────────────────────────────────── */
      const edgeGrad = (x2: number) => {
        const g = ctx.createLinearGradient(cx, vy, x2, H);
        g.addColorStop(0,    rgba(GOLD, 0));
        g.addColorStop(0.12, rgba(GOLD, 0.35));
        g.addColorStop(0.65, rgba(GOLD, 0.75));
        g.addColorStop(1,    rgba(GOLD, 0.25));
        return g;
      };
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(cx, vy);
      ctx.lineTo(bLeft, H);
      ctx.strokeStyle = edgeGrad(bLeft);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, vy);
      ctx.lineTo(bRight, H);
      ctx.strokeStyle = edgeGrad(bRight);
      ctx.stroke();

      /* ── Vanishing-point halo ─────────────────────────────────────────── */
      const halo = ctx.createRadialGradient(cx, vy, 0, cx, vy, H * 0.32);
      halo.addColorStop(0,   rgba(GOLD, 0.14));
      halo.addColorStop(0.4, rgba(GOLD, 0.04));
      halo.addColorStop(1,   rgba(GOLD, 0));
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      /* ── Centre-line dashes ──────────────────────────────────────────── */
      const N_DASHES = 8;
      for (let i = 0; i < N_DASHES; i++) {
        const raw = ((i / N_DASHES) + offset) % 1.0;
        const t   = raw * raw;
        if (t < 0.004) continue;

        const y  = py(t);
        const a  = Math.sin(raw * Math.PI) * (0.25 + t * 0.6);
        const dh = Math.max(1, t * H * 0.022);
        const dw = Math.max(0.5, t * (rx(t) - cx) * 0.06);

        ctx.fillStyle = rgba(AMBER, a);
        ctx.fillRect(cx - dw / 2, y - dh, dw, dh * 2);
      }

      /* ── Edge lights ─────────────────────────────────────────────────── */
      const N_LIGHTS = 10;
      for (let i = 0; i < N_LIGHTS; i++) {
        const raw = ((i / N_LIGHTS) + offset) % 1.0;
        const t   = raw * raw;
        if (t < 0.004) continue;

        const x1 = lx(t);
        const x2 = rx(t);
        const y  = py(t);
        const a  = Math.sin(raw * Math.PI) * (0.45 + t * 0.5);
        const r  = 1.0 + t * 4.5;

        ctx.beginPath();
        ctx.arc(x1, y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(GOLD, a * 0.35);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x1, y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(AMBER, a);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Top fade ────────────────────────────────────────────────────── */
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.45);
      topFade.addColorStop(0,   "#0c0c0b");
      topFade.addColorStop(0.6, "rgba(12,12,11,0.7)");
      topFade.addColorStop(1,   "rgba(12,12,11,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, W, H * 0.45);

      /* ── Bottom vignette ──────────────────────────────────────────────── */
      const botFade = ctx.createLinearGradient(0, H * 0.75, 0, H);
      botFade.addColorStop(0, "rgba(12,12,11,0)");
      botFade.addColorStop(1, "#0c0c0b");
      ctx.fillStyle = botFade;
      ctx.fillRect(0, H * 0.75, W, H * 0.25);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll",    onScroll);
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
