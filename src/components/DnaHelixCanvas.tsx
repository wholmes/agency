"use client";

/**
 * DnaHelixCanvas — Three.js animated double-helix hero background.
 *
 * The helix geometry is rebuilt every frame from a parametric function so
 * the strands can pulse, breathe, and deform in real time.
 *
 * Visual features:
 *  - Two helical tube backbones (gold / teal) rebuilt each frame with a
 *    live radius-breathing and wave-ripple effect.
 *  - Cylindrical base-pair rungs connecting the strands.
 *  - Emissive sphere nodes at every rung endpoint.
 *  - Orbiting PointLight that casts moving specular highlights.
 *  - 180 additive-blended floating particles drifting upward.
 *  - Glow halos (wider translucent tubes, additive blending).
 *
 * Interactivity:
 *  - Mouse X → helix lazily rotates to follow cursor.
 *  - Scroll   → helix tilts forward and animation intensifies.
 *
 * Performance:
 *  - 45 fps cap.
 *  - Adaptive bail-out removed — geometry is light enough for real-time rebuild.
 *  - Tab-visibility guard prevents runaway animation after backgrounding.
 */

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const FRAME_MS = 1000 / 45;

/* ── Palette ──────────────────────────────────────────────────────────── */
const GOLD_HEX  = 0xc9a55a;
const TEAL_HEX  = 0x5adace;
const GOLD_EMIT = 0x7a4a10;
const TEAL_EMIT = 0x0a5550;
const PALE_HEX  = 0xe8dfc0;

/* ── Helix constants ──────────────────────────────────────────────────── */
const HELIX_RADIUS    = 1.55;
const HELIX_HEIGHT    = 13;
const HELIX_TURNS     = 4.2;
const RUNG_COUNT      = 26;
const PATH_STEPS      = 80;      // points per strand (rebuilt each frame)
const STRAND_RADIUS   = 0.06;
const GLOW_RADIUS     = 0.18;
const TUBE_RADIAL_SEG = 7;
const NODE_RADIUS     = 0.13;
const RUNG_RADIUS     = 0.032;
const PARTICLE_COUNT  = 180;

/* ── Helpers ──────────────────────────────────────────────────────────── */
function rgba(hex: number, a: number): string {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8)  & 0xff;
  const b =  hex        & 0xff;
  return `rgba(${r},${g},${b},${a})`;
}
void rgba;

/** Build an array of Vector3 for one strand at animation time t. */
function buildStrand(
  phase: number,
  t: number,
  scroll: number,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const breathe = 1 + 0.12 * Math.sin(t * 0.9);
  const twist   = t * 0.22;
  for (let i = 0; i <= PATH_STEPS; i++) {
    const u     = i / PATH_STEPS;
    const angle = u * Math.PI * 2 * HELIX_TURNS + phase + twist;
    const y     = u * HELIX_HEIGHT - HELIX_HEIGHT / 2;
    /* Ripple — each cross-section breathes at slightly different phase */
    const ripple = 1 + 0.07 * Math.sin(u * Math.PI * 6 - t * 2.1 + phase);
    const r = HELIX_RADIUS * breathe * ripple * (1 + scroll * 0.12);
    pts.push(new THREE.Vector3(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r,
    ));
  }
  return pts;
}

export default function DnaHelixCanvas() {
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
      if (document.hidden) {
        hiddenAt = now;
      } else if (hiddenAt > 0) {
        accHiddenMs += now - hiddenAt;
        hiddenAt = 0;
        scroll.smooth = scroll.pct;
      }
      tabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* ── Mouse ────────────────────────────────────────────────────────── */
    const mouse       = { x: 0.5 };
    const smoothMouse = { x: 0.5 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX / window.innerWidth; };
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
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    let W = canvas.clientWidth  || window.innerWidth;
    let H = Math.max(window.innerHeight, canvas.parentElement?.clientHeight ?? 0);
    renderer.setSize(W, H, true);

    /* ── Scene + camera ───────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 200);
    camera.position.set(0, 0, 11);

    /* ── Lights ───────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const keyLight = new THREE.DirectionalLight(0xfff6e0, 1.6);
    keyLight.position.set(5, 12, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x80ffe0, 0.55);
    fillLight.position.set(-6, 2, -6);
    scene.add(fillLight);

    const orbitLight = new THREE.PointLight(0xffd580, 3.2, 24);
    scene.add(orbitLight);

    /* ── Helix group ──────────────────────────────────────────────────── */
    const helixGroup = new THREE.Group();
    helixGroup.position.x = 2.6;   /* offset right so text has room */
    scene.add(helixGroup);

    /* ── Materials (created once, geometry rebuilt per frame) ─────────── */
    const matA = new THREE.MeshStandardMaterial({
      color: GOLD_HEX, emissive: GOLD_EMIT, emissiveIntensity: 0.4,
      roughness: 0.3, metalness: 0.65,
    });
    const matB = new THREE.MeshStandardMaterial({
      color: TEAL_HEX, emissive: TEAL_EMIT, emissiveIntensity: 0.4,
      roughness: 0.3, metalness: 0.65,
    });
    const glowMatA = new THREE.MeshStandardMaterial({
      color: GOLD_HEX, emissive: GOLD_EMIT, emissiveIntensity: 0.2,
      transparent: true, opacity: 0.07, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.BackSide,
    });
    const glowMatB = new THREE.MeshStandardMaterial({
      color: TEAL_HEX, emissive: TEAL_EMIT, emissiveIntensity: 0.2,
      transparent: true, opacity: 0.07, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.BackSide,
    });
    const rungMat = new THREE.MeshStandardMaterial({
      color: PALE_HEX, emissive: 0x443322, emissiveIntensity: 0.25,
      roughness: 0.45, metalness: 0.5,
    });
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7,
      roughness: 0.2, metalness: 0.3,
    });

    /* ── Initial geometry placeholders ────────────────────────────────── */
    const makeTubeMesh = (mat: THREE.MeshStandardMaterial) => {
      const geo  = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(buildStrand(0, 0, 0)),
        PATH_STEPS, STRAND_RADIUS, TUBE_RADIAL_SEG, false,
      );
      const mesh = new THREE.Mesh(geo, mat);
      helixGroup.add(mesh);
      return mesh;
    };
    const makeGlowMesh = (mat: THREE.MeshStandardMaterial, phase: number) => {
      const geo  = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(buildStrand(phase, 0, 0)),
        PATH_STEPS, GLOW_RADIUS, TUBE_RADIAL_SEG, false,
      );
      const mesh = new THREE.Mesh(geo, mat);
      helixGroup.add(mesh);
      return mesh;
    };

    const meshA     = makeTubeMesh(matA);
    const meshB     = makeTubeMesh(matB);
    const glowMeshA = makeGlowMesh(glowMatA, 0);
    const glowMeshB = makeGlowMesh(glowMatB, Math.PI);

    /* ── Rung + node instanced meshes ─────────────────────────────────── */
    const rungGeo  = new THREE.CylinderGeometry(RUNG_RADIUS, RUNG_RADIUS, 1, 6);
    const rungMesh = new THREE.InstancedMesh(rungGeo, rungMat, RUNG_COUNT);
    rungMesh.frustumCulled = false;
    helixGroup.add(rungMesh);

    const nodeGeo  = new THREE.SphereGeometry(NODE_RADIUS, 10, 8);
    const nodeMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, RUNG_COUNT * 2);
    nodeMesh.frustumCulled = false;
    helixGroup.add(nodeMesh);

    const dummy        = new THREE.Object3D();
    const nodeColGold  = new THREE.Color(GOLD_HEX);
    const nodeColTeal  = new THREE.Color(TEAL_HEX);

    /* ── Particles ────────────────────────────────────────────────────── */
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * HELIX_HEIGHT * 1.6;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc9a55a, size: 0.05, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    /* ── Resize ───────────────────────────────────────────────────────── */
    const onResize = () => {
      W = canvas.clientWidth  || window.innerWidth;
      H = Math.max(window.innerHeight, canvas.parentElement?.clientHeight ?? 0);
      renderer.setSize(W, H, true);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* ── Rebuild tube geometry from new points ────────────────────────── */
    const rebuildTube = (
      mesh: THREE.Mesh,
      pts: THREE.Vector3[],
      radius: number,
    ) => {
      mesh.geometry.dispose();
      mesh.geometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(pts),
        PATH_STEPS, radius, TUBE_RADIAL_SEG, false,
      );
    };

    const t0 = performance.now();
    let lastFrame = 0;

    /* ── Animation loop ───────────────────────────────────────────────── */
    const loop = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      if (!tabVisible || now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
      scroll.smooth  += (scroll.pct - scroll.smooth) * 0.1;
      const sp = Math.sqrt(scroll.smooth);

      const t = (now - t0 - accHiddenMs) * 0.001;

      /* Build live strand paths */
      const ptsA = buildStrand(0,        t, sp);
      const ptsB = buildStrand(Math.PI,  t, sp);

      /* Rebuild backbone + glow tubes */
      rebuildTube(meshA,     ptsA, STRAND_RADIUS);
      rebuildTube(meshB,     ptsB, STRAND_RADIUS);
      rebuildTube(glowMeshA, ptsA, GLOW_RADIUS);
      rebuildTube(glowMeshB, ptsB, GLOW_RADIUS);

      /* Update rung + node positions from live strand */
      for (let i = 0; i < RUNG_COUNT; i++) {
        const u  = (i + 0.5) / RUNG_COUNT;
        const iA = Math.min(Math.round(u * PATH_STEPS), PATH_STEPS);
        const iB = iA;
        const pA = ptsA[iA];
        const pB = ptsB[iB];
        const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(pB, pA);
        const len = dir.length();

        dummy.position.copy(mid);
        dummy.scale.set(1, len, 1);
        dummy.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        dummy.updateMatrix();
        rungMesh.setMatrixAt(i, dummy.matrix);

        dummy.scale.setScalar(1);
        dummy.quaternion.identity();
        dummy.position.copy(pA);
        dummy.updateMatrix();
        nodeMesh.setMatrixAt(i * 2, dummy.matrix);
        nodeMesh.setColorAt(i * 2, nodeColGold);

        dummy.position.copy(pB);
        dummy.updateMatrix();
        nodeMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
        nodeMesh.setColorAt(i * 2 + 1, nodeColTeal);
      }
      rungMesh.instanceMatrix.needsUpdate = true;
      nodeMesh.instanceMatrix.needsUpdate = true;
      if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;

      /* Rotate group — mouse steer + auto-spin */
      helixGroup.rotation.y += ((smoothMouse.x - 0.5) * 0.6 - helixGroup.rotation.y) * 0.03;
      helixGroup.rotation.y += 0.003;
      helixGroup.rotation.x  = sp * 0.25;

      /* Vertical breathing */
      helixGroup.position.y = Math.sin(t * 0.25) * 0.3;

      /* Orbit light */
      orbitLight.position.set(
        Math.cos(t * 0.45) * 8,
        Math.sin(t * 0.28) * 5,
        Math.sin(t * 0.45) * 8 + 5,
      );

      /* Glow pulse */
      const pulse = 0.05 + 0.04 * Math.sin(t * 1.4);
      glowMatA.opacity = pulse;
      glowMatB.opacity = pulse * 0.8;

      /* Particles drift upward */
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3 + 1] += 0.008 + (i % 4) * 0.002;
        if (posArr[i * 3 + 1] > HELIX_HEIGHT * 0.9) {
          posArr[i * 3 + 1] = -HELIX_HEIGHT * 0.9;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll",            onScroll);
      window.removeEventListener("resize",            onResize);
      window.removeEventListener("mousemove",         onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      [meshA, meshB, glowMeshA, glowMeshB].forEach(m => m.geometry.dispose());
      [matA, matB, glowMatA, glowMatB, rungMat, nodeMat].forEach(m => m.dispose());
      rungGeo.dispose();
      nodeGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
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
