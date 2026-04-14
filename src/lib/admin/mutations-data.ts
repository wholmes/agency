"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin/require-admin";
import type { ContactFormConfigParsed } from "@/lib/cms/contact-form-types";

function parseJsonField(raw: string, fallback: unknown): string {
  try {
    const v = JSON.parse(raw) as unknown;
    return JSON.stringify(v);
  } catch {
    return JSON.stringify(fallback);
  }
}

// --- Social & home proof ---

export async function updateFeaturedTestimonial(formData: FormData) {
  await requireAdminSession();
  await prisma.featuredTestimonial.update({
    where: { id: 1 },
    data: {
      quote: String(formData.get("quote") ?? ""),
      authorName: String(formData.get("authorName") ?? ""),
      authorTitle: String(formData.get("authorTitle") ?? ""),
      authorInitials: String(formData.get("authorInitials") ?? ""),
      starCount: Math.min(5, Math.max(1, Number(formData.get("starCount") ?? 5))),
    },
  });
  revalidatePath("/");
}

export async function updateSocialStat(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.socialStat.update({
    where: { id },
    data: {
      value: String(formData.get("value") ?? ""),
      label: String(formData.get("label") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  revalidatePath("/");
}

export async function updateSocialClient(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.socialClient.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      context: String(formData.get("context") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  revalidatePath("/");
}

export async function updateAboutHomeTeaser(formData: FormData) {
  await requireAdminSession();
  await prisma.aboutHomeTeaser.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      headingBeforeEm: String(formData.get("headingBeforeEm") ?? ""),
      headingEmphasis: String(formData.get("headingEmphasis") ?? ""),
      headingMid: String(formData.get("headingMid") ?? ""),
      headingLastLine: String(formData.get("headingLastLine") ?? ""),
      paragraph1: String(formData.get("paragraph1") ?? ""),
      paragraph2: String(formData.get("paragraph2") ?? ""),
    },
  });
  revalidatePath("/");
}

// --- Work listing & labels ---

export async function updateWorkPageHero(formData: FormData) {
  await requireAdminSession();
  await prisma.workPageHero.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      headlineLine1: String(formData.get("headlineLine1") ?? ""),
      headlineLine2Italic: String(formData.get("headlineLine2Italic") ?? ""),
      body: String(formData.get("body") ?? ""),
    },
  });
  revalidatePath("/work");
  revalidatePath("/");
}

export async function updateWorkPreviewSection(formData: FormData) {
  await requireAdminSession();
  await prisma.workPreviewSection.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      headingLine1: String(formData.get("headingLine1") ?? ""),
      headingEmphasis: String(formData.get("headingEmphasis") ?? ""),
    },
  });
  revalidatePath("/");
}

export async function updateCaseStudyUiLabels(formData: FormData) {
  await requireAdminSession();
  await prisma.caseStudyUiLabels.update({
    where: { id: 1 },
    data: {
      backToWorkLabel: String(formData.get("backToWorkLabel") ?? ""),
      backToCaseStudiesLabel: String(formData.get("backToCaseStudiesLabel") ?? ""),
      problemSectionLabel: String(formData.get("problemSectionLabel") ?? ""),
      approachSectionLabel: String(formData.get("approachSectionLabel") ?? ""),
      outcomeSectionLabel: String(formData.get("outcomeSectionLabel") ?? ""),
      similarProjectCtaLabel: String(formData.get("similarProjectCtaLabel") ?? ""),
    },
  });
  revalidatePath("/work", "layout");
}

// --- Services hub ---

export async function updateServicesPageHero(formData: FormData) {
  await requireAdminSession();
  await prisma.servicesPageHero.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
    },
  });
  revalidatePath("/services");
}

export async function updateServicesHomeSection(formData: FormData) {
  await requireAdminSession();
  await prisma.servicesHomeSection.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      headingLine1: String(formData.get("headingLine1") ?? ""),
      headingEmphasis: String(formData.get("headingEmphasis") ?? ""),
      footerBeforeHighlight: String(formData.get("footerBeforeHighlight") ?? ""),
      footerHighlight: String(formData.get("footerHighlight") ?? ""),
      footerAfterHighlightBeforeLink: String(formData.get("footerAfterHighlightBeforeLink") ?? ""),
      footerLinkLabel: String(formData.get("footerLinkLabel") ?? ""),
      footerLinkHref: String(formData.get("footerLinkHref") ?? ""),
      footerAfterLink: String(formData.get("footerAfterLink") ?? ""),
    },
  });
  revalidatePath("/");
}

export async function updateServicesContinuityIntro(formData: FormData) {
  await requireAdminSession();
  await prisma.servicesContinuityIntro.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      heading: String(formData.get("heading") ?? ""),
      body: String(formData.get("body") ?? ""),
    },
  });
  revalidatePath("/services");
}

export async function updateLighthouseGuarantee(formData: FormData) {
  await requireAdminSession();
  await prisma.lighthouseGuarantee.update({
    where: { id: 1 },
    data: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
    },
  });
  revalidatePath("/services");
}

export async function updateContinuityBlock(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.continuityBlock.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  revalidatePath("/services");
}

export async function updateScopeEstimatorConfig(formData: FormData) {
  await requireAdminSession();
  await prisma.scopeEstimatorConfig.update({
    where: { id: 1 },
    data: {
      sectionOverline: String(formData.get("sectionOverline") ?? ""),
      headingLine1: String(formData.get("headingLine1") ?? ""),
      headingLine2Italic: String(formData.get("headingLine2Italic") ?? ""),
      body: String(formData.get("body") ?? ""),
      projectTypes: parseJsonField(String(formData.get("projectTypes") ?? "[]"), []),
      pageCounts: parseJsonField(String(formData.get("pageCounts") ?? "[]"), []),
      integrations: parseJsonField(String(formData.get("integrations") ?? "[]"), []),
      timelines: parseJsonField(String(formData.get("timelines") ?? "[]"), []),
      weeksByTimelineId: parseJsonField(String(formData.get("weeksByTimelineId") ?? "{}"), {}),
      stepTitles: parseJsonField(String(formData.get("stepTitles") ?? "{}"), {}),
      integrationsHint: String(formData.get("integrationsHint") ?? ""),
      resultOverline: String(formData.get("resultOverline") ?? ""),
      resultDisclaimer: String(formData.get("resultDisclaimer") ?? ""),
      stepTemplate: String(formData.get("stepTemplate") ?? ""),
    },
  });
  revalidatePath("/services");
}

// --- Service offerings ---

export async function updateServiceOffering(id: number, formData: FormData) {
  await requireAdminSession();
  const outcomesHome = parseJsonField(String(formData.get("outcomesHome") ?? "[]"), []);
  const outcomesListing = parseJsonField(String(formData.get("outcomesListing") ?? "[]"), []);
  await prisma.serviceOffering.update({
    where: { id },
    data: {
      slug: String(formData.get("slug") ?? ""),
      iconKey: String(formData.get("iconKey") ?? "design"),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      number: String(formData.get("number") ?? "") || null,
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? "") || null,
      descriptionHome: String(formData.get("descriptionHome") ?? ""),
      outcomesHome,
      descriptionListing: String(formData.get("descriptionListing") ?? ""),
      outcomesListing,
      href: String(formData.get("href") ?? ""),
      showOnHomepage: formData.get("showOnHomepage") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/services");
}

// --- Service detail page (by slug) ---

export async function updateServiceDetailPage(slug: string, formData: FormData) {
  await requireAdminSession();
  const whoForBullets = parseJsonField(String(formData.get("whoForBullets") ?? "[]"), []);
  const inclusions = parseJsonField(String(formData.get("inclusions") ?? "[]"), []);
  const faqs = parseJsonField(String(formData.get("faqs") ?? "[]"), []);
  await prisma.serviceDetailPage.update({
    where: { slug },
    data: {
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      heroHasGradient: formData.get("heroHasGradient") === "on",
      heroOverline: String(formData.get("heroOverline") ?? ""),
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroBody: String(formData.get("heroBody") ?? ""),
      primaryCtaLabel: String(formData.get("primaryCtaLabel") ?? ""),
      primaryCtaHref: String(formData.get("primaryCtaHref") ?? ""),
      backLinkLabel: String(formData.get("backLinkLabel") ?? ""),
      backLinkHref: String(formData.get("backLinkHref") ?? "/services"),
      whoForOverline: String(formData.get("whoForOverline") ?? ""),
      whoForHeading: String(formData.get("whoForHeading") ?? ""),
      whoForBullets,
      includedOverline: String(formData.get("includedOverline") ?? ""),
      includedHeading: String(formData.get("includedHeading") ?? ""),
      includedSectionBgSurface: formData.get("includedSectionBgSurface") === "on",
      includedItemsUseSurfaceBg: formData.get("includedItemsUseSurfaceBg") === "on",
      inclusions,
      faqOverline: String(formData.get("faqOverline") ?? ""),
      faqHeading: String(formData.get("faqHeading") ?? ""),
      faqs,
    },
  });
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
}

// --- About ---

export async function updateAboutPageHero(formData: FormData) {
  await requireAdminSession();
  await prisma.aboutPageHero.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      line1: String(formData.get("line1") ?? ""),
      line2: String(formData.get("line2") ?? ""),
      line3BeforeEm: String(formData.get("line3BeforeEm") ?? ""),
      line3Em: String(formData.get("line3Em") ?? ""),
      body: String(formData.get("body") ?? ""),
    },
  });
  revalidatePath("/about");
}

export async function updateAboutStorySection(formData: FormData) {
  await requireAdminSession();
  await prisma.aboutStorySection.update({
    where: { id: 1 },
    data: {
      headingBeforeEm: String(formData.get("headingBeforeEm") ?? ""),
      headingEm: String(formData.get("headingEm") ?? ""),
      headingAfterEm: String(formData.get("headingAfterEm") ?? ""),
      bmcMonogram: String(formData.get("bmcMonogram") ?? ""),
      bmcTagline: String(formData.get("bmcTagline") ?? ""),
    },
  });
  revalidatePath("/about");
}

export async function updateAboutStoryParagraph(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.aboutStoryParagraph.update({
    where: { id },
    data: {
      body: String(formData.get("body") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  revalidatePath("/about");
}

export async function updateAboutValuesSectionHeader(formData: FormData) {
  await requireAdminSession();
  await prisma.aboutValuesSectionHeader.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      heading: String(formData.get("heading") ?? ""),
    },
  });
  revalidatePath("/about");
}

export async function updateAboutValue(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.aboutValue.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  revalidatePath("/about");
}

export async function updateAboutTeaserBelief(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await prisma.aboutTeaserBelief.update({
    where: { id },
    data: {
      text: String(formData.get("text") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    },
  });
  revalidatePath("/");
}

export async function updateAboutTeaserCard(formData: FormData) {
  await requireAdminSession();
  await prisma.aboutTeaserCard.update({
    where: { id: 1 },
    data: {
      body: String(formData.get("body") ?? ""),
      ctaLabel: String(formData.get("ctaLabel") ?? ""),
      ctaHref: String(formData.get("ctaHref") ?? ""),
    },
  });
  revalidatePath("/about");
}

// --- Contact ---

export async function updateContactPageCopy(formData: FormData) {
  await requireAdminSession();
  const nextSteps = parseJsonField(String(formData.get("nextSteps") ?? "[]"), []);
  await prisma.contactPageCopy.update({
    where: { id: 1 },
    data: {
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      overline: String(formData.get("overline") ?? ""),
      heroLineBeforeEm: String(formData.get("heroLineBeforeEm") ?? ""),
      heroEmphasis: String(formData.get("heroEmphasis") ?? ""),
      heroLineAfterEm: String(formData.get("heroLineAfterEm") ?? ""),
      introParagraph: String(formData.get("introParagraph") ?? ""),
      whatHappensHeading: String(formData.get("whatHappensHeading") ?? ""),
      nextSteps,
      altRoutesHeading: String(formData.get("altRoutesHeading") ?? ""),
      emailCardTitle: String(formData.get("emailCardTitle") ?? ""),
      calendarCardTitle: String(formData.get("calendarCardTitle") ?? ""),
      calendarCardSubtitle: String(formData.get("calendarCardSubtitle") ?? ""),
      calendlyUrl: String(formData.get("calendlyUrl") ?? ""),
    },
  });
  revalidatePath("/contact");
}

export type ContactFormJsonState = { error?: string } | null;

export async function updateContactFormJson(
  _prev: ContactFormJsonState,
  formData: FormData,
): Promise<ContactFormJsonState> {
  await requireAdminSession();
  const raw = String(formData.get("configJson") ?? "");
  let parsed: ContactFormConfigParsed;
  try {
    parsed = JSON.parse(raw) as ContactFormConfigParsed;
  } catch {
    return { error: "Invalid JSON." };
  }
  if (!parsed.labels || !parsed.budgetOptions) {
    return { error: "JSON must include labels and budgetOptions." };
  }
  await prisma.contactFormConfig.update({
    where: { id: 1 },
    data: { configJson: JSON.stringify(parsed) },
  });
  revalidatePath("/contact");
  return null;
}

// --- Industry / vertical pages ---

export async function updateIndustriesHub(formData: FormData) {
  await requireAdminSession();
  await prisma.industriesHub.update({
    where: { id: 1 },
    data: {
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      overline: String(formData.get("overline") ?? ""),
      headline: String(formData.get("headline") ?? ""),
      introBody: String(formData.get("introBody") ?? ""),
      cardCtaLabel: String(formData.get("cardCtaLabel") ?? ""),
    },
  });
  revalidatePath("/industries");
}

const RESERVED_INDUSTRY_SLUGS = new Set(["new", "edit", "admin", "api"]);

function normalizeIndustrySlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function defaultIndustryPageFields(listTitle: string) {
  const label = listTitle.trim() || "This industry";
  return {
    metaTitle: `${label} — BrandMeetsCode`,
    metaDescription: `How BrandMeetsCode partners with ${label} teams. Edit this page in the CMS to replace this placeholder.`,
    heroOverline: "Focus area",
    heroTitle: `Digital work for ${label}`,
    heroBody:
      "Replace this with your positioning: who you serve, what problems you solve, and what outcomes you optimize for. Everything here is editable in Admin → Industries.",
    introTitle: `Why ${label} teams work with us`,
    introBody:
      "Add your story here—constraints of the vertical, how you engage, and what a successful engagement looks like.",
    focusTitle: "Where we typically plug in",
    focusBullets: JSON.stringify([
      "First concrete way you help (edit in CMS)",
      "Second focus area",
      "Third focus area",
    ]),
    differentiatorTitle: "How we work with teams like yours",
    differentiatorBody:
      "Describe your process, cadence, and what makes working with you different. Short feedback loops and explicit tradeoffs work well here.",
    ctaLabel: "Start a project",
    ctaHref: "/contact",
  };
}

export type CreateIndustryState = { error?: string } | null;

export async function createIndustryPage(
  _prev: CreateIndustryState,
  formData: FormData,
): Promise<CreateIndustryState> {
  await requireAdminSession();

  const listTitle = String(formData.get("listTitle") ?? "").trim();
  if (!listTitle) {
    return { error: "List title is required." };
  }

  const slug = normalizeIndustrySlug(String(formData.get("slug") ?? ""));
  if (!slug) {
    return { error: "URL slug is required (letters, numbers, and hyphens only)." };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and single hyphens between words." };
  }
  if (slug.length > 64) {
    return { error: "Slug must be 64 characters or fewer." };
  }
  if (RESERVED_INDUSTRY_SLUGS.has(slug)) {
    return { error: "That slug is reserved. Choose another." };
  }

  const existing = await prisma.industryPage.findUnique({ where: { slug } });
  if (existing) {
    return { error: "An industry with this slug already exists." };
  }

  const listBlurbRaw = String(formData.get("listBlurb") ?? "").trim();
  const listBlurb =
    listBlurbRaw ||
    `Placeholder blurb for ${listTitle}. Edit the list card and full page copy in the CMS.`;

  const maxRow = await prisma.industryPage.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxRow._max.sortOrder ?? -1) + 1;

  const defaults = defaultIndustryPageFields(listTitle);

  await prisma.industryPage.create({
    data: {
      slug,
      sortOrder,
      listTitle,
      listBlurb,
      ...defaults,
    },
  });

  revalidatePath("/industries");
  revalidatePath(`/industries/${slug}`);
  revalidatePath("/admin/industries");
  redirect(`/admin/industries/${slug}?toast=industry-created`);
}

// --- Projects ---

export async function toggleProjectPublished(id: string) {
  await requireAdminSession();
  const project = await prisma.project.findUniqueOrThrow({ where: { id } });
  await prisma.project.update({
    where: { id },
    data: { published: !project.published },
  });
  revalidatePath("/work");
  revalidatePath(`/work/${id}`);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function moveProjectUp(id: string) {
  await requireAdminSession();
  const current = await prisma.project.findUniqueOrThrow({ where: { id } });
  const above = await prisma.project.findFirst({
    where: { sortOrder: { lt: current.sortOrder } },
    orderBy: { sortOrder: "desc" },
  });
  if (!above) return;
  await prisma.$transaction([
    prisma.project.update({ where: { id: current.id }, data: { sortOrder: above.sortOrder } }),
    prisma.project.update({ where: { id: above.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  revalidatePath("/work");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function moveProjectDown(id: string) {
  await requireAdminSession();
  const current = await prisma.project.findUniqueOrThrow({ where: { id } });
  const below = await prisma.project.findFirst({
    where: { sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: "asc" },
  });
  if (!below) return;
  await prisma.$transaction([
    prisma.project.update({ where: { id: current.id }, data: { sortOrder: below.sortOrder } }),
    prisma.project.update({ where: { id: below.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  revalidatePath("/work");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export type CreateProjectState = { error?: string } | null;

export async function createProject(
  _prev: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (!id) return { error: "ID is required." };
  if (!/^[a-z0-9-]+$/.test(id)) return { error: "ID may only contain lowercase letters, numbers, and hyphens." };

  const existing = await prisma.project.findUnique({ where: { id } });
  if (existing) return { error: `A case study with ID "${id}" already exists.` };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const maxOrder = await prisma.project.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  await prisma.project.create({
    data: {
      id,
      title,
      category: String(formData.get("category") ?? ""),
      proofFit: String(formData.get("proofFit") ?? ""),
      year: String(formData.get("year") ?? new Date().getFullYear().toString()),
      result: String(formData.get("result") ?? ""),
      resultDetail: String(formData.get("resultDetail") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      approach: String(formData.get("approach") ?? ""),
      outcome: String(formData.get("outcome") ?? ""),
      color: String(formData.get("color") ?? "#1a1a18"),
      accent: String(formData.get("accent") ?? "#c9a55a"),
      services: "[]",
      sortOrder,
    },
  });

  revalidatePath("/work");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${id}?toast=project-created`);
}

// --- SEO settings ---

export async function updateSeoSettings(formData: FormData) {
  await requireAdminSession();
  const data = {
    siteTitle: String(formData.get("siteTitle") ?? ""),
    titleTemplate: String(formData.get("titleTemplate") ?? "%s | BrandMeetsCode"),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    googleAnalyticsId: String(formData.get("googleAnalyticsId") ?? "").trim(),
    googleAnalyticsApiSecret: String(formData.get("googleAnalyticsApiSecret") ?? "").trim(),
    googleTagManagerId: String(formData.get("googleTagManagerId") ?? "").trim(),
    noIndex: formData.get("noIndex") === "on",
  };
  await prisma.seoSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
}

// --- Email settings ---

export async function updateEmailSettings(formData: FormData) {
  await requireAdminSession();
  await prisma.emailSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      notifyEmail: String(formData.get("notifyEmail") ?? ""),
      fromName: String(formData.get("fromName") ?? "BrandMeetsCode"),
      fromAddress: String(formData.get("fromAddress") ?? "onboarding@resend.dev"),
      autoReplyEnabled: formData.get("autoReplyEnabled") === "on",
      autoReplySubject: String(formData.get("autoReplySubject") ?? ""),
      autoReplyOpening: String(formData.get("autoReplyOpening") ?? ""),
    },
    update: {
      notifyEmail: String(formData.get("notifyEmail") ?? ""),
      fromName: String(formData.get("fromName") ?? "BrandMeetsCode"),
      fromAddress: String(formData.get("fromAddress") ?? "onboarding@resend.dev"),
      autoReplyEnabled: formData.get("autoReplyEnabled") === "on",
      autoReplySubject: String(formData.get("autoReplySubject") ?? ""),
      autoReplyOpening: String(formData.get("autoReplyOpening") ?? ""),
    },
  });
  revalidatePath("/admin/email");
}

export async function updateIndustryPage(slug: string, formData: FormData) {
  await requireAdminSession();
  const focusBullets = parseJsonField(String(formData.get("focusBullets") ?? "[]"), []);
  await prisma.industryPage.update({
    where: { slug },
    data: {
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      listTitle: String(formData.get("listTitle") ?? ""),
      listBlurb: String(formData.get("listBlurb") ?? ""),
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      heroOverline: String(formData.get("heroOverline") ?? ""),
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroBody: String(formData.get("heroBody") ?? ""),
      introTitle: String(formData.get("introTitle") ?? ""),
      introBody: String(formData.get("introBody") ?? ""),
      focusTitle: String(formData.get("focusTitle") ?? ""),
      focusBullets,
      differentiatorTitle: String(formData.get("differentiatorTitle") ?? ""),
      differentiatorBody: String(formData.get("differentiatorBody") ?? ""),
      ctaLabel: String(formData.get("ctaLabel") ?? ""),
      ctaHref: String(formData.get("ctaHref") ?? ""),
    },
  });
  revalidatePath("/industries");
  revalidatePath(`/industries/${slug}`);
}
