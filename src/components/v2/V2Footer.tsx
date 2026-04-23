"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import StackLogos from "@/components/StackLogos";
import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";

const HeroFieldCanvas = dynamic(() => import("@/components/HeroFieldCanvas"), { ssr: false });

const EASE = "cubic-bezier(0.16,1,0.3,1)";

const NAV_COLS = [
  {
    title: "Services",
    links: [
      { label: "Web Design",        href: "/services/web-design" },
      { label: "Web Development",   href: "/services/web-development" },
      { label: "Brand Strategy",    href: "/services/brand-strategy" },
      { label: "Analytics & Growth",href: "/services/analytics-growth" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Work",    href: "/work" },
      { label: "About",   href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function V2Footer({
  tagline,
  remoteBlurb,
  contactEmail,
  chrome,
  canvasVariant = "cta",
  bridgeFromLight = false,
}: {
  tagline: string;
  remoteBlurb: string;
  contactEmail: string;
  chrome: SiteChromeConfigParsed;
  canvasVariant?: "home" | "services" | "cta";
  bridgeFromLight?: boolean;
}) {
  const year = new Date().getFullYear();

  return (
    <>
      {bridgeFromLight && (
        <div
          aria-hidden="true"
          className="h-24 w-full"
          style={{ background: "linear-gradient(to bottom, var(--color-bg, #ffffff) 0%, #0e0e0e 100%)" }}
        />
      )}
    <footer
      role="contentinfo"
      className="relative border-t border-white/[0.06] bg-[#0e0e0e]"
    >
      {/* Faint gold bloom — bottom of page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(201,165,90,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-8 md:px-16">

        {/* Top — big CTA statement */}
        <div className="relative overflow-hidden border-b border-white/[0.06] py-20 md:py-24">

          {/* Isometric field — right side accent, fades left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              maskImage: "linear-gradient(to left, black 0%, black 40%, rgba(0,0,0,0.4) 60%, transparent 80%)",
              WebkitMaskImage: "linear-gradient(to left, black 0%, black 40%, rgba(0,0,0,0.4) 60%, transparent 80%)",
            }}
          >
              <HeroFieldCanvas variant={canvasVariant} />
          </div>

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[3fr_2fr] md:items-center">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
                Ready to build?
              </p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-light leading-[0.95] tracking-[-0.03em] text-white">
                Let&apos;s make<br />
                something<br />
                <em className="not-italic" style={{ color: "#c9a55a" }}>worth talking</em>{" "}
                <em className="font-display italic" style={{ color: "rgba(255,255,255,0.7)" }}>about.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:items-start">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#c9a55a] px-7 py-3.5 font-body text-sm font-semibold text-[#080808] no-underline transition-all duration-300 hover:bg-[#d4b46a] hover:shadow-[0_0_28px_rgba(201,165,90,0.25)]"
              >
                Start a project
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a
                href={`mailto:${contactEmail}`}
                className="font-mono text-[12px] text-white/30 no-underline transition-colors hover:text-white/60"
                style={{ transition: `color 0.25s ${EASE}` }}
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Middle — nav columns */}

        <div className="grid grid-cols-2 gap-8 border-b border-white/[0.06] py-14 md:grid-cols-[2fr_1fr_1fr]">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-3 no-underline"
              aria-label="BrandMeetsCode — Home"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-[#c9a55a]/40 font-mono text-[12px] font-semibold text-[#c9a55a]">
                B
              </span>
              <span className="font-display text-[15px] font-normal tracking-tight text-white/80">
                Brand<em className="not-italic text-[#c9a55a]" style={{ fontFamily: "var(--font-yellowtail)", fontSize: "1.45em", lineHeight: 1, verticalAlign: "middle", marginInline: "0.08em" }}>/</em>Code
              </span>
            </Link>
            <p className="max-w-[260px] text-[13px] leading-relaxed text-white/30">
              {tagline}
            </p>
          </div>

          {/* Nav cols from CMS, falling back to static */}
          {(chrome.footerColumns.length > 0 ? chrome.footerColumns : NAV_COLS).map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={`${col.title}:${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/40 no-underline hover:text-white/80"
                      style={{ transition: `color 0.35s ${EASE}` }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Stack logos + remote blurb */}
        <div className="border-b border-white/[0.06] py-10">
          <p className="mb-6 max-w-[520px] text-[12px] leading-relaxed tracking-wide text-white/25">
            {remoteBlurb}
          </p>
          {/* Invert logos to white for dark bg */}
          <div className="[&_img]:brightness-0 [&_img]:invert [&_img]:opacity-30 hover:[&_a:hover_img]:opacity-60">
            <StackLogos />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/20">
              © {year} {chrome.copyrightBrandName}
            </span>
            <span className="text-white/10" aria-hidden="true">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/20">
              Chicago, IL
            </span>
            <span className="text-white/10" aria-hidden="true">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/20">
              {chrome.rightsReservedLine}
            </span>
          </div>
          <nav aria-label="Legal" className="flex gap-6">
            {chrome.footerUtilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] text-white/20 no-underline hover:text-white/55"
                style={{ transition: `color 0.35s ${EASE}` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
    </>
  );
}
