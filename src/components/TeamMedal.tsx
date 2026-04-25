"use client";

/**
 * TeamMedal — standalone 3D gold medal component.
 * Drop anywhere with <TeamMedal width={340} height={480} />.
 * Mouse hover tilts/turns the medal to show its 3D depth.
 */

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Arc-text helper ──────────────────────────────────────────────────────────

function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  r: number,
  centerDeg: number,
  inward: boolean,
  fontSize: number,
  color: string,
) {
  ctx.save();
  ctx.font = `500 ${fontSize}px "DM Mono", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = text.split("");
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalAngle = widths.reduce((s, w) => s + w / r, 0);
  const centerRad = centerDeg * (Math.PI / 180);
  const dir = inward ? -1 : 1;
  let angle = centerRad - (dir * totalAngle) / 2;
  for (let i = 0; i < chars.length; i++) {
    const da = widths[i] / r;
    const ca = angle + (dir * da) / 2;
    ctx.save();
    ctx.translate(cx + r * Math.cos(ca), cy + r * Math.sin(ca));
    ctx.rotate(inward ? ca - Math.PI / 2 : ca + Math.PI / 2);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    angle += dir * da;
  }
  ctx.restore();
}

// ─── Medal face texture ───────────────────────────────────────────────────────

function createTeamMedalTexture(
  topText = "DESIGN  •  DEVELOPMENT",
  bottomText = "THE  TEAM",
): THREE.CanvasTexture {
  const S = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const cx = S / 2, cy = S / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, S / 2 - 2, 0, Math.PI * 2);
  ctx.clip();

  const face = ctx.createLinearGradient(0, 0, S, S);
  face.addColorStop(0.00, "#1a1208");
  face.addColorStop(0.08, "#4a3018");
  face.addColorStop(0.20, "#a87838");
  face.addColorStop(0.34, "#d4a848");
  face.addColorStop(0.44, "#e8c860");
  face.addColorStop(0.50, "#f2da72");
  face.addColorStop(0.58, "#d0a848");
  face.addColorStop(0.72, "#8a6028");
  face.addColorStop(0.86, "#4a3018");
  face.addColorStop(1.00, "#180e04");
  ctx.fillStyle = face;
  ctx.fillRect(0, 0, S, S);

  const spec = ctx.createRadialGradient(cx - 145, cy - 200, 0, cx, cy, S * 0.52);
  spec.addColorStop(0, "rgba(255,252,210,0.22)");
  spec.addColorStop(0.5, "rgba(255,252,210,0.05)");
  spec.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, S, S);

  for (const [r, color, w] of [
    [455, "rgba(0,0,0,0.55)", 3.5],
    [452, "rgba(242,218,114,0.25)", 1.5],
    [382, "rgba(0,0,0,0.45)", 3],
    [379, "rgba(242,218,114,0.20)", 1.2],
    [306, "rgba(0,0,0,0.38)", 2],
    [304, "rgba(242,218,114,0.16)", 0.8],
  ] as [number, string, number][]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const dotR = (382 + 225) / 2;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 16;
    ctx.fillStyle = "rgba(201,165,90,0.45)";
    ctx.beginPath();
    ctx.arc(cx + dotR * Math.cos(a), cy + dotR * Math.sin(a), 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const boss = ctx.createRadialGradient(cx - 60, cy - 80, 0, cx, cy, 232);
  boss.addColorStop(0.00, "#f2da72");
  boss.addColorStop(0.18, "#c9a550");
  boss.addColorStop(0.50, "#7a5820");
  boss.addColorStop(0.80, "#3a2410");
  boss.addColorStop(1.00, "#180e08");
  ctx.fillStyle = boss;
  ctx.beginPath();
  ctx.arc(cx, cy, 225, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(242,218,114,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 225, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0,0,0,0.60)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(242,218,114,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 177, 0, Math.PI * 2);
  ctx.stroke();

  // Dark inner well
  const well = ctx.createRadialGradient(cx - 30, cy - 42, 0, cx, cy, 174);
  well.addColorStop(0, "#1c1408");
  well.addColorStop(0.5, "#0e0a04");
  well.addColorStop(1, "#070504");
  ctx.fillStyle = well;
  ctx.beginPath();
  ctx.arc(cx, cy, 170, 0, Math.PI * 2);
  ctx.fill();

  // Dark centre well — clear canvas for engraved text
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fillStyle = "#0d0905";
  ctx.fill();
  ctx.strokeStyle = "rgba(201,165,90,0.45)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Engraved "B/C" monogram — Georgia + Yellowtail on the medal (nav/footer use mono ring mark)
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const drawBC = (offsetX: number, offsetY: number, fillStyle: string) => {
    ctx.fillStyle = fillStyle;
    // Draw each part separately so we can use different fonts
    const bFont   = `bold 86px Georgia, serif`;
    const slashFont = `400 110px Yellowtail, cursive`;
    const cFont   = `bold 86px Georgia, serif`;
    // Measure to position manually
    ctx.font = bFont;
    const bW = ctx.measureText("B").width;
    ctx.font = slashFont;
    const sW = ctx.measureText("/").width;
    ctx.font = cFont;
    const cW = ctx.measureText("C").width;
    const total = bW + sW * 0.7 + cW;
    let x = -total / 2 + offsetX;
    ctx.font = bFont;
    ctx.fillText("B", x + bW / 2, offsetY);
    x += bW;
    ctx.font = slashFont;
    ctx.fillText("/", x + sW * 0.35, offsetY + 4);
    x += sW * 0.7;
    ctx.font = cFont;
    ctx.fillText("C", x + cW / 2, offsetY);
  };

  drawBC(3, 4, "rgba(0,0,0,0.95)");
  drawBC(-2, -2, "rgba(242,218,114,0.25)");
  drawBC(0, 0, "rgba(201,165,90,0.85)");
  ctx.restore();

  drawArcText(ctx, topText, cx, cy, 332, 90, true, 24, "rgba(201,165,90,0.80)");
  drawArcText(ctx, bottomText, cx, cy, 415, 270, false, 22, "rgba(201,165,90,0.50)");

  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Ribbon texture ───────────────────────────────────────────────────────────

function createRibbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#1a1208";
  ctx.fillRect(0, 0, 128, 512);
  ctx.strokeStyle = "#c9a55a";
  ctx.lineWidth = 5;
  for (let x = -512; x < 640; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 512, 512);
    ctx.stroke();
  }
  ctx.strokeStyle = "#f2da72";
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(64, 0);
  ctx.lineTo(64, 512);
  ctx.stroke();
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ─── Assembly ─────────────────────────────────────────────────────────────────

const ASSEMBLY_HEIGHT = 3.55;
const DISPLAY_SCALE   = 1.22;
const POS_Y           = (ASSEMBLY_HEIGHT * DISPLAY_SCALE) / 2;

function MedalGroup({ topText, bottomText }: { topText?: string; bottomText?: string }) {
  const pivotRef  = useRef<THREE.Group>(null);
  const scaleRef  = useRef(0);
  const settled   = useRef(false);
  const startTime = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const { pointer, gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const onEnter = () => { hoveredRef.current = true; };
    const onLeave = () => { hoveredRef.current = false; };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl.domElement]);

  const barMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c0a050"), metalness: 0.92, roughness: 0.22,
  }), []);
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    const yf = new FontFace("Yellowtail", "url(https://fonts.gstatic.com/s/yellowtail/v25/OZpGg_pnoDtINPfRIlLotlw.ttf)");
    yf.load().then((f) => { document.fonts.add(f); setFontReady(true); }).catch(() => setFontReady(true));
  }, []);
  const faceTexture = useMemo(
    () => createTeamMedalTexture(topText, bottomText),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topText, bottomText, fontReady],
  );
  const ribbonTexture = useMemo(() => createRibbonTexture(), []);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c9a55a"), metalness: 0.95, roughness: 0.16, envMapIntensity: 1.6,
  }), []);
  const discGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1.045, 0.14, 128, 1, false);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  const bossGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.43, 0.46, 0.07, 64, 1, false);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  const discMats = useMemo(() => [
    goldMat,
    new THREE.MeshStandardMaterial({ map: faceTexture, metalness: 0.72, roughness: 0.28, envMapIntensity: 1.0 }),
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#1a1208"), metalness: 0.6, roughness: 0.5 }),
  ], [goldMat, faceTexture]);
  const bossMats = useMemo(() => [
    goldMat,
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#1a1208") }),
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#1a1208") }),
  ], [goldMat]);

  useFrame((state, delta) => {
    if (!pivotRef.current) return;
    if (scaleRef.current < 1) {
      scaleRef.current = Math.min(1, scaleRef.current + delta * 3.5);
      pivotRef.current.scale.setScalar(1 - Math.pow(1 - scaleRef.current, 3));
    }
    if (!settled.current) {
      if (startTime.current === null) startTime.current = state.clock.elapsedTime;
      const t = state.clock.elapsedTime - startTime.current;
      if (t < 3.5) {
        pivotRef.current.rotation.z = Math.sin(t * 2.8) * Math.exp(-t * 2.0) * 0.24;
        return;
      }
      settled.current = true;
    }
    const active = hoveredRef.current;
    pivotRef.current.rotation.z = THREE.MathUtils.lerp(pivotRef.current.rotation.z, active ? pointer.x * 0.14 : 0, Math.min(delta * 5, 1));
    pivotRef.current.rotation.y = THREE.MathUtils.lerp(pivotRef.current.rotation.y, active ? -pointer.x * 1.4 : 0, Math.min(delta * 4, 1));
    pivotRef.current.rotation.x = THREE.MathUtils.lerp(pivotRef.current.rotation.x, active ? pointer.y * 0.55 : 0, Math.min(delta * 3.5, 1));
  });

  const topBarY = -0.245;
  const ribY    = topBarY - 0.045 - 0.55;
  const botBarY = ribY - 0.55 - 0.045;

  return (
    <group position={[0, POS_Y, 0]} scale={DISPLAY_SCALE}>
      <group ref={pivotRef}>
        <mesh position={[0, -0.10, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.20, 16]} />
          <meshStandardMaterial color="#b09050" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, topBarY, 0]} material={barMat}><boxGeometry args={[0.72, 0.09, 0.15]} /></mesh>
        <mesh position={[0, ribY, -0.01]}>
          <planeGeometry args={[0.44, 1.10]} />
          <meshStandardMaterial map={ribbonTexture} roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh position={[0, botBarY, 0]} material={barMat}><boxGeometry args={[0.72, 0.09, 0.15]} /></mesh>
        <mesh position={[0, -2.55, 0]} geometry={discGeo} material={discMats} />
      </group>
    </group>
  );
}

function MedalScene({ topText, bottomText }: { topText?: string; bottomText?: string }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 7]} intensity={1.8} color={new THREE.Color("#fff6e0")} />
      <pointLight position={[-4, 2, 5]} intensity={1.1} color={new THREE.Color("#c9a55a")} />
      <pointLight position={[4, -2, 4]} intensity={0.5} color={new THREE.Color("#8090c0")} />
      <Environment preset="studio" />
      <MedalGroup topText={topText} bottomText={bottomText} />
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function TeamMedal({
  width = 340,
  height = 480,
  topText,
  bottomText,
}: {
  width?: number;
  height?: number;
  topText?: string;
  bottomText?: string;
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        camera={{ position: [0, 0, 8.5], fov: 40 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <MedalScene topText={topText} bottomText={bottomText} />
        </Suspense>
      </Canvas>
    </div>
  );
}
