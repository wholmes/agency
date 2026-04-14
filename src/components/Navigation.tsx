"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark, IconArrowUpRight } from "./icons";
import { ServiceIconGlyph } from "@/lib/service-icons";
import type { AvailabilityStatus } from "@/lib/availability";
import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";

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

const DROPDOWN_HREFS = new Set(["/services", "/work", "/industries", "/about"]);
function hasDropdown(href: string): boolean {
  return DROPDOWN_HREFS.has(href);
}

const STAGGER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ---------------------------------------------------------------------------
// Dropdown panel components
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
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
              className="group block rounded-lg border border-border bg-bg px-4 py-4 no-underline transition-[border-color,background-color] duration-200 hover:border-accent-muted hover:bg-surface"
            >
              <div className="mb-3 text-text-tertiary transition-colors duration-200 group-hover:text-accent">
                <ServiceIconGlyph iconKey={s.iconKey} size={16} />
              </div>
              <p className="font-display mb-1.5 text-sm font-normal tracking-tight text-text-primary transition-colors duration-200 group-hover:text-accent">
                {s.title}
              </p>
              <p className="text-xs leading-relaxed text-text-tertiary">
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
        <SectionLabel>Recent work</SectionLabel>
        <PanelLink href="/work" label="All projects" />
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-text-tertiary">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {data.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.055, duration: 0.4, ease: STAGGER_EASE }}
            >
              <Link
                href={`/work/${p.id}`}
                className="group block rounded-lg border border-border bg-bg px-5 py-5 no-underline transition-[border-color,background-color] duration-200 hover:border-accent-muted hover:bg-surface"
              >
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
                  {p.category}
                </p>
                <p className="font-display mb-3 text-base font-normal tracking-tight text-text-primary transition-colors duration-200 group-hover:text-accent">
                  {p.title}
                </p>
                <p className="text-xs font-medium text-accent">{p.result}</p>
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
                className="group flex items-start gap-4 rounded-lg border border-border bg-bg px-5 py-4 no-underline transition-[border-color,background-color] duration-200 hover:border-accent-muted hover:bg-surface"
              >
                <span
                  className="mt-[5px] size-1.5 shrink-0 rounded-full bg-accent opacity-40 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-display mb-0.5 text-sm font-normal text-text-primary transition-colors duration-200 group-hover:text-accent">
                    {ind.listTitle}
                  </p>
                  <p className="text-xs leading-relaxed text-text-tertiary">
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

const ABOUT_BELIEFS = [
  "Brand strategy before pixels",
  "Engineering that ships on time",
  "Measurable outcomes — no vanity metrics",
];

function AboutPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="mb-5">
          <SectionLabel>About</SectionLabel>
        </div>
        <p className="font-display mb-6 max-w-[480px] text-2xl font-light leading-snug tracking-tight text-text-primary">
          Where brand clarity meets{" "}
          <em className="italic text-accent">engineering precision.</em>
        </p>
        <div className="flex flex-wrap gap-5">
          <Link
            href="/about"
            className="flex items-center gap-1.5 text-sm text-text-secondary no-underline transition-colors duration-200 hover:text-text-primary"
          >
            Our story <IconArrowUpRight size={13} />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-sm font-medium text-accent no-underline transition-colors duration-200 hover:text-text-primary"
          >
            Start a project <IconArrowUpRight size={13} />
          </Link>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <SectionLabel>How we work</SectionLabel>
        </div>
        <ul className="flex flex-col gap-3">
          {ABOUT_BELIEFS.map((belief, i) => (
            <motion.li
              key={belief}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 + 0.08, duration: 0.4, ease: STAGGER_EASE }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <span
                className="inline-block size-1.5 shrink-0 rounded-full bg-accent/50"
                aria-hidden="true"
              />
              {belief}
            </motion.li>
          ))}
        </ul>
      </div>
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
      className={`nav-link relative inline-flex items-center gap-1 py-2 font-body text-sm font-normal tracking-[0.01em] transition-colors [transition-duration:var(--duration-base)] ease-out ${
        isHighlighted ? "text-accent" : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
      {hasDrop && (
        <motion.span
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex"
        >
          <ChevronDown />
        </motion.span>
      )}
      {active && !dropdownOpen && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute right-0 bottom-0 left-0 h-px bg-accent"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
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
}: {
  availability: AvailabilityStatus;
  chrome: SiteChromeConfigParsed;
  dropdownData?: NavDropdownData;
}) {
  const navLinks = chrome.navLinks;
  const primaryCta = chrome.primaryCta;
  const [scrolled, setScrolled] = useState(false);
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
        className={`fixed top-0 right-0 left-0 z-[100] transition-[background-color,backdrop-filter,border-color] [transition-duration:var(--duration-slow)] ease-out ${
          isGlassy
            ? "border-b border-border bg-[rgba(12,12,11,0.92)] backdrop-blur-xl backdrop-saturate-[180%]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Main bar */}
        <div className="container flex h-[var(--nav-height)] w-full items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="BrandMeetsCode — Home"
            className="flex items-center gap-3 no-underline"
            onMouseEnter={scheduleClose}
          >
            <LogoMark
              size={30}
              className="text-accent transition-opacity [transition-duration:var(--duration-base)] hover:opacity-80"
            />
            <span className="font-display text-md font-normal tracking-tight text-text-primary">
              Brand<span className="text-accent">Meets</span>Code
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
              href={primaryCta.href}
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
              className="absolute right-0 left-0 border-b border-border bg-[rgba(12,12,11,0.97)] shadow-lg backdrop-blur-xl backdrop-saturate-150"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <div className="container py-8">
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
                    {activeDropdown === "/about" && <AboutPanel />}
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] flex flex-col bg-bg px-6 pt-[calc(var(--nav-height)+3rem)] pb-8 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-1 flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: 0.1 + i * 0.07,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={`block border-b border-border py-3 font-display text-4xl leading-tight font-light tracking-tight transition-colors [transition-duration:var(--duration-base)] ease-out ${
                      pathname === link.href ? "text-accent" : "text-text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pt-8"
            >
              <Link
                href={primaryCta.href}
                className="btn btn-primary flex w-full justify-center"
              >
                {primaryCta.label}
                <IconArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
