import type { Metadata } from "next";
import Link from "next/link";
import { IconBrand, IconArrowUpRight, IconCheck } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Brand Strategy Services — Positioning & Messaging",
  description:
    "Brand strategy, positioning, and messaging for B2B companies and SaaS founders. Clarity before aesthetics — strategy that makes every visual decision make sense.",
  alternates: {
    canonical: "https://brandmeetscode.com/services/brand-strategy",
  },
};

const faqs = [
  {
    question: "Do we need brand strategy before a website project?",
    answer:
      "Often, yes — but not always. If you have a strong brand position that your team can articulate clearly and consistently, we can work within it. If there's disagreement internally about who you are and who you're for, strategy first will save you significant rework later.",
  },
  {
    question: "What does a brand strategy engagement produce?",
    answer:
      "A positioning document, messaging hierarchy, tone of voice guidelines, and visual identity direction. Some engagements also include competitive analysis, audience persona definitions, and a go-to-market messaging map.",
  },
  {
    question: "Can you do strategy without building the website?",
    answer:
      "Yes. The strategy deliverable is standalone and portable. Some clients bring it to other agencies or their internal team. Most choose to continue with us for the website — but there's no obligation.",
  },
];

export default function BrandStrategyPage() {
  return (
    <>
      <section
        style={{ paddingTop: "calc(var(--nav-height) + var(--space-24))", paddingBottom: "var(--space-24)", borderBottom: "1px solid var(--color-border)" }}
      >
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
            <h1 className="text-h1" style={{ maxWidth: "640px", marginBottom: "var(--space-6)" }}>Brand Strategy</h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg" style={{ maxWidth: "520px", marginBottom: "var(--space-10)" }}>
              Positioning work that clarifies who you are and who you&rsquo;re for.
              Strategy first — then the visuals make sense.
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
            <h2 className="text-h2" style={{ maxWidth: "600px", marginBottom: "var(--space-10)" }}>
              What&rsquo;s included
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-4)" }} className="inclusions-grid">
            {[
              "Market positioning audit", "Competitive landscape review", "Audience persona definitions",
              "Messaging hierarchy", "Tone of voice guidelines", "Visual identity direction",
              "Brand guidelines document", "Go-to-market messaging map",
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
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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
