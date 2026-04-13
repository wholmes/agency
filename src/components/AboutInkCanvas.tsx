"use client";

/**
 * AboutInkCanvas — full-screen GLSL ink-wash for the About hero.
 *
 * Two slow fluid bodies drift toward each other and intermingle at centre.
 * Rendered as luminous filaments against the dark background — like ink
 * dropped in water. No geometry, no grid. Pure fragment shader.
 *
 * Scroll drives the drift speed. Reduced-motion freezes time at t=0.
 *
 * Tab backgrounding: animation time subtracts hidden duration (same idea as
 * HeroFieldCanvas) so returning to the tab doesn’t jump the shader clock.
 */

import { useLayoutEffect, useRef } from "react";

const VERT = /* glsl */ `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_t;
  uniform float u_scroll;

  // ── Smooth noise helpers ────────────────────────────────────────────────
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
          dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
      u.y
    );
  }

  // Layered fbm — 4 octaves
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2  s = vec2(1.0);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  // ── Filament function ───────────────────────────────────────────────────
  // Returns brightness of a thin bright thread at distance d from a ridge
  float filament(float d, float sharpness) {
    return exp(-d * d * sharpness);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    // Keep aspect ratio, centre at (0,0)
    float aspect = u_res.x / u_res.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float spd = 0.18 + u_scroll * 0.22;
    float t   = u_t * spd;

    // ── Two fluid centres orbiting slowly ──────────────────────────────
    float r1 = 0.28;
    float r2 = 0.22;
    vec2 c1 = vec2(cos(t * 0.31) * r1, sin(t * 0.23) * r1 * 0.7);
    vec2 c2 = vec2(cos(t * 0.27 + 2.1) * r2 * -1.0, sin(t * 0.19 + 1.4) * r2 * 0.8);

    // ── Distorted distance fields ──────────────────────────────────────
    // Each body warps space with fbm before measuring distance
    vec2 q1 = p - c1;
    q1 += 0.18 * vec2(fbm(q1 * 2.2 + t * 0.12), fbm(q1 * 2.2 + vec2(5.2, 1.3) + t * 0.09));

    vec2 q2 = p - c2;
    q2 += 0.18 * vec2(fbm(q2 * 2.4 + t * 0.10 + 3.7), fbm(q2 * 2.4 + vec2(2.8, 7.1) + t * 0.13));

    float d1 = length(q1);
    float d2 = length(q2);

    // ── Filament ridges ────────────────────────────────────────────────
    // Primary ridge of each body
    float f1 = filament(d1 - 0.18, 420.0);
    float f2 = filament(d2 - 0.15, 380.0);

    // Secondary (inner) rings — slightly dimmer
    float f1b = filament(d1 - 0.09, 600.0) * 0.45;
    float f2b = filament(d2 - 0.07, 550.0) * 0.40;

    // Interaction zone — where the two bodies overlap, a third brighter thread
    float dMid = length(p - (c1 + c2) * 0.5);
    float fMid = filament(dMid - 0.06, 900.0) * 0.6
               * smoothstep(0.5, 0.1, abs(d1 - d2));   // only bright where they're close

    // ── Ambient glow ───────────────────────────────────────────────────
    float glow1 = exp(-d1 * 4.5) * 0.06;
    float glow2 = exp(-d2 * 4.5) * 0.05;

    // ── Combine ────────────────────────────────────────────────────────
    float bright = f1 + f1b + f2 + f2b + fMid + glow1 + glow2;
    bright = clamp(bright, 0.0, 1.0);

    // Colour: body 1 is warm gold, body 2 is cool silver — they blend at meeting point
    vec3 col1 = vec3(0.84, 0.68, 0.36);   // warm gold
    vec3 col2 = vec3(0.72, 0.76, 0.82);   // cool silver

    // Weight by which body dominates at this pixel
    float w1 = (f1 + f1b + glow1) / max(0.001, f1 + f1b + f2 + f2b + glow1 + glow2);
    vec3  col = mix(col2, col1, w1);

    // Interaction zone pulls toward a pale gold-white
    col = mix(col, vec3(0.92, 0.88, 0.76), fMid * 1.4);

    // Very subtle background tint so the canvas isn't pure black
    vec3 bg = vec3(0.048, 0.044, 0.040);

    gl_FragColor = vec4(mix(bg, col, bright * 0.88), 1.0);
  }
`;

export default function AboutInkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch { /* ignore */ }
    if (!gl) return;

    // ── Compile shaders ─────────────────────────────────────────────────
    function compile(type: number, src: string): WebGLShader | null {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.warn(gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // ── Full-screen quad ────────────────────────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // ── Uniforms ────────────────────────────────────────────────────────
    const uRes    = gl.getUniformLocation(prog, "u_res");
    const uT      = gl.getUniformLocation(prog, "u_t");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    let W = 0, H = 0;
    function resize() {
      W = canvas!.clientWidth  || window.innerWidth;
      H = canvas!.clientHeight || window.innerHeight;
      canvas!.width  = Math.round(W * Math.min(window.devicePixelRatio, 1.5));
      canvas!.height = Math.round(H * Math.min(window.devicePixelRatio, 1.5));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const scroll = { pct: 0 };
    const onScroll = () => {
      const heroH = canvas!.parentElement?.offsetHeight ?? window.innerHeight;
      scroll.pct = Math.min(1, window.scrollY / Math.max(1, heroH));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

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
    document.addEventListener("visibilitychange", onVisibility);

    const t0 = performance.now();
    let rafId = 0;
    let disposed = false;

    const loop = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      if (!tabVisible) return;

      const t = reduced ? 1.0 : (now - t0 - accumulatedHiddenMs) * 0.001;
      gl!.uniform1f(uT, t);
      gl!.uniform1f(uScroll, scroll.pct);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      gl!.deleteProgram(prog);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(buf);
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
