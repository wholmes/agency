import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getIndustriesHub, getIndustryPagesForList } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getIndustriesHub();
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: {
      canonical: "https://brandmeetscode.com/industries",
    },
  };
}

export default async function IndustriesIndexPage() {
  const [hub, industries] = await Promise.all([getIndustriesHub(), getIndustryPagesForList()]);

  return (
    <section className="section border-b border-border pt-[calc(var(--nav-height)+4rem)]">
      <div className="container">
        <ScrollReveal>
          <p className="text-overline mb-5">{hub.overline}</p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <h1 className="text-h1 mb-6 max-w-[640px]">{hub.headline}</h1>
        </ScrollReveal>
        <ScrollReveal delay={140}>
          <p className="text-body-lg mb-14 max-w-[560px] text-text-secondary">{hub.introBody}</p>
        </ScrollReveal>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {industries.map((item, i) => (
            <li key={item.slug}>
              <ScrollReveal delay={i * 60}>
                <Link
                  href={`/industries/${item.slug}`}
                  className="group block rounded-lg border border-border bg-surface p-8 no-underline transition-colors hover:border-accent-muted"
                >
                  <h2 className="font-display mb-3 text-xl font-normal tracking-tight text-text-primary group-hover:text-accent">
                    {item.listTitle}
                  </h2>
                  <p className="text-sm leading-relaxed text-text-secondary">{item.listBlurb}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-accent">
                    {hub.cardCtaLabel}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
