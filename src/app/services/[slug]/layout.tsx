import V2Footer from "@/components/v2/V2Footer";
import { getFooterCopy, getServicesHomeSection, getSiteChrome, getSiteSettings } from "@/lib/cms/queries";
import { utmFromFooterLinkDb } from "@/lib/utm";

export default async function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  const [footer, chrome, settings, homeSection] = await Promise.all([
    getFooterCopy(),
    getSiteChrome(),
    getSiteSettings(),
    getServicesHomeSection(),
  ]);

  return (
    <>
      {children}
      <V2Footer
        tagline={footer.tagline}
        remoteBlurb={footer.remoteBlurb}
        contactEmail={settings.contactEmail}
        chrome={chrome}
        contactUtmBase={utmFromFooterLinkDb(homeSection)}
        canvasVariant="cta"
      />
    </>
  );
}
