"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight, IconEmail } from "../icons";
import MagneticButton from "../MagneticButton";
import type { CtaSectionCopy } from "@prisma/client";
import { appendUtmToUrl, utmFromPrimaryDb, utmFromSecondaryDb } from "@/lib/utm";

// Fabricated "project dashboard" graphic that sits behind the CTA
function ProjectDashboard() {
  const items = [
    { label: "Homepage redesign", status: "In Review", color: "#c9a55a", progress: 88 },
    { label: "Design system", status: "Shipped", color: "#4daf7c", progress: 100 },
    { label: "Analytics setup", status: "In Progress", color: "#6b8cff", progress: 54 },
    { label: "Brand identity", status: "Shipped", color: "#4daf7c", progress: 100 },
    { label: "Performance audit", status: "Queued", color: "#525048", progress: 12 },
  ];

  return (
    <div className="w-full rounded-xl border border-white/[0.06] bg-[#0d0d0c]/95 shadow-2xl backdrop-blur-sm">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-3 font-mono text-[10px] text-white/20">project-tracker — BrandMeetsCode</span>
      </div>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
        <div className="flex gap-5">
          {["Overview","Tasks","Timeline","Docs"].map((tab, i) => (
            <span key={tab} className={`text-[10px] font-medium ${i === 0 ? "text-[#c9a55a]" : "text-white/25"}`}>
              {tab}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#4daf7c]" />
          <span className="text-[9px] text-white/25">Live</span>
        </div>
      </div>
      {/* Project rows */}
      <div className="p-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-md px-2 py-2.5 transition-colors hover:bg-white/[0.02]">
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            <span className="flex-1 text-[11px] text-white/50">{item.label}</span>
            <div className="hidden w-24 items-center gap-2 sm:flex">
              <div className="h-1 flex-1 rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.progress}%`, background: item.color, opacity: 0.7 }}
                />
              </div>
              <span className="w-7 text-right font-mono text-[9px] text-white/20">{item.progress}%</span>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[9px]"
              style={{ background: `${item.color}15`, color: item.color }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CtaSection({ copy }: { copy: CtaSectionCopy }) {
  const secondaryIsMailto = copy.secondaryCtaHref.startsWith("mailto:");
  const primaryHref = appendUtmToUrl(copy.primaryCtaHref, utmFromPrimaryDb(copy));
  const secondaryHref = appendUtmToUrl(copy.secondaryCtaHref, utmFromSecondaryDb(copy));

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-border bg-bg"
    >
      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(201,165,90,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Accent glow at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(201,165,90,0.08) 0%, transparent 70%)" }}
      />

      <div className="container relative z-[1] py-28 lg:py-40">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_1.1fr]">

          {/* Copy */}
          <div>
            <ScrollReveal>
              <p className="text-overline mb-6">{copy.overline}</p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h2 id="cta-heading" className="text-h1 mb-6">
                {copy.headingBeforeEm}
                <em className="italic-display text-accent">{copy.headingEmphasis}</em>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="text-body-lg mb-10 max-w-[420px]">{copy.body}</p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="flex flex-wrap gap-4">
                <MagneticButton>
                  <Link
                    href={primaryHref}
                    className="btn btn-primary px-8 py-5 text-sm"
                    data-cursor-label="Let's Build"
                  >
                    {copy.primaryCtaLabel}
                    <IconArrowUpRight size={18} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  {secondaryIsMailto ? (
                    <a href={secondaryHref} className="btn btn-secondary px-8 py-5 text-sm" data-cursor-label="Say Hello">
                      <IconEmail size={16} />
                      {copy.secondaryCtaLabel}
                    </a>
                  ) : (
                    <Link href={secondaryHref} className="btn btn-secondary px-8 py-5 text-sm" data-cursor-label="Say Hello">
                      {copy.secondaryCtaLabel}
                    </Link>
                  )}
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <p className="mt-8 text-xs tracking-wide text-text-tertiary">{copy.footnote}</p>
            </ScrollReveal>
          </div>

          {/* Dashboard graphic */}
          <ScrollReveal delay={200} className="hidden lg:block">
            <ProjectDashboard />
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
