"use client";

import ScrollReveal from "../ScrollReveal";
import { IconStar } from "../icons";

const stats = [
  { value: "40+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "4.9★", label: "Average Rating" },
  { value: "<2s", label: "Avg Load Time" },
];

const clients = [
  "Meridian SaaS",
  "Croft & Webb",
  "Arclight Labs",
  "Nova Analytics",
  "Sable Studio",
  "Tether Finance",
];

export default function SocialProof() {
  return (
    <section
      aria-label="Social proof"
      className="border-y border-border bg-surface py-16"
    >
      <div className="container">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
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

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {clients.map((name, i) => (
            <ScrollReveal key={name} delay={i * 50}>
              <span className="font-display text-md font-light tracking-tight text-text-tertiary italic transition-colors [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] hover:text-text-secondary">
                {name}
              </span>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="relative mx-auto mt-16 max-w-[720px] rounded-lg border border-border bg-surface-2 p-10">
            <div className="mb-4 flex gap-1" aria-label="5 stars">
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} size={14} className="text-accent" />
              ))}
            </div>
            <blockquote className="mb-6 font-display text-xl font-light leading-snug tracking-tight text-text-primary italic">
              &ldquo;They didn&rsquo;t just build our site — they understood the business. The result increased demo
              requests by 40% in the first month.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-muted),var(--color-accent))] text-sm font-semibold text-bg"
                aria-hidden="true"
              >
                JK
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">Jordan Kim</div>
                <div className="text-xs text-text-tertiary">Head of Marketing, Meridian SaaS</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
