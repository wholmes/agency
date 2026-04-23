import V2Footer from "@/components/v2/V2Footer";
import { getFooterCopy, getSiteChrome, getSiteSettings } from "@/lib/cms/queries";

export default async function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  const [footer, chrome, settings] = await Promise.all([
    getFooterCopy(),
    getSiteChrome(),
    getSiteSettings(),
  ]);

  return (
    <>
      {children}
      <V2Footer
        tagline={footer.tagline}
        remoteBlurb={footer.remoteBlurb}
        contactEmail={settings.contactEmail}
        chrome={chrome}
        canvasVariant="cta"
      />
    </>
  );
}
