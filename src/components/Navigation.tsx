"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowUpRight } from "./icons";
import { ServiceIconGlyph } from "@/lib/service-icons";
import type { AvailabilityStatus } from "@/lib/availability";
import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";
import { siteChromePrimaryCtaHref } from "@/lib/utm";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NavService = {
  id: number;
  slug: string;
  iconKey: string;
  title: string;
  subtitle: string | null;
  descriptionHome: string;
  href: string;
};

export type NavIndustry = {
  slug: string;
  listTitle: string;
  listBlurb: string;
};

export type NavProject = {
  id: string;
  title: string;
  category: string;
  result: string;
};

export type NavDropdownData = {
  services?: NavService[];
  industries?: NavIndustry[];
  recentProjects?: NavProject[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max).trimEnd() + "…";
}

const DROPDOWN_HREFS = new Set(["/services", "/work", "/industries"]);
function hasDropdown(href: string): boolean {
  return DROPDOWN_HREFS.has(href);
}

const STAGGER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ---------------------------------------------------------------------------
// Dropdown panel components
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-text-tertiary">
      {children}
    </p>
  );
}

function PanelLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-xs text-text-tertiary no-underline transition-colors duration-150 hover:text-accent"
    >
      {label}
      <IconArrowUpRight size={11} />
    </Link>
  );
}

function ServicesPanel({ data }: { data: NavService[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-between">
        <SectionLabel>Services</SectionLabel>
        <PanelLink href="/services" label="View all services" />
      </div>
    );
  }
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <SectionLabel>Services</SectionLabel>
        <PanelLink href="/services" label="View all services" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.045, duration: 0.4, ease: STAGGER_EASE }}
          >
            <Link
              href={s.href}
              className="group relative block overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-4 no-underline transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06]"
            >
              {/* Gold left accent bar — slides in on hover */}
              <span className="absolute left-0 top-3 bottom-3 w-[2px] origin-center scale-y-0 rounded-full bg-accent transition-transform duration-200 group-hover:scale-y-100" />
              <div className="mb-3 text-white/30 transition-colors duration-200 group-hover:text-accent">
                <ServiceIconGlyph iconKey={s.iconKey} size={16} />
              </div>
              <p className="font-body mb-1.5 text-sm font-medium tracking-tight text-white/80 transition-colors duration-200 group-hover:text-white">
                {s.title}
              </p>
              <p className="text-xs leading-relaxed text-white/30">
                {s.subtitle ?? truncate(s.descriptionHome, 72)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WorkPanel({ data }: { data: NavProject[] }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <SectionLabel>Work</SectionLabel>
        <PanelLink href="/work" label="All projects" />
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-text-tertiary">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.055, duration: 0.4, ease: STAGGER_EASE }}
            >
              <Link
                href={`/work/${p.id}`}
                className="group relative flex items-start gap-4 overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 no-underline transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06]"
              >
                <span className="absolute left-0 top-3 bottom-3 w-[2px] origin-center scale-y-0 rounded-full bg-accent transition-transform duration-200 group-hover:scale-y-100" />
                <span
                  className="mt-[5px] size-1.5 shrink-0 rounded-full bg-accent opacity-30 transition-opacity duration-200 group-hover:opacity-80"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-body mb-1 text-sm font-medium tracking-tight text-white/80 transition-colors duration-200 group-hover:text-white">
                    {p.title}
                  </p>
                  {p.result && (
                    <p className="text-xs leading-relaxed text-white/30">{p.result}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function IndustriesPanel({ data }: { data: NavIndustry[] }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <SectionLabel>Industries</SectionLabel>
        <PanelLink href="/industries" label="All verticals" />
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-text-tertiary">No verticals yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((ind, i) => (
            <motion.div
              key={ind.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: STAGGER_EASE }}
            >
              <Link
                href={`/industries/${ind.slug}`}
                className="group relative flex items-start gap-4 overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.03] px-5 py-4 no-underline transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06]"
              >
                <span className="absolute left-0 top-3 bottom-3 w-[2px] origin-center scale-y-0 rounded-full bg-accent transition-transform duration-200 group-hover:scale-y-100" />
                <span
                  className="mt-[5px] size-1.5 shrink-0 rounded-full bg-accent opacity-30 transition-opacity duration-200 group-hover:opacity-80"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-body mb-0.5 text-sm font-medium text-white/80 transition-colors duration-200 group-hover:text-white">
                    {ind.listTitle}
                  </p>
                  <p className="text-xs leading-relaxed text-white/30">
                    {truncate(ind.listBlurb, 72)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// NavLink
// ---------------------------------------------------------------------------

function ChevronDown() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M1.5 3.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavLink({
  href,
  label,
  active,
  dropdownOpen,
  hasDrop,
}: {
  href: string;
  label: string;
  active: boolean;
  dropdownOpen: boolean;
  hasDrop: boolean;
}) {
  const isHighlighted = active || dropdownOpen;
  return (
    <Link
      href={href}
      className={`nav-link relative inline-flex items-center gap-1 py-2 font-body text-sm font-normal tracking-[0.01em] transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isHighlighted ? "text-accent" : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
      {hasDrop && (
        <motion.span
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.22, ease: STAGGER_EASE }}
          className="inline-flex text-inherit transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <ChevronDown />
        </motion.span>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// HamburgerIcon
// ---------------------------------------------------------------------------

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.path
        d="M3 8h18"
        animate={open ? { d: "M6 6l12 12" } : { d: "M3 8h18" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.path
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        d="M3 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-left"
      />
      <motion.path
        d="M3 16h18"
        animate={open ? { d: "M18 6L6 18" } : { d: "M3 16h18" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export default function Navigation({
  availability,
  chrome,
  dropdownData = {},
  hideOnScroll = false,
}: {
  availability: AvailabilityStatus;
  chrome: SiteChromeConfigParsed;
  dropdownData?: NavDropdownData;
  hideOnScroll?: boolean;
}) {
  const navLinks = chrome.navLinks;
  const primaryCta = chrome.primaryCta;
  const primaryCtaHref = siteChromePrimaryCtaHref(chrome);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const lastY = useRef(0);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current + 30) setActiveDropdown(null);

      // Always hide on scroll down, reveal on scroll up
      if (y < 80) {
        // Always show at top of page
        setNavHidden(false);
      } else if (y > lastY.current + 6) {
        // Scrolling down — hide
        setNavHidden(true);
      } else if (y < lastY.current - 4) {
        // Scrolling up — reveal
        setNavHidden(false);
      }

      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
      setActiveDropdown(null);
    });
  }, [pathname]);

  const openDropdown = useCallback((href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setActiveDropdown(href), 60);
  }, []);

  const scheduleClose = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 250);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isGlassy = scrolled || !!activeDropdown;

  return (
    <>
      <header
        role="banner"
        style={{
          transform: navHidden && !mobileOpen ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), background-color var(--duration-slow) ease-out, backdrop-filter var(--duration-slow) ease-out, border-color var(--duration-slow) ease-out",
        }}
        className={`fixed top-0 right-0 left-0 z-[100] ${
          isGlassy
            ? "border-b border-border bg-[rgba(12,12,11,0.92)] backdrop-blur-xl backdrop-saturate-[180%]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Main bar */}
        <div className="mx-auto flex h-[var(--nav-height)] w-full max-w-[1280px] items-center justify-between px-8 md:px-16">
          {/* Logo */}
          <Link
            href="/"
            aria-label="BrandMeetsCode — Home"
            className="group relative flex items-center no-underline md:z-[110] xl:z-auto"
            onMouseEnter={scheduleClose}
          >
            {/* Mobile: circle + wordmark */}
            <span className="flex items-center gap-3 md:hidden">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition-opacity [transition-duration:var(--duration-base)] group-hover:opacity-80">
                <span className="font-mono text-sm font-semibold leading-none" aria-hidden="true">
                  B
                </span>
              </span>
              <span className="font-display text-md font-normal tracking-tight text-text-primary">
                Brand<em className="not-italic text-accent" style={{ fontFamily: "var(--font-yellowtail)", fontSize: "1.45em", lineHeight: 1, verticalAlign: "middle", marginInline: "0.08em" }}>/</em>Code
              </span>
            </span>

            {/* md–xl: fixed slot (circle width); pill expands over the nav — does not push layout */}
            <span className="relative hidden h-8 w-8 shrink-0 overflow-visible md:block xl:hidden">
              <span className="absolute top-1/2 left-0 z-[110] inline-flex h-8 max-w-8 -translate-y-1/2 items-center overflow-hidden rounded-full border border-accent/50 bg-bg/95 text-accent shadow-[0_8px_32px_rgb(0_0_0_/_0.45)] backdrop-blur-md transition-[max-width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[min(280px,calc(100vw-8rem))] group-focus-within:max-w-[min(280px,calc(100vw-8rem))]">
                <span className="inline-flex size-8 shrink-0 items-center justify-center" aria-hidden="true">
                  <span className="font-mono text-sm font-semibold leading-none">B</span>
                </span>
                <span className="font-display max-w-0 overflow-hidden pr-3 text-md font-normal tracking-tight whitespace-nowrap text-text-primary opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-1 group-hover:max-w-[min(220px,42vw)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:max-w-[min(220px,42vw)] group-focus-within:translate-x-0 group-focus-within:opacity-100">
                  Brand<em className="not-italic text-accent" style={{ fontFamily: "var(--font-yellowtail)", fontSize: "1.45em", lineHeight: 1, verticalAlign: "middle", marginInline: "0.08em" }}>/</em>Code
                </span>
              </span>
            </span>

            {/* xl+: circle + wordmark */}
            <span className="hidden items-center gap-3 xl:flex">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition-opacity [transition-duration:var(--duration-base)] group-hover:opacity-80">
                <span className="font-mono text-sm font-semibold leading-none" aria-hidden="true">
                  B
                </span>
              </span>
              <span className="font-display text-md font-normal tracking-tight text-text-primary">
                Brand<em className="not-italic text-accent" style={{ fontFamily: "var(--font-yellowtail)", fontSize: "1.45em", lineHeight: 1, verticalAlign: "middle", marginInline: "0.08em" }}>/</em>Code
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
            onMouseLeave={scheduleClose}
          >
            {navLinks.map((link) => {
              const hasDrop = hasDropdown(link.href);
              return (
                <div
                  key={link.href}
                  onMouseEnter={() => (hasDrop ? openDropdown(link.href) : scheduleClose())}
                >
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={
                      pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(`${link.href}/`))
                    }
                    dropdownOpen={activeDropdown === link.href}
                    hasDrop={hasDrop}
                  />
                </div>
              );
            })}
          </nav>

          {/* Availability */}
          <div
            className="hidden items-center gap-2 lg:flex"
            onMouseEnter={scheduleClose}
          >
            <span
              className={`inline-block size-1.5 shrink-0 rounded-full ${
                availability.available
                  ? "bg-success shadow-[0_0_6px_rgba(77,175,124,0.6)]"
                  : "bg-text-tertiary"
              }`}
              aria-hidden="true"
            />
            <span className="text-xs tracking-wide whitespace-nowrap text-text-tertiary">
              {availability.available
                ? availability.label
                : `Next opening: ${availability.nextOpen}`}
            </span>
          </div>

          {/* CTA */}
          <div
            className="hidden items-center gap-4 md:flex"
            onMouseEnter={scheduleClose}
          >
            <Link
              href={primaryCtaHref}
              className="btn btn-primary text-xs"
              data-cursor-label="Let's Build"
            >
              {primaryCta.label}
              <IconArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-10 items-center justify-center text-text-primary md:hidden"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>

        {/* Dropdown panel — anchored below the header bar */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              key="nav-panel-shell"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: "spring", stiffness: 480, damping: 38 }}
              className="absolute right-0 left-0 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150"
              style={{
                background: "rgba(13,13,13,0.98)",
                backgroundImage: [
                  `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
                  `radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)`,
                  `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 4px)`,
                  `linear-gradient(180deg, rgba(255,255,255,0.06) 0px, transparent 1px)`,
                ].join(", "),
                backgroundSize: "180px 180px, 24px 24px, 100% 100%, 100% 100%",
                borderBottom: "1px solid transparent",
                borderImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%) 1",
              }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <div className="mx-auto max-w-[1280px] px-8 py-8 md:px-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDropdown}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    {activeDropdown === "/services" && (
                      <ServicesPanel data={dropdownData.services ?? []} />
                    )}
                    {activeDropdown === "/work" && (
                      <WorkPanel data={dropdownData.recentProjects ?? []} />
                    )}
                    {activeDropdown === "/industries" && (
                      <IndustriesPanel data={dropdownData.industries ?? []} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile full-screen nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] flex flex-col overflow-hidden md:hidden"
            style={{ backgroundColor: "#0c0c0b" }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Noise grain layer */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "200px 200px",
                opacity: 0.045,
                mixBlendMode: "overlay",
              }}
            />
            {/* Gold bloom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-full -translate-x-1/2"
              style={{
                background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,165,90,0.10) 0%, transparent 70%)",
              }}
            />

            {/* Nav links — vertically centred in remaining space above footer */}
            <nav
              aria-label="Mobile navigation links"
              className="flex flex-1 flex-col justify-center px-8 pt-[var(--nav-height)]"
            >
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.07 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative"
                  >
                    {/* Hairline divider */}
                    <div className="h-px w-full bg-white/[0.07]" />

                    {/* Gold left rule */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-accent transition-opacity duration-300"
                      style={{ opacity: isActive ? 1 : 0 }}
                    />

                    <Link
                      href={link.href}
                      className="flex flex-col py-[1.1rem] pl-5 no-underline"
                    >
                      {/* Step number above label */}
                      <span
                        className="mb-1 font-mono text-[9px] tabular-nums tracking-[0.2em] transition-colors duration-300"
                        style={{ color: isActive ? "#c9a55a" : "rgba(255,255,255,0.45)" }}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Label */}
                      <span
                        className="font-display text-[2.6rem] font-light leading-none tracking-[-0.03em] transition-colors duration-300"
                        style={{
                          color: isActive ? "#c9a55a" : "rgba(255,255,255,0.85)",
                          fontStyle: isActive ? "italic" : "normal",
                        }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              {/* Bottom divider after last item */}
              <div className="h-px w-full bg-white/[0.07]" />
            </nav>

            {/* Footer: availability + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.34, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 pb-10 pt-6"
            >
              {/* Availability */}
              {availability.available && (
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="inline-block size-1.5 shrink-0 rounded-full bg-success shadow-[0_0_6px_rgba(77,175,124,0.6)]"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                    {availability.label}
                  </span>
                </div>
              )}

              <Link
                href={primaryCtaHref}
                className="btn btn-primary flex w-full items-center justify-center gap-2"
              >
                {primaryCta.label}
                <IconArrowUpRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
