import type { Metadata } from "next";
import V2Footer from "@/components/v2/V2Footer";
import V2ServicesHero from "@/components/v2/services/V2ServicesHero";
import V2ServiceOfferings from "@/components/v2/services/V2ServiceOfferings";
import V2CapabilitiesStrip from "@/components/v2/services/V2CapabilitiesStrip";
import V2ContinuitySection from "@/components/v2/services/V2ContinuitySection";
import V2PanelBreak from "@/components/v2/services/V2PanelBreak";
import {
  getServiceOfferings,
  getServicesPageHero,
  getCapabilities,
  getServicesContinuityIntro,
  getContinuityBlocks,
  getFooterCopy,
  getSiteChrome,
  getSiteSettings,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Services — Web Design, Development, Brand Strategy & Analytics",
  description:
    "Premium web design & development, brand strategy, and analytics integration for B2B companies and SaaS founders. See what's included.",
  alternates: {
    canonical: "https://brandmeetscode.com/services",
  },
  openGraph: {
    title: "Services — BrandMeetsCode",
    description:
      "Premium web design & development, brand strategy, and analytics integration for B2B companies and SaaS founders. See what's included.",
    url: "https://brandmeetscode.com/services",
    siteName: "BrandMeetsCode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — BrandMeetsCode",
    description:
      "Premium web design & development, brand strategy, and analytics integration for B2B companies and SaaS founders. See what's included.",
  },
};

export default async function ServicesPage() {
  const [
    offerings,
    hero,
    capabilities,
    continuityIntro,
    continuityBlocks,
    footer,
    chrome,
    settings,
  ] = await Promise.all([
    getServiceOfferings(),
    getServicesPageHero(),
    getCapabilities(),
    getServicesContinuityIntro(),
    getContinuityBlocks(),
    getFooterCopy(),
    getSiteChrome(),
    getSiteSettings(),
  ]);

  return (
    <>
      <div className="relative bg-[#0e0e0e]">
        {/* Noise grain overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        />
        <V2ServicesHero content={hero} />
        <V2ServiceOfferings offerings={offerings} />
        <V2CapabilitiesStrip capabilities={capabilities} />
        <V2PanelBreak />
        <V2ContinuitySection intro={continuityIntro} blocks={continuityBlocks} />
      </div>
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
