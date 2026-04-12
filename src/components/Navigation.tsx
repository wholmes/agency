"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark, IconArrowUpRight } from "./icons";
import { availability } from "@/lib/availability";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    startTransition(() => setMobileOpen(false));
  }, [pathname]);

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 right-0 left-0 z-[100] flex h-[var(--nav-height)] items-center transition-[background-color,backdrop-filter,border-color] [transition-duration:var(--duration-slow)] ease-out ${
          scrolled
            ? "border-b border-border bg-[rgba(12,12,11,0.85)] backdrop-blur-xl backdrop-saturate-[180%]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container flex w-full items-center justify-between">
          <Link
            href="/"
            aria-label="BrandMeetsCode — Home"
            className="flex items-center gap-3 no-underline"
          >
            <LogoMark
              size={28}
              className="text-accent transition-transform [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:rotate-[15deg]"
            />
            <span className="font-display text-md font-normal tracking-tight text-text-primary">
              Brand<span className="text-accent">Meets</span>Code
            </span>
          </Link>

          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
              />
            ))}
          </nav>

          <div className="availability-badge hidden items-center gap-2 lg:flex">
            <span
              className={`inline-block size-1.5 shrink-0 rounded-full ${
                availability.available
                  ? "bg-success shadow-[0_0_6px_rgba(77,175,124,0.6)]"
                  : "bg-text-tertiary"
              }`}
              aria-hidden="true"
            />
            <span className="text-xs tracking-wide whitespace-nowrap text-text-tertiary">
              {availability.available ? availability.label : `Next opening: ${availability.nextOpen}`}
            </span>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/contact"
              className="btn btn-primary text-xs"
              data-cursor-label="Let's Build"
            >
              Start a Project
              <IconArrowUpRight size={14} />
            </Link>
          </div>

          <button
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-10 items-center justify-center text-text-primary md:hidden"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

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
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
              <Link href="/contact" className="btn btn-primary flex w-full justify-center">
                Start a Project
                <IconArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`nav-link relative py-2 font-body text-sm font-normal tracking-[0.01em] transition-colors [transition-duration:var(--duration-base)] ease-out ${
        active ? "text-accent" : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute right-0 bottom-0 left-0 h-px bg-accent"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
    </Link>
  );
}

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
