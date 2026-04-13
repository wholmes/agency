import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkPreview from "@/components/sections/WorkPreview";
import AboutTeaser from "@/components/sections/AboutTeaser";
import CtaSection from "@/components/sections/CtaSection";
import ChapterProgress from "@/components/ChapterProgress";
import {
  getAboutHomeTeaser,
  getAboutTeaserBeliefs,
  getCtaSectionCopy,
  getFeaturedTestimonial,
  getHomeHero,
  getProjects,
  getServiceOfferingsForHome,
  getServicesHomeSection,
  getSocialClients,
  getSocialStats,
  getWorkPreviewSection,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "BrandMeetsCode — Premium Web Development Agency",
  description:
    "BrandMeetsCode builds premium websites for B2B companies and SaaS founders. Brand strategy meets technical execution — Lighthouse ≥ 90 guaranteed.",
  alternates: {
    canonical: "https://brandmeetscode.com",
  },
};

const SECTION_IDS = ["section-proof", "section-services", "section-work", "section-about", "section-cta"];

export default async function Home() {
  const [
    homeHero,
    projects,
    stats,
    clients,
    testimonial,
    serviceOfferings,
    servicesHome,
    workPreviewSection,
    aboutIntro,
    beliefs,
    ctaCopy,
  ] = await Promise.all([
    getHomeHero(),
    getProjects(),
    getSocialStats(),
    getSocialClients(),
    getFeaturedTestimonial(),
    getServiceOfferingsForHome(),
    getServicesHomeSection(),
    getWorkPreviewSection(),
    getAboutHomeTeaser(),
    getAboutTeaserBeliefs(),
    getCtaSectionCopy(),
  ]);

  return (
    <>
      <ChapterProgress sectionIds={SECTION_IDS} />
      <Hero content={homeHero} />
      <div id="section-proof">
        <SocialProof
          stats={stats.map((s) => ({ value: s.value, label: s.label }))}
          clients={clients.map((c) => ({ name: c.name, context: c.context }))}
          testimonial={{
            quote: testimonial.quote,
            authorName: testimonial.authorName,
            authorTitle: testimonial.authorTitle,
            authorInitials: testimonial.authorInitials,
            starCount: testimonial.starCount,
          }}
        />
      </div>
      <div id="section-services">
        <ServicesSection offerings={serviceOfferings} homeSection={servicesHome} />
      </div>
      <div id="section-work">
        <WorkPreview projects={projects} header={workPreviewSection} />
      </div>
      <div id="section-about">
        <AboutTeaser intro={aboutIntro} beliefs={beliefs} />
      </div>
      <div id="section-cta">
        <CtaSection copy={ctaCopy} />
      </div>
    </>
  );
}
