"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type TeamMember = {
  id: number;
  name: string;
  role: string;
  philosophy: string;
  bio: string;
  skills: string[];
  brandCodeBalance: number;
  featured: boolean;
  showTags: boolean;
  showBalance: boolean;
  photoUrl: string;
  capabilities: string;
};

// ─── Arc-text helper ──────────────────────────────────────────────────────────

/**
 * Draws text along a circular arc on a 2D canvas.
 *
 * centerDeg: angle of the text midpoint, SVG convention (y-down):
 *   90  = bottom of circle
 *   270 = top of circle
 *
 * inward = true  → letters face center (inscribed, used for bottom name)
 * inward = false → letters face outward (used for top role label)
 *
 * Math is verified: at 90° inward, each char rotates by (angle - π/2),
 * which equals 0 at the exact bottom → upright, pointing up toward center.
 * At 270° outward, each char rotates by (angle + π/2), also 0 at exact top.
 */
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
  const totalAngle = widths.reduce((s, w) => s + w / r, 0); // total radians

  const centerRad = centerDeg * (Math.PI / 180);
  // dir: -1 → angle decreases (rightward at bottom), +1 → angle increases (rightward at top)
  const dir = inward ? -1 : 1;
  let angle = centerRad - dir * totalAngle / 2; // start at left edge

  for (let i = 0; i < chars.length; i++) {
    const da = widths[i] / r;
    const ca = angle + dir * da / 2; // center angle for this char
    ctx.save();
    ctx.translate(cx + r * Math.cos(ca), cy + r * Math.sin(ca));
    ctx.rotate(inward ? ca - Math.PI / 2 : ca + Math.PI / 2);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    angle += dir * da;
  }

  ctx.restore();
}

// ─── Medal face canvas texture ────────────────────────────────────────────────

function createMedalTexture(member: TeamMember): THREE.CanvasTexture {
  const S = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const cx = S / 2, cy = S / 2;

  // Clip to circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, S / 2 - 2, 0, Math.PI * 2);
  ctx.clip();

  // Brushed gold gradient (angled light source top-left)
  const faceGrad = ctx.createLinearGradient(0, 0, S, S);
  faceGrad.addColorStop(0.00, "#1e1408");
  faceGrad.addColorStop(0.08, "#5a4018");
  faceGrad.addColorStop(0.20, "#a87838");
  faceGrad.addColorStop(0.34, "#d4a848");
  faceGrad.addColorStop(0.44, "#e8c860");
  faceGrad.addColorStop(0.50, "#f2da72");
  faceGrad.addColorStop(0.58, "#d0a848");
  faceGrad.addColorStop(0.72, "#8a6028");
  faceGrad.addColorStop(0.86, "#4a3018");
  faceGrad.addColorStop(1.00, "#180e04");
  ctx.fillStyle = faceGrad;
  ctx.fillRect(0, 0, S, S);

  // Specular bloom (top-left)
  const spec = ctx.createRadialGradient(cx - 145, cy - 200, 0, cx, cy, S * 0.52);
  spec.addColorStop(0, "rgba(255,252,210,0.22)");
  spec.addColorStop(0.5, "rgba(255,252,210,0.05)");
  spec.addColorStop(1, "rgba(255,252,210,0)");
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, S, S);

  // Engraved concentric rings — each is a shadow line + highlight line
  const rings: [number, string, number][] = [
    [455, "rgba(0,0,0,0.60)", 3.5],
    [452, "rgba(255,220,120,0.22)", 1.5],
    [382, "rgba(0,0,0,0.48)", 3],
    [379, "rgba(255,220,120,0.17)", 1.2],
    [306, "rgba(0,0,0,0.40)", 2],
    [304, "rgba(255,220,120,0.13)", 0.8],
  ];
  for (const [r, color, w] of rings) {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Six dot details between the middle and inner rings
  const dotR = (382 + 225) / 2;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 12;
    ctx.fillStyle = "rgba(201,165,90,0.48)";
    ctx.beginPath();
    ctx.arc(cx + dotR * Math.cos(a), cy + dotR * Math.sin(a), 9.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Boss (raised disc) — radial gradient, highlight at top-left
  const bossGrad = ctx.createRadialGradient(cx - 60, cy - 80, 0, cx, cy, 232);
  bossGrad.addColorStop(0, "#f2e0a8");
  bossGrad.addColorStop(0.18, "#c9a550");
  bossGrad.addColorStop(0.50, "#7a5820");
  bossGrad.addColorStop(0.80, "#3a2410");
  bossGrad.addColorStop(1, "#180e08");
  ctx.fillStyle = bossGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 225, 0, Math.PI * 2);
  ctx.fill();
  // Boss rim
  ctx.strokeStyle = "rgba(255,240,170,0.30)";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 225, 0, Math.PI * 2);
  ctx.stroke();

  // Well groove
  ctx.strokeStyle = "rgba(0,0,0,0.65)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,220,120,0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 177, 0, Math.PI * 2);
  ctx.stroke();

  // Recessed well (deep dark field)
  const wellGrad = ctx.createRadialGradient(cx - 30, cy - 42, 0, cx, cy, 174);
  wellGrad.addColorStop(0, "#1c1408");
  wellGrad.addColorStop(0.5, "#0e0a04");
  wellGrad.addColorStop(1, "#070504");
  ctx.fillStyle = wellGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 170, 0, Math.PI * 2);
  ctx.fill();

  // Gilded initials in the well
  const initials = member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  ctx.fillStyle = "rgba(201,165,90,0.88)";
  ctx.font = `300 115px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, cx, cy + 5);

  // Name arc — bottom of face, letters face toward center
  drawArcText(ctx, member.name.toUpperCase(), cx, cy, 332, 90, true, 25, "rgba(201,165,90,0.72)");

  // Role arc — top of face, letters face outward toward rim
  drawArcText(
    ctx,
    member.role.toUpperCase().slice(0, 22),
    cx, cy, 415, 270, false, 22, "rgba(201,165,90,0.44)",
  );

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Ribbon stripe texture ─────────────────────────────────────────────────────

function createRibbonTexture(balance: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const stripe = balance >= 60 ? "#c9a55a" : balance <= 40 ? "#7888a0" : "#c9a55a";
  const dark = "#0d0c08";

  // Fill background
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, 128, 512);

  // Diagonal stripes
  ctx.strokeStyle = stripe;
  ctx.lineWidth = 5;
  for (let x = -512; x < 640; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 512, 512);
    ctx.stroke();
  }

  // Side shadows for fabric depth
  const leftShadow = ctx.createLinearGradient(0, 0, 20, 0);
  leftShadow.addColorStop(0, "rgba(0,0,0,0.35)");
  leftShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = leftShadow;
  ctx.fillRect(0, 0, 20, 512);

  const rightShadow = ctx.createLinearGradient(108, 0, 128, 0);
  rightShadow.addColorStop(0, "rgba(0,0,0,0)");
  rightShadow.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = rightShadow;
  ctx.fillRect(108, 0, 20, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ─── Bar material (brass) ─────────────────────────────────────────────────────

const BAR_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#c0a050"),
  metalness: 0.92,
  roughness: 0.22,
});

// ─── 3D Medal group ───────────────────────────────────────────────────────────

interface MedalGroupProps {
  member: TeamMember;
  posX: number;
  scale: number;
  index: number;
}

function MedalGroup({ member, posX, scale, index }: MedalGroupProps) {
  const pivotRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const target = useRef(0);
  const settled = useRef(false);
  const settleStart = useRef<number | null>(null);

  // Medal face texture (canvas)
  const faceTexture = useMemo(() => createMedalTexture(member), [member.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ribbon stripe texture
  const ribbonTexture = useMemo(() => createRibbonTexture(member.brandCodeBalance), [member.brandCodeBalance]);

  // Gold side material
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c9a55a"),
        metalness: 0.95,
        roughness: 0.16,
        envMapIntensity: 1.6,
      }),
    [],
  );

  // Medal disc geometry — cylinder rotated so cap faces +Z toward camera
  const discGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1.045, 0.14, 128, 1, false);
    g.rotateX(Math.PI / 2); // top cap (+Y → +Z) faces the camera
    return g;
  }, []);

  // Boss geometry
  const bossGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.43, 0.46, 0.07, 64, 1, false);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  // Medal face material array [side, front-cap, back-cap]
  const discMaterials = useMemo(
    () => [
      goldMaterial,
      new THREE.MeshStandardMaterial({
        map: faceTexture,
        metalness: 0.72,
        roughness: 0.28,
        envMapIntensity: 1.0,
      }),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1208"),
        metalness: 0.6,
        roughness: 0.5,
      }),
    ],
    [goldMaterial, faceTexture],
  );

  const bossMaterials = useMemo(
    () => [
      goldMaterial,
      new THREE.MeshStandardMaterial({ color: new THREE.Color("#1a1208") }),
      new THREE.MeshStandardMaterial({ color: new THREE.Color("#1a1208") }),
    ],
    [goldMaterial],
  );

  // Track pointer for sway target
  const { pointer, size } = useThree();

  useEffect(() => {
    if (hovered) return;
    // Each medal is influenced by a region of the x-axis
    const unsubscribe = () => {};
    return unsubscribe;
  }, [hovered]);

  // Pendulum animation
  useFrame((state, delta) => {
    if (!pivotRef.current) return;

    // Entry settle: damped oscillation when first becoming visible
    if (!settled.current) {
      if (settleStart.current === null) {
        settleStart.current = state.clock.elapsedTime + index * 0.14;
      }
      const elapsed = state.clock.elapsedTime - settleStart.current;
      if (elapsed < 0) return;
      if (elapsed < 3.0) {
        const envelope = Math.exp(-elapsed * 2.2);
        pivotRef.current.rotation.z = Math.sin(elapsed * 3.2) * envelope * 0.18;
        return;
      }
      settled.current = true;
    }

    // Mouse-driven sway: the medal nearest the cursor sways more
    const normalizedX = pointer.x; // -1 to +1 across the canvas
    const medalNDC = posX / 6; // approximate NDC position of this medal
    const proximity = 1 - Math.min(Math.abs(normalizedX - medalNDC), 1);
    const swayAmount = hovered ? normalizedX * 0.18 : normalizedX * 0.06 * proximity;

    target.current = swayAmount;
    pivotRef.current.rotation.z = THREE.MathUtils.lerp(
      pivotRef.current.rotation.z,
      target.current,
      Math.min(delta * 5, 1),
    );

    // Hover: tilt medal slightly toward viewer
    pivotRef.current.rotation.x = THREE.MathUtils.lerp(
      pivotRef.current.rotation.x,
      hovered ? -0.12 : 0,
      Math.min(delta * 6, 1),
    );
  });

  // Assembly dimensions
  const hookH = 0.2;
  const barW = 0.72, barH = 0.09, barD = 0.16;
  const ribbonW = 0.44, ribbonH = 1.1;
  const medalY = -2.55; // medal center below pivot

  // Positioning (all relative to pivot at y=0)
  const hookY = -hookH / 2;
  const topBarY = -hookH - barH / 2;
  const ribbonY = topBarY - barH / 2 - ribbonH / 2;
  const botBarY = ribbonY - ribbonH / 2 - barH / 2;

  return (
    <group position={[posX, 0, 0]} scale={scale}>
      <group
        ref={pivotRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Hook pin */}
        <mesh position={[0, hookY, 0]}>
          <cylinderGeometry args={[0.04, 0.04, hookH, 16]} />
          <meshStandardMaterial color="#b09050" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Top ribbon bar */}
        <mesh position={[0, topBarY, 0]} material={BAR_MATERIAL}>
          <boxGeometry args={[barW, barH, barD]} />
        </mesh>

        {/* Ribbon fabric */}
        <mesh position={[0, ribbonY, -0.01]}>
          <planeGeometry args={[ribbonW, ribbonH]} />
          <meshStandardMaterial
            map={ribbonTexture}
            side={THREE.FrontSide}
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>

        {/* Bottom ribbon bar */}
        <mesh position={[0, botBarY, 0]} material={BAR_MATERIAL}>
          <boxGeometry args={[barW, barH, barD]} />
        </mesh>

        {/* Medal disc */}
        <mesh
          position={[0, medalY, 0]}
          geometry={discGeo}
          material={discMaterials}
        />

        {/* Boss (raised centre disc) */}
        <mesh
          position={[0, medalY, 0.075]}
          geometry={bossGeo}
          material={bossMaterials}
        />

        {/* Name plate and philosophy — rendered as HTML overlay */}
        <Html
          position={[0, medalY - 1.35, 0]}
          center
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div style={{ textAlign: "center", width: 220 }}>
            <p
              style={{
                fontFamily: "var(--font-fraunces, Georgia, serif)",
                fontWeight: 300,
                fontSize: member.featured ? 18 : 15,
                letterSpacing: "-0.02em",
                color: hovered ? "var(--color-accent, #c9a55a)" : "var(--color-text-primary, #e8e4dc)",
                transition: "color 0.3s ease",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {member.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary, #6b6762)",
                marginTop: 5,
                margin: "5px 0 0",
              }}
            >
              {member.role}
            </p>

            {hovered && member.philosophy && (
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 11,
                  lineHeight: 1.55,
                  color: "var(--color-text-tertiary, #6b6762)",
                  marginTop: 8,
                  maxWidth: 200,
                  opacity: 0.85,
                }}
              >
                &ldquo;{member.philosophy}&rdquo;
              </p>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

// ─── Wall screw detail ─────────────────────────────────────────────────────────

function WallScrews({ count, spread }: { count: number; spread: number }) {
  const screwGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), []);
  const screwMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8a7040"),
        metalness: 0.9,
        roughness: 0.3,
      }),
    [],
  );

  const positions = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : (i / (count - 1) - 0.5) * 2;
    return t * spread;
  });

  return (
    <>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, 0.42, 0.06]} geometry={screwGeo} material={screwMat}>
          {/* Slot groove on screw face */}
        </mesh>
      ))}
    </>
  );
}

// ─── Mounting strip (top of display case) ────────────────────────────────────

function MountingStrip({ width }: { width: number }) {
  return (
    <mesh position={[0, 0.46, -0.05]}>
      <boxGeometry args={[width, 0.12, 0.15]} />
      <meshStandardMaterial
        color={new THREE.Color("#2e2210")}
        metalness={0.1}
        roughness={0.85}
      />
    </mesh>
  );
}

// ─── Full scene ────────────────────────────────────────────────────────────────

function MedalScene({ members }: { members: TeamMember[] }) {
  const n = members.length;
  const spacing = n <= 2 ? 3.4 : 2.8;
  const stripW = Math.max(n * spacing, 6);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 7]}
        intensity={1.8}
        color={new THREE.Color("#fff6e0")}
        castShadow={false}
      />
      <pointLight position={[-4, 2, 5]} intensity={1.1} color={new THREE.Color("#c9a55a")} />
      <pointLight position={[4, -2, 4]} intensity={0.5} color={new THREE.Color("#8090c0")} />

      {/* HDRI environment for real reflections on the gold */}
      <Environment preset="studio" />

      {/* Mounting strip */}
      <MountingStrip width={stripW} />
      <WallScrews count={Math.max(3, n + 1)} spread={stripW * 0.42} />

      {/* Medals */}
      {members.map((m, i) => (
        <MedalGroup
          key={m.id}
          member={m}
          posX={(i - (n - 1) / 2) * spacing}
          scale={m.featured ? 1.22 : 1.0}
          index={i}
        />
      ))}
    </>
  );
}

// ─── Fallback (while WebGL initialises) ──────────────────────────────────────

function CanvasFallback({ members }: { members: TeamMember[] }) {
  return (
    <div className="flex items-center justify-center gap-12 py-16">
      {members.map((m) => (
        <div key={m.id} className="flex flex-col items-center gap-3 opacity-40">
          <div
            className="flex items-center justify-center rounded-full border border-accent-muted"
            style={{
              width: m.featured ? 120 : 96,
              height: m.featured ? 120 : 96,
              background: "radial-gradient(circle at 35% 30%, #c9a55a, #3a2410)",
            }}
          >
            <span className="font-display text-2xl font-light text-accent">
              {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
          </div>
          <p className="font-display text-sm font-light text-text-primary">{m.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{m.role}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TeamSection({ members: raw }: { members: TeamMember[] }) {
  if (!raw.length) return null;

  const featured = raw.filter((m) => m.featured);
  const others   = raw.filter((m) => !m.featured);
  const all      = [...featured, ...others];

  return (
    <section
      aria-labelledby="team-heading"
      className="section border-b border-border"
      style={{
        background: "linear-gradient(160deg, #0f0e0a 0%, #0b0a07 50%, #0f0e0a 100%)",
      }}
    >
      <div className="container">
        {/* Section heading */}
        <div className="mb-16">
          <motion.p
            className="text-overline mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            The Team
          </motion.p>
          <motion.h2
            id="team-heading"
            className="text-h2 max-w-[540px]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          >
            People built at the intersection of{" "}
            <em className="italic-display text-accent">brand and code</em>
          </motion.h2>
        </div>

        {/* Display case */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="relative overflow-hidden rounded-lg"
          style={{
            height: 540,
            background:
              "radial-gradient(ellipse at 55% 30%, rgba(201,165,90,0.05) 0%, transparent 60%), linear-gradient(to bottom, #111009 0%, #0c0b08 100%)",
            border: "1px solid rgba(201,165,90,0.08)",
            boxShadow:
              "inset 0 2px 28px rgba(0,0,0,0.5), 0 16px 48px rgba(0,0,0,0.6)",
          }}
        >
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            camera={{ position: [0, -1.8, 7.5], fov: 44 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <MedalScene members={all} />
            </Suspense>
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
