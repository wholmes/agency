"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionValue, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

type CapabilityDB = {
  id: number;
  sortOrder: number;
  title: string;
  descriptor: string;
  detail: string;
  tags: string;
  showTags: boolean;
  iconSvg: string;
  published: boolean;
};

type Capability = {
  id: string;
  number: string;
  title: string;
  descriptor: string;
  detail: string;
  tags: string[];
  showTags: boolean;
  icon: React.ReactNode;
};

/** Header is h-40 (160px) + 1px top border + 1px progress bar = 162px */
const HEADER_HEIGHT = 162;

function dbToCapability(cap: CapabilityDB, index: number, total: number): Capability {
  return {
    id: String(cap.id),
    number: String(index + 1).padStart(2, "0"),
    title: cap.title,
    descriptor: cap.descriptor,
    detail: cap.detail,
    tags: cap.tags.split(",").map((t) => t.trim()).filter(Boolean),
    showTags: cap.showTags,
    icon: cap.iconSvg ? (
      <span
        className="[&>svg]:h-[38px] [&>svg]:w-[38px]"
        dangerouslySetInnerHTML={{ __html: cap.iconSvg }}
      />
    ) : (
      <span className="text-xs text-text-tertiary">{String(index + 1).padStart(2, "0")}</span>
    ),
  };
}

export default function CapabilitiesScroll({ capabilities: rawCaps = [] }: { capabilities?: CapabilityDB[] }) {
  const CAPABILITIES: Capability[] = rawCaps.map((c, i) => dbToCapability(c, i, rawCaps.length));
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollDistRef = useRef(0);
  const [scrollDist, setScrollDist] = useState((CAPABILITIES.length - 1) * 480);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const dist = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      scrollDistRef.current = dist;
      setScrollDist(dist);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    restDelta: 0.001,
  });

  const x = useTransform(
    reduce ? scrollYProgress : springProgress,
    (p) => -p * scrollDistRef.current
  );

  // Velocity skew — cards lean in the direction of travel
  const xVelocity = useVelocity(x);
  const rawSkew = useTransform(xVelocity, [-2400, 0, 2400], [-7, 0, 7]);
  const skewX = useSpring(rawSkew, { stiffness: 130, damping: 28, restDelta: 0.01 });

  // Active card spotlight — nearest card to center gets focus
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(springProgress, "change", (p) => {
    setActiveIndex(Math.round(p * (CAPABILITIES.length - 1)));
  });

  return (
    <section
      ref={containerRef}
      aria-label="Capabilities"
      style={{ height: reduce ? "auto" : `calc(100vh + ${scrollDist}px)` }}
    >
      {reduce ? (
        <div className="border-t border-border py-24">
          <div className="container mb-16">
            <p className="text-overline mb-4">Capabilities</p>
            <h2 className="text-h2 max-w-[560px]">
              What we <em className="italic-display text-accent">build</em>
            </h2>
          </div>
          <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <StaticCard key={cap.id} cap={cap} />
            ))}
          </div>
        </div>
      ) : (
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Top border (1px) */}
          <div className="h-px w-full bg-border" aria-hidden />

          {/* Header — fixed h-40 (160px) */}
          <div className="container flex h-40 items-end justify-between pb-6">
            <div>
              <p className="text-overline mb-3">Capabilities</p>
              <h2 className="text-h2 max-w-[520px]">
                What we <em className="italic-display text-accent">build</em>
              </h2>
            </div>
            <p className="hidden text-sm text-text-tertiary lg:block">Scroll to explore →</p>
          </div>

          {/* Progress bar (1px) */}
          <div className="relative h-px w-full bg-border" aria-hidden>
            <motion.div
              className="absolute inset-y-0 left-0 right-0 origin-left bg-accent opacity-60"
              style={{ scaleX: scrollYProgress }}
            />
          </div>

          {/* Card area — explicit height = 100vh - HEADER_HEIGHT */}
          <div
            className="overflow-hidden"
            style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
          >
            <motion.div
              ref={trackRef}
              style={{ x, skewX }}
              className="flex h-full items-stretch gap-6 py-8 pl-[max(theme(spacing.8),calc((100vw-theme(screens.2xl))/2+theme(spacing.8)))]"
            >
              {CAPABILITIES.map((cap, i) => (
                <HorizontalCard key={cap.id} cap={cap} index={i} total={CAPABILITIES.length} activeIndex={activeIndex} springProgress={springProgress} />
              ))}
              <div className="w-[max(theme(spacing.8),calc((100vw-theme(screens.2xl))/2+theme(spacing.8)))] shrink-0" />
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}

function HorizontalCard({
  cap,
  index,
  total,
  activeIndex,
  springProgress,
}: {
  cap: Capability;
  index: number;
  total: number;
  activeIndex: number;
  springProgress: MotionValue<number>;
}) {
  const distance = Math.abs(index - activeIndex);
  const isActive = distance === 0;

  // Parallax — each layer moves at a different rate as the card crosses the viewport.
  const iconX = useTransform(springProgress, (p) => (p * (total - 1) - index) * -14);
  const titleX = useTransform(springProgress, (p) => (p * (total - 1) - index) * -7);

  // Cursor-following tag pill
  const articleRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);
  const pillX = useMotionValue(-200);
  const pillY = useMotionValue(-200);
  const springPillX = useSpring(pillX, { stiffness: 380, damping: 26 });
  const springPillY = useSpring(pillY, { stiffness: 380, damping: 26 });

  // Always cycle at 1 per second
  useEffect(() => {
    if (!cap.showTags || cap.tags.length < 2) return;
    const id = setInterval(() => {
      setTagIdx((i) => (i + 1) % cap.tags.length);
    }, 1000);
    return () => clearInterval(id);
  }, [cap.showTags, cap.tags.length]);

  // Monocle lens
  const LENS_R = 88;
  const LENS_SCALE = 1.65;
  const detailRef = useRef<HTMLParagraphElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; rect: DOMRect } | null>(null);
  const onDetailMove = useCallback((e: React.MouseEvent<HTMLParagraphElement>) => {
    if (!detailRef.current) return;
    setLens({ x: e.clientX, y: e.clientY, rect: detailRef.current.getBoundingClientRect() });
  }, []);
  const onDetailLeave = useCallback(() => setLens(null), []);


  return (
    <motion.article
      ref={articleRef as React.RefObject<HTMLDivElement>}
      animate={{
        opacity: distance === 0 ? 1 : distance === 1 ? 0.65 : 0.4,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex h-full w-[clamp(340px,30vw,480px)] shrink-0 flex-col justify-between overflow-hidden rounded-lg border p-10 transition-[border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isActive
          ? "border-accent-muted bg-surface-2"
          : "border-border bg-surface hover:border-accent-muted hover:bg-surface-2"
      }`}
      aria-label={cap.title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={(e) => {
        pillX.set(e.clientX + 14);
        pillY.set(e.clientY + 18);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight glow */}
      <motion.div
        aria-hidden
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-t-lg"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(201,165,90,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Glint — diagonal specular sweep, plays once on activation */}
      <motion.div
        key={String(isActive)}
        aria-hidden
        initial={{ x: isActive ? "-110%" : "210%", opacity: 0 }}
        animate={
          isActive
            ? { x: "210%", opacity: [0, 1, 1, 0] }
            : { x: "210%", opacity: 0 }
        }
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
        style={{
          background:
            "linear-gradient(108deg, transparent 30%, rgba(255,248,220,0.07) 45%, rgba(255,255,255,0.13) 50%, rgba(255,248,220,0.07) 55%, transparent 70%)",
        }}
      />

      {/* Top group: icon + line + title + descriptor — kept tight together */}
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <motion.div
            style={{ x: iconX }}
            className="flex min-h-14 shrink-0 items-center justify-center rounded-md border border-accent-muted bg-accent-subtle px-3 text-accent transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:bg-accent-muted"
          >
            {cap.icon}
          </motion.div>

          {/* Odometer flip */}
          <div style={{ perspective: "400px", overflow: "hidden" }}>
            <motion.span
              key={String(isActive)}
              initial={{ rotateX: isActive ? -90 : 0, opacity: isActive ? 0 : 1 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.32, ease: [0.34, 1.4, 0.64, 1] }}
              style={{ display: "inline-block", transformOrigin: "50% 0%" }}
              className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary"
            >
              {cap.number} / {String(total).padStart(2, "0")}
            </motion.span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-px w-full bg-border" aria-hidden />
          <motion.h3
            style={{ x: titleX }}
            className="font-body text-2xl font-semibold leading-tight tracking-tight text-text-primary"
          >
            {cap.title}
          </motion.h3>
          <motion.p style={{ x: titleX }} className="text-sm leading-relaxed text-text-secondary">
            {cap.descriptor}
          </motion.p>
        </div>
      </div>

      {/* Bottom: detail + tags (back layer) */}
      <div className="flex flex-col gap-5">
        <p
          ref={detailRef}
          onMouseMove={onDetailMove}
          onMouseLeave={onDetailLeave}
          className="text-xs leading-relaxed text-text-tertiary"
          style={{ cursor: lens ? "none" : "default" }}
        >
          {cap.detail}
        </p>
        {cap.showTags && cap.tags.length > 0 && (
          <div className="h-px w-full bg-border" aria-hidden />
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 rounded-tl-full bg-[radial-gradient(circle_at_100%_100%,rgba(201,165,90,0.05),transparent_70%)]"
      />

      {/* Cursor-following tag pill portal */}
      {cap.showTags && cap.tags.length > 0 && typeof document !== "undefined" && createPortal(
        <motion.div
          aria-hidden
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.88 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: springPillX, y: springPillY, position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9998 }}
          className="rounded border border-accent-muted bg-surface-2 px-3 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(201,165,90,0.12)]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={tagIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="block whitespace-nowrap font-mono text-[10px] tracking-wider text-accent"
            >
              {cap.tags[tagIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.div>,
        document.body
      )}

      {/* Monocle lens portal — rendered outside overflow:hidden into document.body */}
      {lens !== null && typeof document !== "undefined" && createPortal(
        <div
          aria-hidden
          style={{
            position: "fixed",
            left: lens.x,
            top: lens.y,
            transform: "translate(-50%, -50%)",
            width: LENS_R * 2,
            height: LENS_R * 2,
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 9999,
            background: "rgba(14, 12, 9, 0.88)",
            boxShadow:
              "0 0 0 1.5px rgba(201,165,90,0.45), 0 0 0 3px rgba(201,165,90,0.10), 0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,240,0.07)",
          }}
        >
          {/* Glass highlight arc at top */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse 70% 35% at 50% 2%, rgba(255,248,220,0.09) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Magnified text */}
          <div
            style={{
              position: "absolute",
              left: LENS_R - (lens.x - lens.rect.left) * LENS_SCALE,
              top: LENS_R - (lens.y - lens.rect.top) * LENS_SCALE,
              width: lens.rect.width,
              transform: `scale(${LENS_SCALE})`,
              transformOrigin: "0 0",
              fontSize: "0.75rem",
              lineHeight: "1.625",
              color: "rgba(220, 200, 160, 0.92)",
              whiteSpace: "normal",
              userSelect: "none",
            }}
          >
            {cap.detail}
          </div>
          {/* Centre crosshair dot */}
          <div
            style={{
              position: "absolute",
              left: LENS_R - 1.5,
              top: LENS_R - 1.5,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "rgba(201,165,90,0.6)",
            }}
          />
        </div>,
        document.body
      )}
    </motion.article>
  );
}

function StaticCard({ cap }: { cap: Capability }) {
  return (
    <article className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-8">
      <div className="flex items-start justify-between">
        <div className="flex min-h-12 shrink-0 items-center justify-center rounded-md border border-accent-muted bg-accent-subtle px-3 text-accent">
          {cap.icon}
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary">{cap.number}</span>
      </div>
      <div>
        <h3 className="font-body mb-2 text-xl font-semibold tracking-tight text-text-primary">{cap.title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{cap.descriptor}</p>
      </div>
      {cap.showTags && cap.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {cap.tags.map((tag) => (
            <li key={tag} className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-[10px] tracking-wider text-text-tertiary">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
