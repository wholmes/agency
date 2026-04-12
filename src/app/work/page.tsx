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
      <section className="border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24">
        <div className="container">
          <ScrollReveal>
            <p className="text-overline mb-5">Selected Work</p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-h1 mb-6 max-w-[640px]">
              Results, not just <em className="italic-display text-accent">renderings</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-body-lg max-w-[520px]">
              Every case study follows the same format: the problem as the client described it, what we actually did, and
              what happened as a result.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section aria-label="Case studies" className="section">
        <div className="container">
          <div className="flex flex-col gap-24">
            {projects.map((project) => (
              <CaseStudy key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

function CaseStudy({ project }: { project: Project }) {
  return (
    <article aria-labelledby={`case-${project.id}`}>
      <ScrollReveal>
        <Link
          href={`/work/${project.id}`}
          className="case-header mb-10 grid grid-cols-1 items-center gap-8 no-underline transition-opacity hover:opacity-90 md:grid-cols-[1.2fr_1fr]"
        >
          <div
            className="relative flex h-[clamp(240px,35vw,400px)] items-center justify-center overflow-hidden rounded-lg"
            style={{ background: project.color }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `radial-gradient(circle at 30% 40%, ${project.accent}22 0%, transparent 60%)` }}
            />
            <span
              className="font-display select-none text-[clamp(4rem,12vw,8rem)] font-light tracking-tighter"
              style={{ color: project.accent, opacity: 0.12 }}
            >
              {project.title.split(" ")[0]}
            </span>
          </div>

          <div>
            <p className="mb-3 text-xs tracking-wider text-text-tertiary uppercase">
              {project.category} · {project.year}
            </p>
            <h2 id={`case-${project.id}`} className="text-h3 mb-5">
              {project.title}
            </h2>
            <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-accent-muted bg-accent-subtle px-4 py-2">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-xs font-medium text-accent">{project.result}</span>
            </div>
            <p className="text-sm text-text-tertiary">{project.resultDetail}</p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
              Read case study <IconArrowUpRight size={14} />
            </div>
          </div>
        </Link>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="case-body grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-8">
            <p className="mb-4 text-xs font-medium tracking-wider text-accent uppercase">Problem</p>
            <p className="text-base leading-relaxed text-text-secondary">{project.problem}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-8">
            <p className="mb-4 text-xs font-medium tracking-wider text-accent uppercase">Approach</p>
            <p className="text-base leading-relaxed text-text-secondary">{project.approach}</p>
          </div>
        </div>
      </ScrollReveal>

        <div className="mt-16 h-px bg-border" aria-hidden="true" />
    </article>
  );
}
