import type { Metadata } from "next";
import Link from "next/link";
import { IconDesign, IconCheck, IconArrowUpRight, IconCode } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Web Design & Development Services",
  description:
    "Premium web design and development for B2B companies and SaaS founders. Conversion-optimized, Lighthouse ≥ 90 guaranteed, mobile-first. Learn what's included.",
  alternates: {
    canonical: "https://brandmeetscode.com/services/web-design",
  },
};

const inclusions = [
  "Discovery and strategy session",
  "Full mobile-first design system",
  "All major breakpoints designed and built",
  "Motion and microinteraction design",
  "Next.js + TypeScript development",
  "Lighthouse ≥ 90 guaranteed",
  "SEO foundation built in",
  "Accessibility audit and remediation",
  "Staging environment + QA period",
  "90 days post-launch support",
  "Full codebase handoff with documentation",
  "Training session for your team",
];

const faqs = [
  {
    question: "How long does a typical web design project take?",
    answer:
      "Most projects run 6–10 weeks from strategy kick-off to launch. Complex sites with custom CMS integrations or multi-page architectures may take 12–16 weeks. We'll give you a precise timeline after our discovery session.",
  },
  {
    question: "Do you work with our existing brand guidelines?",
    answer:
      "Absolutely. If you have an existing brand system, we design within it — or we'll note where it needs extending to work on the web. If you don't have guidelines yet, we can run a brand strategy engagement first.",
  },
  {
    question: "What CMS do you use?",
    answer:
      "We primarily use Contentful, Sanity, and Notion as content backends — all with Next.js frontends. We choose based on your team's technical comfort level and content editing needs. Simpler sites may not need a CMS at all.",
  },
  {
    question: "Will I be able to update the site myself after launch?",
    answer:
      "Yes — that's a requirement for us, not an add-on. Every project includes a training session and documentation. If you want a full CMS where non-technical team members can make updates without touching code, we scope that in from the start.",
  },
  {
    question: "What makes you different from a typical web agency?",
    answer:
      "Most agencies separate design and development into two different teams or phases. We integrate them from day one. The designer understands what's buildable; the developer understands why design decisions were made. The result is faster, cleaner, and more coherent.",
  },
];

export default function WebDesignPage() {
  return (
    <>
      {/* Page header */}
      <section
        aria-labelledby="service-heading"
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-24)",
          borderBottom: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "radial-gradient(ellipse at 80% 20%, rgba(201,165,90,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative" }}>
          <ScrollReveal>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-8)" }} className="back-link">
              ← All Services
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>
              Service
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <h1 id="service-heading" className="text-h1" style={{ maxWidth: "640px", marginBottom: "var(--space-6)" }}>
              Web Design &amp; Development
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-body-lg" style={{ maxWidth: "520px", marginBottom: "var(--space-10)" }}>
              Interfaces built with composition principles, not templates.
              We design and build your site as a single, coherent project — no hand-off between design and dev teams.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={280}>
            <Link href="/contact" className="btn btn-primary">
              Start a Project
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="who-heading" className="section" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>Who It&rsquo;s For</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="who-heading" className="text-h2" style={{ maxWidth: "640px", marginBottom: "var(--space-8)" }}>
              Right for you if:
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-5)" }} className="who-grid">
            {[
              "You've outgrown your current site and it no longer represents where the business is",
              "You're launching something new and want to do it right the first time",
              "You've had a site built before and it looked good in Figma but fell apart in code",
              "You need the site to do real work — not just look good in a portfolio screenshot",
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", padding: "var(--space-6)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0, marginTop: "0.4em" }} aria-hidden="true" />
                  <p style={{ fontSize: "var(--text-md)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{item}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section aria-labelledby="included-heading" className="section" style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div className="container">
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>What&rsquo;s Included</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="included-heading" className="text-h2" style={{ marginBottom: "var(--space-12)" }}>
              No hidden scope
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-4)" }} className="inclusions-grid">
            {inclusions.map((item, i) => (
              <ScrollReveal key={item} delay={i * 40}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4) var(--space-5)", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
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

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="section">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>FAQ</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="faq-heading" className="text-h2" style={{ marginBottom: "var(--space-12)" }}>
              Common questions
            </h2>
          </ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <details
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingBlock: "var(--space-6)",
                  }}
                  className="faq-item"
                >
                  <summary
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      cursor: "pointer",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "var(--space-4)",
                      userSelect: "none",
                    }}
                  >
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
        @media (min-width: 640px) {
          .who-grid { grid-template-columns: 1fr 1fr !important; }
          .inclusions-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
