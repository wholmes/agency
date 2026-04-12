import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProject } from "@/lib/projects";
import ScrollReveal from "@/components/ScrollReveal";
import { IconArrowUpRight, IconCheck } from "@/components/icons";
import CtaSection from "@/components/sections/CtaSection";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: `How BrandMeetsCode helped ${project.title}: ${project.result}. ${project.resultDetail}`,
    alternates: { canonical: `https://brandmeetscode.com/work/${id}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <>
      {/* Header */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-24)",
          borderBottom: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at 70% 30%, ${project.accent}08 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <ScrollReveal>
            <Link
              href="/work"
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-8)" }}
              className="back-link"
            >
              ← All Work
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <p className="text-overline" style={{ marginBottom: "var(--space-4)" }}>
              {project.category} · {project.year}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <h1 className="text-h1" style={{ marginBottom: "var(--space-6)" }}>
              {project.title}
            </h1>
          </ScrollReveal>

          {/* Result badge */}
          <ScrollReveal delay={200}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-10)", alignItems: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-3) var(--space-5)", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} aria-hidden="true" />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 600, letterSpacing: "0.01em" }}>{project.result}</span>
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}>{project.resultDetail}</p>
            </div>
          </ScrollReveal>

          {/* Services tags */}
          <ScrollReveal delay={260}>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {project.services.map((s) => (
                <span key={s} style={{ fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "var(--space-2) var(--space-3)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text-secondary)" }}>
                  {s}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Visual hero block */}
      <ScrollReveal>
        <div
          style={{
            height: "clamp(280px, 40vw, 480px)",
            background: project.color,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 30% 40%, ${project.accent}28 0%, transparent 55%), radial-gradient(circle at 75% 70%, ${project.accent}14 0%, transparent 50%)` }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,165,90,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,90,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(6rem, 18vw, 14rem)", fontWeight: 300, letterSpacing: "-0.04em", color: project.accent, opacity: 0.1, userSelect: "none", position: "relative" }}>
            {project.title.split(" ")[0]}
          </span>
        </div>
      </ScrollReveal>

      {/* Case study body */}
      <section aria-label="Case study details" className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-6)" }} className="case-grid">
            {/* Problem */}
            <ScrollReveal>
              <div style={{ padding: "var(--space-10)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
                <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-5)", fontWeight: 600 }}>
                  01 — Problem
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 300, letterSpacing: "-0.01em", color: "var(--color-text-primary)", lineHeight: 1.7 }}>
                  {project.problem}
                </p>
              </div>
            </ScrollReveal>

            {/* Approach */}
            <ScrollReveal delay={80}>
              <div style={{ padding: "var(--space-10)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
                <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-5)", fontWeight: 600 }}>
                  02 — Approach
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 300, letterSpacing: "-0.01em", color: "var(--color-text-primary)", lineHeight: 1.7 }}>
                  {project.approach}
                </p>
              </div>
            </ScrollReveal>

            {/* Outcome */}
            <ScrollReveal delay={160}>
              <div style={{ padding: "var(--space-10)", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", borderRadius: "var(--radius-lg)", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, var(--color-accent), transparent)" }} />
                <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-5)", fontWeight: 600 }}>
                  03 — Result
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 300, letterSpacing: "-0.01em", color: "var(--color-text-primary)", lineHeight: 1.7 }}>
                  {project.outcome}
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Nav to other projects */}
          <ScrollReveal delay={100} style={{ paddingTop: "var(--space-24)", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", marginTop: "var(--space-24)", flexWrap: "wrap", gap: "var(--space-4)" }}>
            <Link href="/work" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textDecoration: "none" }} className="back-link">
              ← All Case Studies
            </Link>
            <Link href="/contact" className="btn btn-primary">
              Start a Similar Project
              <IconArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <CtaSection />

      <style>{`
        .back-link:hover { color: var(--color-text-primary) !important; }
        @media (min-width: 768px) {
          .case-grid { grid-template-columns: 1fr 1fr !important; }
          .case-grid > :last-child { grid-column: 1 / -1; }
        }
      `}</style>
    </>
  );
}
