"use client";

import ScrollReveal from "../ScrollReveal";
import { IconStar } from "../icons";

export type SocialStatDTO = { value: string; label: string };
export type SocialClientDTO = { name: string; context: string };
export type FeaturedTestimonialDTO = {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorInitials: string;
  starCount: number;
};

export default function SocialProof({
  stats,
  clients,
  testimonial,
}: {
  stats: SocialStatDTO[];
  clients: SocialClientDTO[];
  testimonial: FeaturedTestimonialDTO;
}) {
  // Duplicate enough times to fill the marquee strip without gaps
  const marqueeItems = [...clients, ...clients, ...clients];

  return (
    <section aria-label="Social proof" className="border-y border-border bg-surface">

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-border">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 60}>
              <div className="px-4 py-4 text-center first:pl-0 last:pr-0 md:px-10 md:first:pl-0 md:last:pr-0">
                <div className="font-display mb-2 text-[clamp(2.4rem,5vw,4rem)] leading-none font-extralight tracking-tight text-accent">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.18em] text-text-tertiary uppercase">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* ── Trusted by — infinite marquee ──────────────────────────────── */}
      <div className="border-t border-border py-10 overflow-hidden">
        <div className="container mb-6">
          <span className="text-[10px] tracking-[0.2em] text-text-tertiary uppercase">Trusted by</span>
        </div>

        {/* Fade masks on edges */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(to_right,var(--color-surface),transparent)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(to_left,var(--color-surface),transparent)]" />

          <div className="flex animate-[marquee_36s_linear_infinite] gap-0 will-change-transform">
            {marqueeItems.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="flex shrink-0 items-center gap-5 px-10"
                aria-hidden={i >= clients.length}
              >
                {/* Gold accent bullet */}
                <span className="size-[5px] shrink-0 rounded-full bg-accent opacity-60" aria-hidden="true" />
                <div>
                  <div className="font-display whitespace-nowrap text-sm font-light tracking-tight text-text-primary">
                    {client.name}
                  </div>
                  <p className="mt-0.5 whitespace-nowrap text-[11px] text-text-tertiary">
                    {client.context}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonial — editorial, no box ────────────────────────────── */}
      <div className="border-t border-border py-16 lg:py-20">
        <ScrollReveal delay={100}>
          <div className="container mx-auto max-w-[820px] text-center">
            {/* Stars */}
            <div className="mb-8 flex justify-center gap-1.5" aria-label={`${testimonial.starCount} stars`}>
              {[...Array(testimonial.starCount)].map((_, i) => (
                <IconStar key={i} size={13} className="text-accent" />
              ))}
            </div>

            {/* Decorative opening quote */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none font-display mb-[-1.5rem] text-[7rem] leading-none font-light text-accent opacity-15"
            >
              &ldquo;
            </div>

            <blockquote className="relative font-display text-[clamp(1.25rem,3vw,1.875rem)] font-light leading-[1.4] tracking-tight text-text-primary italic">
              {testimonial.quote}
            </blockquote>

            {/* Author */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-border" aria-hidden="true" />
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-muted),var(--color-accent))] text-sm font-semibold text-bg"
                aria-hidden="true"
              >
                {testimonial.authorInitials}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">{testimonial.authorName}</div>
                <div className="text-xs text-text-tertiary">{testimonial.authorTitle}</div>
              </div>
              <div className="h-px w-10 bg-border" aria-hidden="true" />
            </div>
          </div>
        </ScrollReveal>
      </div>

    </section>
  );
}
