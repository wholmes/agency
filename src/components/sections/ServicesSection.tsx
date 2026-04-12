"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconCode, IconBrand, IconAnalytics, IconDesign, IconArrowUpRight } from "../icons";

const services = [
  {
    icon: IconDesign,
    number: "01",
    title: "Web Design",
    description:
      "Interfaces built with composition principles, not templates. Every decision — spacing, type, color, motion — is intentional.",
    outcomes: ["Conversion-optimized layouts", "Design system included", "Mobile-first approach"],
    href: "/services/web-design",
  },
  {
    icon: IconCode,
    number: "02",
    title: "Web Development",
    description:
      "Production-grade code. Next.js, TypeScript, and infrastructure that scales without becoming someone else's problem.",
    outcomes: ["Lighthouse ≥ 90 guaranteed", "Edge-deployed", "Handoff with full docs"],
    href: "/services/web-design",
  },
  {
    icon: IconBrand,
    number: "03",
    title: "Brand Strategy",
    description:
      "Positioning work that clarifies who you are and who you're for. Strategy first — then the visuals make sense.",
    outcomes: ["Market positioning audit", "Messaging hierarchy", "Visual identity direction"],
    href: "/services/brand-strategy",
  },
  {
    icon: IconAnalytics,
    number: "04",
    title: "Analytics & Growth",
    description:
      "Instrumentation that actually answers business questions. No vanity dashboards — just the data that drives decisions.",
    outcomes: ["GA4 + Segment setup", "Custom event tracking", "Monthly reporting included"],
    href: "/services/analytics-integration",
  },
];

export default function ServicesSection() {
  return (
    <section aria-labelledby="services-heading" className="section">
      <div className="container">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "var(--space-16)",
            flexWrap: "wrap",
            gap: "var(--space-6)",
          }}
        >
          <div>
            <ScrollReveal>
              <p className="text-overline" style={{ marginBottom: "var(--space-4)" }}>
                What We Do
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 id="services-heading" className="text-h2">
                Built for brands that<br />
                <em className="italic-display" style={{ color: "var(--color-accent)" }}>
                  mean business
                </em>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <Link href="/services" className="btn btn-ghost" style={{ color: "var(--color-text-secondary)" }}>
              All Services
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>

        {/* Services grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1px",
            background: "var(--color-border)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
          className="services-grid"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.number} service={service} delay={i * 80} />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({
  service,
  delay,
}: {
  service: (typeof services)[0];
  delay: number;
}) {
  const Icon = service.icon;

  return (
    <ScrollReveal delay={delay}>
      <Link
        href={service.href}
        style={{
          display: "block",
          padding: "var(--space-10)",
          background: "var(--color-surface)",
          transition: "background var(--duration-base) var(--ease-out)",
          textDecoration: "none",
          height: "100%",
        }}
        className="service-card"
        aria-label={`Learn about ${service.title}`}
        data-cursor-label="Explore"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "var(--space-6)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-accent-subtle)",
              border: "1px solid var(--color-accent-muted)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-accent)",
              transition: "background var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)",
            }}
            className="service-icon"
          >
            <Icon size={22} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.08em",
            }}
          >
            {service.number}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 400,
            letterSpacing: "-0.015em",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          {service.title}
        </h3>

        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            marginBottom: "var(--space-6)",
          }}
        >
          {service.description}
        </p>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {service.outcomes.map((outcome) => (
            <li
              key={outcome}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              {outcome}
            </li>
          ))}
        </ul>

        <style>{`
          .service-card:hover {
            background: var(--color-surface-2) !important;
          }
          .service-card:hover .service-icon {
            background: var(--color-accent-muted) !important;
            transform: scale(1.05);
          }
        `}</style>
      </Link>
    </ScrollReveal>
  );
}
