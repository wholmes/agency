"use client";

/**
 * Companion field for Selected Work — same family as the hero isometric terrain,
 * but calmer: radial ripples, tighter grid, cooler gold, sized to its container.
 * Intended to sit on a higher z-index and extend above the section (overlap).
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const COLS = 16;
const ROWS = 16;
const N = COLS * ROWS;
const GAP = 1.02;
const MIN_H = 0.06;
const MAX_H = 2.85;

function fieldHeight(col: number, row: number, t: number): number {
  const cx = COLS / 2;
  const cz = ROWS / 2;
  const x = col - cx;
  const z = row - cz;
  const r = Math.sqrt(x * x + z * z);

  // Radial ripples — different from the hero’s cartesian waves
  const v =
    0.48 +
    0.24 * Math.sin(r * 0.55 - t * 0.95) +
    0.14 * Math.cos(r * 0.9 + t * 0.45) +
    0.1 * Math.sin(x * 0.35 + z * 0.35 + t * 0.55);

  const edgeX = Math.min(1, col / 4) * Math.min(1, (COLS - 1 - col) / 5);
  const edgeZ = Math.min(1, row / 3) * Math.min(1, (ROWS - 1 - row) / 4);
  const edgeFade = Math.min(edgeX, edgeZ);

  return MIN_H + Math.max(0, v) * (MAX_H - MIN_H) * edgeFade;
}

export default function WorkOverlapFieldCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const parent = wrapRef.current;
    if (!canvas || !parent) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 1;
    let H = 1;

    const readSize = () => {
      const r = parent.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
    };
    readSize();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const GX = ((COLS - 1) * GAP) / 2;
    const GZ = ((ROWS - 1) * GAP) / 2;

    const ambient = new THREE.AmbientLight(0xffffff, 0.26);
    const sun = new THREE.DirectionalLight(0xf0ead8, 1.25);
    sun.position.set(5, 9, 4);
    scene.add(ambient, sun);

    const bodyGeo = new THREE.BoxGeometry(0.92, 1, 0.92);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x141312 });
    const bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, N);
    bodyMesh.frustumCulled = false;
    scene.add(bodyMesh);

    const topGeo = new THREE.BoxGeometry(0.94, 0.055, 0.94);
    const topMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const topMesh = new THREE.InstancedMesh(topGeo, topMat, N);
    topMesh.frustumCulled = false;
    const topColor = new THREE.Color();
    for (let i = 0; i < N; i++) topMesh.setColorAt(i, topColor);
    topMesh.instanceColor!.needsUpdate = true;
    scene.add(topMesh);

    const quat = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    const mx = new THREE.Matrix4();

    function buildCamera(w: number, h: number): THREE.OrthographicCamera {
      const frustumH = ROWS * GAP * 0.52 + MAX_H * 0.42;
      const frustumW = frustumH * (w / h);
      const cam = new THREE.OrthographicCamera(
        -frustumW / 2,
        frustumW / 2,
        frustumH / 2,
        -frustumH / 2,
        0.1,
        500,
      );
      const d = 68;
      cam.position.set(GX + d, d, GZ + d);
      cam.lookAt(GX, MAX_H * 0.22, GZ);
      return cam;
    }

    let camera = buildCamera(W, H);
    renderer.setSize(W, H, false);

    const applySize = () => {
      readSize();
      renderer.setSize(W, H, false);
      camera = buildCamera(W, H);
    };

    const ro = new ResizeObserver(() => applySize());
    ro.observe(parent);

    const t0 = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const t = reduced ? 0.5 : (now - t0) * 0.001;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col;
          const wx = col * GAP;
          const wz = row * GAP;
          const h = fieldHeight(col, row, t);

          pos.set(wx, h / 2, wz);
          scl.set(1, h, 1);
          mx.compose(pos, quat, scl);
          bodyMesh.setMatrixAt(idx, mx);

          pos.set(wx, h + 0.028, wz);
          scl.set(1, 1, 1);
          mx.compose(pos, quat, scl);
          topMesh.setMatrixAt(idx, mx);

          // Cooler, slightly desaturated gold vs hero
          const brightness = 0.18 + ((h - MIN_H) / (MAX_H - MIN_H)) * 0.72;
          topColor.setRGB(0.72 * brightness, 0.58 * brightness, 0.4 * brightness);
          topMesh.setColorAt(idx, topColor);
        }
      }

      bodyMesh.instanceMatrix.needsUpdate = true;
      topMesh.instanceMatrix.needsUpdate = true;
      topMesh.instanceColor!.needsUpdate = true;
      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      bodyGeo.dispose();
      bodyMat.dispose();
      topGeo.dispose();
      topMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full min-h-[min(280px,38vw)] w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
