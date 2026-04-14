"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconArrowUpRight, IconCheck } from "./icons";
import Link from "next/link";
import type { ScopeEstimatorData } from "@/lib/cms/scope-estimator-types";

type Step = "type" | "pages" | "integrations" | "timeline" | "result";

interface Selections {
  type: string;
  pages: string;
  integrations: string[];
  timeline: string;
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function fmt(n: number): string {
  return `$${Math.round(n / 1000)}k`;
}

function calcRange(
  sel: Selections,
  data: ScopeEstimatorData,
): { low: number; high: number; weeks: string } {
  const type = data.projectTypes.find((t) => t.id === sel.type);
  const pages = data.pageCounts.find((p) => p.id === sel.pages);
  const timeline = data.timelines.find((t) => t.id === sel.timeline);
  const integCost = sel.integrations
    .filter((i) => i !== "none")
    .reduce((sum, id) => {
      const integ = data.integrations.find((x) => x.id === id);
      return sum + (integ?.cost ?? 0);
    }, 0);

  if (!type || !pages || !timeline) return { low: 0, high: 0, weeks: "" };

  const lowM = data.rangeLowMultiplier;
  const highM = data.rangeHighMultiplier;
  const inc = Math.max(1, data.roundingIncrement);

  const base = type.base * pages.multiplier + integCost;
  const low = Math.round((base * timeline.rush * lowM) / inc) * inc;
  const high = Math.round((base * timeline.rush * highM) / inc) * inc;

  const weeks = data.weeksByTimelineId[sel.timeline] ?? "";
  return { low, high, weeks };
}

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function formatStepLabel(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

export default function ScopeEstimator({ data }: { data: ScopeEstimatorData }) {
  const [step, setStep] = useState<Step>("type");
  const [sel, setSel] = useState<Selections>({
    type: "",
    pages: "",
    integrations: [],
    timeline: "",
  });

  const steps: Step[] = ["type", "pages", "integrations", "timeline", "result"];
  const stepIndex = steps.indexOf(step);
  const st = data.stepTitles;

  const select = (field: keyof Omit<Selections, "integrations">, value: string) => {
    setSel((s) => ({ ...s, [field]: value }));
    const next = steps[stepIndex + 1];
    if (next) setTimeout(() => setStep(next), 200);
  };

  const toggleInteg = (id: string) => {
    setSel((s) => {
      if (id === "none") return { ...s, integrations: ["none"] };
      const without = s.integrations.filter((x) => x !== "none");
      return {
        ...s,
        integrations: without.includes(id) ? without.filter((x) => x !== id) : [...without, id],
      };
    });
  };

  const range = step === "result" ? calcRange(sel, data) : null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="h-0.5 bg-border">
        <div
          className="h-full bg-accent transition-[width] [transition-duration:400ms] [transition-timing-function:var(--ease-out)]"
          style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="p-10">
        <p className="mb-5 text-xs tracking-wider text-text-tertiary uppercase">
          {formatStepLabel(data.stepTemplate, stepIndex + 1, steps.length)}
        </p>

        <AnimatePresence mode="wait">
          {step === "type" && (
            <StepWrap key="type">
              <StepTitle>{st.type}</StepTitle>
              <OptionGrid>
                {data.projectTypes.map((t) => (
                  <OptionButton key={t.id} selected={sel.type === t.id} onClick={() => select("type", t.id)}>
                    {t.label}
                  </OptionButton>
                ))}
              </OptionGrid>
            </StepWrap>
          )}

          {step === "pages" && (
            <StepWrap key="pages">
              <StepTitle>{st.pages}</StepTitle>
              <OptionGrid cols={3}>
                {data.pageCounts.map((p) => (
                  <OptionButton key={p.id} selected={sel.pages === p.id} onClick={() => select("pages", p.id)}>
                    {p.label}
                  </OptionButton>
                ))}
              </OptionGrid>
            </StepWrap>
          )}

          {step === "integrations" && (
            <StepWrap key="integrations">
              <StepTitle>{st.integrations}</StepTitle>
              <p className="mb-6 text-sm text-text-tertiary">{st.integrationsSub || data.integrationsHint}</p>
              <OptionGrid>
                {data.integrations.map((i) => (
                  <OptionButton
                    key={i.id}
                    selected={sel.integrations.includes(i.id)}
                    onClick={() => toggleInteg(i.id)}
                    multiSelect
                  >
                    {i.label}
                  </OptionButton>
                ))}
              </OptionGrid>
              <div className="mt-6">
                <button
                  type="button"
                  className="btn btn-primary disabled:opacity-40"
                  onClick={() => setStep("timeline")}
                  disabled={sel.integrations.length === 0}
                >
                  {st.continueLabel} <IconArrowRight size={16} />
                </button>
              </div>
            </StepWrap>
          )}

          {step === "timeline" && (
            <StepWrap key="timeline">
              <StepTitle>{st.timeline}</StepTitle>
              <OptionGrid cols={2}>
                {data.timelines.map((t) => (
                  <OptionButton
                    key={t.id}
                    selected={sel.timeline === t.id}
                    onClick={() => select("timeline", t.id)}
                  >
                    {t.label}
                  </OptionButton>
                ))}
              </OptionGrid>
            </StepWrap>
          )}

          {step === "result" && range && (
            <StepWrap key="result">
              <p className="mb-4 text-xs font-semibold tracking-wider text-accent uppercase">{data.resultOverline}</p>
              <div className="mb-6">
                <div className="font-display text-4xl leading-none font-light tracking-tight text-text-primary">
                  {fmt(range.low)}–{fmt(range.high)}
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {range.weeks} · {st.estimateTagline}
                </p>
              </div>

              <div className="mb-8 rounded-md border border-accent-muted bg-accent-subtle p-5 text-sm leading-relaxed text-text-secondary">
                {data.resultDisclaimer}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary" data-cursor-label="Let's Build">
                  {st.ctaStartProject} <IconArrowUpRight size={16} />
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setStep("type");
                    setSel({ type: "", pages: "", integrations: [], timeline: "" });
                  }}
                >
                  {st.startOver}
                </button>
              </div>
            </StepWrap>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display mb-6 text-2xl font-light leading-snug tracking-tight">{children}</h3>
  );
}

function OptionGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  const colClass = cols === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
  return <div className={`grid gap-3 ${colClass}`}>{children}</div>;
}

function OptionButton({
  children,
  selected,
  onClick,
  multiSelect = false,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`option-btn flex cursor-pointer items-center gap-2 rounded-md border px-5 py-4 text-left text-sm font-body transition-all [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] ${
        selected
          ? "border-accent bg-accent-subtle text-accent"
          : "border-border bg-bg text-text-secondary"
      }`}
    >
      {multiSelect && (
        <span
          className={`flex size-4 shrink-0 items-center justify-center rounded border transition-all [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-out)] ${
            selected ? "border-accent bg-accent text-bg" : "border-border bg-transparent"
          }`}
        >
          {selected && <IconCheck size={10} />}
        </span>
      )}
      {children}
    </button>
  );
}
