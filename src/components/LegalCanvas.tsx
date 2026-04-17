"use client";

/**
 * LegalCanvas — Three.js scales of justice hero background.
 *
 * A single, beautifully lit 3D scales of justice, centred-right.
 * The arm tips slowly and rebalances. Chains hang with realistic lag.
 * Fine particles drift like dust in courthouse light.
 *
 * Interactivity:
 *  - Mouse X/Y → camera orbits subtly around the scales.
 *  - Scroll    → scales tilt more dramatically.
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const FRAME_MS = 1000 / 45;

const GOLD  = 0xc9a55a;
const IVORY = 0xe8dfc0;
const DIM   = 0x6a3d0a;

const BEAM_H       = 5.2;
const ARM_W        = 3.2;   /* half-width */
const CHAIN_SEGS   = 8;
const CHAIN_H      = 2.2;
const PAN_RADIUS   = 0.72;
const PAN_DEPTH    = 0.08;
const TIP_AMP      = 0.32;  /* max arm tilt radians */
const TIP_PERIOD   = 8.5;   /* seconds per full cycle */
const PARTICLE_COUNT = 280;

export default function LegalCanvas() {
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

    /* ── Scene + camera ───────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    /* Tight FOV amplifies perspective — near objects loom, far ones recede */
    const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 200);
    camera.position.set(2, 0.5, 16);
    camera.lookAt(2, 0, 0);

    /* ── Lights ───────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    /* Warm overhead key */
    const keyLight = new THREE.DirectionalLight(0xfff6e0, 2.2);
    keyLight.position.set(4, 18, 10);
    scene.add(keyLight);

    /* Cool fill from below-left */
    const fillLight = new THREE.DirectionalLight(0xd0c8b0, 0.5);
    fillLight.position.set(-10, -4, 4);
    scene.add(fillLight);

    /* Rim light for edge separation */
    const rimLight = new THREE.DirectionalLight(0xffd580, 0.9);
    rimLight.position.set(-6, 8, -10);
    scene.add(rimLight);

    /* Soft point light near scales face — gives pan reflections */
    const faceLight = new THREE.PointLight(0xfff8e8, 3.5, 20);
    faceLight.position.set(2, 4, 8);
    scene.add(faceLight);

    /* ── Materials ────────────────────────────────────────────────────── */
    const goldMat = new THREE.MeshStandardMaterial({
      color: GOLD, emissive: DIM, emissiveIntensity: 0.25,
      roughness: 0.18, metalness: 0.92,
    });
    const ivoryMat = new THREE.MeshStandardMaterial({
      color: IVORY, emissive: 0x2a1a04, emissiveIntensity: 0.12,
      roughness: 0.28, metalness: 0.75,
    });
    const chainMat = new THREE.MeshStandardMaterial({
      color: GOLD, emissive: DIM, emissiveIntensity: 0.2,
      roughness: 0.22, metalness: 0.88,
    });

    /* ── Scales group ─────────────────────────────────────────────────── */
    const root = new THREE.Group();
    root.position.set(2.5, 0.6, 0);
    root.scale.setScalar(1.05);
    scene.add(root);

    /* Base plinth */
    const plinthGeo  = new THREE.CylinderGeometry(0.38, 0.52, 0.22, 20);
    const plinthMesh = new THREE.Mesh(plinthGeo, goldMat);
    plinthMesh.position.y = -BEAM_H / 2 - 0.11;
    root.add(plinthMesh);

    /* Vertical beam — tapers slightly */
    const beamGeo  = new THREE.CylinderGeometry(0.038, 0.058, BEAM_H, 12);
    const beamMesh = new THREE.Mesh(beamGeo, goldMat);
    root.add(beamMesh);
    void beamMesh;

    /* Fulcrum — decorative sphere where arm meets beam */
    const fulcrumGeo  = new THREE.SphereGeometry(0.16, 16, 12);
    const fulcrumMesh = new THREE.Mesh(fulcrumGeo, ivoryMat);
    fulcrumMesh.position.y = BEAM_H / 2;
    root.add(fulcrumMesh);
    void fulcrumMesh;

    /* Top finial — small pointed ornament */
    const finialGeo  = new THREE.ConeGeometry(0.07, 0.28, 10);
    const finialMesh = new THREE.Mesh(finialGeo, goldMat);
    finialMesh.position.y = BEAM_H / 2 + 0.16 + 0.14;
    root.add(finialMesh);
    void finialMesh;

    /* ── Arm group (pivots at fulcrum) ────────────────────────────────── */
    const armGroup = new THREE.Group();
    armGroup.position.y = BEAM_H / 2;
    root.add(armGroup);

    /* Horizontal arm — slight taper toward ends */
    const armGeo  = new THREE.CylinderGeometry(0.022, 0.038, ARM_W * 2, 10);
    const armMesh = new THREE.Mesh(armGeo, goldMat);
    armMesh.rotation.z = Math.PI / 2;
    armGroup.add(armMesh);
    void armMesh;

    /* Arm end caps */
    [-ARM_W, ARM_W].forEach(x => {
      const capGeo  = new THREE.SphereGeometry(0.055, 10, 8);
      const capMesh = new THREE.Mesh(capGeo, ivoryMat);
      capMesh.position.x = x;
      armGroup.add(capMesh);
    });

    /* ── Chain + pan factory ──────────────────────────────────────────── */
    interface PanRig {
      pivot:    THREE.Group;   /* hangs from arm tip, rotates to stay vertical */
      panGroup: THREE.Group;   /* pan + chain, child of pivot */
    }

    const makePanRig = (side: -1 | 1): PanRig => {
      /* Pivot point at arm tip */
      const pivot = new THREE.Group();
      pivot.position.x = side * ARM_W;
      armGroup.add(pivot);

      const panGroup = new THREE.Group();
      pivot.add(panGroup);

      /* Chain — CHAIN_SEGS small cylinders */
      const segH = CHAIN_H / CHAIN_SEGS;
      for (let i = 0; i < CHAIN_SEGS; i++) {
        /* Alternate link orientation for visual variety */
        const isEven  = i % 2 === 0;
        const linkRad = 0.055;
        const linkGeo = new THREE.TorusGeometry(linkRad, 0.016, 6, 12);
        const link    = new THREE.Mesh(linkGeo, chainMat);
        link.position.y = -(i + 0.5) * segH;
        /* Alternate X/Z orientation so it looks like interlinked rings */
        link.rotation.x = isEven ? 0 : Math.PI / 2;
        panGroup.add(link);
      }

      /* Three suspension wires — each runs from chain base (0,wireY,0)
         to its attachment point on the pan rim.
         We place each wire at the midpoint of that segment and orient it
         with quaternion lookAt so it points correctly in 3D regardless of angle. */
      const wireY      = -CHAIN_H;
      const panY_local = -CHAIN_H - 0.45; /* top face of pan */
      const wireAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
      const up         = new THREE.Vector3(0, 1, 0);
      wireAngles.forEach(angle => {
        const rimX  = Math.cos(angle) * PAN_RADIUS * 0.78;
        const rimZ  = Math.sin(angle) * PAN_RADIUS * 0.78;
        /* Start: chain base centre */
        const start = new THREE.Vector3(0,    wireY,      0);
        /* End: attachment point on pan rim */
        const end   = new THREE.Vector3(rimX, panY_local, rimZ);
        const dir   = new THREE.Vector3().subVectors(end, start);
        const len   = dir.length();
        const mid   = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        const wireGeo  = new THREE.CylinderGeometry(0.008, 0.008, len, 5);
        const wireMesh = new THREE.Mesh(wireGeo, chainMat);
        wireMesh.position.copy(mid);
        /* Align cylinder (default Y-up) to the dir vector */
        wireMesh.quaternion.setFromUnitVectors(up, dir.clone().normalize());
        panGroup.add(wireMesh);
      });

      /* Pan — sits just below the wire endpoints */
      const panY = -CHAIN_H - 0.45 - PAN_DEPTH / 2;

      const panBodyGeo  = new THREE.CylinderGeometry(PAN_RADIUS, PAN_RADIUS * 0.92, PAN_DEPTH, 32);
      const panBody     = new THREE.Mesh(panBodyGeo, goldMat);
      panBody.position.y = panY;
      panGroup.add(panBody);

      /* Rim ring */
      const rimGeo  = new THREE.TorusGeometry(PAN_RADIUS, 0.022, 8, 32);
      const rimMesh = new THREE.Mesh(rimGeo, ivoryMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = panY + PAN_DEPTH / 2;
      panGroup.add(rimMesh);

      return { pivot, panGroup };
    };

    const leftRig  = makePanRig(-1);
    const rightRig = makePanRig(1);

    /* ── Particles — dust motes in courthouse light ───────────────────── */
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.3) * 16;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: GOLD, size: 0.03, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

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
      scroll.smooth  += (scroll.pct - scroll.smooth) * 0.08;
      const sp = Math.sqrt(scroll.smooth);

      const t = (now - t0 - accHiddenMs) * 0.001;

      /* Camera rises/falls with mouse Y, pulling in slightly as it rises */
      camera.position.x = 2.5 + (smoothMouse.x - 0.5) * 1.5;
      camera.position.y = 0.5 + (0.5 - smoothMouse.y) * 2.5;
      camera.position.z = 16  - (0.5 - smoothMouse.y) * 2.0;
      camera.lookAt(2, 0, 0);

      /* Root swings broadly on Y with mouse X — this rotates the whole scales
         so whichever pan is coming toward the camera faces us more directly */
      root.rotation.y = (smoothMouse.x - 0.5) * 1.1;

      /* Arm tips with mouse X + scroll drives it to full tilt */
      const tipAngle = Math.tanh((smoothMouse.x - 0.5) * 3.5) * TIP_AMP
        + sp * TIP_AMP * 0.9;
      armGroup.rotation.z = tipAngle;

      /* Chains always hang straight — counteract the arm tilt */
      leftRig.pivot.rotation.z  = -tipAngle;
      rightRig.pivot.rotation.z = -tipAngle;

      /* Pendulum sway: pans lag slightly behind the arm's motion */
      const swayPhase = t * 0.5;
      leftRig.panGroup.rotation.x  =  0.05 * Math.sin(swayPhase + tipAngle * 2);
      rightRig.panGroup.rotation.x = -0.05 * Math.sin(swayPhase - tipAngle * 2);

      /* Face light pulses very softly */
      faceLight.intensity = 3.4 + 0.3 * Math.sin(t * 0.55);

      /* Dust particles drift slowly upward */
      const posArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3 + 1] += 0.004 + (i % 5) * 0.001;
        if (posArr[i * 3 + 1] > 7) posArr[i * 3 + 1] = -7;
      }
      dustGeo.attributes.position.needsUpdate = true;

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
      goldMat.dispose(); ivoryMat.dispose(); chainMat.dispose();
      dustGeo.dispose(); dustMat.dispose();
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
