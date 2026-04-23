import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import IndustryDetailHero from "@/components/sections/IndustryDetailHero";
import { getIndustryPage, getIndustrySlugs } from "@/lib/cms/queries";

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
  const url = `https://brandmeetscode.com/industries/${slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: "BrandMeetsCode",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getIndustryPage(slug);
  if (!detail) notFound();

  const showFocus = detail.focusBullets.length > 0;

  return (
    <div className="bg-[#0e0e0e]">
      {/* Noise grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.04,
          mixBlendMode: "overlay",
        }}
      />

      <IndustryDetailHero
        slug={slug}
        heroOverline={detail.heroOverline}
        heroTitle={detail.heroTitle}
        heroBody={detail.heroBody}
        ctaLabel={detail.ctaLabel}
        ctaHref={detail.ctaHref}
      />

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="intro-heading"
        className="py-24"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
          <div className="max-w-[680px]">
            <ScrollReveal>
              <div className="mb-8 flex items-center gap-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Overview
                </p>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              <h2
                id="intro-heading"
                className="mb-6 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-[1.15] tracking-[-0.02em] text-white/90"
              >
                {detail.introTitle}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p className="font-body text-[17px] leading-relaxed text-white/50">
                {detail.introBody}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Focus bullets ─────────────────────────────────────────────────── */}
      {showFocus && (
        <section
          aria-labelledby="focus-heading"
          className="py-24"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <div className="mb-10 flex items-center gap-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Where we focus
                </p>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              <h2
                id="focus-heading"
                className="mb-10 max-w-[580px] font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-[1.15] tracking-[-0.02em] text-white/90"
              >
                {detail.focusTitle}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detail.focusBullets.map((item, i) => (
                <ScrollReveal key={item} delay={Math.floor(i / 2) * 60}>
                  <div
                    className="group flex items-start gap-4 rounded-xl p-6 transition-all duration-200 hover:border-white/[0.1]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {/* Gold dot */}
                    <div
                      className="mt-[5px] size-1.5 shrink-0 rounded-full transition-opacity duration-200 group-hover:opacity-100"
                      style={{ background: "#c9a55a", opacity: 0.5 }}
                      aria-hidden="true"
                    />
                    <p className="font-body text-[15px] leading-relaxed text-white/60">
                      {item}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Differentiator ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="diff-heading"
        className="py-24"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16">
          <div className="max-w-[680px]">
            <ScrollReveal>
              <div className="mb-8 flex items-center gap-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  How we work
                </p>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              <h2
                id="diff-heading"
                className="mb-6 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-[1.15] tracking-[-0.02em] text-white/90"
              >
                {detail.differentiatorTitle}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p className="font-body text-[17px] leading-relaxed text-white/50">
                {detail.differentiatorBody}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </div>
  );
}
