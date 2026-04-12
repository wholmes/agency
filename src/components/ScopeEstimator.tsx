"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconArrowUpRight, IconCheck } from "./icons";
import Link from "next/link";

type Step = "type" | "pages" | "integrations" | "timeline" | "result";

interface Selections {
  type: string;
  pages: string;
  integrations: string[];
  timeline: string;
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const projectTypes = [
  { id: "new-site", label: "New website", base: 12000 },
  { id: "redesign", label: "Site redesign", base: 10000 },
  { id: "brand-web", label: "Brand strategy + web", base: 20000 },
  { id: "analytics", label: "Analytics integration", base: 5000 },
];

const pageCounts = [
  { id: "1-5", label: "1–5 pages", multiplier: 1.0 },
  { id: "6-15", label: "6–15 pages", multiplier: 1.5 },
  { id: "16+", label: "16+ pages", multiplier: 2.2 },
];

const integrations = [
  { id: "cms", label: "CMS (Contentful, Sanity)", cost: 2000 },
  { id: "analytics", label: "Analytics setup", cost: 1500 },
  { id: "forms", label: "Lead capture / CRM", cost: 1000 },
  { id: "auth", label: "User auth / dashboard", cost: 3500 },
  { id: "ecomm", label: "E-commerce", cost: 4000 },
  { id: "none", label: "None", cost: 0 },
];

const timelines = [
  { id: "relaxed", label: "No rush (12+ weeks)", rush: 1.0 },
  { id: "standard", label: "Standard (8–12 weeks)", rush: 1.0 },
  { id: "fast", label: "Fast (4–8 weeks)", rush: 1.25 },
  { id: "urgent", label: "ASAP (<4 weeks)", rush: 1.5 },
];

function fmt(n: number): string {
  return `$${Math.round(n / 1000)}k`;
}

function calcRange(sel: Selections) {
  const type = projectTypes.find((t) => t.id === sel.type);
  const pages = pageCounts.find((p) => p.id === sel.pages);
  const timeline = timelines.find((t) => t.id === sel.timeline);
  const integCost = sel.integrations
    .filter((i) => i !== "none")
    .reduce((sum, id) => {
      const integ = integrations.find((x) => x.id === id);
      return sum + (integ?.cost ?? 0);
    }, 0);

  if (!type || !pages || !timeline) return { low: 0, high: 0, weeks: "" };

  const base = type.base * pages.multiplier + integCost;
  const low = Math.round((base * timeline.rush * 0.9) / 1000) * 1000;
  const high = Math.round((base * timeline.rush * 1.2) / 1000) * 1000;

  const weeksMap: Record<string, string> = {
    relaxed: "12–16 weeks",
    standard: "8–12 weeks",
    fast: "5–8 weeks",
    urgent: "3–5 weeks",
  };

  return { low, high, weeks: weeksMap[sel.timeline] ?? "" };
}

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function ScopeEstimator() {
  const [step, setStep] = useState<Step>("type");
  const [sel, setSel] = useState<Selections>({
    type: "",
    pages: "",
    integrations: [],
    timeline: "",
  });

  const steps: Step[] = ["type", "pages", "integrations", "timeline", "result"];
  const stepIndex = steps.indexOf(step);

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
        integrations: without.includes(id)
          ? without.filter((x) => x !== id)
          : [...without, id],
      };
    });
  };

  const range = step === "result" ? calcRange(sel) : null;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Progress bar */}
      <div style={{ height: 2, background: "var(--color-border)" }}>
        <div
          style={{
            height: "100%",
            width: `${((stepIndex) / (steps.length - 1)) * 100}%`,
            background: "var(--color-accent)",
            transition: "width 400ms var(--ease-out)",
          }}
        />
      </div>

      <div style={{ padding: "var(--space-10)" }}>
        {/* Step label */}
        <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: "var(--space-5)" }}>
          Step {stepIndex + 1} of {steps.length}
        </p>

        <AnimatePresence mode="wait">
          {step === "type" && (
            <StepWrap key="type">
              <StepTitle>What are you building?</StepTitle>
              <OptionGrid>
                {projectTypes.map((t) => (
                  <OptionButton key={t.id} selected={sel.type === t.id} onClick={() => select("type", t.id)}>
                    {t.label}
                  </OptionButton>
                ))}
              </OptionGrid>
            </StepWrap>
          )}

          {step === "pages" && (
            <StepWrap key="pages">
              <StepTitle>How many pages?</StepTitle>
              <OptionGrid cols={3}>
                {pageCounts.map((p) => (
                  <OptionButton key={p.id} selected={sel.pages === p.id} onClick={() => select("pages", p.id)}>
                    {p.label}
                  </OptionButton>
                ))}
              </OptionGrid>
            </StepWrap>
          )}

          {step === "integrations" && (
            <StepWrap key="integrations">
              <StepTitle>Any integrations needed?</StepTitle>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-6)" }}>Select all that apply.</p>
              <OptionGrid>
                {integrations.map((i) => (
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
              <div style={{ marginTop: "var(--space-6)" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep("timeline")}
                  disabled={sel.integrations.length === 0}
                  style={{ opacity: sel.integrations.length === 0 ? 0.4 : 1 }}
                >
                  Continue <IconArrowRight size={16} />
                </button>
              </div>
            </StepWrap>
          )}

          {step === "timeline" && (
            <StepWrap key="timeline">
              <StepTitle>What&rsquo;s your timeline?</StepTitle>
              <OptionGrid cols={2}>
                {timelines.map((t) => (
                  <OptionButton key={t.id} selected={sel.timeline === t.id} onClick={() => { select("timeline", t.id); setStep("result"); }}>
                    {t.label}
                  </OptionButton>
                ))}
              </OptionGrid>
            </StepWrap>
          )}

          {step === "result" && range && (
            <StepWrap key="result">
              <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-4)", fontWeight: 600 }}>
                Your ballpark estimate
              </p>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 300, letterSpacing: "-0.03em", color: "var(--color-text-primary)", lineHeight: 1 }}>
                  {fmt(range.low)}–{fmt(range.high)}
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>
                  {range.weeks} · All-in estimate
                </p>
              </div>

              <div style={{ padding: "var(--space-5)", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                This is a rough range based on your inputs — not a quote. Real projects are scoped after a 30-minute discovery call where we can understand your actual goals.
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-primary" data-cursor-label="Let's Build">
                  Start a Project <IconArrowUpRight size={16} />
                </Link>
                <button className="btn btn-secondary" onClick={() => { setStep("type"); setSel({ type: "", pages: "", integrations: [], timeline: "" }); }}>
                  Start over
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
    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "var(--space-6)", lineHeight: 1.2 }}>
      {children}
    </h3>
  );
}

function OptionGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "var(--space-3)" }}>
      {children}
    </div>
  );
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
      onClick={onClick}
      style={{
        padding: "var(--space-4) var(--space-5)",
        background: selected ? "var(--color-accent-subtle)" : "var(--color-bg)",
        border: `1px solid ${selected ? "var(--color-accent)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-md)",
        color: selected ? "var(--color-accent)" : "var(--color-text-secondary)",
        fontSize: "var(--text-sm)",
        fontFamily: "var(--font-body, sans-serif)",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        transition: "all var(--duration-base) var(--ease-out)",
        cursor: "pointer",
      }}
      className="option-btn"
    >
      {multiSelect && (
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1px solid ${selected ? "var(--color-accent)" : "var(--color-border)"}`,
            background: selected ? "var(--color-accent)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--color-bg)",
            transition: "all var(--duration-fast) var(--ease-out)",
          }}
        >
          {selected && <IconCheck size={10} />}
        </span>
      )}
      {children}
    </button>
  );
}
