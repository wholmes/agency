"use client";

import { motion } from "framer-motion";
import ScopeEstimator from "@/components/ScopeEstimator";
import type { ScopeEstimatorData } from "@/lib/cms/scope-estimator-types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function V2ScopeEstimatorSection({ data }: { data: ScopeEstimatorData }) {
  return (
    <section
      aria-labelledby="estimator-heading"
      className="border-y border-white/[0.06]"
      style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,165,90,0.04) 0%, #0e0e0e 60%)" }}
    >
      <div className="mx-auto max-w-[1280px] px-8 py-20 md:px-16 md:py-28">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.3fr]">

          {/* Copy */}
          <div>
            <motion.p
              className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/25"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {data.sectionOverline}
            </motion.p>
            <motion.h2
              id="estimator-heading"
              className="mb-6 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              {data.headingLine1}
              <br />
              <em className="font-display italic" style={{ color: "#c9a55a" }}>
                {data.headingLine2Italic}
              </em>
            </motion.h2>
            <motion.p
              className="max-w-[400px] text-[15px] leading-relaxed text-white/40"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {data.body}
            </motion.p>
          </div>

          {/* Estimator widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <ScopeEstimator data={data} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
