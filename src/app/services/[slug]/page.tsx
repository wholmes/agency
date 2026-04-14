import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowUpRight, IconCheck } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";
import {
  getCtaSectionCopy,
  getServiceDetailPage,
  getServiceDetailSlugs,
} from "@/lib/cms/queries";
import { appendUtmToUrl, utmFromPrimaryDb } from "@/lib/utm";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getServiceDetailSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServiceDetailPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://brandmeetscode.com/services/${slug}`,
    },
  };
}

export default async function ServiceDetailRoute({ params }: Props) {
  const { slug } = await params;
  const [detail, ctaCopy] = await Promise.all([getServiceDetailPage(slug), getCtaSectionCopy()]);
  if (!detail) notFound();

  const showWho = detail.whoForBullets.length > 0;
  const showIncludedOverline = detail.includedOverline.trim().length > 0;
  const showFaqOverline = detail.faqOverline.trim().length > 0;
  const heroPrimaryHref = appendUtmToUrl(detail.primaryCtaHref, utmFromPrimaryDb(detail));

  return (
    <>
      <section
        aria-labelledby="service-heading"
        className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24"
      >
        {detail.heroHasGradient ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,165,90,0.05)_0%,transparent_60%)]"
          />
        ) : null}
        <div className="container relative">
          <ScrollReveal>
            <Link
              href={detail.backLinkHref}
              className="mb-8 inline-flex items-center gap-2 text-sm text-text-tertiary no-underline transition-colors hover:text-text-secondary"
            >
              {detail.backLinkLabel}
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <p className="text-overline mb-5">{detail.heroOverline}</p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h1 id="service-heading" className="text-h1 mb-6 max-w-[640px]">
              {detail.heroTitle}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg mb-10 max-w-[520px]">{detail.heroBody}</p>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <Link href={heroPrimaryHref} className="btn btn-primary">
              {detail.primaryCtaLabel}
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {showWho ? (
        <section aria-labelledby="who-heading" className="section border-b border-border">
          <div className="container">
            {detail.whoForOverline ? (
              <ScrollReveal>
                <p className="text-overline mb-5">{detail.whoForOverline}</p>
              </ScrollReveal>
            ) : null}
            <ScrollReveal delay={80}>
              <h2 id="who-heading" className="text-h2 mb-8 max-w-[640px]">
                {detail.whoForHeading}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {detail.whoForBullets.map((item, i) => (
                <ScrollReveal key={item} delay={Math.floor(i / 2) * 60}>
                  <div className="flex items-start gap-4 rounded-md border border-border bg-surface p-6">
                    <div className="mt-[0.4em] size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <p className="text-md leading-relaxed text-text-secondary">{item}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="included-heading"
        className={`section border-b border-border${detail.includedSectionBgSurface ? " bg-surface" : ""}`}
      >
        <div className="container">
          {showIncludedOverline ? (
            <ScrollReveal>
              <p className="text-overline mb-5">{detail.includedOverline}</p>
            </ScrollReveal>
          ) : null}
          <ScrollReveal delay={showIncludedOverline ? 80 : 0}>
            <h2 id="included-heading" className={`text-h2 ${detail.includedOverline ? "mb-12" : "mb-10 max-w-[600px]"}`}>
              {detail.includedHeading}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {detail.inclusions.map((item, i) => (
              <ScrollReveal key={item} delay={Math.floor(i / 2) * 40}>
                <div
                  className={`flex items-center gap-4 rounded-md border border-border px-5 py-4 ${
                    detail.includedItemsUseSurfaceBg ? "bg-surface" : "bg-bg"
                  }`}
                >
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
          {showFaqOverline ? (
            <ScrollReveal>
              <p className="text-overline mb-5">{detail.faqOverline}</p>
            </ScrollReveal>
          ) : null}
          <ScrollReveal delay={showFaqOverline ? 80 : 0}>
            <h2 id="faq-heading" className="text-h2 mb-12">
              {detail.faqHeading}
            </h2>
          </ScrollReveal>
          <div className="divide-y divide-border">
            {detail.faqs.map((faq, i) => (
              <ScrollReveal key={faq.question} delay={i * 60}>
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

      <CtaSection copy={ctaCopy} />
    </>
  );
}
