import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowUpRight } from "@/components/icons";
import ScrollReveal from "@/components/ScrollReveal";
import CtaSection from "@/components/sections/CtaSection";
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
      <section
        aria-labelledby="industry-heading"
        className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24"
      >
        <div className="container relative">
          <ScrollReveal>
            <Link
              href="/industries"
              className="mb-8 inline-flex items-center gap-2 text-sm text-text-tertiary no-underline transition-colors hover:text-text-secondary"
            >
              ← Industries
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <p className="text-overline mb-5">{detail.heroOverline}</p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <h1 id="industry-heading" className="text-h1 mb-6 max-w-[640px]">
              {detail.heroTitle}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-body-lg mb-10 max-w-[560px]">{detail.heroBody}</p>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <Link href={detail.ctaHref} className="btn btn-primary">
              {detail.ctaLabel}
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

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
