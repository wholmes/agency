import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { IconArrowUpRight, IconCheck } from "@/components/icons";
import CtaSection from "@/components/sections/CtaSection";
import TeamSection from "@/components/sections/TeamSection";
import AboutHero from "./AboutHero";
import {
  getAboutPageHero,
  getAboutStoryParagraphs,
  getAboutStorySection,
  getAboutTeaserCard,
  getAboutValues,
  getAboutValuesSectionHeader,
  getCtaSectionCopy,
  getTeamMembers,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "About — The BrandMeetsCode Story",
  description:
    "The story of BrandMeetsCode — a Chicago-based web development agency built at the intersection of brand strategy and technical execution. Values, approach, and the work behind the work.",
  alternates: {
    canonical: "https://brandmeetscode.com/about",
  },
};

export default async function AboutPage() {
  const [aboutHero, storySection, storyParagraphs, teaserCard, valuesHeader, values, ctaCopy, teamMembers] = await Promise.all([
    getAboutPageHero(),
    getAboutStorySection(),
    getAboutStoryParagraphs(),
    getAboutTeaserCard(),
    getAboutValuesSectionHeader(),
    getAboutValues(),
    getCtaSectionCopy(),
    getTeamMembers(),
  ]);

  return (
    <>
      <AboutHero content={aboutHero} />

      <section aria-labelledby="story-heading" className="section border-b border-border">
        <div className="container">
          <div className="story-grid grid grid-cols-1 items-start gap-16 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <ScrollReveal>
                <h2 id="story-heading" className="text-h2 mb-8">
                  {storySection.headingBeforeEm}
                  <em className="italic-display text-accent">{storySection.headingEm}</em>
                  {storySection.headingAfterEm}
                </h2>
              </ScrollReveal>
              {storyParagraphs.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 80}>
                  <p className="text-body-lg mb-6">{p.body}</p>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <div
                  className="relative flex h-[280px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-surface-2)_0%,#1c1810_100%)]"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
                  <div className="relative text-center">
                    <div className="font-display text-[5rem] leading-none font-light tracking-tighter text-accent opacity-15">
                      {storySection.bmcMonogram}
                    </div>
                    <p className="mt-4 text-xs tracking-[0.15em] text-text-tertiary uppercase">{storySection.bmcTagline}</p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">{teaserCard.body}</p>
                  <Link href={teaserCard.ctaHref} className="btn btn-ghost px-0 text-sm text-accent">
                    {teaserCard.ctaLabel} <IconArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <TeamSection
        members={teamMembers.map((m) => ({
          ...m,
          skills: m.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }))}
      />

      <section aria-labelledby="values-heading" className="section border-b border-border bg-surface">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">{valuesHeader.overline}</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 id="values-heading" className="text-h2 mb-16">
              {valuesHeader.heading}
            </h2>
          </ScrollReveal>
          <div className="values-grid grid grid-cols-1 gap-6 lg:grid-cols-2">
            {values.map((value, i) => (
              <ScrollReveal key={value.id} delay={Math.floor(i / 2) * 80}>
                <div className="rounded-lg border border-border bg-bg p-8">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle text-accent">
                      <IconCheck size={11} />
                    </div>
                    <h3 className="font-display text-xl font-normal leading-snug tracking-tight">{value.title}</h3>
                  </div>
                  <p className="pl-10 text-sm leading-relaxed text-text-secondary">{value.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection copy={ctaCopy} />
    </>
  );
}
