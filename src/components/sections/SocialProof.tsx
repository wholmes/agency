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
  return (
    <section
      aria-label="Social proof"
      className="border-y border-border bg-surface py-16"
    >
      <div className="container">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={Math.floor(i / 2) * 80}>
              <div className="text-center">
                <div className="font-display mb-2 text-3xl leading-none font-light tracking-tight text-accent">
                  {stat.value}
                </div>
                <div className="text-xs tracking-wider text-text-tertiary uppercase">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs tracking-[0.15em] whitespace-nowrap text-text-tertiary uppercase">
              Trusted by
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </ScrollReveal>

        <ul className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, i) => (
            <ScrollReveal
              key={client.name}
              delay={Math.floor(i / 2) * 80}
              as="li"
              className="list-none text-center sm:text-left"
            >
              <div className="font-display text-md font-light tracking-tight text-text-primary transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)]">
                {client.name}
              </div>
              <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-text-tertiary sm:max-w-none">
                {client.context}
              </p>
            </ScrollReveal>
          ))}
        </ul>

        <ScrollReveal delay={200}>
          <div className="relative mx-auto mt-16 max-w-[720px] rounded-lg border border-border bg-surface-2 p-10">
            <div className="mb-4 flex gap-1" aria-label={`${testimonial.starCount} stars`}>
              {[...Array(testimonial.starCount)].map((_, i) => (
                <IconStar key={i} size={14} className="text-accent" />
              ))}
            </div>
            <blockquote className="mb-6 font-display text-xl font-light leading-snug tracking-tight text-text-primary italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-muted),var(--color-accent))] text-sm font-semibold text-bg"
                aria-hidden="true"
              >
                {testimonial.authorInitials}
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{testimonial.authorName}</div>
                <div className="text-xs text-text-tertiary">{testimonial.authorTitle}</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
