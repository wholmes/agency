"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowUpRight } from "../icons";
import type { AboutHomeTeaser, AboutTeaserBelief } from "@prisma/client";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutTeaser({
  intro,
  beliefs,
}: {
  intro: AboutHomeTeaser;
  beliefs: AboutTeaserBelief[];
}) {
  return (
    <section aria-labelledby="about-heading" className="section overflow-hidden">
      <div className="container">

        {/* Editorial heading — full width, large */}
        <div className="mb-16 max-w-[900px]">
          <motion.p
            className="text-overline mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            {intro.overline}
          </motion.p>

          <h2 id="about-heading" className="text-h2 max-w-[820px]">
            {[
              intro.headingBeforeEm,
              <em key="em" className="italic-display text-accent">{intro.headingEmphasis}</em>,
              intro.headingMid,
              intro.headingLastLine,
            ].map((part, i) => (
              <motion.span
                key={i}
                className="inline"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE_OUT }}
              >
                {part}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* Body + beliefs in a clean two-col layout */}
        <div className="grid grid-cols-1 gap-16 border-t border-border pt-16 lg:grid-cols-[1fr_1fr]">

          {/* Left — paragraphs + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <p className="text-body-lg mb-6">{intro.paragraph1}</p>
            <p className="text-body mb-10 text-text-tertiary">{intro.paragraph2}</p>
            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-accent no-underline transition-opacity hover:opacity-70">
              Our Story <IconArrowUpRight size={14} />
            </Link>
          </motion.div>

          {/* Right — beliefs as clean list, no card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
          >
            <p className="mb-8 font-body text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary">
              What we believe
            </p>
            <ul className="flex flex-col">
              {beliefs.map((belief, i) => (
                <motion.li
                  key={belief.id}
                  className="flex items-start gap-5 border-t border-border py-5"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE_OUT }}
                >
                  <span className="mt-1 font-mono text-[10px] tracking-[0.15em] text-text-tertiary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg font-light leading-snug tracking-tight text-text-primary">
                    {belief.text}
                  </span>
                </motion.li>
              ))}
              <li className="border-t border-border" />
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
