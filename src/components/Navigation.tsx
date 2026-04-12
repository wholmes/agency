"use client";

import { useEffect, useRef, useState } from "react";
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

  /* Lock scroll when mobile menu open */
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

  /* Close on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "var(--nav-height)",
          display: "flex",
          alignItems: "center",
          transition: `background-color var(--duration-slow) var(--ease-out), backdrop-filter var(--duration-slow) var(--ease-out), border-color var(--duration-slow) var(--ease-out)`,
          backgroundColor: scrolled ? "rgba(12, 12, 11, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {/* Logo */}
          <Link
            href="/"
            aria-label="BrandMeetsCode — Home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              textDecoration: "none",
            }}
          >
            <LogoMark
              size={28}
              className="logo-mark"
              style={{ color: "var(--color-accent)", transition: "transform var(--duration-base) var(--ease-out)" } as React.CSSProperties}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-md)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "var(--color-text-primary)",
              }}
            >
              Brand<span style={{ color: "var(--color-accent)" }}>Meets</span>Code
            </span>
          </Link>

          {/* Desktop nav */}
          <nav role="navigation" aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }} className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href || pathname.startsWith(link.href + "/")} />
            ))}
          </nav>

          {/* Availability indicator — desktop only */}
          <div style={{ display: "none", alignItems: "center", gap: "var(--space-2)" }} className="desktop-nav availability-badge">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: availability.available ? "var(--color-success, #4DAF7C)" : "var(--color-text-tertiary)",
                flexShrink: 0,
                boxShadow: availability.available ? "0 0 6px rgba(77,175,124,0.6)" : "none",
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
              {availability.available ? availability.label : `Next opening: ${availability.nextOpen}`}
            </span>
          </div>

          {/* Desktop CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }} className="desktop-nav">
            <Link href="/contact" className="btn btn-primary" style={{ fontSize: "var(--text-xs)" }} data-cursor-label="Let's Build">
              Start a Project
              <IconArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="mobile-trigger"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              color: "var(--color-text-primary)",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              backgroundColor: "var(--color-bg)",
              display: "flex",
              flexDirection: "column",
              padding: "var(--space-8) var(--space-6)",
              paddingTop: "calc(var(--nav-height) + var(--space-12))",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
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
                    style={{
                      display: "block",
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-4xl)",
                      fontWeight: 300,
                      letterSpacing: "-0.03em",
                      color: pathname === link.href ? "var(--color-accent)" : "var(--color-text-primary)",
                      padding: "var(--space-3) 0",
                      borderBottom: "1px solid var(--color-border)",
                      transition: "color var(--duration-base) var(--ease-out)",
                      lineHeight: 1.2,
                    }}
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
              style={{ paddingTop: "var(--space-8)" }}
            >
              <Link href="/contact" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Start a Project
                <IconArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav {
          display: none;
        }
        .mobile-trigger {
          display: flex;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
          .mobile-trigger {
            display: none;
          }
        }
        @media (min-width: 1024px) {
          .availability-badge {
            display: flex !important;
          }
        }
        .logo-mark:hover {
          transform: rotate(15deg);
        }
      `}</style>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        fontWeight: 400,
        letterSpacing: "0.01em",
        color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
        textDecoration: "none",
        padding: "var(--space-2) 0",
        transition: "color var(--duration-base) var(--ease-out)",
      }}
      className="nav-link"
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-indicator"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "var(--color-accent)",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      <style>{`
        .nav-link:hover {
          color: var(--color-text-primary) !important;
        }
      `}</style>
    </Link>
  );
}

/* SVG path-morphing hamburger → close */
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
        style={{ transformOrigin: "left" }}
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
