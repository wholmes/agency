"use client";

/**
 * "The Meeting" — Brand Meets Code visualised.
 *
 * Two particle systems live on the right side of the hero:
 *
 *   BRAND cloud  — warm gold, organic golden-angle orbits, high wobble.
 *                  Represents: intuition, identity, human judgment.
 *
 *   CODE  cloud  — cooler gold, precise grid arrangement, almost still.
 *                  Represents: structure, logic, engineering precision.
 *
 * The two clouds are held apart by spring physics, pulled together by a slow
 * gravitational attraction. Where they overlap, cross-cloud connections
 * light up brighter — that intersection is the product.
 *
 * On scroll the clouds converge; by the CTA section they are fully merged.
 * The metaphor maps directly to the value proposition: the closer the two
 * disciplines get, the more valuable the output.
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

// ─── constants ────────────────────────────────────────────────────────────────

const NB = 24;   // Brand particles
const NC = 20;   // Code particles  (4 × 5 grid)
const N  = NB + NC;

const MAX_CONNS = (N * (N - 1)) / 2;

const BRAND_K    = 0.018;  const BRAND_DAMP = 0.90;  const BRAND_WOBBLE = 0.58;
const CODE_K     = 0.042;  const CODE_DAMP  = 0.84;  const CODE_WOBBLE  = 0.06;

// ─── shaders ─────────────────────────────────────────────────────────────────

const POINT_VERT = /* glsl */ `
  attribute float aGroup;   /* 0 = brand, 1 = code */
  attribute float aEnergy;
  varying float vGroup;
  varying float vEnergy;
  void main() {
    vGroup  = aGroup;
    vEnergy = aEnergy;
    gl_PointSize = 3.5 + aEnergy * 4.5 - aGroup * 1.2;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const POINT_FRAG = /* glsl */ `
  precision mediump float;
  varying float vGroup;
  varying float vEnergy;
  void main() {
    vec2  c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;
    /* Brand: warm, soft. Code: cooler, sharper. */
    vec3 brandCol = vec3(0.86, 0.73, 0.44);
    vec3 codeCol  = vec3(0.72, 0.57, 0.30);
    vec3 col = mix(brandCol, codeCol, vGroup);
    float a  = (1.0 - d * d) * (0.36 + vEnergy * 0.64);
    gl_FragColor = vec4(col, a);
  }
`;

const LINE_VERT = /* glsl */ `
  attribute float aAlpha;
  attribute float aCross;   /* 1 = brand×code connection */
  varying float vAlpha;
  varying float vCross;
  void main() {
    vAlpha = aAlpha;
    vCross = aCross;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINE_FRAG = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying float vCross;
  void main() {
    /* Cross connections are brighter + warmer — they represent the product */
    vec3 baseCol  = vec3(0.788, 0.647, 0.353);
    vec3 crossCol = vec3(0.970, 0.860, 0.600);
    vec3 col = mix(baseCol, crossCol, vCross * 0.7);
    gl_FragColor = vec4(col, vAlpha);
  }
`;

// ─── cloud keyframes ──────────────────────────────────────────────────────────
// Brand and Code clouds start apart; scroll brings them together.
// xF, yF = centre as fraction of W/H (Three.js Y-up)
// rxF, ryF = radii as fraction

// Brand: right-of-centre, large, organic
const BRAND_KEYS = [
  { xF: 0.62, yF: 0.52, rxF: 0.15, ryF: 0.26, rot: 0.0  }, // hero — spread out
  { xF: 0.64, yF: 0.55, rxF: 0.14, ryF: 0.24, rot: 0.5  },
  { xF: 0.66, yF: 0.50, rxF: 0.13, ryF: 0.22, rot: 1.1  },
  { xF: 0.70, yF: 0.52, rxF: 0.12, ryF: 0.20, rot: 1.6  },
  { xF: 0.73, yF: 0.52, rxF: 0.11, ryF: 0.18, rot: 2.2  }, // cta — nearly merged
];

// Code: further right, smaller, tight grid
const CODE_KEYS = [
  { xF: 0.85, yF: 0.52, rxF: 0.10, ryF: 0.17, rot: 0.0  }, // hero — apart
  { xF: 0.83, yF: 0.50, rxF: 0.10, ryF: 0.16, rot: -0.3 },
  { xF: 0.80, yF: 0.52, rxF: 0.10, ryF: 0.16, rot: -0.7 },
  { xF: 0.77, yF: 0.52, rxF: 0.09, ryF: 0.15, rot: -1.1 },
  { xF: 0.73, yF: 0.52, rxF: 0.09, ryF: 0.14, rot: -1.5 }, // cta — nearly merged
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(t: number) { return t * t * (3 - 2 * t); }

interface Cloud { x: number; y: number; rx: number; ry: number; rot: number; }

function getCloud(
  keys: typeof BRAND_KEYS,
  scrollPct: number,
  time: number,
  W: number, H: number,
  driftAmp: number,
  breatheAmp: number,
  driftFreq: number,
): Cloud {
  const last = keys.length - 1;
  const raw  = Math.max(0, Math.min(scrollPct, 1)) * last;
  const i0   = Math.min(Math.floor(raw), last - 1);
  const s    = smoothstep(raw - i0);
  const k0   = keys[i0], k1 = keys[i0 + 1];

  const xF  = lerp(k0.xF,  k1.xF,  s);
  const yF  = lerp(k0.yF,  k1.yF,  s);
  const rxF = lerp(k0.rxF, k1.rxF, s);
  const ryF = lerp(k0.ryF, k1.ryF, s);
  const rot = lerp(k0.rot, k1.rot, s);

  const driftX  = Math.sin(time * driftFreq + 0.7) * W * driftAmp;
  const driftY  = Math.cos(time * driftFreq * 0.8) * H * driftAmp;
  const breathe = 1 + Math.sin(time * 0.22) * breatheAmp;

  return {
    x:  W * xF + driftX,
    y:  H * yF + driftY,
    rx: W * rxF * breathe,
    ry: H * ryF * breathe,
    rot: rot + time * 0.025,
  };
}

// ─── particle slots ───────────────────────────────────────────────────────────

const GOLDEN = 2.39996323;

interface BrandSlot { kind: "brand"; angle: number; rFrac: number; freq: number; phase: number; }
interface CodeSlot  { kind: "code";  gx: number;   gy: number;   freq: number; phase: number; }
type Slot = BrandSlot | CodeSlot;

function buildSlots(): Slot[] {
  const brand: BrandSlot[] = Array.from({ length: NB }, (_, i) => ({
    kind:  "brand",
    angle: i * GOLDEN,
    rFrac: 0.12 + (i % 7) * 0.13,
    freq:  0.25 + (i % 11) * 0.06,
    phase: i * 1.1231 + (i % 5) * 0.785,
  }));

  // Code: 4 rows × 5 cols = 20 in a precise grid
  const COLS = 5, ROWS = 4;
  const code: CodeSlot[] = Array.from({ length: NC }, (_, i) => ({
    kind:  "code",
    gx:    ((i % COLS) / (COLS - 1)) * 2 - 1,   // -1 … +1
    gy:    (Math.floor(i / COLS) / (ROWS - 1)) * 2 - 1,
    freq:  0.08 + (i % 5) * 0.03,   // very low — almost still
    phase: i * 0.618,
  }));

  return [...brand, ...code];
}

// ─── component ───────────────────────────────────────────────────────────────

export default function BrandMeetsCodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = window.innerWidth;
    let H = window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: "default",
      });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(W, H, false);

    const scene  = new THREE.Scene();
    let   camera = new THREE.OrthographicCamera(0, W, H, 0, 0, 1);

    // ── point geometry ──
    const pointGeo   = new THREE.BufferGeometry();
    const pPos        = new Float32Array(N * 3);
    const pEng        = new Float32Array(N);
    const pGrp        = new Float32Array(N);   // 0=brand, 1=code
    const pPosAttr    = new THREE.BufferAttribute(pPos, 3);
    const pEngAttr    = new THREE.BufferAttribute(pEng, 1);
    const pGrpAttr    = new THREE.BufferAttribute(pGrp, 1);
    pPosAttr.setUsage(THREE.DynamicDrawUsage);
    pEngAttr.setUsage(THREE.DynamicDrawUsage);
    pointGeo.setAttribute("position", pPosAttr);
    pointGeo.setAttribute("aEnergy",  pEngAttr);
    pointGeo.setAttribute("aGroup",   pGrpAttr);

    // group values are static — fill once
    for (let i = 0; i < N; i++) pGrp[i] = i < NB ? 0 : 1;
    pGrpAttr.needsUpdate = true;

    const pointMat = new THREE.ShaderMaterial({
      vertexShader:   POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(pointGeo, pointMat);
    pointsMesh.renderOrder = 1;
    scene.add(pointsMesh);

    // ── line geometry ──
    const lineGeo     = new THREE.BufferGeometry();
    const lPos         = new Float32Array(MAX_CONNS * 2 * 3);
    const lAlpha       = new Float32Array(MAX_CONNS * 2);
    const lCross       = new Float32Array(MAX_CONNS * 2);
    const lPosAttr     = new THREE.BufferAttribute(lPos,   3);
    const lAlphaAttr   = new THREE.BufferAttribute(lAlpha, 1);
    const lCrossAttr   = new THREE.BufferAttribute(lCross, 1);
    lPosAttr.setUsage(THREE.DynamicDrawUsage);
    lAlphaAttr.setUsage(THREE.DynamicDrawUsage);
    lCrossAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", lPosAttr);
    lineGeo.setAttribute("aAlpha",   lAlphaAttr);
    lineGeo.setAttribute("aCross",   lCrossAttr);
    const lineMat = new THREE.ShaderMaterial({
      vertexShader:   LINE_VERT,
      fragmentShader: LINE_FRAG,
      transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    linesMesh.renderOrder = 0;
    scene.add(linesMesh);

    // ── particle state ──
    const px    = new Float32Array(N);
    const py    = new Float32Array(N);
    const vx    = new Float32Array(N);
    const vy    = new Float32Array(N);
    const slots = buildSlots();

    // Seed initial positions
    const b0 = getCloud(BRAND_KEYS, 0, 0, W, H, 0, 0, 0.1);
    const c0 = getCloud(CODE_KEYS,  0, 0, W, H, 0, 0, 0.08);
    for (let i = 0; i < N; i++) {
      const sl = slots[i];
      if (sl.kind === "brand") {
        px[i] = b0.x + Math.cos(sl.angle) * b0.rx * sl.rFrac;
        py[i] = b0.y + Math.sin(sl.angle) * b0.ry * sl.rFrac;
      } else {
        px[i] = c0.x + sl.gx * c0.rx;
        py[i] = c0.y + sl.gy * c0.ry;
      }
    }

    // ── scroll ──
    const scroll = { pct: 0 };
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scroll.pct = Math.min(1, window.scrollY / max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── resize ──
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      renderer.setSize(W, H, false);
      camera = new THREE.OrthographicCamera(0, W, H, 0, 0, 1);
    };
    window.addEventListener("resize", onResize);

    // ── loop ──
    const t0 = performance.now();
    let   frame = 0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const time = reduced ? 0 : (now - t0) * 0.001;

      const brand = getCloud(BRAND_KEYS, scroll.pct, time, W, H, 0.012, 0.08, 0.09);
      const code  = getCloud(CODE_KEYS,  scroll.pct, time, W, H, 0.004, 0.03, 0.13);

      for (let i = 0; i < N; i++) {
        const sl = slots[i];
        let tx: number, ty: number;
        let springK: number, damp: number;

        if (sl.kind === "brand") {
          const wobbleA = Math.sin(time * sl.freq        + sl.phase) * BRAND_WOBBLE;
          const wobbleR = 0.68 + 0.32 * Math.cos(time * sl.freq * 0.7 + sl.phase + 1.3);
          const angle   = sl.angle + brand.rot + wobbleA;
          tx = brand.x + Math.cos(angle) * brand.rx * sl.rFrac * wobbleR;
          ty = brand.y + Math.sin(angle) * brand.ry * sl.rFrac * wobbleR;
          springK = reduced ? 0.20 : BRAND_K;
          damp    = reduced ? 0.72 : BRAND_DAMP;
        } else {
          const micro = Math.sin(time * sl.freq + sl.phase) * CODE_WOBBLE;
          tx = code.x + (sl.gx + micro) * code.rx;
          ty = code.y + (sl.gy + micro) * code.ry;
          springK = reduced ? 0.25 : CODE_K;
          damp    = reduced ? 0.75 : CODE_DAMP;
        }

        vx[i] += (tx - px[i]) * springK;
        vy[i] += (ty - py[i]) * springK;
        vx[i] *= damp;
        vy[i] *= damp;
        px[i] += vx[i];
        py[i] += vy[i];

        pPos[i * 3]     = px[i];
        pPos[i * 3 + 1] = py[i];
        pPos[i * 3 + 2] = 0;
        pEng[i] = Math.min(1, Math.hypot(vx[i], vy[i]) * 0.32);
      }

      // Connection distance — average of both cloud radii
      const connDist = (brand.ry + code.ry) * 0.42;
      let ci = 0;
      for (let i = 0; i < N && ci < MAX_CONNS; i++) {
        for (let j = i + 1; j < N && ci < MAX_CONNS; j++) {
          const d = Math.hypot(px[j] - px[i], py[j] - py[i]);
          if (d < connDist) {
            const isBrand = i < NB;
            const jIsBrand = j < NB;
            const cross = isBrand !== jIsBrand ? 1 : 0;
            // Cross-cloud connections glow brighter
            const a = (1 - d / connDist) * (cross ? 0.28 : 0.13);
            const b = ci * 6;
            lPos[b]     = px[i]; lPos[b + 1] = py[i]; lPos[b + 2] = 0;
            lPos[b + 3] = px[j]; lPos[b + 4] = py[j]; lPos[b + 5] = 0;
            lAlpha[ci * 2]     = a;
            lAlpha[ci * 2 + 1] = a;
            lCross[ci * 2]     = cross;
            lCross[ci * 2 + 1] = cross;
            ci++;
          }
        }
      }

      lineGeo.setDrawRange(0, ci * 2);
      pPosAttr.needsUpdate   = true;
      pEngAttr.needsUpdate   = true;
      lPosAttr.needsUpdate   = true;
      lAlphaAttr.needsUpdate = true;
      lCrossAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      pointGeo.dispose(); pointMat.dispose();
      lineGeo.dispose();  lineMat.dispose();
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
