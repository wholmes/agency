import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { IconArrowUpRight } from "@/components/icons";
import CtaSection from "@/components/sections/CtaSection";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Case Studies & Portfolio",
  description:
    "BrandMeetsCode portfolio: case studies in web design, development, brand strategy, and analytics. Problem, approach, result — real metrics, not just screenshots.",
  alternates: {
    canonical: "https://brandmeetscode.com/work",
  },
};

export default function WorkPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-24)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-5)" }}>Selected Work</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-h1" style={{ maxWidth: "640px", marginBottom: "var(--space-6)" }}>
              Results, not just{" "}
              <em className="italic-display" style={{ color: "var(--color-accent)" }}>renderings</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-body-lg" style={{ maxWidth: "520px" }}>
              Every case study follows the same format: the problem as the client described it,
              what we actually did, and what happened as a result.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects */}
      <section aria-label="Case studies" className="section">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-24)" }}>
            {projects.map((project, i) => (
              <CaseStudy key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

function CaseStudy({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <article aria-labelledby={`case-${project.id}`}>
      {/* Visual block + meta */}
      <ScrollReveal>
        <Link href={`/work/${project.id}`} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-8)", marginBottom: "var(--space-10)", alignItems: "center", textDecoration: "none" }} className="case-header case-link">
          {/* Large visual */}
          <div
            style={{
              height: "clamp(240px, 35vw, 400px)",
              borderRadius: "var(--radius-lg)",
              background: project.color,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 30% 40%, ${project.accent}22 0%, transparent 60%)` }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 8rem)", fontWeight: 300, letterSpacing: "-0.04em", color: project.accent, opacity: 0.12, userSelect: "none" }}>
              {project.title.split(" ")[0]}
            </span>
          </div>

          {/* Meta */}
          <div>
            <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }}>
              {project.category} · {project.year}
            </p>
            <h2 id={`case-${project.id}`} className="text-h3" style={{ marginBottom: "var(--space-5)" }}>
              {project.title}
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-2) var(--space-4)", background: "var(--color-accent-subtle)", border: "1px solid var(--color-accent-muted)", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-3)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)" }} aria-hidden="true" />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 500 }}>{project.result}</span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}>{project.resultDetail}</p>
            <div style={{ marginTop: "var(--space-5)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 500 }}>
                Read case study <IconArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </Link>
      </ScrollReveal>

      {/* Case study body */}
      <ScrollReveal delay={100}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-8)" }} className="case-body">
          <div style={{ padding: "var(--space-8)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
            <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-4)", fontWeight: 500 }}>Problem</p>
            <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{project.problem}</p>
          </div>
          <div style={{ padding: "var(--space-8)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
            <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-4)", fontWeight: 500 }}>Approach</p>
            <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{project.approach}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Divider between projects */}
      <div style={{ marginTop: "var(--space-16)", height: 1, background: "var(--color-border)" }} aria-hidden="true" />

      <style>{`
        @media (min-width: 768px) {
          .case-header { grid-template-columns: 1.2fr 1fr !important; }
          .case-body { grid-template-columns: 1fr 1fr !important; }
        }
        .case-link:hover { opacity: 0.9; }
      `}</style>
    </article>
  );
}
