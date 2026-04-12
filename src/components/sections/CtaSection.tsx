"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight, IconEmail } from "../icons";
import MagneticButton from "../MagneticButton";

export default function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingBlock: "var(--space-40)",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Background — subtle grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201, 165, 90, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 165, 90, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Large decorative text — intentional layering */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 20vw, 18rem)",
            fontWeight: 300,
            letterSpacing: "-0.05em",
            fontStyle: "italic",
            color: "var(--color-accent)",
            opacity: 0.03,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Let&rsquo;s Build
        </span>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <ScrollReveal>
          <p className="text-overline" style={{ marginBottom: "var(--space-6)" }}>
            Ready to Start?
          </p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2
            id="cta-heading"
            className="text-h1"
            style={{ marginBottom: "var(--space-6)", maxWidth: "680px", marginInline: "auto" }}
          >
            Your site should be your
            {" "}
            <em className="italic-display" style={{ color: "var(--color-accent)" }}>
              best salesperson
            </em>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p
            className="text-body-lg"
            style={{ maxWidth: "480px", marginInline: "auto", marginBottom: "var(--space-12)" }}
          >
            Tell us about your project. We respond within one business day with
            a clear sense of fit, timeline, and what working together would look like.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <MagneticButton>
              <Link href="/contact" className="btn btn-primary" style={{ fontSize: "var(--text-sm)", padding: "var(--space-5) var(--space-8)" }} data-cursor-label="Let's Build">
                Start a Project
                <IconArrowUpRight size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href="mailto:hello@brandmeetscode.com"
                className="btn btn-secondary"
                style={{ fontSize: "var(--text-sm)", padding: "var(--space-5) var(--space-8)" }}
                data-cursor-label="Say Hello"
              >
                <IconEmail size={16} />
                hello@brandmeetscode.com
              </a>
            </MagneticButton>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={320}>
          <p
            style={{
              marginTop: "var(--space-8)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.05em",
            }}
          >
            No commitment. No sales call unless you want one.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
