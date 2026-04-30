import type { SiteChromeConfigParsed } from "@/lib/cms/site-chrome-types";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type UtmParams = Partial<Record<UtmKey, string | null | undefined>>;

/**
 * Appends GA4-friendly UTM query params to an href. Skips mailto/tel/empty values.
 * Relative paths stay relative. Existing query params are preserved; UTMs from `utm` override same keys.
 */
export function appendUtmToUrl(href: string, utm: UtmParams): string {
  const trimmed = href.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) return trimmed;

  const hasUtm = UTM_KEYS.some((k) => {
    const v = utm[k];
    return v != null && String(v).trim() !== "";
  });
  if (!hasUtm) return trimmed;

  try {
    const absolute = trimmed.startsWith("http://") || trimmed.startsWith("https://");
    const url = absolute ? new URL(trimmed) : new URL(trimmed, "https://placeholder.invalid");

    for (const key of UTM_KEYS) {
      const raw = utm[key];
      if (raw == null) continue;
      const v = String(raw).trim();
      if (v !== "") url.searchParams.set(key, v);
    }

    if (absolute) return url.toString();
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

/** Map optional DB columns to GA4 UTM keys (primary CTA pattern). */
export function utmFromPrimaryDb(row: {
  primaryUtmSource?: string | null;
  primaryUtmMedium?: string | null;
  primaryUtmCampaign?: string | null;
  primaryUtmContent?: string | null;
  primaryUtmTerm?: string | null;
}): UtmParams {
  return {
    utm_source: row.primaryUtmSource,
    utm_medium: row.primaryUtmMedium,
    utm_campaign: row.primaryUtmCampaign,
    utm_content: row.primaryUtmContent,
    utm_term: row.primaryUtmTerm,
  };
}

export function utmFromSecondaryDb(row: {
  secondaryUtmSource?: string | null;
  secondaryUtmMedium?: string | null;
  secondaryUtmCampaign?: string | null;
  secondaryUtmContent?: string | null;
  secondaryUtmTerm?: string | null;
}): UtmParams {
  return {
    utm_source: row.secondaryUtmSource,
    utm_medium: row.secondaryUtmMedium,
    utm_campaign: row.secondaryUtmCampaign,
    utm_content: row.secondaryUtmContent,
    utm_term: row.secondaryUtmTerm,
  };
}

export function utmFromFooterLinkDb(row: {
  footerLinkUtmSource?: string | null;
  footerLinkUtmMedium?: string | null;
  footerLinkUtmCampaign?: string | null;
  footerLinkUtmContent?: string | null;
  footerLinkUtmTerm?: string | null;
}): UtmParams {
  return {
    utm_source: row.footerLinkUtmSource,
    utm_medium: row.footerLinkUtmMedium,
    utm_campaign: row.footerLinkUtmCampaign,
    utm_content: row.footerLinkUtmContent,
    utm_term: row.footerLinkUtmTerm,
  };
}

export function utmFromCalendlyDb(row: {
  calendlyUtmSource?: string | null;
  calendlyUtmMedium?: string | null;
  calendlyUtmCampaign?: string | null;
  calendlyUtmContent?: string | null;
  calendlyUtmTerm?: string | null;
}): UtmParams {
  return {
    utm_source: row.calendlyUtmSource,
    utm_medium: row.calendlyUtmMedium,
    utm_campaign: row.calendlyUtmCampaign,
    utm_content: row.calendlyUtmContent,
    utm_term: row.calendlyUtmTerm,
  };
}

/**
 * Value for `utm_content` on the sitewide footer "Start a project" → /contact link.
 * Derived from the current path so source/medium/campaign can stay fixed in the CMS
 * while content identifies which page the click came from.
 */
export function pathnameToFooterUtmContent(pathname: string | null | undefined): string {
  if (pathname == null || pathname === "") return "home";
  const t = pathname.replace(/\/$/, "") || "/";
  if (t === "/") return "home";
  return t.replace(/^\//, "").replace(/\//g, "-");
}

/** Merge static footer UTMs (from DB) with per-page `utm_content` (typically pathname-based). */
export function mergeFooterCtaUtm(
  base: UtmParams,
  utmContent: string,
): UtmParams {
  return { ...base, utm_content: utmContent };
}

/** Header / mobile nav primary CTA href with optional JSON `utm*` fields. */
export function siteChromePrimaryCtaHref(chrome: SiteChromeConfigParsed): string {
  const p = chrome.primaryCta;
  return appendUtmToUrl(p.href, {
    utm_source: p.utmSource,
    utm_medium: p.utmMedium,
    utm_campaign: p.utmCampaign,
    utm_content: p.utmContent,
    utm_term: p.utmTerm,
  });
}
