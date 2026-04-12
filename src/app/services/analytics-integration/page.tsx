import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowUpRight, IconCheck } from "@/components/icons";
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
            <h1 className="text-h1 mb-6 max-w-[640px]">Analytics &amp; Growth Integration</h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg mb-10 max-w-[520px]">
              Data you&rsquo;ll actually use. We configure tracking that answers business questions — not just fills
              dashboards.
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
            <h2 className="text-h2 mb-10">What&rsquo;s included</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "GA4 full configuration",
              "Google Tag Manager setup",
              "Custom event taxonomy",
              "Funnel tracking implementation",
              "Custom KPI dashboard",
              "Conversion goal configuration",
              "90-day monthly review",
              "Team training session",
            ].map((item, i) => (
              <ScrollReveal key={item} delay={i * 40}>
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
