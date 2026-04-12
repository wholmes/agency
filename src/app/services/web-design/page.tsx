import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconArrowUpRight } from "@/components/icons";
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
      <section aria-labelledby="service-heading" className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,165,90,0.05)_0%,transparent_60%)]"
        />
        <div className="container relative">
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
            <h1 id="service-heading" className="text-h1 mb-6 max-w-[640px]">
              Web Design &amp; Development
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg mb-10 max-w-[520px]">
              Interfaces built with composition principles, not templates. We design and build your site as a single,
              coherent project — no hand-off between design and dev teams.
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

      <section aria-labelledby="who-heading" className="section border-b border-border">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">Who It&rsquo;s For</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="who-heading" className="text-h2 mb-8 max-w-[640px]">
              Right for you if:
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              "You've outgrown your current site and it no longer represents where the business is",
              "You're launching something new and want to do it right the first time",
              "You've had a site built before and it looked good in Figma but fell apart in code",
              "You need the site to do real work — not just look good in a portfolio screenshot",
            ].map((item, i) => (
              <ScrollReveal key={i} delay={Math.floor(i / 2) * 60}>
                <div className="flex items-start gap-4 rounded-md border border-border bg-surface p-6">
                  <div className="mt-[0.4em] size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <p className="text-md leading-relaxed text-text-secondary">{item}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="included-heading" className="section border-b border-border bg-surface">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">What&rsquo;s Included</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="included-heading" className="text-h2 mb-12">
              No hidden scope
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {inclusions.map((item, i) => (
              <ScrollReveal key={item} delay={Math.floor(i / 2) * 40}>
                <div className="flex items-center gap-4 rounded-md border border-border bg-bg px-5 py-4">
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

      <section aria-labelledby="faq-heading" className="section">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">FAQ</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="faq-heading" className="text-h2 mb-12">
              Common questions
            </h2>
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
