import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import AboutHero from "./AboutHero";
import { IsoDesignDiscipline, IsoCodeQuality, IsoClarityOverCleverness, IsoBriefStartingPoint } from "./ValuesIcons";
import MedalCard from "./MedalCard";
import StoryBody from "./StoryBody";
import {
  getAboutPageHero,
  getAboutStoryParagraphs,
  getAboutValues,
} from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "About — The BrandMeetsCode Story",
  description:
    "The story of BrandMeetsCode — a web development agency built at the intersection of brand strategy and technical execution. Disciplines that rarely meet.",
  alternates: { canonical: "https://brandmeetscode.com/about" },
  openGraph: {
    title: "About — BrandMeetsCode",
    description:
      "The story of BrandMeetsCode — a web development agency built at the intersection of brand strategy and technical execution. Disciplines that rarely meet.",
    url: "https://brandmeetscode.com/about",
    siteName: "BrandMeetsCode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — BrandMeetsCode",
    description:
      "The story of BrandMeetsCode — a web development agency built at the intersection of brand strategy and technical execution. Disciplines that rarely meet.",
  },
};

export default async function AboutPage() {
  const [aboutHero, storyParagraphs, values] =
    await Promise.all([
      getAboutPageHero(),
      getAboutStoryParagraphs(),
      getAboutValues(),
    ]);

  return (
    <div className="bg-[#0e0e0e]">
      {/* Noise grain */}
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

      <AboutHero content={aboutHero} />

      {/* Story section */}
      <section aria-labelledby="story-heading" className="border-b border-white/[0.06] py-20 md:py-32">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">

          {/* Overline */}
          <ScrollReveal>
            <div className="mb-12 flex items-center gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Our story</p>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_420px]">

            {/* Left — copy + stats */}
            <div className="flex flex-col">
              <ScrollReveal>
                <h2
                  id="story-heading"
                  className="mb-10 font-display text-[clamp(2.2rem,4vw,3.75rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
                >
                  Origin.
                </h2>
              </ScrollReveal>

              <StoryBody paragraphs={storyParagraphs} />

              {/* Stat strip */}
              <ScrollReveal delay={240}>
                <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.06]">
                  {[
                    { value: "100%", label: "Senior team" },
                    { value: "2019", label: "Est. Chicago" },
                    { value: "2×", label: "Disciplines" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-1 px-6 py-5"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <span className="font-display text-[28px] font-light leading-none tracking-[-0.03em] text-white">
                        {stat.value}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right — medal glass card */}
            <ScrollReveal delay={160}>
              <div
                className="sticky top-28 overflow-hidden rounded-2xl border border-white/[0.08]"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  boxShadow: "0 0 0 1px rgba(201,165,90,0.06), 0 32px 80px -20px rgba(0,0,0,0.6), 0 0 60px -20px rgba(201,165,90,0.08)",
                }}
              >
                {/* Medal display */}
                <div className="relative flex h-[400px] items-center justify-center overflow-hidden"
                  style={{ background: "radial-gradient(ellipse 80% 70% at 50% 60%, rgba(201,165,90,0.07) 0%, transparent 70%)" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.03)_1px,transparent_1px)] bg-size-[36px_36px]" />
                  {/* Soft gold halo behind medal */}
                  <div
                    className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(201,165,90,0.18) 0%, transparent 70%)", filter: "blur(24px)" }}
                  />
                  <div className="relative -mt-6">
                    <MedalCard />
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Pull quote */}
      <ScrollReveal>
        <section className="border-b border-white/[0.06] py-20 md:py-28">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
            <div className="mx-auto max-w-[760px] text-center">
              <div className="mb-8 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-[#c9a55a]/30" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">BrandMeetsCode</span>
                <div className="h-px w-12 bg-[#c9a55a]/30" />
              </div>
              <blockquote className="font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.02em] text-white/80">
                <em className="not-italic">
                  "Not by being mediocre at both disciplines — but by being{" "}
                  <span style={{ color: "#c9a55a" }}>genuinely excellent at both</span>
                  , and by understanding how each one makes the other better."
                </em>
              </blockquote>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Values section */}
      <section aria-labelledby="values-heading" className="border-b border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">

          <ScrollReveal>
            <div className="mb-4 flex items-center gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                What we believe
              </p>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h2
              id="values-heading"
              className="mb-14 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
            >
              Beliefs.
            </h2>
          </ScrollReveal>

          {(() => {
            const ICONS = [IsoDesignDiscipline, IsoCodeQuality, IsoClarityOverCleverness, IsoBriefStartingPoint];
            return (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {values.map((value, i) => {
                  const Icon = ICONS[i % ICONS.length];
                  return (
                    <ScrollReveal key={value.id} delay={Math.floor(i / 2) * 80}>
                      <div
                        className="flex flex-col rounded-2xl border border-white/[0.06] p-8"
                        style={{ background: "rgba(255,255,255,0.02)" }}
                      >
                        {/* Isometric icon */}
                        <div className="mb-5 -ml-2">
                          <Icon />
                        </div>
                        <h3 className="mb-3 font-sans text-[18px] font-normal leading-snug tracking-[-0.02em] text-white/85">
                          {value.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-white/40">{value.body}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
