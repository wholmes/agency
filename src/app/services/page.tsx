import type { Metadata } from "next";
import Link from "next/link";
import { IconDesign, IconCode, IconBrand, IconAnalytics, IconArrowUpRight, IconPerformance } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Services — Web Design, Development, Brand Strategy & Analytics",
  description:
    "BrandMeetsCode offers premium web design, development, brand strategy, and analytics integration for B2B companies and SaaS founders.",
  alternates: {
    canonical: "https://brandmeetscode.com/services",
  },
};

const services = [
  {
    icon: IconDesign,
    title: "Web Design",
    subtitle: "Interfaces that convert",
    description:
      "We design websites with composition first and components second. Every layout, typographic choice, and color decision is deliberate — calibrated to your audience and your objectives.",
    outcomes: [
      "Conversion-optimized information architecture",
      "Full design system with all states and variants",
      "Mobile-first, responsive across all breakpoints",
      "Accessibility-first (WCAG AA minimum)",
    ],
    href: "/services/web-design",
  },
  {
    icon: IconCode,
    title: "Web Development",
    subtitle: "Production-grade code, zero shortcuts",
    description:
      "Next.js, TypeScript, and infrastructure choices that hold up at scale. We write code that your future developer won't hate — or we handoff with documentation thorough enough that they won't need to ask.",
    outcomes: [
      "Lighthouse score ≥ 90 across all categories",
      "Edge-deployed for global performance",
      "Full codebase documentation on handoff",
      "Three months of post-launch support included",
    ],
    href: "/services/web-design",
  },
  {
    icon: IconBrand,
    title: "Brand Strategy",
    subtitle: "Clarity before aesthetics",
    description:
      "Positioning work that tells you who you are, who you're for, and how to say it. We do this before we open Figma — because visual decisions made without strategic context are expensive guesses.",
    outcomes: [
      "Competitive landscape and positioning audit",
      "Messaging hierarchy and tone of voice",
      "Visual identity direction (not just a logo)",
      "Brand guidelines document",
    ],
    href: "/services/brand-strategy",
  },
  {
    icon: IconAnalytics,
    title: "Analytics Integration",
    subtitle: "Data you'll actually use",
    description:
      "We set up tracking that answers business questions, not just fills dashboards. GA4, Segment, Mixpanel, Looker — configured around what you actually need to know.",
    outcomes: [
      "GA4 and tag manager full setup",
      "Custom event tracking mapped to your funnel",
      "Dashboard built around your KPIs",
      "Monthly analytics review for 90 days",
    ],
    href: "/services/analytics-integration",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section
        aria-labelledby="services-page-heading"
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-24)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>
              Services
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 id="services-page-heading" className="text-h1" style={{ maxWidth: "640px", marginBottom: "var(--space-6)" }}>
              Everything a premium website requires
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-body-lg" style={{ maxWidth: "520px" }}>
              We offer four integrated services. Most clients engage us for two or three —
              because the results compound when strategy, design, and code are all speaking the same language.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services list */}
      <section aria-label="Service details" className="section">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <Link
                  href={service.href}
                  className="service-item"
                  style={{ display: "block", textDecoration: "none" }}
                  aria-label={`Learn about ${service.title}`}
                >
                  <article
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "var(--space-8)",
                      padding: "var(--space-10)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--color-surface)",
                      transition: "transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)",
                    }}
                    className="service-article"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
                      <div style={{ display: "flex", gap: "var(--space-5)", alignItems: "flex-start" }}>
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "var(--color-accent-subtle)",
                            border: "1px solid var(--color-accent-muted)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--color-accent)",
                            flexShrink: 0,
                          }}
                        >
                          <service.icon size={24} />
                        </div>
                        <div>
                          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "var(--space-1)" }}>
                            {service.title}
                          </h2>
                          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontStyle: "italic" }}>
                            {service.subtitle}
                          </p>
                        </div>
                      </div>
                      <IconArrowUpRight size={20} style={{ color: "var(--color-text-tertiary)", marginTop: "var(--space-3)" } as React.CSSProperties} className="service-arrow" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }} className="service-body">
                      <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.75 }}>
                        {service.description}
                      </p>
                      <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }} className="outcomes-list">
                        {service.outcomes.map((outcome) => (
                          <li key={outcome} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0, marginTop: "0.5em" }} aria-hidden="true" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Performance guarantee */}
      <section aria-labelledby="guarantee-heading" style={{ paddingBottom: "var(--space-40)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <ScrollReveal>
            <div
              style={{
                display: "flex",
                gap: "var(--space-6)",
                alignItems: "flex-start",
                padding: "var(--space-10)",
                background: "var(--color-accent-subtle)",
                border: "1px solid var(--color-accent-muted)",
                borderRadius: "var(--radius-lg)",
              }}
              className="guarantee-box"
            >
              <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-accent)", borderRadius: "var(--radius-md)", flexShrink: 0, color: "var(--color-bg)" }}>
                <IconPerformance size={24} />
              </div>
              <div>
                <h2 id="guarantee-heading" style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, letterSpacing: "-0.015em", marginBottom: "var(--space-3)" }}>
                  The Lighthouse Guarantee
                </h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.75, maxWidth: "600px" }}>
                  Every website we build ships with a Lighthouse score of 90+ across Performance, Accessibility,
                  Best Practices, and SEO. If it doesn&rsquo;t, we fix it before final delivery — no scope negotiations.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CtaSection />

      <style>{`
        .service-item:hover .service-article {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
          border-color: var(--color-accent-muted) !important;
        }
        .service-item:hover .service-arrow {
          color: var(--color-accent) !important;
        }
        @media (min-width: 768px) {
          .service-body {
            grid-template-columns: 1fr 1fr !important;
          }
          .outcomes-list {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .outcomes-list {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .guarantee-box {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
