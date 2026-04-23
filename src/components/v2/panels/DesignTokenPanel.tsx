"use client";

const BG = "#16161a";
const BORDER = "rgba(255,255,255,0.07)";

const PALETTE = [
  { name: "Brand Gold",   hex: "#c9a55a", swatch: "#c9a55a" },
  { name: "Midnight",     hex: "#080808", swatch: "#080808" },
  { name: "Surface",      hex: "#16161a", swatch: "#16161a" },
  { name: "Elevated",     hex: "#1c1c22", swatch: "#1c1c22" },
  { name: "Frost",        hex: "#e8eaf0", swatch: "#e8eaf0" },
  { name: "Muted",        hex: "#4a4a5a", swatch: "#4a4a5a" },
];

const TYPE_SCALE = [
  { token: "--text-display",  sample: "Aa", size: "7rem",  weight: 300,  family: "Fraunces" },
  { token: "--text-h1",       sample: "Aa", size: "4rem",  weight: 300,  family: "Fraunces" },
  { token: "--text-h2",       sample: "Aa", size: "2.5rem",weight: 300,  family: "Fraunces" },
  { token: "--text-body-lg",  sample: "Aa", size: "1.1rem",weight: 400,  family: "Geist" },
  { token: "--text-body",     sample: "Aa", size: "0.95rem",weight: 400, family: "Geist" },
  { token: "--text-mono",     sample: "Aa", size: "0.75rem",weight: 400, family: "DM Mono" },
];

const SPACING = [2, 4, 8, 12, 16, 24, 32, 48, 64, 96];

export default function DesignTokenPanel() {
  return (
    <div
      style={{
        background: BG,
        width: "100%",
        height: "100%",
        fontFamily: "var(--font-mono), monospace",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a55a" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>design-system / tokens.json</span>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>v2.4.1</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left — Colour palette */}
        <div style={{ width: 200, borderRight: `1px solid ${BORDER}`, padding: 16, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Colour</span>
          {PALETTE.map(({ name, hex, swatch }) => (
            <div key={hex} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 5,
                background: swatch,
                border: `1px solid rgba(255,255,255,0.1)`,
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.2 }}>{name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{hex}</div>
              </div>
            </div>
          ))}

          {/* Spacing row */}
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Spacing</span>
            <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", gap: 4 }}>
              {SPACING.map((s) => (
                <div
                  key={s}
                  title={`${s}px`}
                  style={{
                    width: Math.max(3, s / 8),
                    height: Math.max(3, s / 8),
                    background: "rgba(201,165,90,0.45)",
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right — Type scale */}
        <div style={{ flex: 1, padding: 16, overflow: "hidden", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Typography</span>

          {TYPE_SCALE.map(({ token, sample, size, weight, family }) => (
            <div
              key={token}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "8px 10px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(255,255,255,0.04)`,
              }}
            >
              {/* Sample letterform */}
              <div
                style={{
                  fontSize: `clamp(14px, ${size}, 48px)`,
                  fontWeight: weight,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1,
                  width: 52,
                  flexShrink: 0,
                  fontFamily: family === "DM Mono" ? "monospace" : family === "Geist" ? "sans-serif" : "serif",
                  fontStyle: family === "Fraunces" ? "italic" : "normal",
                }}
              >
                {sample}
              </div>

              {/* Meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{token}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{size} · {weight} · {family}</div>
              </div>

              {/* Gold accent bar — width proportional to size */}
              <div style={{
                height: 2,
                width: Math.min(60, parseFloat(size) * 8),
                background: "rgba(201,165,90,0.25)",
                borderRadius: 1,
                flexShrink: 0,
              }} />
            </div>
          ))}

          {/* Component preview strip */}
          <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>Components</span>
            {[
              { label: "Button",  bg: "#c9a55a",              text: "#080808" },
              { label: "Outline", bg: "transparent",          text: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.2)" },
              { label: "Ghost",   bg: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.4)" },
            ].map(({ label, bg, text, border }) => (
              <div
                key={label}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: bg,
                  color: text,
                  fontSize: 10,
                  border: `1px solid ${border ?? "transparent"}`,
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {["rounded", "sharp", "pill"].map((r) => (
                <div
                  key={r}
                  style={{
                    width: 22,
                    height: 22,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: r === "rounded" ? 4 : r === "pill" ? 11 : 1,
                    border: `1px solid rgba(255,255,255,0.08)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
