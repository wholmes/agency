"use client";

import ScrollReveal from "../ScrollReveal";
import { IconStar } from "../icons";

const stats = [
  { value: "40+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "4.9★", label: "Average Rating" },
  { value: "<2s", label: "Avg Load Time" },
];

const clients = [
  "Meridian SaaS",
  "Croft & Webb",
  "Arclight Labs",
  "Nova Analytics",
  "Sable Studio",
  "Tether Finance",
];

export default function SocialProof() {
  return (
    <section
      aria-label="Social proof"
      style={{
        paddingBlock: "var(--space-16)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div className="container">
        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-8)",
            marginBottom: "var(--space-16)",
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-3xl)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    color: "var(--color-accent)",
                    lineHeight: 1,
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Divider with label */}
        <ScrollReveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              marginBottom: "var(--space-10)",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            <span
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                whiteSpace: "nowrap",
              }}
            >
              Trusted by
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          </div>
        </ScrollReveal>

        {/* Client name marquee — no images, just editorial typography */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4) var(--space-8)",
            justifyContent: "center",
          }}
        >
          {clients.map((name, i) => (
            <ScrollReveal key={name} delay={i * 50}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-md)",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  color: "var(--color-text-tertiary)",
                  fontStyle: "italic",
                  transition: "color var(--duration-base) var(--ease-out)",
                }}
                className="client-name"
              >
                {name}
              </span>
            </ScrollReveal>
          ))}
        </div>

        {/* Testimonial */}
        <ScrollReveal delay={200}>
          <div
            style={{
              marginTop: "var(--space-16)",
              padding: "var(--space-10)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              position: "relative",
              maxWidth: "720px",
              marginInline: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "var(--space-1)",
                marginBottom: "var(--space-4)",
              }}
              aria-label="5 stars"
            >
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} size={14} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
              ))}
            </div>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.5,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.01em",
                marginBottom: "var(--space-6)",
              }}
            >
              &ldquo;They didn&rsquo;t just build our site — they understood the
              business. The result increased demo requests by 40% in the first
              month.&rdquo;
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-accent-muted), var(--color-accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-bg)",
                }}
                aria-hidden="true"
              >
                JK
              </div>
              <div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>
                  Jordan Kim
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  Head of Marketing, Meridian SaaS
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        .client-name:hover {
          color: var(--color-text-secondary) !important;
        }
      `}</style>
    </section>
  );
}
