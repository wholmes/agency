import type { Metadata } from "next";
import Link from "next/link";
import { IconAnalytics, IconArrowUpRight, IconCheck } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Analytics Integration Services — GA4, Segment, Looker",
  description:
    "Analytics setup that answers real business questions. GA4, Segment, Mixpanel, custom dashboards — data you'll actually use. No vanity metrics.",
  alternates: {
    canonical: "https://brandmeetscode.com/services/analytics-integration",
  },
};

const faqs = [
  {
    question: "What platforms do you work with?",
    answer:
      "GA4, Google Tag Manager, Segment, Mixpanel, Amplitude, Looker, and Looker Studio are our primary tools. We choose the stack based on your team's existing tooling and budget.",
  },
  {
    question: "We already have Google Analytics — why do we need this?",
    answer:
      "Most Google Analytics setups track pageviews and not much else. We build tracking that maps to your actual funnel — so you can answer questions like 'which traffic source generates our best leads?' and 'where are people dropping off in the sign-up flow?'",
  },
  {
    question: "What do we get at the end?",
    answer:
      "A fully configured tracking setup, a custom dashboard built around your KPIs, and 90 days of monthly analytics reviews where we walk you through what the data is saying and what to do about it.",
  },
];

export default function AnalyticsPage() {
  return (
    <>
      <section style={{ paddingTop: "calc(var(--nav-height) + var(--space-24))", paddingBottom: "var(--space-24)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <ScrollReveal>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-8)" }} className="back-link">
              ← All Services
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>Service</p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h1 className="text-h1" style={{ maxWidth: "640px", marginBottom: "var(--space-6)" }}>
              Analytics &amp; Growth Integration
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg" style={{ maxWidth: "520px", marginBottom: "var(--space-10)" }}>
              Data you&rsquo;ll actually use. We configure tracking that answers business questions — not just fills dashboards.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <Link href="/contact" className="btn btn-primary">
              Start a Project <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <ScrollReveal>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-10)" }}>What&rsquo;s included</h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-4)" }} className="inclusions-grid">
            {[
              "GA4 full configuration", "Google Tag Manager setup", "Custom event taxonomy", "Funnel tracking implementation",
              "Custom KPI dashboard", "Conversion goal configuration", "90-day monthly review", "Team training session",
            ].map((item, i) => (
              <ScrollReveal key={item} delay={i * 40}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4) var(--space-5)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)", flexShrink: 0 }}>
                    <IconCheck size={12} />
                  </div>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-12)" }}>Common questions</h2>
          </ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <details style={{ borderTop: "1px solid var(--color-border)", paddingBlock: "var(--space-6)" }}>
                  <summary style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 400, letterSpacing: "-0.01em", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", userSelect: "none" }}>
                    {faq.question}
                    <span aria-hidden="true" style={{ flexShrink: 0, fontSize: "var(--text-xl)", color: "var(--color-accent)", fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ marginTop: "var(--space-5)", fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.75, maxWidth: "680px" }}>
                    {faq.answer}
                  </p>
                </details>
              </ScrollReveal>
            ))}
            <div style={{ borderTop: "1px solid var(--color-border)" }} />
          </div>
        </div>
      </section>

      <CtaSection />
      <style>{`
        .back-link:hover { color: var(--color-text-secondary) !important; }
        details[open] summary span { transform: rotate(45deg); }
        details summary span { transition: transform 0.2s ease; display: inline-block; }
        @media (min-width: 640px) { .inclusions-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </>
  );
}
