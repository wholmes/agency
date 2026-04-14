import { prisma } from "@/lib/prisma";
import ChromeEditor from "./ChromeEditor";

export const metadata = { title: "Admin — Nav & footer" };

export default async function AdminChromePage() {
  const row = await prisma.siteChrome.findUniqueOrThrow({ where: { id: 1 } });
  let pretty = row.configJson;
  try {
    pretty = JSON.stringify(JSON.parse(row.configJson), null, 2);
  } catch {
    /* keep raw */
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display mb-2 text-2xl font-light tracking-tight">Navigation &amp; footer links</h1>
      <p className="mb-8 text-sm text-text-secondary">
        This JSON drives the main nav, primary header CTA, footer columns, bottom utility links, and copyright line.
        Optional <code className="text-xs">utmSource</code>, <code className="text-xs">utmMedium</code>,{" "}
        <code className="text-xs">utmCampaign</code>, <code className="text-xs">utmContent</code>,{" "}
        <code className="text-xs">utmTerm</code> on <code className="text-xs">primaryCta</code> are appended to that
        button&apos;s href for GA4 (same behavior as other admin UTM fields).
      </p>
      <ChromeEditor initialJson={pretty} />
    </div>
  );
}
