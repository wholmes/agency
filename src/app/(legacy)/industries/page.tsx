import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import IndustriesHero from "@/components/sections/IndustriesHero";
import { getIndustriesHub, getIndustryPagesForList } from "@/lib/cms/queries";
import { IsoStartups, IsoLifeSciences, IsoLawFirms, IsoRealEstate, IsoRestaurants } from "./IndustryIcons";

const INDUSTRY_ICONS: Record<string, React.ComponentType> = {
  startups:       IsoStartups,
  "life-sciences": IsoLifeSciences,
  "law-firms":    IsoLawFirms,
  "real-estate":  IsoRealEstate,
  restaurants:    IsoRestaurants,
};

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getIndustriesHub();
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: { canonical: "https://brandmeetscode.com/industries" },
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDescription,
      url: "https://brandmeetscode.com/industries",
      siteName: "BrandMeetsCode",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hub.metaTitle,
      description: hub.metaDescription,
    },
  };
}

export default async function IndustriesIndexPage() {
  const [hub, industries] = await Promise.all([
    getIndustriesHub(),
    getIndustryPagesForList(),
  ]);

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

      <IndustriesHero hub={hub} industries={industries} />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-8 md:px-16">

          {/* Section header */}
          <ScrollReveal>
            <div className="mb-12 flex items-center gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Sectors.</p>
              <div className="h-px flex-1 bg-white/[0.05]" />
              <p className="font-mono text-[10px] text-white/25">{industries.length} industries</p>
            </div>
          </ScrollReveal>

          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {industries.map((item, i) => (
              <li key={item.slug}>
                <ScrollReveal delay={i * 60}>
                  <Link
                    href={`/industries/${item.slug}`}
                    className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] p-8 no-underline transition-all duration-500 hover:border-[#c9a55a]/20 hover:shadow-[0_8px_40px_-12px_rgba(201,165,90,0.12)]"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    {/* Icon — absolute top right */}
                    {(() => {
                      const Icon = INDUSTRY_ICONS[item.slug];
                      return Icon ? (
                        <div className="pointer-events-none absolute -top-4 -right-4 opacity-60 transition-opacity duration-300 group-hover:opacity-90">
                          <Icon />
                        </div>
                      ) : null;
                    })()}

                    {/* Index + arrow — top */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.25em] text-white/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex size-7 items-center justify-center rounded-full border border-white/[0.08] text-white/20 transition-all duration-300 group-hover:border-[#c9a55a]/30 group-hover:text-[#c9a55a]">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Spacer pushes content to bottom */}
                    <div className="flex-1" />

                    {/* Bottom content */}
                    <div className="pr-44">
                      <h2 className="mb-2 font-sans text-[20px] font-normal leading-snug tracking-[-0.02em] text-white/75 transition-colors duration-300 group-hover:text-white">
                        {item.listTitle}
                      </h2>
                      <p className="mb-6 text-[13px] leading-[1.7] text-white/35">
                        {item.listBlurb}
                      </p>
                      <div className="border-t border-white/[0.05] pt-5">
                        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a55a]/40 transition-all duration-300 group-hover:gap-3 group-hover:text-[#c9a55a]">
                          {hub.cardCtaLabel}
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
