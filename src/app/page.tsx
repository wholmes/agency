import type { Metadata } from "next";
import V2Hero from "@/components/v2/V2Hero";
import V2ServicesSection from "@/components/v2/V2ServicesSection";
import V2ProjectsGrid from "@/components/v2/V2ProjectsGrid";
import V2Footer from "@/components/v2/V2Footer";
import {
  getServiceOfferingsForHome,
  getServicesHomeSection,
  getFooterCopy,
  getSiteChrome,
  getSiteSettings,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "BrandMeetsCode — Premium Digital Studio",
  description:
    "BrandMeetsCode builds premium websites for B2B companies and SaaS founders. Brand strategy meets technical execution — Lighthouse ≥ 90 guaranteed.",
  alternates: {
    canonical: "https://brandmeetscode.com",
  },
};

export default async function Home() {
  const [serviceOfferings, servicesHome, footer, chrome, settings] = await Promise.all([
    getServiceOfferingsForHome(),
    getServicesHomeSection(),
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
        <V2Hero />
        <V2ServicesSection offerings={serviceOfferings} homeSection={servicesHome} />
        <V2ProjectsGrid />
      </div>
      <V2Footer
        tagline={footer.tagline}
        remoteBlurb={footer.remoteBlurb}
        contactEmail={settings.contactEmail}
        chrome={chrome}
      />
    </>
  );
}
