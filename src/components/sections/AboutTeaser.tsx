"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight, IconCheck } from "../icons";

const beliefs = [
  "Design that doesn't convert is decoration",
  "Code quality is a business decision",
  "The brief is a starting point, not a ceiling",
  "Every pixel should earn its place",
];

export default function AboutTeaser() {
  return (
    <section aria-labelledby="about-heading" className="section">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <ScrollReveal>
              <p className="text-overline mb-4">The Difference</p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h2 id="about-heading" className="text-h2 mb-6">
                Where brand{" "}
                <em className="italic-display text-accent">strategy</em> meets
                <br />
                technical execution
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="text-body-lg mb-8">
                Most agencies are either great at design or great at code. We built BrandMeetsCode because the best
                projects need both — and they need them to work together from day one, not be stitched together at the
                end.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <p className="text-body mb-10">
                We work with companies who have tried generic dev shops and ended up with something technically
                functional but strategically inert. We fix that — not by redesigning every six months, but by making the
                right decisions the first time.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Link href="/about" className="btn btn-secondary">
                Our Story
                <IconArrowUpRight size={16} />
              </Link>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal delay={200}>
              <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-10">
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 left-0 h-0.5 bg-[linear-gradient(to_right,var(--color-accent),transparent)]"
                />

                <p className="mb-8 text-xs tracking-[0.15em] text-text-tertiary uppercase">What we believe</p>

                <ul className="flex list-none flex-col gap-5">
                  {beliefs.map((belief, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-accent-muted bg-accent-subtle text-accent"
                        aria-hidden="true"
                      >
                        <IconCheck size={11} />
                      </div>
                      <span className="font-display text-lg font-light leading-snug tracking-tight text-text-primary">
                        {belief}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
