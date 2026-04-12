"use client";

import ScrollReveal from "../ScrollReveal";
import { IconStar } from "../icons";

const stats = [
  { value: "40+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "4.9★", label: "Average Rating" },
  { value: "<2s", label: "Avg Load Time" },
];

const clients: { name: string; context: string }[] = [
  { name: "Meridian SaaS", context: "B2B SaaS · pipeline & demo conversion" },
  { name: "Croft & Webb", context: "Professional services · brand & lead gen" },
  { name: "Arclight Labs", context: "Enterprise AI · Series A & enterprise pilots" },
  { name: "Nova Analytics", context: "Product analytics · self-serve growth" },
  { name: "Sable Studio", context: "Creative studio · profitability & ops reporting" },
  { name: "Tether Finance", context: "Fintech · compliance-first UX" },
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
