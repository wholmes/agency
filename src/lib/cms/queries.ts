import { cache } from "react";
import type { Project } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import type { ContactFormConfigParsed } from "@/lib/cms/contact-form-types";
import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";
import type { ScopeEstimatorData } from "@/lib/cms/scope-estimator-types";

function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function parseJsonObject<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type ServiceFaq = { question: string; answer: string };

function parseServiceFaqs(raw: string): ServiceFaq[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.map((item) => ({
      question: String((item as { question?: unknown }).question ?? ""),
      answer: String((item as { answer?: unknown }).answer ?? ""),
    }));
  } catch {
    return [];
  }
}

export const getServiceDetailPage = cache(async (slug: string) => {
  const row = await prisma.serviceDetailPage.findUnique({ where: { slug } });
  if (!row) return null;
  return {
    ...row,
    whoForBullets: parseJsonArray(row.whoForBullets),
    inclusions: parseJsonArray(row.inclusions),
    faqs: parseServiceFaqs(row.faqs),
  };
});

export type ServiceDetailPageData = NonNullable<Awaited<ReturnType<typeof getServiceDetailPage>>>;

export const getServiceDetailSlugs = cache(async (): Promise<string[]> => {
  const rows = await prisma.serviceDetailPage.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
});

export const getIndustriesHub = cache(async () => {
  return prisma.industriesHub.findUniqueOrThrow({ where: { id: 1 } });
});

export const getIndustrySlugs = cache(async (): Promise<string[]> => {
  const rows = await prisma.industryPage.findMany({ select: { slug: true }, orderBy: { sortOrder: "asc" } });
  return rows.map((r) => r.slug);
});

export const getIndustryPagesForList = cache(async () => {
  return prisma.industryPage.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, listTitle: true, listBlurb: true },
  });
});

export const getIndustryPage = cache(async (slug: string) => {
  const row = await prisma.industryPage.findUnique({ where: { slug } });
  if (!row) return null;
  return {
    ...row,
    focusBullets: parseJsonArray(row.focusBullets),
  };
});

export type IndustryPageData = NonNullable<Awaited<ReturnType<typeof getIndustryPage>>>;

export const getServicesContinuityIntro = cache(async () => {
  return prisma.servicesContinuityIntro.findUniqueOrThrow({ where: { id: 1 } });
});

function scopeRowToData(row: {
  sectionOverline: string;
  headingLine1: string;
  headingLine2Italic: string;
  body: string;
  projectTypes: string;
  pageCounts: string;
  integrations: string;
  timelines: string;
  weeksByTimelineId: string;
  stepTitles: string;
  integrationsHint: string;
  resultOverline: string;
  resultDisclaimer: string;
  stepTemplate: string;
  rangeLowMultiplier: number;
  rangeHighMultiplier: number;
  roundingIncrement: number;
}): ScopeEstimatorData {
  const emptySteps = {
    type: "",
    pages: "",
    integrations: "",
    integrationsSub: "",
    timeline: "",
    continueLabel: "",
    startOver: "Start over",
    ctaStartProject: "Start a Project",
    estimateTagline: "All-in estimate",
  };
  return {
    sectionOverline: row.sectionOverline,
    headingLine1: row.headingLine1,
    headingLine2Italic: row.headingLine2Italic,
    body: row.body,
    projectTypes: parseJsonObject(row.projectTypes, [] as ScopeEstimatorData["projectTypes"]),
    pageCounts: parseJsonObject(row.pageCounts, [] as ScopeEstimatorData["pageCounts"]),
    integrations: parseJsonObject(row.integrations, [] as ScopeEstimatorData["integrations"]),
    timelines: parseJsonObject(row.timelines, [] as ScopeEstimatorData["timelines"]),
    weeksByTimelineId: parseJsonObject(row.weeksByTimelineId, {} as Record<string, string>),
    stepTitles: parseJsonObject(row.stepTitles, emptySteps),
    integrationsHint: row.integrationsHint,
    resultOverline: row.resultOverline,
    resultDisclaimer: row.resultDisclaimer,
    stepTemplate: row.stepTemplate,
    rangeLowMultiplier: row.rangeLowMultiplier,
    rangeHighMultiplier: row.rangeHighMultiplier,
    roundingIncrement: row.roundingIncrement,
  };
}

export const getScopeEstimatorConfig = cache(async (): Promise<ScopeEstimatorData> => {
  const row = await prisma.scopeEstimatorConfig.findUniqueOrThrow({ where: { id: 1 } });
  return scopeRowToData(row);
});

export const getAboutStorySection = cache(async () => {
  return prisma.aboutStorySection.findUniqueOrThrow({ where: { id: 1 } });
});

export const getAboutValuesSectionHeader = cache(async () => {
  return prisma.aboutValuesSectionHeader.findUniqueOrThrow({ where: { id: 1 } });
});

export type ContactNextStep = { step: string; text: string };

function parseContactNextSteps(raw: string): ContactNextStep[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.map((item) => ({
      step: String((item as { step?: unknown }).step ?? ""),
      text: String((item as { text?: unknown }).text ?? ""),
    }));
  } catch {
    return [];
  }
}

export const getContactPageCopy = cache(async () => {
  const row = await prisma.contactPageCopy.findUniqueOrThrow({ where: { id: 1 } });
  return { ...row, nextSteps: parseContactNextSteps(row.nextSteps) };
});

export const getCaseStudyUiLabels = cache(async () => {
  return prisma.caseStudyUiLabels.findUniqueOrThrow({ where: { id: 1 } });
});

export const getContactFormConfig = cache(async (): Promise<ContactFormConfigParsed> => {
  const row = await prisma.contactFormConfig.findUniqueOrThrow({ where: { id: 1 } });
  return parseJsonObject(row.configJson, {} as ContactFormConfigParsed);
});

export const getSiteChrome = cache(async (): Promise<SiteChromeConfigParsed> => {
  const row = await prisma.siteChrome.findUniqueOrThrow({ where: { id: 1 } });
  return parseJsonObject(row.configJson, {} as SiteChromeConfigParsed);
});

function projectRowToProject(row: {
  id: string;
  title: string;
  category: string;
  proofFit: string;
  year: string;
  result: string;
  resultDetail: string;
  problem: string;
  approach: string;
  outcome: string;
  color: string;
  accent: string;
  services: string;
}): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    proofFit: row.proofFit,
    year: row.year,
    result: row.result,
    resultDetail: row.resultDetail,
    problem: row.problem,
    approach: row.approach,
    outcome: row.outcome,
    color: row.color,
    accent: row.accent,
    services: parseJsonArray(row.services),
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(projectRowToProject);
});

/** Admin-only: returns all projects regardless of published state */
export const getAllProjectsForAdmin = cache(async () => {
  return prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getProject = cache(async (id: string): Promise<Project | undefined> => {
  const row = await prisma.project.findUnique({ where: { id } });
  return row ? projectRowToProject(row) : undefined;
});

export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
});

export const getSeoSettings = cache(async () => {
  return prisma.seoSettings.findUniqueOrThrow({ where: { id: 1 } });
});

export const getSocialStats = cache(async () => {
  return prisma.socialStat.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getSocialClients = cache(async () => {
  return prisma.socialClient.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getFeaturedTestimonial = cache(async () => {
  return prisma.featuredTestimonial.findUniqueOrThrow({ where: { id: 1 } });
});

export type ServiceOfferingRow = Awaited<ReturnType<typeof getServiceOfferings>>[number];

export const getServiceOfferings = cache(async () => {
  return prisma.serviceOffering.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getServiceOfferingsForHome = cache(async () => {
  return prisma.serviceOffering.findMany({
    where: { showOnHomepage: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getContinuityBlocks = cache(async () => {
  return prisma.continuityBlock.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getLighthouseGuarantee = cache(async () => {
  return prisma.lighthouseGuarantee.findUniqueOrThrow({ where: { id: 1 } });
});

export const getHomeHero = cache(async () => {
  return prisma.homeHero.findUniqueOrThrow({ where: { id: 1 } });
});

export const getWorkPageHero = cache(async () => {
  return prisma.workPageHero.findUniqueOrThrow({ where: { id: 1 } });
});

export const getServicesPageHero = cache(async () => {
  return prisma.servicesPageHero.findUniqueOrThrow({ where: { id: 1 } });
});

export const getServicesHomeSection = cache(async () => {
  return prisma.servicesHomeSection.findUniqueOrThrow({ where: { id: 1 } });
});

export const getFooterCopy = cache(async () => {
  return prisma.footerCopy.findUniqueOrThrow({ where: { id: 1 } });
});

export const getAboutValues = cache(async () => {
  return prisma.aboutValue.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getAboutStoryParagraphs = cache(async () => {
  return prisma.aboutStoryParagraph.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getAboutTeaserBeliefs = cache(async () => {
  return prisma.aboutTeaserBelief.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getAboutTeaserCard = cache(async () => {
  return prisma.aboutTeaserCard.findUniqueOrThrow({ where: { id: 1 } });
});

export const getAboutPageHero = cache(async () => {
  return prisma.aboutPageHero.findUniqueOrThrow({ where: { id: 1 } });
});

export const getWorkPreviewSection = cache(async () => {
  return prisma.workPreviewSection.findUniqueOrThrow({ where: { id: 1 } });
});

export const getCtaSectionCopy = cache(async () => {
  return prisma.ctaSectionCopy.findUniqueOrThrow({ where: { id: 1 } });
});

export const getAboutHomeTeaser = cache(async () => {
  return prisma.aboutHomeTeaser.findUniqueOrThrow({ where: { id: 1 } });
});

// ── Blog ────────────────────────────────────────────────────────────────────

function parseTags(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function blogRowToPost(row: {
  id: string;
  slug: string;
  status: string;
  featured: boolean;
  sortOrder: number;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  authorTitle: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return { ...row, tags: parseTags(row.tags) };
}

export type BlogPostData = ReturnType<typeof blogRowToPost>;

export const getBlogPosts = cache(async () => {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { sortOrder: "asc" }],
  });
  return rows.map(blogRowToPost);
});

export const getBlogPost = cache(async (slug: string) => {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  return row ? blogRowToPost(row) : null;
});

export const getBlogPostSlugs = cache(async (): Promise<string[]> => {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
});

export const getAllBlogPostsForAdmin = cache(async () => {
  const rows = await prisma.blogPost.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  return rows.map(blogRowToPost);
});

// ── Redirects ────────────────────────────────────────────────────────────────

export const getAllRedirectsForAdmin = cache(async () => {
  return prisma.redirect.findMany({ orderBy: { id: "asc" } });
});

export const getTeamMembers = cache(async () => {
  return prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getAllTeamMembersForAdmin = cache(async () => {
  return prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
});

export const getCapabilities = cache(async () => {
  return prisma.capability.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getAllCapabilitiesForAdmin = cache(async () => {
  return prisma.capability.findMany({ orderBy: { sortOrder: "asc" } });
});
