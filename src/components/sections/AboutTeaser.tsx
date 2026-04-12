"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight, IconCheck } from "../icons";

const beliefs = [
  "Design that doesn't convert is decoration",
  "Code quality is a business decision",
  "The brief is a starting point, not a ceiling",
  "Every pixel should earn its place",
];

export default function AboutTeaser() {
  return (
    <section aria-labelledby="about-heading" className="section">
      <div className="container">
        {/* Intentionally asymmetric layout — text heavy left, accent right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Left: copy */}
          <div>
            <ScrollReveal>
              <p className="text-overline" style={{ marginBottom: "var(--space-4)" }}>
                The Difference
              </p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h2 id="about-heading" className="text-h2" style={{ marginBottom: "var(--space-6)" }}>
                Where brand{" "}
                <em className="italic-display" style={{ color: "var(--color-accent)" }}>
                  strategy
                </em>
                {" "}meets<br />technical execution
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="text-body-lg" style={{ marginBottom: "var(--space-8)" }}>
                Most agencies are either great at design or great at code. We built
                BrandMeetsCode because the best projects need both — and they need them
                to work together from day one, not be stitched together at the end.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <p className="text-body" style={{ marginBottom: "var(--space-10)" }}>
                We work with companies who have tried generic dev shops and ended up
                with something technically functional but strategically inert. We fix
                that — not by redesigning every six months, but by making the right
                decisions the first time.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Link href="/about" className="btn btn-secondary">
                Our Story
                <IconArrowUpRight size={16} />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: beliefs/values card */}
          <div>
            <ScrollReveal delay={200}>
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-10)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative accent line */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "linear-gradient(to right, var(--color-accent), transparent)",
                  }}
                />

                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-text-tertiary)",
                    marginBottom: "var(--space-8)",
                  }}
                >
                  What we believe
                </p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  {beliefs.map((belief, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "var(--color-accent-subtle)",
                          border: "1px solid var(--color-accent-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                          color: "var(--color-accent)",
                        }}
                        aria-hidden="true"
                      >
                        <IconCheck size={11} />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-lg)",
                          fontWeight: 300,
                          letterSpacing: "-0.01em",
                          color: "var(--color-text-primary)",
                          lineHeight: 1.4,
                        }}
                      >
                        {belief}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
