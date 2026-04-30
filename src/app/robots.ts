import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/cms/queries";

const SITE_URL = "https://brandmeetscode.com";

/** Fresh robots when SEO toggles (e.g. staging → launch). */
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let noIndex = false;
  try {
    const seo = await getSeoSettings();
    noIndex = seo.noIndex;
  } catch {
    // DB unreachable — fail open so a prod outage doesn’t look like a deliberate global block.
    noIndex = false;
  }

  if (noIndex) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
