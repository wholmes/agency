import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowUpRight, IconPerformance } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CapabilitiesScroll from "@/components/sections/CapabilitiesScroll";
import CtaSection from "@/components/sections/CtaSection";
import FireworksCanvas from "@/components/FireworksCanvas";
import ServicesPageHero from "@/components/sections/ServicesPageHero";
import ScopeEstimator from "@/components/ScopeEstimator";
import { ServiceIconGlyph, parseOutcomeList } from "@/lib/service-icons";
import {
  getCapabilities,
  getContinuityBlocks,
  getCtaSectionCopy,
  getLighthouseGuarantee,
  getScopeEstimatorConfig,
  getServiceOfferings,
  getServicesContinuityIntro,
  getServicesPageHero,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Services — Web Design, Development, Brand Strategy & Analytics",
  description:
    "BrandMeetsCode offers premium web design, development, brand strategy, and analytics integration for B2B companies and SaaS founders.",
  alternates: {
    canonical: "https://brandmeetscode.com/services",
  },
};

export default async function ServicesPage() {
  const [offerings, servicesHero, continuityIntro, continuityBlocks, guarantee, estimatorData, ctaCopy, capabilities] =
    await Promise.all([
      getServiceOfferings(),
      getServicesPageHero(),
      getServicesContinuityIntro(),
      getContinuityBlocks(),
      getLighthouseGuarantee(),
      getScopeEstimatorConfig(),
      getCtaSectionCopy(),
      getCapabilities(),
    ]);

  return (
    <>
      <ServicesPageHero content={servicesHero} />

      <section aria-label="Service details" className="border-t border-border pt-16 pb-24 lg:pb-40">
        <div className="container">
          <div className="flex flex-col gap-4">
            {offerings.map((service, i) => {
              const outcomes = parseOutcomeList(service.outcomesListing);
              return (
                <ScrollReveal key={service.slug} delay={i * 80}>
                  <Link
                    href={service.href}
                    className="service-item block no-underline"
                    aria-label={`Learn about ${service.title}`}
                  >
                    <article className="service-article rounded-lg border border-border bg-surface p-10 transition-[transform,box-shadow,border-color] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)]">
                      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-wrap items-start gap-5">
                          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-md border border-accent-muted bg-accent-subtle text-accent">
                            <ServiceIconGlyph iconKey={service.iconKey} size={24} />
                          </div>
                          <div>
                            <h2 className="font-display mb-1 text-2xl font-light tracking-tight">{service.title}</h2>
                            <p className="text-sm text-accent italic">{service.subtitle}</p>
                          </div>
                        </div>
                        <IconArrowUpRight
                          size={20}
                          className="service-arrow mt-3 shrink-0 text-text-tertiary transition-colors [transition-duration:var(--duration-base)]"
                        />
                      </div>

                      <div className="service-body">
                        <p className="text-base leading-relaxed text-text-secondary">{service.descriptionListing}</p>
                        <ul className="outcomes-list">
                          {outcomes.map((outcome) => (
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
              );
            })}
          </div>
        </div>
      </section>

      <CapabilitiesScroll capabilities={capabilities} />

      <section aria-labelledby="continuity-heading" className="relative overflow-hidden section border-t border-border">
        <FireworksCanvas className="pointer-events-none absolute inset-y-0 right-0 h-full w-[55%]" />
        <div className="container relative z-10">
          <ScrollReveal>
            <p className="text-overline mb-4">{continuityIntro.overline}</p>
            <h2 id="continuity-heading" className="text-h3 mb-4 max-w-[680px]">
              {continuityIntro.heading}
            </h2>
            <p className="mb-12 max-w-[640px] text-sm leading-relaxed text-text-secondary">{continuityIntro.body}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {continuityBlocks.map((block, i) => (
              <ScrollReveal key={block.id} delay={80 + i * 40}>
                <div className="rounded-lg border border-border bg-surface p-8">
                  <h3 className="font-display mb-3 text-lg font-normal tracking-tight text-text-primary">
                    {block.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{block.body}</p>
                </div>
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
                  {guarantee.title}
                </h2>
                <p className="max-w-[600px] text-sm leading-relaxed text-text-secondary">{guarantee.body}</p>
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
                <p className="text-overline mb-5">{estimatorData.sectionOverline}</p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <h2 id="estimator-heading" className="text-h2 mb-6">
                  {estimatorData.headingLine1}
                  <br />
                  <em className="italic-display text-accent">{estimatorData.headingLine2Italic}</em>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <p className="text-body-lg">{estimatorData.body}</p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={120}>
              <ScopeEstimator data={estimatorData} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CtaSection copy={ctaCopy} />
    </>
  );
}
