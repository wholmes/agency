"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 sun = vec2(1.0, 1.0);
  vec2 rd = uv - sun;
  float dist = max(length(rd), 1e-4);
  float ang = atan(rd.y, rd.x);

  float t = uTime;

  // Broad soft glow (corona) — gentle breathing
  float breathe = 0.94 + 0.06 * sin(t * 0.55);
  float corona = exp(-dist * dist * 4.2) * 0.5 * breathe;
  corona += exp(-dist * 2.0) * 0.16 * breathe;

  // Sharp luminous bands — lower angular frequency = fewer, wider rays
  float rays = 0.0;
  rays += pow(abs(sin(ang * 16.0 + t * 0.22)), 6.0) * 0.5;
  rays += pow(abs(sin(ang * 38.0 - t * 0.14)), 10.0) * 0.38;
  rays += pow(abs(sin(ang * 9.0 + sin(dist * 7.0) * 1.5 + t * 0.1)), 4.0) * 0.22;

  float n = hash(vec2(floor(ang * 24.0), floor(dist * 28.0)));
  rays *= 0.9 + 0.2 * n;

  // Fall off along the beam direction (from top-right into the frame)
  float atten = 1.0 / (1.0 + dist * dist * 1.6);
  atten *= exp(-dist * 0.55);

  // Slightly stronger when moving away from the corner into the layout
  float inward = smoothstep(0.0, 0.45, 1.0 - uv.x) * smoothstep(0.0, 0.45, 1.0 - uv.y);

  float glow = corona + rays * atten * mix(0.55, 1.0, inward);

  vec3 gold = vec3(0.788, 0.647, 0.353);
  vec3 cream = vec3(1.0, 0.95, 0.86);
  vec3 col = mix(gold, cream, clamp(corona * 1.8, 0.0, 1.0)) * glow;

  float a = clamp(glow * 0.58, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function WorkSunburst() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cssFallback, setCssFallback] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let raf = 0;
    let ro: ResizeObserver | null = null;

    const init = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 2 || h < 2) return;

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        setCssFallback(true);
        return;
      }

      const gl = renderer.getContext();
      if (!gl) {
        setCssFallback(true);
        renderer.dispose();
        renderer = null;
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText =
        "display:block;width:100%;height:100%;pointer-events:none";

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const reduce = prefersReducedMotion();

      const tick = (now: number) => {
        if (!material || !renderer) return;
        if (!reduce) {
          material.uniforms.uTime.value = now * 0.001;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);

      ro = new ResizeObserver(() => {
        if (!renderer || !material || !el) return;
        const cw = el.clientWidth;
        const ch = el.clientHeight;
        if (cw < 2 || ch < 2) return;
        renderer.setSize(cw, ch, false);
      });
      ro.observe(el);
    };

    init();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      material?.dispose();
      geometry?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {cssFallback ? (
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at 100% 0%, rgba(255,236,210,0.2) 0%, rgba(201,165,90,0.1) 32%, transparent 56%),
              repeating-conic-gradient(from -18deg at 100% 0%, transparent 0deg 5deg, rgba(201,165,90,0.075) 5deg 10deg)
            `,
            maskImage: "radial-gradient(ellipse 130% 95% at 100% 0%, black 0%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 130% 95% at 100% 0%, black 0%, transparent 72%)",
          }}
        />
      ) : null}
    </div>
  );
}
