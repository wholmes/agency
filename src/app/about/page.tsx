import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { IconArrowUpRight, IconCheck } from "@/components/icons";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "About — The BrandMeetsCode Story",
  description:
    "The story of BrandMeetsCode — a premium web development agency built at the intersection of brand strategy and technical execution. Values, approach, and the team behind the work.",
  alternates: {
    canonical: "https://brandmeetscode.com/about",
  },
};

const values = [
  {
    title: "Design is a business discipline",
    body: "Good design isn't decoration — it's how your business communicates without you in the room. We treat every visual decision as a business decision.",
  },
  {
    title: "Code quality is not optional",
    body: "Slow sites, inaccessible interfaces, and unmaintainable code are liabilities. We write code that holds up — for your users, your team, and your future developers.",
  },
  {
    title: "Clarity over cleverness",
    body: "The best work is often the work that looks obvious in retrospect. We resist novelty for its own sake and design toward understanding.",
  },
  {
    title: "The brief is a starting point",
    body: "We will ask questions your previous agency didn't. Not to be difficult — but because the best projects start with a clear understanding of the real problem, not just the stated one.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-24)",
          borderBottom: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", top: "10%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,165,90,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>About</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-h1" style={{ maxWidth: "700px", marginBottom: "var(--space-6)" }}>
              Built at the intersection of two disciplines that rarely meet
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-body-lg" style={{ maxWidth: "520px" }}>
              BrandMeetsCode exists because the best websites require both brand clarity
              and technical precision — and most agencies only do one of those well.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="story-heading" className="section" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-16)", alignItems: "start" }} className="story-grid">
            {/* Text */}
            <div>
              <ScrollReveal>
                <h2 id="story-heading" className="text-h2" style={{ marginBottom: "var(--space-8)" }}>
                  The{" "}
                  <em className="italic-display" style={{ color: "var(--color-accent)" }}>real</em>{" "}
                  origin story
                </h2>
              </ScrollReveal>
              {[
                "We've sat on both sides of the table — as brand strategists who got frustrated with developers who didn't understand why positioning mattered, and as engineers who watched beautiful Figma files turn into sluggish, inaccessible code.",
                "BrandMeetsCode was built to close that gap. Not by being mediocre at both disciplines — but by being genuinely excellent at both, and by understanding how each one makes the other better.",
                "When brand strategy informs design, the visual decisions have reasons behind them. When design informs engineering, the technical choices support — rather than undermine — the user experience. When all three work together, you get something that most clients have never seen before: a website that works as hard as your best salesperson.",
                "That's what we build.",
              ].map((paragraph, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <p className="text-body-lg" style={{ marginBottom: "var(--space-6)" }}>
                    {paragraph}
                  </p>
                </ScrollReveal>
              ))}
            </div>

            {/* Visual card — founder presence */}
            <ScrollReveal delay={200}>
              <div
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                {/* Abstract visual placeholder representing the founders */}
                <div
                  style={{
                    height: "280px",
                    background: "linear-gradient(135deg, var(--color-surface-2) 0%, #1C1810 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                >
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,165,90,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,90,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "5rem", fontWeight: 300, letterSpacing: "-0.04em", color: "var(--color-accent)", opacity: 0.15, lineHeight: 1 }}>
                      BMC
                    </div>
                    <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginTop: "var(--space-4)" }}>
                      Brand Meets Code
                    </p>
                  </div>
                </div>
                <div style={{ padding: "var(--space-8)" }}>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-4)" }}>
                    We&rsquo;re a small, senior team. No juniors in client-facing work.
                    Every project is handled by people who have done this many times before.
                  </p>
                  <Link href="/contact" className="btn btn-ghost" style={{ paddingInline: 0, fontSize: "var(--text-sm)", color: "var(--color-accent)" }}>
                    Work with us <IconArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="section" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>What We Believe</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="values-heading" className="text-h2" style={{ marginBottom: "var(--space-16)" }}>
              Specific beliefs, not platitudes
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }} className="values-grid">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 80}>
                <div style={{ padding: "var(--space-8)", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }}>
                      <IconCheck size={11} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
                      {value.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.75, paddingLeft: "var(--space-10)" }}>
                    {value.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />

      <style>{`
        @media (min-width: 1024px) {
          .story-grid { grid-template-columns: 1.2fr 1fr !important; }
          .values-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
