import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";
import IndustryDetailHero from "@/components/sections/IndustryDetailHero";
import { getCtaSectionCopy, getIndustryPage, getIndustrySlugs } from "@/lib/cms/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getIndustrySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getIndustryPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://brandmeetscode.com/industries/${slug}`,
    },
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [detail, ctaCopy] = await Promise.all([getIndustryPage(slug), getCtaSectionCopy()]);
  if (!detail) notFound();

  const showFocus = detail.focusBullets.length > 0;

  return (
    <>
      <IndustryDetailHero
        heroOverline={detail.heroOverline}
        heroTitle={detail.heroTitle}
        heroBody={detail.heroBody}
        ctaLabel={detail.ctaLabel}
        ctaHref={detail.ctaHref}
      />

      <section aria-labelledby="intro-heading" className="section border-b border-border">
        <div className="container max-w-[720px]">
          <ScrollReveal>
            <h2 id="intro-heading" className="text-h2 mb-8">
              {detail.introTitle}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="text-body-lg text-text-secondary">{detail.introBody}</p>
          </ScrollReveal>
        </div>
      </section>

      {showFocus ? (
        <section aria-labelledby="focus-heading" className="section border-b border-border">
          <div className="container">
            <ScrollReveal>
              <h2 id="focus-heading" className="text-h2 mb-10 max-w-[640px]">
                {detail.focusTitle}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {detail.focusBullets.map((item, i) => (
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

      <section aria-labelledby="diff-heading" className="section border-b border-border">
        <div className="container max-w-[720px]">
          <ScrollReveal>
            <h2 id="diff-heading" className="text-h2 mb-8">
              {detail.differentiatorTitle}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="text-body-lg text-text-secondary">{detail.differentiatorBody}</p>
          </ScrollReveal>
        </div>
      </section>

      <CtaSection copy={ctaCopy} />
    </>
  );
}
