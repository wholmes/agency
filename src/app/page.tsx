import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ServicesSection from "@/components/sections/ServicesSection";
import WorkPreview from "@/components/sections/WorkPreview";
import AboutTeaser from "@/components/sections/AboutTeaser";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "BrandMeetsCode — Premium Web Development Agency",
  description:
    "BrandMeetsCode builds premium websites for B2B companies and SaaS founders. Brand strategy meets technical execution — Lighthouse ≥ 90 guaranteed.",
  alternates: {
    canonical: "https://brandmeetscode.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <ServicesSection />
      <WorkPreview />
      <AboutTeaser />
      <CtaSection />
    </>
  );
}
