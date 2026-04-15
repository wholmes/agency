"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

// Gold / amber palette — matches site accent
const PALETTE = [
  "201,165,90",
  "220,185,110",
  "255,238,160",
  "240,215,130",
  "255,252,210",
];

function spawnBurst(particles: Particle[], cx: number, cy: number) {
  const count = 72 + Math.floor(Math.random() * 44);
  const baseColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const accentColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
    const speed = 1.4 + Math.random() * 4.2;
    const isComet = Math.random() < 0.14;

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 0.88 + Math.random() * 0.12,
      decay: isComet
        ? 0.007 + Math.random() * 0.005
        : 0.013 + Math.random() * 0.011,
      size: isComet ? 1.6 + Math.random() * 0.8 : 0.9 + Math.random() * 1.3,
      color: Math.random() < 0.18 ? accentColor : baseColor,
      trail: [],
    });
  }
}

export default function FireworksCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let nextBurst = 0; // burst immediately on first visible frame
    let visible = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        // Ensure a burst fires promptly when scrolled into view
        if (visible) nextBurst = 0;
      },
      { threshold: 0.1 }
    );
    io.observe(canvas);

    const GRAVITY = 0.052;
    const DRAG = 0.983;
    const TRAIL_LEN = 10;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      if (now > nextBurst) {
        // Scatter bursts across the canvas — left edge gets a narrow margin
        const bx = W * (0.08 + Math.random() * 0.86);
        const by = H * (0.06 + Math.random() * 0.60);
        spawnBurst(particles, bx, by);
        nextBurst = now + 900 + Math.random() * 1400;
      }

      particles = particles.filter((p) => p.alpha > 0.02);

      for (const p of particles) {
        // Build trail
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.pop();

        // Draw trail segments (fade toward tail)
        for (let t = 0; t < p.trail.length; t++) {
          const ratio = 1 - t / p.trail.length;
          ctx.beginPath();
          ctx.arc(
            p.trail[t].x,
            p.trail[t].y,
            p.size * ratio * 0.75,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(${p.color},${p.alpha * ratio * 0.42})`;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();

        // Bright inner sparkle
        if (p.alpha > 0.45) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,250,225,${p.alpha * 0.65})`;
          ctx.fill();
        }

        // Physics
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  if (reduce) return null;
  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
