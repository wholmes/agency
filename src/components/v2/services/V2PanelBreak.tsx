"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StudioDashboardPanel from "@/components/v2/panels/StudioDashboardPanel";
import AnalyticsPanel from "@/components/v2/panels/AnalyticsPanel";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function V2PanelBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const panelY  = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const overlayY = useTransform(scrollYProgress, [0, 1], ["8%", "-20%"]);

  return (
    <div ref={ref} className="relative bg-[#0e0e0e]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-8 md:mx-16"
      >
        {/* Specular rule above panel */}
        <div className="relative mb-0 h-px bg-white/[0.06]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,165,90,0.18) 50%, transparent 100%)" }}
          />
        </div>

        {/* Main panel — rounded top, bleeds off bottom */}
        <motion.div
          style={{ y: panelY }}
          className="relative overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] shadow-[0_-16px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          {/* Specular top edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(201,165,90,0.15) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)" }}
          />

          <div className="h-[380px] md:h-[460px]">
            <StudioDashboardPanel />
          </div>

          {/* Floating overlay panel */}
          <motion.div
            style={{ y: overlayY, boxShadow: "0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            className="pointer-events-none absolute bottom-[-24px] right-[3%] hidden w-[44%] overflow-hidden rounded-xl border border-white/[0.1] md:block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-px"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(201,165,90,0.12) 60%, transparent 100%)" }}
            />
            <div className="h-[240px] md:h-[280px]">
              <AnalyticsPanel />
            </div>
          </motion.div>

          {/* Bottom dissolve into page bg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
            style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 100%)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
