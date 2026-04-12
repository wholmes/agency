import type { Metadata } from "next";
import Link from "next/link";
import { IconDesign, IconCode, IconBrand, IconAnalytics, IconArrowUpRight, IconPerformance } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";
import ScopeEstimator from "@/components/ScopeEstimator";

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
      <section
        aria-labelledby="services-page-heading"
        className="border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24"
      >
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">Services</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 id="services-page-heading" className="text-h1 mb-6 max-w-[640px]">
              Everything a premium website requires
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-body-lg max-w-[520px]">
              We offer four integrated services. Most clients engage us for two or three — because the results compound
              when strategy, design, and code are all speaking the same language.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section aria-label="Service details" className="section">
        <div className="container">
          <div className="flex flex-col gap-4">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <Link
                  href={service.href}
                  className="service-item block no-underline"
                  aria-label={`Learn about ${service.title}`}
                >
                  <article className="service-article rounded-lg border border-border bg-surface p-10 transition-[transform,box-shadow,border-color] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)]">
                    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex flex-wrap items-start gap-5">
                        <div className="flex size-[52px] shrink-0 items-center justify-center rounded-md border border-accent-muted bg-accent-subtle text-accent">
                          <service.icon size={24} />
                        </div>
                        <div>
                          <h2 className="font-display mb-1 text-2xl font-light tracking-tight">{service.title}</h2>
                          <p className="text-sm text-accent italic">{service.subtitle}</p>
                        </div>
                      </div>
                      <IconArrowUpRight size={20} className="service-arrow mt-3 shrink-0 text-text-tertiary transition-colors [transition-duration:var(--duration-base)]" />
                    </div>

                    <div className="service-body">
                      <p className="text-base leading-relaxed text-text-secondary">{service.description}</p>
                      <ul className="outcomes-list">
                        {service.outcomes.map((outcome) => (
                          <li key={outcome} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span
                              className="mt-[0.5em] size-1 shrink-0 rounded-full bg-accent"
                              aria-hidden="true"
                            />
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

      <section aria-labelledby="guarantee-heading" className="border-b border-border pb-40">
        <div className="container">
          <ScrollReveal>
            <div className="guarantee-box flex flex-col gap-6 rounded-lg border border-accent-muted bg-accent-subtle p-10 sm:flex-row sm:items-start">
              <div className="flex size-[52px] shrink-0 items-center justify-center rounded-md bg-accent text-bg">
                <IconPerformance size={24} />
              </div>
              <div>
                <h2 id="guarantee-heading" className="font-display mb-3 text-xl font-normal tracking-tight">
                  The Lighthouse Guarantee
                </h2>
                <p className="max-w-[600px] text-sm leading-relaxed text-text-secondary">
                  Every website we build ships with a Lighthouse score of 90+ across Performance, Accessibility, Best
                  Practices, and SEO. If it doesn&rsquo;t, we fix it before final delivery — no scope negotiations.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section aria-labelledby="estimator-heading" className="border-b border-border py-40">
        <div className="container">
          <div className="estimator-grid grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <ScrollReveal>
                <p className="text-overline mb-5">Ballpark Estimator</p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <h2 id="estimator-heading" className="text-h2 mb-6">
                  Get a rough number
                  <br />
                  <em className="italic-display text-accent">before the call</em>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <p className="text-body-lg">
                  No forms, no follow-up emails, no sales call required. Answer four questions and get a realistic ballpark
                  range for your project.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={120}>
              <ScopeEstimator />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
