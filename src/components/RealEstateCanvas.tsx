"use client";

/**
 * RealEstateCanvas — a small, elegant cluster of city buildings, right-side.
 *
 * ~12 buildings of varied heights grouped in a tight downtown cluster.
 * Each building has a grid of small recessed windows on its faces.
 * Warm amber streetlight from below, cool moonlight from upper-left.
 * Mouse orbits the camera. Scroll lifts buildings taller.
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const FRAME_MS = 1000 / 45;

const GOLD        = 0xc9a55a;
const AMBER       = 0xc9843a;
const WIN_WARM    = 0xffe8a0;
const WIN_COOL    = 0xb8d8ff;
const BLDG_COLOR  = 0x141210;
const ROOF_COLOR  = 0x1e1a14;

/* Building definitions — hand-placed so the cluster feels intentional */
interface BldgDef {
  x: number; z: number;   /* position in world */
  w: number; d: number;   /* footprint */
  h: number;              /* base height (scroll will grow this) */
  winsX: number;          /* window columns per face */
  winsY: number;          /* window rows per face */
}

const BUILDINGS: BldgDef[] = [
  /* Centrepiece tower */
  { x:  0.0, z:  0.0, w: 1.1, d: 1.1, h: 9.5, winsX: 3, winsY: 9 },
  /* Tall neighbour */
  { x:  1.9, z:  0.3, w: 0.9, d: 0.85, h: 7.2, winsX: 2, winsY: 7 },
  /* Wide low block behind */
  { x: -0.4, z: -1.8, w: 1.6, d: 0.75, h: 4.1, winsX: 4, winsY: 4 },
  /* Slender tower right */
  { x:  3.0, z: -0.4, w: 0.65, d: 0.65, h: 8.8, winsX: 2, winsY: 8 },
  /* Mid block left */
  { x: -1.8, z:  0.2, w: 1.0, d: 0.9,  h: 5.4, winsX: 3, winsY: 5 },
  /* Short squat right */
  { x:  2.2, z:  1.6, w: 1.2, d: 1.0,  h: 2.8, winsX: 3, winsY: 2 },
  /* Background filler */
  { x:  0.8, z: -2.6, w: 0.8, d: 0.7,  h: 6.0, winsX: 2, winsY: 5 },
  { x: -2.4, z: -1.4, w: 0.7, d: 0.8,  h: 3.5, winsX: 2, winsY: 3 },
  { x:  4.0, z:  0.8, w: 0.6, d: 0.6,  h: 5.2, winsX: 2, winsY: 5 },
  { x: -0.8, z:  2.0, w: 0.9, d: 0.75, h: 2.2, winsX: 2, winsY: 2 },
  { x:  1.4, z: -1.4, w: 0.7, d: 0.7,  h: 4.8, winsX: 2, winsY: 4 },
  { x:  3.6, z: -1.8, w: 0.55, d: 0.6, h: 3.8, winsX: 1, winsY: 3 },
];

export default function RealEstateCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId    = 0;

    /* ── Tab visibility ───────────────────────────────────────────────── */
    let tabVisible  = !document.hidden;
    let accHiddenMs = 0;
    let hiddenAt    = 0;
    const onVisibility = () => {
      const now = performance.now();
      if (document.hidden) { hiddenAt = now; }
      else if (hiddenAt > 0) { accHiddenMs += now - hiddenAt; hiddenAt = 0; scroll.smooth = scroll.pct; }
      tabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* ── Mouse ────────────────────────────────────────────────────────── */
    const mouse       = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    /* ── Scroll ───────────────────────────────────────────────────────── */
    const scroll = { pct: 0, smooth: 0 };
    const onScroll = () => {
      const heroH = canvas.parentElement?.offsetHeight ?? window.innerHeight;
      scroll.pct = Math.min(1, window.scrollY / Math.max(1, heroH));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── Renderer ─────────────────────────────────────────────────────── */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    let W = canvas.clientWidth  || window.innerWidth;
    let H = Math.max(window.innerHeight, canvas.parentElement?.clientHeight ?? 0);
    renderer.setSize(W, H, true);

    /* ── Scene ────────────────────────────────────────────────────────── */
    const scene = new THREE.Scene();

    /* ── Camera ───────────────────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 200);
    camera.position.set(3, 7, 16);
    camera.lookAt(1.5, 2, 0);

    /* ── Lights ───────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x1a1510, 1.2));

    const moonLight = new THREE.DirectionalLight(0xc0ccd8, 1.1);
    moonLight.position.set(-8, 16, 8);
    scene.add(moonLight);

    const streetGlow = new THREE.PointLight(AMBER, 3.5, 30);
    streetGlow.position.set(4, 0.5, 6);
    scene.add(streetGlow);

    const rimLight = new THREE.DirectionalLight(GOLD, 0.8);
    rimLight.position.set(14, 6, -4);
    scene.add(rimLight);

    /* ── Ground ───────────────────────────────────────────────────────── */
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0907, roughness: 0.95 });
    const ground    = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    /* ── Materials ────────────────────────────────────────────────────── */
    const bldgMat = new THREE.MeshStandardMaterial({
      color: BLDG_COLOR, roughness: 0.80, metalness: 0.15,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: ROOF_COLOR, roughness: 0.55, metalness: 0.45,
      emissive: 0x1a1200, emissiveIntensity: 0.2,
    });
    const winWarmMat = new THREE.MeshStandardMaterial({
      color: WIN_WARM, emissive: WIN_WARM, emissiveIntensity: 1.4,
      transparent: true, opacity: 0.92, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const winCoolMat = new THREE.MeshStandardMaterial({
      color: WIN_COOL, emissive: WIN_COOL, emissiveIntensity: 1.0,
      transparent: true, opacity: 0.7, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    /* ── Build geometry ───────────────────────────────────────────────── */
    /* Cluster group — offset right so text has left margin */
    const cluster = new THREE.Group();
    cluster.position.set(2.5, 0, -1);
    scene.add(cluster);

    /* Deterministic pseudo-random */
    const rng = (seed: number) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    /* Per-building current (animated) height */
    const currentH = BUILDINGS.map(() => 0.1);

    /* Build each building's meshes */
    const bldgGroups: THREE.Group[] = [];

    BUILDINGS.forEach((b, bi) => {
      const g = new THREE.Group();
      g.position.set(b.x, 0, b.z);
      cluster.add(g);
      bldgGroups.push(g);

      /* Body — unit cube scaled per frame */
      const bodyGeo  = new THREE.BoxGeometry(b.w, 1, b.d);
      const bodyMesh = new THREE.Mesh(bodyGeo, bldgMat);
      bodyMesh.name  = "body";
      g.add(bodyMesh);

      /* Roof cap */
      const roofGeo  = new THREE.BoxGeometry(b.w + 0.05, 0.06, b.d + 0.05);
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.name  = "roof";
      g.add(roofMesh);

      /* Windows — one plane per window, placed on all 4 faces */
      const WIN_W = 0.13;
      const WIN_H = 0.18;
      const WIN_DEPTH = 0.012; /* how far they sit inside the facade */

      /* faces: [normal X, normal Z, rotation Y around body centre] */
      const faces: [number, number, number][] = [
        [ 0,  1, 0],           /* front  +Z */
        [ 0, -1, Math.PI],     /* back   -Z */
        [-1,  0, Math.PI / 2], /* left   -X */
        [ 1,  0,-Math.PI / 2], /* right  +X */
      ];

      faces.forEach(([nx, nz, rotY], fi) => {
        const isXFace   = nx !== 0;
        const faceW     = isXFace ? b.d : b.w;   /* face physical width */
        const cols      = b.winsX;
        const rows      = b.winsY;
        const colStep   = faceW / (cols + 1);
        const faceDist  = (isXFace ? b.w : b.d) / 2 + WIN_DEPTH;

        for (let wc = 0; wc < cols; wc++) {
          for (let wr = 0; wr < rows; wr++) {
            const seed  = bi * 1000 + fi * 100 + wc * 10 + wr;
            const isLit = rng(seed) > 0.28;
            if (!isLit) continue;

            const isCool = rng(seed + 0.5) > 0.72;
            const mat    = isCool ? winCoolMat : winWarmMat;

            const winGeo  = new THREE.PlaneGeometry(WIN_W, WIN_H);
            const winMesh = new THREE.Mesh(winGeo, mat);
            winMesh.name  = `win_${wc}_${wr}`;

            /* Local position on the face — centred */
            const localX = (wc + 1) * colStep - faceW / 2;
            /* Y will be scaled per frame based on building height */
            winMesh.userData = {
              localX,
              rowFrac: (wr + 0.5) / rows,   /* 0–1 up the building */
              nx, nz, rotY, faceDist,
            };
            winMesh.rotation.y = rotY;
            g.add(winMesh);
          }
        }
      });
    });

    /* ── Resize ───────────────────────────────────────────────────────── */
    const onResize = () => {
      W = canvas.clientWidth  || window.innerWidth;
      H = Math.max(window.innerHeight, canvas.parentElement?.clientHeight ?? 0);
      renderer.setSize(W, H, true);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const t0 = performance.now();
    let lastFrame = 0;

    /* ── Animation loop ───────────────────────────────────────────────── */
    const loop = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      if (!tabVisible || now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;
      scroll.smooth  += (scroll.pct - scroll.smooth) * 0.06;
      const sp = scroll.smooth;

      const t = (now - t0 - accHiddenMs) * 0.001;

      /* Scroll rotates camera around the cluster on Y axis — 0→60° arc */
      const scrollAngle = sp * Math.PI * 0.33;
      const camR  = 16 - sp * 3;           /* also pulls in slightly */
      const camX  = 3   + Math.sin(scrollAngle) * camR * 0.55 + (smoothMouse.x - 0.5) * 4;
      const camZ  = camR - Math.sin(scrollAngle) * camR * 0.4;
      const camY  = 7   + sp * 2 + (0.5 - smoothMouse.y) * 3;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(1.5, 2, 0);

      /* Update each building */
      BUILDINGS.forEach((b, bi) => {
        const targetH = b.h * (1 + sp * 0.55);
        currentH[bi] += (targetH - currentH[bi]) * 0.04;
        const h = currentH[bi];

        const g = bldgGroups[bi];
        g.traverse(child => {
          if (!(child instanceof THREE.Mesh)) return;

          if (child.name === "body") {
            child.scale.y = h;
            child.position.y = h / 2;
          } else if (child.name === "roof") {
            child.position.y = h + 0.03;
          } else if (child.name.startsWith("win_")) {
            const { localX, rowFrac, nx, nz, faceDist } = child.userData as {
              localX: number; rowFrac: number;
              nx: number; nz: number; rotY: number; faceDist: number;
            };
            const winY = h * 0.12 + rowFrac * h * 0.78;
            child.position.set(
              nx * faceDist + (nz !== 0 ? localX : 0),
              winY,
              nz * faceDist + (nx !== 0 ? localX : 0),
            );
            /* Hide windows that haven't "grown" into yet */
            child.visible = winY < h * 0.95;
          }
        });
      });

      /* Street glow flicker */
      streetGlow.intensity = 3.2 + 0.5 * Math.sin(t * 0.8) + 0.2 * Math.sin(t * 3.3);

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll",             onScroll);
      window.removeEventListener("resize",             onResize);
      window.removeEventListener("mousemove",          onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      bldgMat.dispose(); roofMat.dispose();
      winWarmMat.dispose(); winCoolMat.dispose();
      groundGeo.dispose(); groundMat.dispose();
      renderer.dispose();
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
