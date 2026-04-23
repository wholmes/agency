"use client";

import Link from "next/link";
import { motion, useInView, useScroll, useTransform, useMotionValue, useAnimation, type Variants } from "framer-motion";
import { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import type { Project } from "@/lib/projects";
import type { CaseStudyUiLabels } from "@prisma/client";
import ExpandableText from "@/components/ExpandableText";

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const clipVariant: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: (delay: number) => ({
    clipPath: "inset(0 0 0% 0)",
    transition: { delay, duration: 1.1, ease: EASE_OUT },
  }),
};

const enterVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.9, ease: EASE_OUT },
  }),
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.9, ease: EASE_OUT },
  }),
};

function InViewMotion({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={cardVariant}
    >
      {children}
    </motion.div>
  );
}


function HeroImageBlock({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Parallax for the phone overlay
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [40, -80]);

  const y = useMotionValue(0);
  const controls = useAnimation();
  const phoneImgRef = useRef<HTMLImageElement>(null);

  // Phone scroll: mirrors the desktop y but scaled to the phone image's travel range
  const phoneScrollY = useTransform(y, (val) => {
    const vp = viewportRef.current;       // desktop viewport
    const desktopImg = imgRef.current;
    const phoneImg = phoneImgRef.current;
    if (!vp || !desktopImg || !phoneImg || desktopImg.naturalWidth === 0 || phoneImg.naturalWidth === 0) return 0;
    const PHONE_W = 192;
    const PHONE_SCREEN_H = 340;
    const phoneRenderedH = phoneImg.naturalHeight * (PHONE_W / phoneImg.naturalWidth);
    const phoneTravel = Math.min(0, -(phoneRenderedH - PHONE_SCREEN_H));
    const desktopTravel = Math.min(0, -(desktopImg.naturalHeight * (vp.clientWidth / desktopImg.naturalWidth) - vp.clientHeight));
    if (desktopTravel === 0) return 0;
    // Map desktop progress (0→1) to phone travel
    const progress = val / desktopTravel;
    return progress * phoneTravel;
  });

  // True max upward travel in px (negative number).
  // rendered image height = naturalHeight × (displayWidth / naturalWidth)
  // travel = -(renderedHeight - viewportHeight)  — capped at 0 if image fits
  const maxTravel = useCallback((): number => {
    const vp = viewportRef.current;
    const img = imgRef.current;
    if (!vp || !img || img.naturalWidth === 0) return 0;
    const rendered = img.naturalHeight * (vp.clientWidth / img.naturalWidth);
    return Math.min(0, -(rendered - vp.clientHeight));
  }, []);

  // Hijack zone: frame top is within the top 30% of the viewport
  // (works even when the frame is taller than the screen)
  const frameIsFullyVisible = useCallback((): boolean => {
    const el = viewportRef.current;
    if (!el) return false;
    const { top } = el.getBoundingClientRect();
    return top >= 0 && top <= window.innerHeight * 0.3;
  }, []);

  // Is the outer block above the screen (user scrolled past it)?
  const blockIsAbove = useCallback((): boolean => {
    const el = ref.current;
    if (!el) return false;
    return el.getBoundingClientRect().bottom < 0;
  }, []);

  // Scroll hijack ─────────────────────────────────────────────────────────────
  // "idle"     → waiting for frame to enter trigger zone
  // "active"   → wheel redirected into screenshot
  // "released" → done, page scrolls freely until frame fully leaves + re-enters
  const hijackState = useRef<"idle" | "active" | "released">("idle");
  const overscrollBuffer = useRef(0);

  // Reset to top synchronously before paint — prevents stale position on mount
  useLayoutEffect(() => {
    y.set(0);
    hijackState.current = "idle";
    overscrollBuffer.current = 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const block = ref.current;
    if (!block) return;
    const OVER = 80;

    const handleWheel = (e: WheelEvent) => {
      const travel = maxTravel();
      if (travel >= -2) return;

      // Block scrolled off screen — full reset
      if (blockIsAbove()) {
        hijackState.current = "idle";
        controls.stop();
        y.set(0);
        return;
      }

      // Released — page scrolls freely; re-arm only after frame fully leaves trigger zone
      if (hijackState.current === "released") {
        if (!frameIsFullyVisible()) {
          hijackState.current = "idle";
        }
        return;
      }

      // Arm when frame enters trigger zone
      if (hijackState.current === "idle") {
        if (frameIsFullyVisible()) {
          hijackState.current = "active";
          overscrollBuffer.current = 0;
          y.set(0);
        } else {
          return;
        }
      }

      // Active — intercept scroll and move screenshot
      if (hijackState.current === "active") {
        e.preventDefault();
        e.stopPropagation();

        const scrollingDown = e.deltaY > 0;
        const atTop = y.get() >= -2;
        const atBottom = y.get() <= travel + 2;

        if ((atBottom && scrollingDown) || (atTop && !scrollingDown)) {
          overscrollBuffer.current += Math.abs(e.deltaY);
          if (overscrollBuffer.current >= OVER) {
            // Release — page resumes, won't re-hijack until frame leaves view
            hijackState.current = "released";
            overscrollBuffer.current = 0;
          }
          return;
        }

        overscrollBuffer.current = 0;
        const next = Math.min(0, Math.max(travel, y.get() - e.deltaY * 2));
        controls.stop();
        controls.start({ y: next, transition: { duration: 0.25, ease: "easeOut" } });
      }
    };

    // Native scroll: reset when block leaves screen upward
    const handleScroll = () => {
      if (blockIsAbove()) {
        controls.stop();
        y.set(0);
        hijackState.current = "idle";
      }
    };

    block.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      block.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls, y, maxTravel, frameIsFullyVisible, blockIsAbove]);

  // Touch hijack ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let startY = 0;
    let lastY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      lastY = startY;
      controls.stop();
    };
    const onTouchMove = (e: TouchEvent) => {
      const travel = maxTravel();
      if (travel >= -2) return;
      e.preventDefault();
      const delta = lastY - e.touches[0].clientY;
      lastY = e.touches[0].clientY;
      const next = Math.min(0, Math.max(travel, y.get() - delta));
      y.set(next);
    };
    const onTouchEnd = () => {
      const travel = maxTravel();
      const momentum = (lastY - startY) * -0.15;
      const next = Math.min(0, Math.max(travel, y.get() + momentum));
      controls.start({ y: next, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } });
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [controls, y, maxTravel]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: project.color }}
      aria-hidden="true"
    >
      {/* Ambient gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, ${project.accent}22 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, ${project.accent}10 0%, transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto max-w-[1280px] px-8 md:px-16">
        {project.heroImage ? (
          <div className="relative mx-auto max-w-5xl">
            {/* Desktop browser */}
            <div
              className="overflow-hidden rounded-xl"
              style={{ boxShadow: `0 32px 80px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)` }}
            >
              <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#131313] px-4 py-2.5">
                <div className="flex shrink-0 gap-1.5">
                  <span className="size-3 rounded-full bg-[#ff5f56]" />
                  <span className="size-3 rounded-full bg-[#ffbd2e]" />
                  <span className="size-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex h-6 w-52 items-center gap-2 rounded bg-white/[0.05] px-3">
                    <span className="size-1.5 shrink-0 rounded-full bg-white/20" />
                    <div className="h-1.5 w-28 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="w-[52px] shrink-0" />
              </div>
              <div ref={viewportRef} className="aspect-[16/9] overflow-hidden select-none flex flex-col justify-start items-stretch">
                <motion.div style={{ y }} animate={controls} className="will-change-transform flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={project.heroImage}
                    alt={`${project.title} website`}
                    className="block h-auto w-full"
                    onLoad={() => {
                      y.set(0);
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Phone overlay — parallax */}
            {project.mobileImage && (
              <motion.div
                style={{ y: phoneY }}
                className="absolute -bottom-12 -right-12 z-10 md:-right-20"
              >
                <div
                  className="relative rounded-[32px] border-[6px]"
                  style={{
                    borderColor: "#1c1c1e",
                    width: 192,
                    boxShadow: `0 32px 60px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)`,
                  }}
                >
                  {/* Notch */}
                  <div className="flex h-7 shrink-0 items-center justify-center rounded-t-[26px] bg-[#0a0a0a]">
                    <div className="h-[14px] w-[60px] rounded-full bg-black" />
                  </div>
                  {/* Scrollable image viewport — fixed height = phone screen */}
                  <div className="overflow-hidden" style={{ height: 340 }}>
                    <motion.div style={{ y: phoneScrollY }} className="will-change-transform">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img ref={phoneImgRef} src={project.mobileImage} alt={`${project.title} mobile`} className="block h-auto w-full" />
                    </motion.div>
                  </div>
                  {/* Home indicator */}
                  <div className="flex shrink-0 items-center justify-center rounded-b-[26px] bg-[#0a0a0a] py-2">
                    <div className="h-[4px] w-16 rounded-full bg-white/20" />
                  </div>
                </div>
                {/* Buttons */}
                <div className="absolute -right-[8px] top-20 h-12 w-[3px] rounded-full bg-[#2c2c2e]" />
                <div className="absolute -left-[8px] top-16 h-6 w-[3px] rounded-full bg-[#2c2c2e]" />
                <div className="absolute -left-[8px] top-24 h-6 w-[3px] rounded-full bg-[#2c2c2e]" />
              </motion.div>
            )}
          </div>
        ) : (
          <div className="relative flex h-[clamp(200px,30vw,360px)] items-center justify-center">
            <span
              className="select-none font-display text-[clamp(6rem,18vw,14rem)] font-light tracking-tighter"
              style={{ color: project.accent, opacity: 0.08 }}
            >
              {project.title.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseStudyContent({
  project,
  labels,
}: {
  project: Project;
  labels: CaseStudyUiLabels;
}) {
  return (
    <div className="bg-[#0e0e0e]">
      {/* Noise grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.04,
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pt-[calc(var(--nav-height)+5rem)] pb-20">
        {/* Accent radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 30%, ${project.accent}12 0%, transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-[1280px] px-8 md:px-16">
          {/* Back link */}
          <motion.div initial="hidden" animate="visible" custom={0} variants={enterVariant}>
            <Link
              href="/work"
              className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 no-underline transition-colors hover:text-white/60"
              style={{ transition: `color 0.3s` }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {labels.backToWorkLabel}
            </Link>
          </motion.div>

          {/* Overline */}
          <motion.p
            className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
            initial="hidden" animate="visible" custom={0.08} variants={enterVariant}
          >
            {project.category} · {project.year}
          </motion.p>

          {/* Title */}
          <h1 className="mb-8 font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.93] tracking-[-0.03em] text-white">
            <motion.span
              className="block overflow-hidden pb-[0.04em]"
              initial="hidden" animate="visible" custom={0.12} variants={clipVariant}
            >
              {project.title}
            </motion.span>
          </h1>

          {/* Result pill + detail */}
          <motion.div
            className="mb-8 flex flex-wrap items-center gap-4"
            initial="hidden" animate="visible" custom={0.38} variants={enterVariant}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{ borderColor: `${project.accent}40`, background: `${project.accent}10` }}
            >
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-wide" style={{ color: project.accent }}>{project.result}</span>
            </div>
            <p className="text-[13px] text-white/40">{project.resultDetail}</p>
          </motion.div>

          {/* Service tags */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden" animate="visible" custom={0.5} variants={enterVariant}
          >
            {project.services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/[0.08] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/35"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Hero image + mobile overlay ───────────────────────────── */}
      <HeroImageBlock project={project} />

      {/* ── Case study body ───────────────────────────────────────── */}
      <section aria-label="Case study details" className="py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-8 md:px-16">

          {/* Section overline */}
          <InViewMotion>
            <div className="mb-10 flex items-center gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">Selected Work</p>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
          </InViewMotion>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Problem */}
            <InViewMotion delay={0}>
              <div
                className="rounded-2xl border border-white/[0.06] p-8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a55a]/60">
                  {labels.problemSectionLabel}
                </p>
                <ExpandableText text={project.problem} />
              </div>
            </InViewMotion>

            {/* Approach */}
            <InViewMotion delay={0.08}>
              <div
                className="rounded-2xl border border-white/[0.06] p-8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a55a]/60">
                  {labels.approachSectionLabel}
                </p>
                <ExpandableText text={project.approach} />
              </div>
            </InViewMotion>

            {/* Outcome — full width, gold accent */}
            <InViewMotion delay={0.16} className="md:col-span-2">
              <div
                className="relative overflow-hidden rounded-2xl border p-8"
                style={{
                  borderColor: "rgba(201,165,90,0.2)",
                  background: "rgba(201,165,90,0.04)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(to right, rgba(201,165,90,0.6), transparent)" }}
                />
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a55a]/70">
                  {labels.outcomeSectionLabel}
                </p>
                <p className="text-[15px] leading-[1.75] text-white/70">{project.outcome}</p>
              </div>
            </InViewMotion>
          </div>

          {/* Bottom nav */}
          <InViewMotion className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-10">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 no-underline hover:text-white/60"
              style={{ transition: "color 0.3s" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {labels.backToCaseStudiesLabel}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a55a]/40 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#c9a55a] no-underline transition-all duration-300 hover:border-[#c9a55a]/70 hover:bg-[rgba(201,165,90,0.12)] hover:shadow-[0_0_20px_rgba(201,165,90,0.15)]"
              style={{ background: "rgba(201,165,90,0.06)" }}
            >
              {labels.similarProjectCtaLabel}
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </InViewMotion>

        </div>
      </section>
    </div>
  );
}
