/**
 * Minimal “field” silhouette for the Selected Work header — echoes the hero
 * isometric terrain without another 3D layer. Pure SVG, decorative only.
 */
export default function WorkHeaderVisual() {
  const bars = [
    { x: 0, h: 42 },
    { x: 36, h: 68 },
    { x: 72, h: 48 },
    { x: 108, h: 92 },
    { x: 144, h: 55 },
    { x: 180, h: 76 },
    { x: 216, h: 50 },
    { x: 252, h: 84 },
  ];
  const baseY = 118;
  const barW = 10;

  return (
    <div className="relative ml-auto hidden w-full max-w-[min(100%,340px)] md:block" aria-hidden>
      <svg viewBox="0 0 320 130" className="h-[min(140px,22vw)] w-full text-accent" fill="none">
        <line x1="0" y1={baseY + 2} x2="320" y2={baseY + 2} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
        {bars.map((b, i) => (
          <rect
            key={b.x}
            x={28 + b.x}
            y={baseY - b.h}
            width={barW}
            height={b.h}
            rx="1"
            fill="currentColor"
            opacity={0.07 + (i % 4) * 0.035}
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
