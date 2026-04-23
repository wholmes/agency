"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CLAMP_LINES = 4;
const LINE_HEIGHT_REM = 1.75;
const FONT_SIZE_PX = 15;
const CLAMP_HEIGHT = `${(CLAMP_LINES * LINE_HEIGHT_REM * FONT_SIZE_PX) / 16}rem`;

export default function ExpandableText({
  text,
  textClassName = "text-[15px] leading-[1.75] text-white/55",
}: {
  text: string;
  textClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <motion.div
        animate={{ height: expanded ? "auto" : CLAMP_HEIGHT }}
        initial={false}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className={textClassName}>{text}</p>
      </motion.div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white/55"
      >
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex size-3.5 items-center justify-center rounded-full border border-white/20"
        >
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.span>
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
