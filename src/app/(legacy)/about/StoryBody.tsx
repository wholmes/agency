"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

interface Paragraph {
  id: string;
  body: string;
}

export default function StoryBody({ paragraphs }: { paragraphs: Paragraph[] }) {
  const [expanded, setExpanded] = useState(false);
  const lead = paragraphs[0];
  const rest = paragraphs.slice(1);

  return (
    <div className="mb-12">
      {/* Lead paragraph — always visible */}
      <ScrollReveal>
        <p className="mb-5 text-[15px] leading-[1.75] text-white/60">{lead?.body}</p>
      </ScrollReveal>

      {/* Expandable paragraphs */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="rest"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 pt-0">
              {rest.map((p) => (
                <p key={p.id} className="text-[15px] leading-[1.75] text-white/45">
                  {p.body}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle */}
      {rest.length > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-white/60"
        >
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex size-4 items-center justify-center rounded-full border border-white/20"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </motion.span>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
