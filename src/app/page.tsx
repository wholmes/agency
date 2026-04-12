import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkPreview from "@/components/sections/WorkPreview";
import AboutTeaser from "@/components/sections/AboutTeaser";
import CtaSection from "@/components/sections/CtaSection";
import ChapterProgress from "@/components/ChapterProgress";

export const metadata: Metadata = {
  title: "BrandMeetsCode — Premium Web Development Agency",
  description:
    "BrandMeetsCode builds premium websites for B2B companies and SaaS founders. Brand strategy meets technical execution — Lighthouse ≥ 90 guaranteed.",
  alternates: {
    canonical: "https://brandmeetscode.com",
  },
};

const SECTION_IDS = ["section-proof", "section-services", "section-work", "section-about", "section-cta"];

export default function Home() {
  return (
    <>
      <ChapterProgress sectionIds={SECTION_IDS} />
      <Hero />
      <div id="section-proof"><SocialProof /></div>
      <div id="section-services"><ServicesSection /></div>
      <div id="section-work"><WorkPreview /></div>
      <div id="section-about"><AboutTeaser /></div>
      <div id="section-cta"><CtaSection /></div>
    </>
  );
}
