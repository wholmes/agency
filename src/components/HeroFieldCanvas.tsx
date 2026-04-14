"use client";

/**
 * Single WebGL hero field — one context, one animation loop per mount.
 * `home`: cartesian waves, 18×18, warm gold.
 * `services`: radial ripples, 14×14, cooler gold.
 *
 * Both share the same camera treatment (right-biased orthographic) and scroll
 * response so we don’t run two diverging Three.js lifecycles.
 *
 * --- SCROLL SCRUBBING TUNING GUIDE -------------------------------------------
 *
 * The scroll response has two layers that work together:
 *
 * 1. EASING CURVE  (animation loop, search "sp = Math.sqrt")
 *    sp = Math.sqrt(scroll.pct)
 *    sqrt front-loads the effect: at 10% scroll the visual is already ~32% of
 *    its maximum. Change the curve to adjust "how quickly it kicks in":
 *      Math.sqrt(x)   -> very snappy (current)
 *      Math.cbrt(x)   -> even snappier (try if still feels slow)
 *      x              -> linear / gradual (try if too aggressive)
 *      x * x          -> slow start, fast finish (rarely useful here)
 *
 * 2. AMPLITUDE  (inside heightHome / heightServices, search "scrollAmp")
 *    scrollAmp = 1 + scrollPct * 0.65  (home)
 *    scrollAmp = 1 + scrollPct * 0.58  (services)
 *    Multiplies bar heights. At full scroll bars are 65/58% taller than at
 *    rest. Raise the coefficient for drama; lower for subtlety.
 *    Keep it below ~1.0 to avoid bars clipping the camera frustum.
 *
 * 3. WAVE SPEED  (same height functions, search "spd =")
 *    spd = 0.65 + scrollPct * 0.9   (home)
 *    spd = 0.72 + scrollPct * 0.88  (services)
 *    The base value is the idle animation speed. The coefficient is how much
 *    faster the waves run at full scroll. Note: scrollPct here is already
 *    sqrt-eased, so speed also kicks in early.
 *
 * Rule of thumb:
 *   EASING    -> "how soon" the effect starts
 *   AMPLITUDE -> "how much" the bars grow
 *   WAVE SPEED -> energy/chaos feel as the hero scrolls away
 *
 * TAB BACKGROUNDING: wave time uses (now - t0 - accumulatedHiddenMs) so the
 * animation clock pauses while the tab is hidden — otherwise wall-clock keeps
 * advancing and returning feels like a huge phase jump / “fast” scrub.
 * -----------------------------------------------------------------------------
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export type HeroFieldVariant = "home" | "services";

type FieldConfig = {
  cols: number;
  rows: number;
  gap: number;
  minH: number;
  maxH: number;
  bodyHex: number;
  topSlabY: number;
  ambient: number;
  sunColor: number;
  sunIntensity: number;
  sunPos: [number, number, number];
  boxBody: number;
  boxTop: number;
};

const CONFIG: Record<HeroFieldVariant, FieldConfig> = {
  home: {
    cols: 18,
    rows: 18,
    gap: 1.1,
    minH: 0.08,
    maxH: 4.4,
    bodyHex: 0x191714,
    topSlabY: 0.03,
    ambient: 0.28,
    sunColor: 0xfff6e6,
    sunIntensity: 1.5,
    sunPos: [4, 10, 3],
    boxBody: 0.93,
    boxTop: 0.95,
  },
  services: {
    cols: 14,
    rows: 14,
    gap: 1.02,
    minH: 0.06,
    maxH: 2.85,
    bodyHex: 0x141312,
    topSlabY: 0.028,
    ambient: 0.26,
    sunColor: 0xf0ead8,
    sunIntensity: 1.3,
    sunPos: [5, 9, 4],
    boxBody: 0.92,
    boxTop: 0.94,
  },
};

function heightHome(
  col: number,
  row: number,
  t: number,
  scrollPct: number,
  cols: number,
  rows: number,
  minH: number,
  maxH: number,
): number {
  const x = col - cols / 2;
  const z = row - rows / 2;
  const spd = 0.65 + scrollPct * 0.9;
  const v =
    0.5 +
    0.22 * Math.sin(x * 0.65 + t * spd * 0.32) +
    0.18 * Math.cos(z * 0.72 + t * spd * 0.26) +
    0.11 * Math.sin((x + z) * 0.55 + t * spd * 0.44) +
    0.07 * Math.cos(x * 0.9 - z * 0.52 + t * spd * 0.38) +
    0.05 * Math.sin(z * 1.1 + t * spd * 0.56);
  const edgeFade = Math.min(1, col / 5);
  const scrollAmp = 1 + scrollPct * 0.65;
  return minH + Math.max(0, v) * (maxH - minH) * edgeFade * scrollAmp;
}

function heightServices(
  col: number,
  row: number,
  t: number,
  scrollPct: number,
  cols: number,
  rows: number,
  minH: number,
  maxH: number,
): number {
  const cx = cols / 2;
  const cz = rows / 2;
  const x = col - cx;
  const z = row - cz;
  const r = Math.sqrt(x * x + z * z);
  const spd = 0.72 + scrollPct * 0.88;
  const v =
    0.48 +
    0.24 * Math.sin(r * 0.55 - t * spd * 0.95) +
    0.14 * Math.cos(r * 0.9 + t * spd * 0.45) +
    0.1 * Math.sin(x * 0.35 + z * 0.35 + t * spd * 0.55);
  const edgeX = Math.min(1, col / 2.5) * Math.min(1, (cols - 1 - col) / 2.5);
  const edgeZ = Math.min(1, row / 2.5) * Math.min(1, (rows - 1 - row) / 2.5);
  const cornerFade = Math.max(0.5, Math.min(edgeX, edgeZ));
  const leftFade = Math.min(1, col / 5);
  const scrollAmp = 1 + scrollPct * 0.58;
  return minH + Math.max(0, v) * (maxH - minH) * cornerFade * leftFade * scrollAmp;
}

function applyTopGold(
  variant: HeroFieldVariant,
  h: number,
  minH: number,
  maxH: number,
  out: THREE.Color,
): void {
  const k = (h - minH) / (maxH - minH);
  if (variant === "home") {
    const brightness = 0.18 + k * 0.82;
    out.setRGB(0.84 * brightness, 0.69 * brightness, 0.37 * brightness);
  } else {
    const brightness = 0.18 + k * 0.72;
    out.setRGB(0.72 * brightness, 0.58 * brightness, 0.4 * brightness);
  }
}

/** 30 fps cap — reduces per-frame main-thread blocking in software rendering (e.g. Lighthouse). */
const FRAME_MS = 1000 / 30;

export default function HeroFieldCanvas({ variant }: { variant: HeroFieldVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let bodyGeo: THREE.BoxGeometry | undefined;
    let bodyMat: THREE.MeshLambertMaterial | undefined;
    let topGeo: THREE.BoxGeometry | undefined;
    let topMat: THREE.MeshLambertMaterial | undefined;

    const dispose = () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      bodyGeo?.dispose();
      bodyMat?.dispose();
      topGeo?.dispose();
      topMat?.dispose();
      renderer?.dispose();
    };

    // Scroll/resize/visibility handlers declared early so dispose() can reference them.
    const scroll = { pct: 0 };
    const onScroll = () => {
      const heroH = canvas.parentElement?.offsetHeight ?? window.innerHeight;
      scroll.pct = Math.min(1, window.scrollY / Math.max(1, heroH));
    };

    let W = window.innerWidth;
    let H = window.innerHeight;
    let camera: THREE.OrthographicCamera;

    /**
     * On portrait phones the screen aspect is ~0.46 (430×932).
     * If we render into that canvas with a landscape-equivalent frustum the
     * scene is horizontally squashed ("smushed"). The fix: render into a
     * landscape-sized buffer (H × 1.5 wide) and anchor it to the right edge of
     * the hero so the section's overflow-hidden clips the left overhang.
     * frustumW / renderW  then equals frustumH / H and there's no distortion.
     */
    const applyPortraitHome = () => {
      if (variant !== "home" || W >= H) return;
      const rW = Math.round(H * 1.5);
      renderer?.setSize(rW, H, true);
      canvas.style.left = "auto";
      canvas.style.right = "0";
    };

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const portrait = W < H;
      // On portrait mobile, render at H×1.5 (landscape buffer) anchored right:0
      // so the grid enters as a corner accent without distortion.
      const portraitField = portrait;
      // On narrow desktop (home only), render at min 1200px anchored left:0 so
      // the grid entry diagonal stays consistent as the viewport narrows.
      const narrowDesktop = variant === "home" && !portrait && W < 1200;
      const renderW = portraitField ? Math.round(H * 1.5) : narrowDesktop ? 1200 : W;
      renderer?.setSize(renderW, H, true);
      if (portraitField) {
        canvas.style.left = "auto";
        canvas.style.right = "0";
      } else if (narrowDesktop) {
        canvas.style.left = "0";
        canvas.style.right = "auto";
      } else {
        canvas.style.left = "";
        canvas.style.right = "";
      }
      if (camera) {
        const cfg = CONFIG[variant];
        const GX = ((cfg.cols - 1) * cfg.gap) / 2;
        const GZ = ((cfg.rows - 1) * cfg.gap) / 2;
        const frustumH = cfg.rows * cfg.gap * 0.6 + cfg.maxH * 0.45;
        const frustumW = frustumH * (renderW / Math.max(H, 1));
        camera.left = -frustumW * 0.76;
        camera.right = frustumW * 0.24;
        camera.top = frustumH / 2;
        camera.bottom = -frustumH / 2;
        // On portrait mobile, look left of the grid so the right-aligned canvas
        // shows empty space on the left and the grid's entry diagonal on the right.
        const lookX = portraitField ? -3 : GX;
        camera.position.set(lookX + 80, 80, GZ + 80);
        camera.lookAt(lookX, cfg.maxH * 0.25, GZ);
        camera.updateProjectionMatrix();
      }
    };
    void applyPortraitHome;

    let tabVisible = !document.hidden;
    let accumulatedHiddenMs = 0;
    let hiddenAtMs = 0;
    const onVisibility = () => {
      const now = performance.now();
      if (document.hidden) {
        hiddenAtMs = now;
      } else if (hiddenAtMs > 0) {
        accumulatedHiddenMs += now - hiddenAtMs;
        hiddenAtMs = 0;
        onScroll();
      }
      tabVisible = !document.hidden;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();

    /**
     * Full Three.js init + loop.
     *
     * Called via requestIdleCallback so it runs after the page is interactive.
     * This keeps the animation out of Lighthouse's TBT measurement window.
     * On fast real hardware the idle fires within ~200ms; on headless Chromium
     * (Lighthouse) it fires at the 2 s timeout — well after TTI.
     */
    const init = () => {
      if (disposed) return;

      const cfg = CONFIG[variant];
      const N = cfg.cols * cfg.rows;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      const portrait0 = W < H;
      const narrowDesktop0 = variant === "home" && !portrait0 && W < 1200;
      const initRenderW = portrait0 ? Math.round(H * 1.5) : narrowDesktop0 ? 1200 : W;
      renderer.setSize(initRenderW, H, true);
      if (portrait0) {
        canvas.style.left = "auto";
        canvas.style.right = "0";
      } else if (narrowDesktop0) {
        canvas.style.left = "0";
        canvas.style.right = "auto";
      }

      const scene = new THREE.Scene();
      const GX = ((cfg.cols - 1) * cfg.gap) / 2;
      const GZ = ((cfg.rows - 1) * cfg.gap) / 2;

      const ambient = new THREE.AmbientLight(0xffffff, cfg.ambient);
      const sun = new THREE.DirectionalLight(cfg.sunColor, cfg.sunIntensity);
      sun.position.set(...cfg.sunPos);
      scene.add(ambient, sun);

      bodyGeo = new THREE.BoxGeometry(cfg.boxBody, 1, cfg.boxBody);
      bodyMat = new THREE.MeshLambertMaterial({ color: cfg.bodyHex });
      const bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, N);
      bodyMesh.frustumCulled = false;
      scene.add(bodyMesh);

      const topH = variant === "services" ? 0.055 : 0.06;
      topGeo = new THREE.BoxGeometry(cfg.boxTop, topH, cfg.boxTop);
      topMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const topMesh = new THREE.InstancedMesh(topGeo, topMat, N);
      topMesh.frustumCulled = false;
      const initGold = new THREE.Color(0xd4a760);
      for (let i = 0; i < N; i++) topMesh.setColorAt(i, initGold);
      topMesh.instanceColor!.needsUpdate = true;
      scene.add(topMesh);

      const quat = new THREE.Quaternion();
      const pos = new THREE.Vector3();
      const scl = new THREE.Vector3();
      const mx = new THREE.Matrix4();
      const topCol = new THREE.Color();

      const frustumH = cfg.rows * cfg.gap * 0.6 + cfg.maxH * 0.45;
      const frustumW = frustumH * (initRenderW / Math.max(H, 1));
      camera = new THREE.OrthographicCamera(
        -frustumW * 0.76,
        frustumW * 0.24,
        frustumH / 2,
        -frustumH / 2,
        0.1,
        500,
      );
      // On portrait mobile, look left of the grid so the right-aligned canvas
      // shows empty space on the left and the grid's entry diagonal on the right.
      const lookX0 = portrait0 ? -3 : GX;
      camera.position.set(lookX0 + 80, 80, GZ + 80);
      camera.lookAt(lookX0, cfg.maxH * 0.25, GZ);

      const t0 = performance.now();
      let lastFrameTime = 0;
      let frameCount = 0;
      const heightFn = variant === "services" ? heightServices : heightHome;

      const loop = (now: number) => {
        if (disposed) return;
        rafId = requestAnimationFrame(loop);
        if (!tabVisible) return;

        // 30 fps cap
        if (now - lastFrameTime < FRAME_MS) return;
        lastFrameTime = now;

        const t = reduced ? 0.5 : (now - t0 - accumulatedHiddenMs) * 0.001;
        const sp = Math.sqrt(scroll.pct);

        for (let row = 0; row < cfg.rows; row++) {
          for (let col = 0; col < cfg.cols; col++) {
            const idx = row * cfg.cols + col;
            const wx = col * cfg.gap;
            const wz = row * cfg.gap;
            const h = heightFn(col, row, t, sp, cfg.cols, cfg.rows, cfg.minH, cfg.maxH);

            pos.set(wx, h / 2, wz);
            scl.set(1, h, 1);
            mx.compose(pos, quat, scl);
            bodyMesh.setMatrixAt(idx, mx);

            pos.set(wx, h + cfg.topSlabY, wz);
            scl.set(1, 1, 1);
            mx.compose(pos, quat, scl);
            topMesh.setMatrixAt(idx, mx);

            applyTopGold(variant, h, cfg.minH, cfg.maxH, topCol);
            topMesh.setColorAt(idx, topCol);
          }
        }

        bodyMesh.instanceMatrix.needsUpdate = true;
        topMesh.instanceMatrix.needsUpdate = true;
        topMesh.instanceColor!.needsUpdate = true;

        const renderStart = performance.now();
        renderer!.render(scene, camera);
        const renderMs = performance.now() - renderStart;

        frameCount++;
        // Adaptive quality: if the first few frames are slow (software rendering /
        // headless Chromium / very slow device), stop the loop and keep the current
        // frame as a static background. Real GPUs render in <5 ms; SwiftShader
        // typically takes 100–300 ms. This prevents runaway TBT on Lighthouse.
        if (frameCount <= 5 && renderMs > 60) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };

      rafId = requestAnimationFrame(loop);
    };

    // Start immediately — adaptive quality bails out after first slow frame.
    init();
    onResize();

    return () => {
      dispose();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
