"use client";

import { useState } from "react";

export default function FounderPhoto() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative mx-auto w-full max-w-[320px] md:mx-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gold halo */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,165,90,0.12) 0%, transparent 70%)", filter: "blur(24px)" }}
      />
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.08]"
        style={{ boxShadow: "0 0 0 1px rgba(201,165,90,0.08), 0 32px 80px -20px rgba(0,0,0,0.7)" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: "linear-gradient(rgba(201,165,90,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,90,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Bottom gradient fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32"
          style={{ background: "linear-gradient(to top, rgba(14,14,14,0.85) 0%, transparent 100%)" }}
        />

        {/* Base image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/whittfield.png"
          alt="Whittfield Holmes — CEO, BrandMeetsCode"
          className="relative z-0 w-full object-cover object-top"
          style={{ filter: "grayscale(100%) contrast(1.08)" }}
        />

        {/* Hover image — crossfades on top */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/whittfield-hover.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-[1] w-full h-full object-cover object-top transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            filter: "grayscale(20%) contrast(1.05)",
          }}
        />
      </div>

      {/* Name badge */}
      <div
        className="absolute bottom-4 left-4 right-4 z-20 rounded-xl px-4 py-3"
        style={{ background: "rgba(14,14,14,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(201,165,90,0.12)" }}
      >
        <p className="font-mono text-[10px] text-[#c9a55a]/70">CEO · Chief Creator · Full-Stack Designer</p>
      </div>
    </div>
  );
}
