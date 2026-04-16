"use client";

/**
 * Shared animated backdrop for the services page — spans the hero *and* the
 * "Service details" section beneath it, so the WebGL field continues past the
 * hero boundary. The next section sits on top with a near-opaque dark overlay
 * so its perceived color stays identical to the rest of the page; only a
 * whisper of animation peeks through.
 */

import dynamic from "next/dynamic";

const HeroFieldCanvas = dynamic(() => import("./HeroFieldCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 60% 35%, #191614 0%, #0c0c0b 65%)",
      }}
    />
  ),
});

export default function ServicesHeroBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <HeroFieldCanvas variant="services" />
      {children}
    </div>
  );
}
