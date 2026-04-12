"use client";

/**
 * "The Field" — code moving pixels.
 *
 * A 22×22 grid of isometric cubes fills the right side of the hero.
 * Every cube's height is driven by a multi-octave wave function — a
 * mathematical field computed each frame. Code is literally sculpting
 * the terrain in real time.
 *
 * Gold tops. Charcoal sides. Nothing else.
 *
 * The restraint is the signal.
 * The precision is the product.
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

// ─── grid ────────────────────────────────────────────────────────────────────

const COLS = 22;
const ROWS = 22;
const N    = COLS * ROWS;
const GAP  = 1.1;          // world-space spacing between cube centres
const MIN_H = 0.08;
const MAX_H = 4.4;

/**
 * Multi-octave wave field.
 * Returns a height value in [MIN_H, MAX_H].
 * The left edge fades in so the field doesn't compete with body copy.
 */
function fieldHeight(col: number, row: number, t: number, scrollPct: number): number {
  const x = col - COLS / 2;
  const z = row - ROWS / 2;

  // Wave animation speed increases slightly as user scrolls — the field
  // becomes more energised the deeper the user explores.
  const spd = 0.65 + scrollPct * 0.9;

  const v = 0.50
    + 0.22 * Math.sin(x * 0.65 + t * spd * 0.32)
    + 0.18 * Math.cos(z * 0.72 + t * spd * 0.26)
    + 0.11 * Math.sin((x + z) * 0.55 + t * spd * 0.44)
    + 0.07 * Math.cos(x * 0.90 - z * 0.52 + t * spd * 0.38)
    + 0.05 * Math.sin(z * 1.10 + t * spd * 0.56);

  // Left columns emerge gradually so the copy side stays clean
  const edgeFade = Math.min(1, col / 5);
  return MIN_H + Math.max(0, v) * (MAX_H - MIN_H) * edgeFade;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function IsometricFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = window.innerWidth;
    let H = window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();

    // Grid world centre (XZ plane)
    const GX = ((COLS - 1) * GAP) / 2;
    const GZ = ((ROWS - 1) * GAP) / 2;

    // ── lighting ──────────────────────────────────────────────────────────
    // Ambient keeps shadow sides readable. Directional catches the top.
    const ambient = new THREE.AmbientLight(0xffffff, 0.28);
    const sun = new THREE.DirectionalLight(0xfff6e6, 1.5);
    sun.position.set(4, 10, 3);
    scene.add(ambient, sun);

    // ── cube body ─────────────────────────────────────────────────────────
    // Geometry height = 1; scaled per instance on the Y axis.
    const bodyGeo = new THREE.BoxGeometry(0.93, 1, 0.93);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x191714 });
    const bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, N);
    bodyMesh.frustumCulled = false;
    scene.add(bodyMesh);

    // ── top slab ──────────────────────────────────────────────────────────
    // A thin slab per cube for the gold face. Brightness varies with height.
    const topGeo = new THREE.BoxGeometry(0.95, 0.06, 0.95);
    const topMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const topMesh = new THREE.InstancedMesh(topGeo, topMat, N);
    topMesh.frustumCulled = false;
    const initColor = new THREE.Color(0xd4a760);
    for (let i = 0; i < N; i++) topMesh.setColorAt(i, initColor);
    topMesh.instanceColor!.needsUpdate = true;
    scene.add(topMesh);

    // Reusable transform objects
    const quat     = new THREE.Quaternion();
    const pos      = new THREE.Vector3();
    const scl      = new THREE.Vector3();
    const mx       = new THREE.Matrix4();
    const topColor = new THREE.Color();

    // ── camera ───────────────────────────────────────────────────────────
    // Orthographic isometric (camera at equal angles from X/Y/Z).
    // Asymmetric left/right frustum shifts the grid to the right ~60% of screen.
    function buildCamera(W: number, H: number): THREE.OrthographicCamera {
      // frustumH: how many world units fit vertically — tunes the zoom
      const frustumH = ROWS * GAP * 0.78 + MAX_H * 0.55;
      const frustumW = frustumH * (W / H);

      // L = 60% of total width → lookAt target renders at screen x = 60%
      const L = frustumW * 0.60;
      const R = frustumW * 0.40;

      const cam = new THREE.OrthographicCamera(-L, R, frustumH / 2, -frustumH / 2, 0.1, 500);

      const d = 80;
      cam.position.set(GX + d, d, GZ + d);
      // Look slightly above ground so tall columns don't clip the top
      cam.lookAt(GX, MAX_H * 0.25, GZ);
      return cam;
    }

    let camera = buildCamera(W, H);

    // ── events ────────────────────────────────────────────────────────────
    const scroll = { pct: 0 };
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scroll.pct = Math.min(1, window.scrollY / max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H, false);
      camera = buildCamera(W, H);
    };
    window.addEventListener("resize", onResize);

    // ── render loop ───────────────────────────────────────────────────────
    const t0 = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);

      // On reduced motion: pause the field at t=0.5 (mid-wave, looks natural)
      const t = reduced ? 0.5 : (now - t0) * 0.001;
      const sp = scroll.pct;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col;
          const wx  = col * GAP;
          const wz  = row * GAP;
          const h   = fieldHeight(col, row, t, sp);

          // Body: base at Y=0, top at Y=h
          pos.set(wx, h / 2, wz);
          scl.set(1, h, 1);
          mx.compose(pos, quat, scl);
          bodyMesh.setMatrixAt(idx, mx);

          // Top slab: sits flush on top of the body
          pos.set(wx, h + 0.03, wz);
          scl.set(1, 1, 1);
          mx.compose(pos, quat, scl);
          topMesh.setMatrixAt(idx, mx);

          // Gold brightness scales with height — shorter = nearly invisible,
          // tallest = bright warm gold
          const brightness = 0.18 + ((h - MIN_H) / (MAX_H - MIN_H)) * 0.82;
          topColor.setRGB(0.84 * brightness, 0.69 * brightness, 0.37 * brightness);
          topMesh.setColorAt(idx, topColor);
        }
      }

      bodyMesh.instanceMatrix.needsUpdate   = true;
      topMesh.instanceMatrix.needsUpdate    = true;
      topMesh.instanceColor!.needsUpdate    = true;

      // Fade the canvas as the user scrolls past the hero (~first 30% of page)
      canvas.style.opacity = String(Math.max(0, 1 - sp * 3.5));

      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      bodyGeo.dispose();
      bodyMat.dispose();
      topGeo.dispose();
      topMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-dvh w-full"
    />
  );
}
