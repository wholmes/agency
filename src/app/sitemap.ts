import type { MetadataRoute } from "next";
import { getBlogPostSlugs, getIndustrySlugs, getProjects, getServiceDetailSlugs } from "@/lib/cms/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://brandmeetscode.com";
  const lastModified = new Date();
  const [projects, serviceSlugs, industrySlugs, blogSlugs] = await Promise.all([
    getProjects(),
    getServiceDetailSlugs(),
    getIndustrySlugs(),
    getBlogPostSlugs().catch(() => []),
  ]);

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industrySlugs.map((slug) => ({
    url: `${baseUrl}/industries/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "yearly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.85 },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const workEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/work/${p.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...servicePages, ...industryPages, ...workEntries, ...blogEntries];
}
