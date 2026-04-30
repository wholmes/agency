import type { MetadataRoute } from "next";
import {
  getBlogPostsForSitemap,
  getIndustrySlugs,
  getPublishedProjectIdsForSitemap,
  getServiceDetailSlugs,
} from "@/lib/cms/queries";
import { getPublicSiteUrl } from "@/lib/site-url";

/** Regenerate periodically so new posts/services appear without redeploy-only updates */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicSiteUrl();
  const fallbackModified = new Date();

  const [projectIds, serviceSlugs, industrySlugs, blogRows] = await Promise.all([
    getPublishedProjectIdsForSitemap(),
    getServiceDetailSlugs(),
    getIndustrySlugs(),
    getBlogPostsForSitemap().catch(() => []),
  ]);

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: fallbackModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industrySlugs.map((slug) => ({
    url: `${baseUrl}/industries/${slug}`,
    lastModified: fallbackModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: fallbackModified, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: fallbackModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: fallbackModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified: fallbackModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/about`, lastModified: fallbackModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: fallbackModified, changeFrequency: "yearly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: fallbackModified, changeFrequency: "weekly", priority: 0.85 },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogRows.map((row) => {
    const lastModified = row.publishedAt ?? row.updatedAt ?? fallbackModified;
    return {
      url: `${baseUrl}/blog/${row.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  const workEntries: MetadataRoute.Sitemap = projectIds.map((id) => ({
    url: `${baseUrl}/work/${id}`,
    lastModified: fallbackModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...servicePages, ...industryPages, ...workEntries, ...blogEntries];
}
