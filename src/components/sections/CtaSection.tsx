"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight, IconEmail } from "../icons";
import MagneticButton from "../MagneticButton";
import type { CtaSectionCopy } from "@prisma/client";

export default function CtaSection({ copy }: { copy: CtaSectionCopy }) {
  const secondaryIsMailto = copy.secondaryCtaHref.startsWith("mailto:");

  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-border bg-surface py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.04)_1px,transparent_1px)] bg-size-[60px_60px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="font-display text-[clamp(6rem,20vw,18rem)] font-light tracking-tighter italic text-accent select-none whitespace-nowrap opacity-[0.03]">
          Let&rsquo;s Build
        </span>
      </div>

      <div className="container relative z-[1] text-center">
        <ScrollReveal>
          <p className="text-overline mb-6">{copy.overline}</p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h2 id="cta-heading" className="text-h1 mx-auto mb-6 max-w-[680px]">
            {copy.headingBeforeEm}
            <em className="italic-display text-accent">{copy.headingEmphasis}</em>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="text-body-lg mx-auto mb-12 max-w-[480px]">{copy.body}</p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton>
              <Link
                href={copy.primaryCtaHref}
                className="btn btn-primary px-8 py-5 text-sm"
                data-cursor-label="Let's Build"
              >
                {copy.primaryCtaLabel}
                <IconArrowUpRight size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              {secondaryIsMailto ? (
                <a
                  href={copy.secondaryCtaHref}
                  className="btn btn-secondary px-8 py-5 text-sm"
                  data-cursor-label="Say Hello"
                >
                  <IconEmail size={16} />
                  {copy.secondaryCtaLabel}
                </a>
              ) : (
                <Link
                  href={copy.secondaryCtaHref}
                  className="btn btn-secondary px-8 py-5 text-sm"
                  data-cursor-label="Say Hello"
                >
                  {copy.secondaryCtaLabel}
                </Link>
              )}
            </MagneticButton>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={320}>
          <p className="mt-8 text-xs tracking-wide text-text-tertiary">{copy.footnote}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
