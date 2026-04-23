import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServiceDetailPage,
  getServiceDetailSlugs,
  getCapabilities,
} from "@/lib/cms/queries";
import { appendUtmToUrl, utmFromPrimaryDb } from "@/lib/utm";
import ServiceDetailClient from "./ServiceDetailClient";

// Capability IDs relevant to web design & development
const WEB_CAPABILITY_IDS = new Set([9, 11, 12, 13, 14]); // SaaS, CMS, WP/Drupal, Ecommerce, Gaming
// Capability IDs relevant to analytics & growth
const ANALYTICS_CAPABILITY_IDS = new Set([15, 16, 17, 18, 19]); // GA4+GTM, Attribution, Dashboards, Funnel, Growth Reporting

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
  const url = `https://brandmeetscode.com/services/${slug}`;
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

export default async function ServiceDetailRoute({ params }: Props) {
  const { slug } = await params;
  const needsCapabilities = slug === "web-design" || slug === "analytics-integration";
  const [detail, allCapabilities] = await Promise.all([
    getServiceDetailPage(slug),
    needsCapabilities ? getCapabilities() : Promise.resolve([]),
  ]);
  if (!detail) notFound();

  const heroPrimaryHref = appendUtmToUrl(detail.primaryCtaHref, utmFromPrimaryDb(detail));
  const capabilityIds = slug === "analytics-integration" ? ANALYTICS_CAPABILITY_IDS : WEB_CAPABILITY_IDS;
  const capabilities = allCapabilities.filter((c) => capabilityIds.has(c.id));

  return (
    <ServiceDetailClient
      slug={slug}
      heroOverline={detail.heroOverline}
      heroTitle={detail.heroTitle}
      heroBody={detail.heroBody}
      primaryCtaLabel={detail.primaryCtaLabel}
      primaryCtaHref={heroPrimaryHref}
      backLinkLabel={detail.backLinkLabel}
      backLinkHref={detail.backLinkHref}
      whoForHeading={detail.whoForHeading}
      whoForBullets={detail.whoForBullets}
      includedHeading={detail.includedHeading}
      includedOverline={detail.includedOverline}
      inclusions={detail.inclusions}
      faqHeading={detail.faqHeading}
      faqOverline={detail.faqOverline}
      faqs={detail.faqs}
      capabilities={capabilities}
    />
  );
}
