"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight } from "../icons";
import { ServiceIconGlyph, parseOutcomeList } from "@/lib/service-icons";
import type { ServiceOffering as ServiceOfferingModel } from "@prisma/client";
import type { ServicesHomeSection } from "@prisma/client";
import { appendUtmToUrl, utmFromFooterLinkDb } from "@/lib/utm";

export default function ServicesSection({
  offerings,
  homeSection,
}: {
  offerings: ServiceOfferingModel[];
  homeSection: ServicesHomeSection;
}) {
  const footerLinkHref = appendUtmToUrl(homeSection.footerLinkHref, utmFromFooterLinkDb(homeSection));

  return (
    <section aria-labelledby="services-heading" className="section">
      <div className="container">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <ScrollReveal>
              <p className="text-overline mb-4">{homeSection.overline}</p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 id="services-heading" className="text-h2">
                {homeSection.headingLine1}
                <br />
                <em className="italic-display text-accent">{homeSection.headingEmphasis}</em>
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
          {offerings.map((service, i) => (
            <ServiceCard key={service.slug} service={service} delay={i * 80} />
          ))}
        </div>

        <ScrollReveal delay={400} className="mt-12 max-w-[720px]">
          <p className="text-sm leading-relaxed text-text-secondary">
            {homeSection.footerBeforeHighlight}
            <span className="text-text-primary">{homeSection.footerHighlight}</span>
            {homeSection.footerAfterHighlightBeforeLink}
            <Link
              href={footerLinkHref}
              className="text-accent no-underline transition-opacity hover:opacity-80"
            >
              {homeSection.footerLinkLabel}
            </Link>
            {homeSection.footerAfterLink}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  delay,
}: {
  service: ServiceOfferingModel;
  delay: number;
}) {
  const outcomes = parseOutcomeList(service.outcomesHome);
  const num = service.number ?? "";

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
              <ServiceIconGlyph iconKey={service.iconKey} size={22} />
            </div>
            <h3 className="font-display text-xl font-normal tracking-tight text-text-primary">{service.title}</h3>
          </div>
          <span className="font-mono text-xs tracking-wider text-text-tertiary">{num}</span>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-text-secondary">{service.descriptionHome}</p>

        <ul className="flex list-none flex-col gap-2">
          {outcomes.map((outcome) => (
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
