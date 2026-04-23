"use client";

/**
 * IndustriesOrbitCanvas — gyroscopic orbital rings for the Industries hero.
 *
 * Five elliptical orbits at different tilts surround a common center.
 * Each ring carries a single glowing node with a comet-tail trail.
 * The whole system slowly precesses; scroll accelerates the rotation.
 *
 * Pure GLSL fragment shader (no Three.js) — a single full-screen quad.
 * Uses the same adaptive-quality pattern as the other hero canvases:
 * if the first few frames take >60 ms (software rendering / Lighthouse),
 * the loop stops and the static first frame remains as background.
 */

import { useLayoutEffect, useRef } from "react";

/* ─── Vertex shader ─────────────────────────────────────────────────────── */
const VERT = /* glsl */ `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

/* ─── Fragment shader ────────────────────────────────────────────────────── */
const FRAG = /* glsl */ `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_t;
  uniform float u_scroll;

  #define PI  3.14159265359
  #define TAU 6.28318530718

  /* Rotate a 2-D vector by angle a */
  vec2 rot2(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  /* Glow along the full ring (thin luminous line) */
  float ringGlow(vec2 p, float rx, float ry, float ang, float width) {
    vec2 q = rot2(p, -ang);
    float nx = q.x / rx;
    float ny = q.y / ry;
    float d = abs(length(vec2(nx, ny)) - 1.0) * min(rx, ry);
    return exp(-d * d / (width * width));
  }

  /*
   * Glowing orbital node + directional trail.
   *   phi      – current angular position of the node
   *   trailLen – arc length of the trail (radians, behind node)
   */
  float orbitNode(vec2 p, float rx, float ry, float ang,
                  float phi, float trailLen) {
    vec2 q = rot2(p, -ang);

    /* Parametric angle of this fragment relative to the ellipse */
    float t = atan(q.y / ry, q.x / rx);

    /* Distance to ellipse ring */
    float r  = length(vec2(q.x / rx, q.y / ry));
    float rd = abs(r - 1.0) * min(rx, ry);

    /* "On-ring" weight */
    float onRing = exp(-rd * rd * 700.0);

    /* Angular offset from node – wrapped to (−π, π] */
    float ad = mod(phi - t + PI, TAU) - PI;

    /* Trail: brightens from 0 at –trailLen to peak just behind node */
    float trail = smoothstep(-trailLen, -0.08, ad)
                * (1.0 - smoothstep(-0.08, 0.18, ad));

    /* Node dot (position-based, not ring-based) */
    vec2 nodePos = rot2(vec2(rx * cos(phi), ry * sin(phi)), ang);
    float dd     = length(p - nodePos);
    float dot    = exp(-dd * dd * 900.0);

    return onRing * trail * 0.75 + dot * 2.0;
  }

  void main() {
    /* Normalised coords: (0,0) = centre, unit = shorter viewport dimension */
    vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);

    /* Slow global precession, nudged by scroll */
    float sysRot = u_t * 0.038 + u_scroll * 0.45;
    vec2 p = rot2(uv, sysRot);

    /* ── Colour palette ─────────────────────────────────────────────── */
    vec3 bg    = vec3(0.048, 0.044, 0.040);
    vec3 gold  = vec3(0.84,  0.69,  0.37);
    vec3 goldM = vec3(0.66,  0.54,  0.28);
    vec3 goldD = vec3(0.44,  0.36,  0.18);

    float t = u_t;
    vec3 col = bg;

    /* ── Ring A  (large, gentle tilt, long trail) ────────────────── */
    float rA = ringGlow(p, 0.42, 0.14, 0.14,  0.0055);
    float nA = orbitNode(p, 0.42, 0.14, 0.14, mod(t * 0.35, TAU), 1.6);
    col += goldD * 0.30 * rA + gold  * 0.055 * nA;

    /* ── Ring B  (medium, 30° tilt, counter-rotating) ────────────── */
    float rB = ringGlow(p, 0.32, 0.27, 1.18,  0.0060);
    float nB = orbitNode(p, 0.32, 0.27, 1.18, mod(-t * 0.48, TAU), 1.2);
    col += goldD * 0.26 * rB + goldM * 0.065 * nB;

    /* ── Ring C  (large, steep tilt, fast) ──────────────────────── */
    float rC = ringGlow(p, 0.52, 0.10, -0.52, 0.0048);
    float nC = orbitNode(p, 0.52, 0.10, -0.52, mod(t * 0.68, TAU), 0.85);
    col += goldD * 0.22 * rC + gold  * 0.050 * nC;

    /* ── Ring D  (small, perpendicular-ish, very slow) ───────────── */
    float rD = ringGlow(p, 0.25, 0.22, -1.25, 0.0058);
    float nD = orbitNode(p, 0.25, 0.22, -1.25, mod(-t * 0.22, TAU), 1.9);
    col += goldD * 0.28 * rD + goldM * 0.070 * nD;

    /* ── Ring E  (very large, shallow, slowest) ──────────────────── */
    float rE = ringGlow(p, 0.62, 0.16, 0.78,  0.0042);
    float nE = orbitNode(p, 0.62, 0.16, 0.78,  mod(t * 0.17, TAU), 2.2);
    col += goldD * 0.18 * rE + goldM * 0.045 * nE;

    /* ── Central core glow ───────────────────────────────────────── */
    float core = exp(-dot(p, p) * 9.0);
    col += gold * 0.18 * core;

    /* ── Edge vignette ───────────────────────────────────────────── */
    col *= 1.0 - dot(uv, uv) * 0.38;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function IndustriesOrbitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId    = 0;
    let gl: WebGLRenderingContext | null = null;
    let prog: WebGLProgram   | null = null;
    let vs: WebGLShader      | null = null;
    let fs: WebGLShader      | null = null;
    let buf: WebGLBuffer     | null = null;

    /* Scroll / visibility state */
    const scroll = { pct: 0 };
    const onScroll = () => {
      const heroH = canvas.parentElement?.offsetHeight ?? window.innerHeight;
      scroll.pct = Math.min(1, window.scrollY / Math.max(1, heroH));
    };
    let tabVisible       = !document.hidden;
    let accHiddenMs      = 0;
    let hiddenAt         = 0;
    const onVisibility   = () => {
      const now = performance.now();
      if (document.hidden) {
        hiddenAt = now;
      } else if (hiddenAt > 0) {
        accHiddenMs += now - hiddenAt;
        hiddenAt = 0;
        onScroll();
      }
      tabVisible = !document.hidden;
    };
    let resize: () => void = () => {};

    window.addEventListener("scroll",           onScroll,      { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();

    const cleanup = () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",           resize);
      window.removeEventListener("scroll",           onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (gl) {
        if (prog) gl.deleteProgram(prog);
        if (vs)   gl.deleteShader(vs);
        if (fs)   gl.deleteShader(fs);
        if (buf)  gl.deleteBuffer(buf);
      }
    };

    const init = () => {
      if (disposed) return;

      try {
        gl = canvas.getContext("webgl", {
          alpha: false, antialias: false, powerPreference: "high-performance",
        });
      } catch { /* ignore */ }
      if (!gl) return;

      const compile = (type: number, src: string): WebGLShader | null => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
          console.warn(gl!.getShaderInfoLog(s));
          return null;
        }
        return s;
      };

      vs = compile(gl.VERTEX_SHADER,   VERT);
      fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;

      prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn(gl.getProgramInfoLog(prog));
        return;
      }
      gl.useProgram(prog);

      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const aPos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes    = gl.getUniformLocation(prog, "u_res");
      const uT      = gl.getUniformLocation(prog, "u_t");
      const uScroll = gl.getUniformLocation(prog, "u_scroll");

      resize = () => {
        const W = canvas.clientWidth  || window.innerWidth;
        const H = canvas.clientHeight || window.innerHeight;
        canvas.width  = Math.round(W * Math.min(window.devicePixelRatio, 1.5));
        canvas.height = Math.round(H * Math.min(window.devicePixelRatio, 1.5));
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform2f(uRes, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const reduced   = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t0        = performance.now();
      let frameCount  = 0;

      const loop = (now: number) => {
        if (disposed) return;
        rafId = requestAnimationFrame(loop);
        if (!tabVisible) return;

        const t = reduced ? 1.2 : (now - t0 - accHiddenMs) * 0.001;
        gl!.uniform1f(uT,      t);
        gl!.uniform1f(uScroll, scroll.pct);

        const renderStart = performance.now();
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        const renderMs = performance.now() - renderStart;

        frameCount++;
        /* Adaptive quality: bail on slow/headless environments */
        if (frameCount <= 5 && renderMs > 60) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };

      rafId = requestAnimationFrame(loop);
    };

    init();
    return cleanup;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
