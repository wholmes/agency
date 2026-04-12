"use client";

import { useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  style = {},
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });
  const rawY = useSpring(0, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: rawX, y: rawY, display: "inline-flex", ...style }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
