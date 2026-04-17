"use client";

/**
 * RestaurantCanvas — Three.js candlelit atmosphere hero.
 *
 * Three layered elements:
 *
 * 1. CANDLE FLAMES — a cluster of 5 candles on the right, each with a
 *    teardrop flame mesh that flickers in scale and emissive intensity.
 *    Warm PointLights sit at each flame casting soft pools of light.
 *
 * 2. RISING EMBERS — ~200 additive-blended particles that drift upward
 *    from the candle cluster, fading out as they rise, like heat shimmer
 *    and floating wax-smoke in a candlelit room.
 *
 * 3. WINE GLASS SILHOUETTE — a minimal wireframe wine glass built from
 *    lathed curves, rendered as a gold LineSegments outline. It slowly
 *    rotates and catches the candle glow.
 *
 * Palette: deep amber (#c9843a), warm gold (#c9a55a), crimson (#8b1a1a)
 * on near-black. No cool tones — pure warmth.
 *
 * Interactivity:
 *  - Mouse X/Y → camera drifts, parallax between candles and glass.
 *  - Scroll    → embers accelerate, camera pulls back revealing the scene.
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const FRAME_MS = 1000 / 45;

const AMBER       = 0xc9843a;
const GOLD        = 0xc9a55a;
const FLAME_CORE  = 0xfff0a0;
const FLAME_MID   = 0xff9020;
const EMBER_COL   = 0xff6010;
const PARTICLE_COUNT = 220;
const CANDLE_COUNT   = 5;

export default function RestaurantCanvas() {
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
    const mouse       = { x: 1.0, y: 1.0 };
    const smoothMouse = { x: 1.0, y: 1.0 };
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
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 150);
    /* Default to bottom-right mouse position view */
    camera.position.set(1.5, -0.5, 11);
    camera.lookAt(1.5, 0, 0);

    /* ── Ambient ──────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x1a0d00, 1.0));

    /* ── Candle cluster ───────────────────────────────────────────────── */
    /* Candle positions — grouped right of centre */
    const candlePositions: [number, number, number][] = [
      [ 2.8,  -1.8, 0.0],
      [ 4.2,  -1.8, 0.5],
      [ 3.5,  -1.8, 1.2],
      [ 1.9,  -1.8, 0.8],
      [ 5.0,  -1.8, -0.3],
    ];
    const candleHeights = [1.8, 1.2, 2.2, 0.9, 1.5];

    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xf0ead8, roughness: 0.85, metalness: 0.0,
    });
    const wickMat = new THREE.MeshStandardMaterial({
      color: 0x1a1008, roughness: 1.0,
    });

    /* Flame materials */
    const flameCoreMat = new THREE.MeshStandardMaterial({
      color: FLAME_CORE, emissive: FLAME_CORE, emissiveIntensity: 1.8,
      transparent: true, opacity: 0.92, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.FrontSide,
    });
    const flameMidMat = new THREE.MeshStandardMaterial({
      color: FLAME_MID, emissive: FLAME_MID, emissiveIntensity: 1.2,
      transparent: true, opacity: 0.65, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.FrontSide,
    });

    /* Flame shape — lathe of a teardrop profile */
    const flameProfile: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      /* Teardrop: wide at base, pointed at top */
      const r = Math.sin(t * Math.PI) * (1 - t * 0.3) * 0.18;
      const y = t * 0.55;
      flameProfile.push(new THREE.Vector2(r, y));
    }
    const flameGeoCore = new THREE.LatheGeometry(flameProfile, 8);
    const flameGeoMid  = new THREE.LatheGeometry(
      flameProfile.map(v => new THREE.Vector2(v.x * 1.7, v.y * 1.1)), 8,
    );

    interface CandleRig {
      flameCore: THREE.Mesh;
      flameMid:  THREE.Mesh;
      light:     THREE.PointLight;
      baseY:     number;
      phase:     number;
    }
    const candles: CandleRig[] = [];

    candlePositions.forEach(([cx, cy, cz], i) => {
      const ch = candleHeights[i];

      /* Body */
      const bodyGeo  = new THREE.CylinderGeometry(0.12, 0.13, ch, 14);
      const bodyMesh = new THREE.Mesh(bodyGeo, candleMat);
      bodyMesh.position.set(cx, cy + ch / 2, cz);
      scene.add(bodyMesh);

      /* Wick */
      const wickGeo  = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 5);
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.set(cx, cy + ch + 0.06, cz);
      scene.add(wickMesh);

      /* Flame */
      const flameY = cy + ch + 0.28;
      const flameCore = new THREE.Mesh(flameGeoCore, flameCoreMat);
      flameCore.position.set(cx, flameY, cz);
      scene.add(flameCore);

      const flameMid = new THREE.Mesh(flameGeoMid, flameMidMat);
      flameMid.position.set(cx, flameY - 0.06, cz);
      scene.add(flameMid);

      /* Candle light */
      const light = new THREE.PointLight(AMBER, 2.2, 8);
      light.position.set(cx, flameY + 0.1, cz);
      scene.add(light);

      candles.push({ flameCore, flameMid, light, baseY: flameY, phase: i * 1.37 });
    });

    /* ── Wine glass silhouette ────────────────────────────────────────── */
    /* Profile points for a wine glass — lathe creates the solid, we extract edges */
    const glassProfile: THREE.Vector2[] = [
      new THREE.Vector2(0.00,  0.00),  /* centre base */
      new THREE.Vector2(0.38,  0.00),  /* base outer edge — wide flat foot */
      new THREE.Vector2(0.38,  0.05),  /* base thickness top */
      new THREE.Vector2(0.32,  0.07),  /* bevel inward */
      new THREE.Vector2(0.06,  0.14),  /* taper to stem */
      new THREE.Vector2(0.035, 0.18),  /* stem start */
      new THREE.Vector2(0.035, 1.05),  /* stem — long and thin */
      new THREE.Vector2(0.035, 1.10),  /* stem top */
      new THREE.Vector2(0.10,  1.18),  /* bowl throat */
      new THREE.Vector2(0.30,  1.50),  /* bowl opening */
      new THREE.Vector2(0.48,  1.90),  /* bowl widest */
      new THREE.Vector2(0.52,  2.30),  /* bowl upper */
      new THREE.Vector2(0.48,  2.60),  /* rim taper */
      new THREE.Vector2(0.44,  2.68),  /* rim lip */
    ];

    /* Build glass as a wireframe lathe */
    const glassLatheGeo = new THREE.LatheGeometry(glassProfile, 32);
    const glassWireMat  = new THREE.MeshBasicMaterial({
      color: GOLD, wireframe: true, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const glassMesh = new THREE.Mesh(glassLatheGeo, glassWireMat);
    const GLASS_X = 5.2, GLASS_Y = -1.8, GLASS_Z = -2.2;
    glassMesh.position.set(GLASS_X, GLASS_Y, GLASS_Z);
    glassMesh.scale.setScalar(1.35);
    scene.add(glassMesh);

    /* Base disc — closes the bottom of the lathe */
    const baseDiscGeo  = new THREE.CircleGeometry(0.38 * 1.35, 32);
    const baseDiscMat  = new THREE.MeshBasicMaterial({
      color: GOLD, wireframe: true, transparent: true, opacity: 0.25,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const baseDisc = new THREE.Mesh(baseDiscGeo, baseDiscMat);
    baseDisc.rotation.x = -Math.PI / 2;
    baseDisc.position.set(GLASS_X, GLASS_Y, GLASS_Z);
    scene.add(baseDisc);

    /* Solid glass with very low opacity for refraction feel */
    const glassSolidMat = new THREE.MeshStandardMaterial({
      color: 0xffe8c0, emissive: 0x7a4a10, emissiveIntensity: 0.08,
      transparent: true, opacity: 0.07, roughness: 0.05, metalness: 0.1,
      depthWrite: false, side: THREE.DoubleSide,
    });
    const glassSolid = new THREE.Mesh(glassLatheGeo, glassSolidMat);
    glassSolid.position.set(GLASS_X, GLASS_Y, GLASS_Z);
    glassSolid.scale.copy(glassMesh.scale);
    scene.add(glassSolid);

    /* ── Rising embers / heat shimmer ────────────────────────────────── */
    const pPos    = new Float32Array(PARTICLE_COUNT * 3);
    const pVelY   = new Float32Array(PARTICLE_COUNT);
    const pLife   = new Float32Array(PARTICLE_COUNT);   /* 0–1 */
    const pOrigin = new Float32Array(PARTICLE_COUNT * 2); /* x,z spawn origin */

    const resetParticle = (i: number) => {
      /* Spawn from random candle position */
      const ci = Math.floor(Math.random() * CANDLE_COUNT);
      const [cx,, cz] = candlePositions[ci];
      const ch = candleHeights[ci];
      pPos[i * 3]     = cx + (Math.random() - 0.5) * 0.3;
      pPos[i * 3 + 1] = candlePositions[ci][1] + ch + 0.3;
      pPos[i * 3 + 2] = cz + (Math.random() - 0.5) * 0.3;
      pOrigin[i * 2]  = pPos[i * 3];
      pOrigin[i * 2 + 1] = pPos[i * 3 + 2];
      pVelY[i] = 0.018 + Math.random() * 0.025;
      pLife[i] = Math.random();
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) resetParticle(i);

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: EMBER_COL, size: 0.055, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    /* ── Table surface hint ───────────────────────────────────────────── */
    const tableGeo = new THREE.PlaneGeometry(12, 6);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0d0805, roughness: 0.6, metalness: 0.3,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.rotation.x = -Math.PI / 2;
    table.position.set(2, -1.8, 0);
    scene.add(table);

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

      /* Camera pulls back and rises on scroll, mouse drifts it */
      camera.position.set(
        0   + (smoothMouse.x - 0.5) * 3,
        1   + sp * 3 + (0.5 - smoothMouse.y) * 2,
        12  + sp * 4,
      );
      camera.lookAt(1.5, 0, 0);

      /* Flame flicker — scale and emissive pulse per candle */
      candles.forEach((c, i) => {
        const flicker = 0.88 + 0.18 * Math.sin(t * 8.5 + c.phase)
          + 0.08 * Math.sin(t * 13.2 + c.phase * 2.1)
          + 0.05 * Math.sin(t * 21.0 + c.phase * 0.7);
        const lean = 0.06 * Math.sin(t * 3.1 + c.phase);

        c.flameCore.scale.set(flicker * 0.9, flicker, flicker * 0.9);
        c.flameCore.position.y = c.baseY + lean * 0.1;
        c.flameCore.rotation.z = lean;

        c.flameMid.scale.set(flicker, flicker * 1.05, flicker);
        c.flameMid.rotation.z = lean * 1.2;

        c.light.intensity = 1.8 * flicker + 0.5 * Math.sin(t * 6.3 + c.phase);
        c.light.position.y = c.baseY + 0.15 * flicker;

        /* Subtle colour temperature shift in flicker */
        const warm = flicker > 1.0;
        c.light.color.setHex(warm ? 0xffcc70 : AMBER);
      });

      /* Wine glass slow rotation */
      const glassRot = t * 0.08 + (smoothMouse.x - 0.5) * 0.4;
      glassMesh.rotation.y  = glassRot;
      glassSolid.rotation.y = glassRot;
      baseDisc.rotation.y   = glassRot;

      /* Rising embers */
      const speedBoost = 1 + sp * 1.8;
      const posArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pLife[i] += 0.004 * speedBoost;
        posArr[i * 3]     = pOrigin[i * 2] + 0.18 * Math.sin(t * 1.4 + i * 0.7);
        posArr[i * 3 + 1] += pVelY[i] * speedBoost;
        posArr[i * 3 + 2] = pOrigin[i * 2 + 1] + 0.12 * Math.cos(t * 1.1 + i * 0.5);
        if (pLife[i] > 1.0) resetParticle(i);
      }
      dustGeo.attributes.position.needsUpdate = true;

      /* Ember opacity fades with life */
      dustMat.opacity = 0.65;

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
      candleMat.dispose(); wickMat.dispose();
      flameCoreMat.dispose(); flameMidMat.dispose();
      flameGeoCore.dispose(); flameGeoMid.dispose();
      glassLatheGeo.dispose(); glassWireMat.dispose(); glassSolidMat.dispose();
      baseDiscGeo.dispose(); baseDiscMat.dispose();
      dustGeo.dispose(); dustMat.dispose();
      tableGeo.dispose(); tableMat.dispose();
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
