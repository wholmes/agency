/**
 * Canonical public origin for absolute URLs (OG, sitemap, robots).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://brandmeetscode.com).
 */
export function getPublicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    return `https://${host}`;
  }

  return "https://brandmeetscode.com";
}
