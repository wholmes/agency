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
      <section className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[10%] -left-[5%] size-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,165,90,0.05)_0%,transparent_70%)]"
        />
        <div className="container relative">
          <ScrollReveal>
            <p className="text-overline mb-5">About</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-h1 mb-6 max-w-[700px]">Built at the intersection of two disciplines that rarely meet</h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-body-lg max-w-[520px]">
              BrandMeetsCode exists because the best websites require both brand clarity and technical precision — and most
              agencies only do one of those well.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section aria-labelledby="story-heading" className="section border-b border-border">
        <div className="container">
          <div className="story-grid grid grid-cols-1 items-start gap-16 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <ScrollReveal>
                <h2 id="story-heading" className="text-h2 mb-8">
                  The <em className="italic-display text-accent">real</em> origin story
                </h2>
              </ScrollReveal>
              {[
                "We've sat on both sides of the table — as brand strategists who got frustrated with developers who didn't understand why positioning mattered, and as engineers who watched beautiful Figma files turn into sluggish, inaccessible code.",
                "BrandMeetsCode was built to close that gap. Not by being mediocre at both disciplines — but by being genuinely excellent at both, and by understanding how each one makes the other better.",
                "When brand strategy informs design, the visual decisions have reasons behind them. When design informs engineering, the technical choices support — rather than undermine — the user experience. When all three work together, you get something that most clients have never seen before: a website that works as hard as your best salesperson.",
                "That's what we build.",
              ].map((paragraph, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <p className="text-body-lg mb-6">{paragraph}</p>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <div
                  className="relative flex h-[280px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-surface-2)_0%,#1c1810_100%)]"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
                  <div className="relative text-center">
                    <div className="font-display text-[5rem] leading-none font-light tracking-tighter text-accent opacity-15">
                      BMC
                    </div>
                    <p className="mt-4 text-xs tracking-[0.15em] text-text-tertiary uppercase">Brand Meets Code</p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    We&rsquo;re a small, senior team. No juniors in client-facing work. Every project is handled by people who
                    have done this many times before.
                  </p>
                  <Link href="/contact" className="btn btn-ghost px-0 text-sm text-accent">
                    Work with us <IconArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="section border-b border-border bg-surface">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">What We Believe</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="values-heading" className="text-h2 mb-16">
              Specific beliefs, not platitudes
            </h2>
          </ScrollReveal>
          <div className="values-grid grid grid-cols-1 gap-6 lg:grid-cols-2">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 80}>
                <div className="rounded-lg border border-border bg-bg p-8">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle text-accent">
                      <IconCheck size={11} />
                    </div>
                    <h3 className="font-display text-xl font-normal leading-snug tracking-tight">{value.title}</h3>
                  </div>
                  <p className="pl-10 text-sm leading-relaxed text-text-secondary">{value.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
