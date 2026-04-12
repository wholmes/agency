"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight } from "../icons";

const projects = [
  {
    id: "meridian",
    title: "Meridian SaaS",
    category: "Web Design & Development",
    result: "+40% demo requests in 30 days",
    description:
      "A complete rebuild of a B2B SaaS marketing site — cleaner positioning, conversion-first architecture.",
    color: "#1A2A1A",
    accent: "#4DAF7C",
    year: "2025",
  },
  {
    id: "arclight",
    title: "Arclight Labs",
    category: "Brand Strategy + Web",
    result: "Series A secured post-launch",
    description:
      "Pre-launch brand and site for a deeptech startup entering a crowded market. Clarity became their competitive advantage.",
    color: "#1A1A2A",
    accent: "#6B8CE8",
    year: "2025",
  },
  {
    id: "sable",
    title: "Sable Studio",
    category: "Analytics Integration",
    result: "3× faster reporting cycle",
    description:
      "Migrated a creative studio from gut-feel metrics to a custom GA4 + Looker setup that actually got used.",
    color: "#2A1A18",
    accent: "#E88B6B",
    year: "2024",
  },
];

export default function WorkPreview() {
  return (
    <section aria-labelledby="work-heading" className="section" style={{ background: "var(--color-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "var(--space-16)" }}>
          <ScrollReveal>
            <p className="text-overline" style={{ marginBottom: "var(--space-4)" }}>
              Selected Work
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 id="work-heading" className="text-h2" style={{ maxWidth: "560px" }}>
              Results, not just
              {" "}
              <em className="italic-display" style={{ color: "var(--color-accent)" }}>
                renderings
              </em>
            </h2>
          </ScrollReveal>
        </div>

        {/* Projects */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} delay={i * 100} />
          ))}
        </div>

        <ScrollReveal delay={300} style={{ textAlign: "center", paddingTop: "var(--space-16)" }}>
          <Link href="/work" className="btn btn-secondary">
            View All Work
            <IconArrowUpRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  delay,
}: {
  project: (typeof projects)[0];
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <Link
        href={`/work/${project.id}`}
        style={{ display: "block", textDecoration: "none" }}
        className="project-row"
        aria-label={`Case study: ${project.title}`}
      >
        <article
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-6)",
            padding: "var(--space-8)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg)",
            transition: "transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)",
          }}
          className="project-article"
        >
          {/* Visual block */}
          <div
            style={{
              height: "clamp(180px, 25vw, 280px)",
              borderRadius: "var(--radius-md)",
              background: project.color,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Abstract visual representation */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  radial-gradient(circle at 30% 40%, ${project.accent}22 0%, transparent 60%),
                  radial-gradient(circle at 70% 70%, ${project.accent}11 0%, transparent 50%)
                `,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "relative",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                color: project.accent,
                opacity: 0.15,
                userSelect: "none",
              }}
            >
              {project.title.charAt(0)}
            </div>
            {/* Year tag */}
            <div
              style={{
                position: "absolute",
                top: "var(--space-4)",
                right: "var(--space-4)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.1em",
                color: `${project.accent}99`,
                fontFamily: "var(--font-mono, monospace)",
              }}
              aria-hidden="true"
            >
              {project.year}
            </div>
          </div>

          {/* Content */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
              <div>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-tertiary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {project.category}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {project.title}
                </h3>
              </div>
              <IconArrowUpRight size={20} style={{ color: "var(--color-text-tertiary)", flexShrink: 0, marginTop: "var(--space-1)" } as React.CSSProperties} className="project-arrow" />
            </div>

            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
              {project.description}
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-accent-subtle)",
                border: "1px solid var(--color-accent-muted)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-xs)",
                color: "var(--color-accent)",
                fontWeight: 500,
              }}
            >
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)" }} />
              {project.result}
            </div>
          </div>
        </article>

        <style>{`
          .project-row:hover .project-article {
            transform: translateY(-4px);
            box-shadow: var(--shadow-card-hover);
            border-color: var(--color-accent-muted) !important;
          }
          .project-row:hover .project-arrow {
            color: var(--color-accent) !important;
          }
          @media (min-width: 768px) {
            .project-article {
              grid-template-columns: 1fr 1.2fr !important;
              align-items: center;
            }
          }
        `}</style>
      </Link>
    </ScrollReveal>
  );
}
