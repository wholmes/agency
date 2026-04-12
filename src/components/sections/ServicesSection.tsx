"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconCode, IconBrand, IconAnalytics, IconDesign, IconArrowUpRight } from "../icons";

const services = [
  {
    icon: IconDesign,
    number: "01",
    title: "Web Design",
    description:
      "Interfaces built with composition principles, not templates. Every decision — spacing, type, color, motion — is intentional.",
    outcomes: ["Conversion-optimized layouts", "Design system included", "Mobile-first approach"],
    href: "/services/web-design",
  },
  {
    icon: IconCode,
    number: "02",
    title: "Web Development",
    description:
      "Production-grade code. Next.js, TypeScript, and infrastructure that scales without becoming someone else's problem.",
    outcomes: ["Lighthouse ≥ 90 guaranteed", "Edge-deployed", "Handoff with full docs"],
    href: "/services/web-design",
  },
  {
    icon: IconBrand,
    number: "03",
    title: "Brand Strategy",
    description:
      "Positioning work that clarifies who you are and who you're for. Strategy first — then the visuals make sense.",
    outcomes: ["Market positioning audit", "Messaging hierarchy", "Visual identity direction"],
    href: "/services/brand-strategy",
  },
  {
    icon: IconAnalytics,
    number: "04",
    title: "Analytics & Growth",
    description:
      "Instrumentation that actually answers business questions. No vanity dashboards — just the data that drives decisions.",
    outcomes: ["GA4 + Segment setup", "Custom event tracking", "Monthly reporting included"],
    href: "/services/analytics-integration",
  },
];

export default function ServicesSection() {
  return (
    <section aria-labelledby="services-heading" className="section">
      <div className="container">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <ScrollReveal>
              <p className="text-overline mb-4">What We Do</p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 id="services-heading" className="text-h2">
                Built for brands that
                <br />
                <em className="italic-display text-accent">mean business</em>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <Link href="/services" className="btn btn-ghost text-text-secondary">
              All Services
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {services.map((service, i) => (
            <ServiceCard key={service.number} service={service} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  delay,
}: {
  service: (typeof services)[0];
  delay: number;
}) {
  const Icon = service.icon;

  return (
    <ScrollReveal delay={delay}>
      <Link
        href={service.href}
        className="group service-card block h-full bg-surface p-10 no-underline transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:bg-surface-2"
        aria-label={`Learn about ${service.title}`}
        data-cursor-label="Explore"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-accent-muted bg-accent-subtle text-accent transition-[background,transform] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] group-hover:scale-105 group-hover:bg-accent-muted">
              <Icon size={22} />
            </div>
            <h3 className="font-display text-xl font-normal tracking-tight text-text-primary">{service.title}</h3>
          </div>
          <span className="font-mono text-xs tracking-wider text-text-tertiary">{service.number}</span>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-text-secondary">{service.description}</p>

        <ul className="flex list-none flex-col gap-2">
          {service.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-center gap-2 text-xs text-text-tertiary">
              <span className="size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {outcome}
            </li>
          ))}
        </ul>
      </Link>
    </ScrollReveal>
  );
}
