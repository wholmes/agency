import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowUpRight, IconCheck } from "@/components/icons";
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
      <section className="border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24">
        <div className="container">
          <ScrollReveal>
            <Link
              href="/services"
              className="mb-8 inline-flex items-center gap-2 text-sm text-text-tertiary no-underline transition-colors hover:text-text-secondary"
            >
              ← All Services
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <p className="text-overline mb-5">Service</p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h1 className="text-h1 mb-6 max-w-[640px]">Brand Strategy</h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg mb-10 max-w-[520px]">
              Positioning work that clarifies who you are and who you&rsquo;re for. Strategy first — then the visuals make
              sense.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <Link href="/contact" className="btn btn-primary">
              Start a Project <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="section border-b border-border">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-h2 mb-10 max-w-[600px]">What&rsquo;s included</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "Market positioning audit",
              "Competitive landscape review",
              "Audience persona definitions",
              "Messaging hierarchy",
              "Tone of voice guidelines",
              "Visual identity direction",
              "Brand guidelines document",
              "Go-to-market messaging map",
            ].map((item, i) => (
              <ScrollReveal key={item} delay={Math.floor(i / 2) * 40}>
                <div className="flex items-center gap-4 rounded-md border border-border bg-surface px-5 py-4">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle text-accent">
                    <IconCheck size={12} />
                  </div>
                  <span className="text-sm text-text-primary">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-h2 mb-12">Common questions</h2>
          </ScrollReveal>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-normal tracking-tight select-none [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="inline-block shrink-0 text-xl font-light text-accent transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-5 max-w-[680px] text-base leading-relaxed text-text-secondary">{faq.answer}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
