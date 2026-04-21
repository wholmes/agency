"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { optionalFormString } from "@/lib/admin/optional-form-string";
import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";

async function guard() {
  await requireAdminSession();
}

export async function updateSiteSettings(formData: FormData) {
  await guard();
  const availabilityNextOpenRaw = formData.get("availabilityNextOpen");
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      contactEmail: String(formData.get("contactEmail") ?? ""),
      availabilityAvailable: formData.get("availabilityAvailable") === "on",
      availabilityLabel: String(formData.get("availabilityLabel") ?? ""),
      availabilityNextOpen:
        typeof availabilityNextOpenRaw === "string" && availabilityNextOpenRaw.trim() !== ""
          ? availabilityNextOpenRaw.trim()
          : null,
      navHideOnScroll: formData.get("navHideOnScroll") === "on",
    },
  });
  revalidatePath("/", "layout");
}

export async function updateFooterCopy(formData: FormData) {
  await guard();
  await prisma.footerCopy.update({
    where: { id: 1 },
    data: {
      tagline: String(formData.get("tagline") ?? ""),
      remoteBlurb: String(formData.get("remoteBlurb") ?? ""),
    },
  });
  revalidatePath("/", "layout");
}

export type ChromeFormState = { error?: string } | null;

export async function updateSiteChromeJson(
  _prev: ChromeFormState,
  formData: FormData,
): Promise<ChromeFormState> {
  await guard();
  const raw = String(formData.get("configJson") ?? "");
  let parsed: SiteChromeConfigParsed;
  try {
    parsed = JSON.parse(raw) as SiteChromeConfigParsed;
  } catch {
    return { error: "Invalid JSON. Fix the syntax and try again." };
  }
  if (!parsed.navLinks || !Array.isArray(parsed.footerColumns)) {
    return { error: "JSON must include navLinks (array) and footerColumns (array)." };
  }
  await prisma.siteChrome.update({
    where: { id: 1 },
    data: { configJson: JSON.stringify(parsed) },
  });
  revalidatePath("/", "layout");
  return null;
}

export async function updateHomeHero(formData: FormData) {
  await guard();
  await prisma.homeHero.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      headlineLine1: String(formData.get("headlineLine1") ?? ""),
      headlineLine2Italic: String(formData.get("headlineLine2Italic") ?? ""),
      headlineLine3: String(formData.get("headlineLine3") ?? ""),
      body: String(formData.get("body") ?? ""),
      primaryCtaLabel: String(formData.get("primaryCtaLabel") ?? ""),
      primaryCtaHref: String(formData.get("primaryCtaHref") ?? ""),
      secondaryCtaLabel: String(formData.get("secondaryCtaLabel") ?? ""),
      secondaryCtaHref: String(formData.get("secondaryCtaHref") ?? ""),
      primaryUtmSource: optionalFormString(formData, "primaryUtmSource"),
      primaryUtmMedium: optionalFormString(formData, "primaryUtmMedium"),
      primaryUtmCampaign: optionalFormString(formData, "primaryUtmCampaign"),
      primaryUtmContent: optionalFormString(formData, "primaryUtmContent"),
      primaryUtmTerm: optionalFormString(formData, "primaryUtmTerm"),
      secondaryUtmSource: optionalFormString(formData, "secondaryUtmSource"),
      secondaryUtmMedium: optionalFormString(formData, "secondaryUtmMedium"),
      secondaryUtmCampaign: optionalFormString(formData, "secondaryUtmCampaign"),
      secondaryUtmContent: optionalFormString(formData, "secondaryUtmContent"),
      secondaryUtmTerm: optionalFormString(formData, "secondaryUtmTerm"),
    },
  });
  revalidatePath("/");
}

export async function updateCtaSection(formData: FormData) {
  await guard();
  await prisma.ctaSectionCopy.update({
    where: { id: 1 },
    data: {
      overline: String(formData.get("overline") ?? ""),
      headingBeforeEm: String(formData.get("headingBeforeEm") ?? ""),
      headingEmphasis: String(formData.get("headingEmphasis") ?? ""),
      body: String(formData.get("body") ?? ""),
      primaryCtaLabel: String(formData.get("primaryCtaLabel") ?? ""),
      primaryCtaHref: String(formData.get("primaryCtaHref") ?? ""),
      secondaryCtaLabel: String(formData.get("secondaryCtaLabel") ?? ""),
      secondaryCtaHref: String(formData.get("secondaryCtaHref") ?? ""),
      footnote: String(formData.get("footnote") ?? ""),
      primaryUtmSource: optionalFormString(formData, "primaryUtmSource"),
      primaryUtmMedium: optionalFormString(formData, "primaryUtmMedium"),
      primaryUtmCampaign: optionalFormString(formData, "primaryUtmCampaign"),
      primaryUtmContent: optionalFormString(formData, "primaryUtmContent"),
      primaryUtmTerm: optionalFormString(formData, "primaryUtmTerm"),
      secondaryUtmSource: optionalFormString(formData, "secondaryUtmSource"),
      secondaryUtmMedium: optionalFormString(formData, "secondaryUtmMedium"),
      secondaryUtmCampaign: optionalFormString(formData, "secondaryUtmCampaign"),
      secondaryUtmContent: optionalFormString(formData, "secondaryUtmContent"),
      secondaryUtmTerm: optionalFormString(formData, "secondaryUtmTerm"),
    },
  });
  revalidatePath("/", "layout");
}

export async function updateProject(id: string, formData: FormData) {
  await guard();
  const servicesRaw = String(formData.get("services") ?? "[]");
  let servicesJson: string;
  try {
    const arr = JSON.parse(servicesRaw) as unknown;
    servicesJson = JSON.stringify(Array.isArray(arr) ? arr : []);
  } catch {
    servicesJson = "[]";
  }
  await prisma.project.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      proofFit: String(formData.get("proofFit") ?? ""),
      year: String(formData.get("year") ?? ""),
      result: String(formData.get("result") ?? ""),
      resultDetail: String(formData.get("resultDetail") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      approach: String(formData.get("approach") ?? ""),
      outcome: String(formData.get("outcome") ?? ""),
      color: String(formData.get("color") ?? ""),
      accent: String(formData.get("accent") ?? ""),
      services: servicesJson,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      published: formData.get("published") === "on",
      thumbImage:  String(formData.get("thumbImage")  ?? ""),
      coverImage:  String(formData.get("coverImage")  ?? ""),
      heroImage:   String(formData.get("heroImage")   ?? ""),
      mobileImage: String(formData.get("mobileImage") ?? ""),
    },
  });
  revalidatePath("/work");
  revalidatePath(`/work/${id}`);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
