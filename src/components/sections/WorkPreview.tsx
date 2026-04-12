"use client";

import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import { IconArrowUpRight } from "../icons";
import WorkOverlapFieldCanvas from "../WorkOverlapFieldCanvas";
import { projects } from "@/lib/projects";

export default function WorkPreview() {
  return (
    <section aria-labelledby="work-heading" className="section relative overflow-visible bg-surface">
      {/* Layered field: same language as hero; radial ripples + cooler gold; bleeds into section above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[min(260px,36vh)] z-[1] hidden h-[min(400px,52vh)] md:block"
      >
        <div
          className="absolute right-6 bottom-0 h-full w-[min(480px,46vw)] md:right-10 lg:right-16 lg:w-[min(520px,42vw)] [mask-image:linear-gradient(to_bottom,transparent,black_26%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_26%)]"
        >
          <WorkOverlapFieldCanvas />
        </div>
      </div>

      <div className="container relative z-[2]">
        <div className="mb-16 max-w-[640px]">
          <ScrollReveal>
            <p className="text-overline mb-4">Selected Work</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 id="work-heading" className="text-h2">
              Results, not just{" "}
              <em className="italic-display text-accent">renderings</em>
            </h2>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-4">
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} delay={i * 100} />
          ))}
        </div>

        <ScrollReveal delay={300} className="pt-16 text-center">
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
  project: (typeof projects)[number];
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <Link
        href={`/work/${project.id}`}
        className="project-row block no-underline"
        style={{ "--project-accent": project.accent } as React.CSSProperties}
        aria-label={`Case study: ${project.title}`}
        data-cursor-label="Case Study"
      >
        <article className="project-article grid grid-cols-1 gap-6 rounded-lg border border-border bg-bg p-8 transition-[transform,box-shadow,border-color] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-out)] md:grid-cols-[1fr_1.2fr] md:items-center">
          <div
            className="project-visual relative flex h-[clamp(180px,25vw,280px)] items-center justify-center overflow-hidden rounded-md md:rounded-md"
            style={{ background: project.color }}
          >
            <div
              aria-hidden="true"
              className="project-gradient absolute inset-0 opacity-90 transition-[opacity] [transition-duration:400ms] [transition-timing-function:var(--ease-out)]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 30% 40%, ${project.accent}22 0%, transparent 60%),
                  radial-gradient(circle at 70% 70%, ${project.accent}11 0%, transparent 50%)
                `,
              }}
            />
            <div
              aria-hidden="true"
              className="project-ghost-letter relative text-[clamp(3rem,8vw,5rem)] font-light tracking-tighter transition-[transform,opacity] [transition-duration:500ms] [transition-timing-function:var(--ease-out)] select-none"
              style={{ color: project.accent, opacity: 0.15, transformOrigin: "center center" }}
            >
              {project.title.charAt(0)}
            </div>
            <div
              className="project-year absolute top-4 right-4 font-mono text-xs tracking-wider transition-opacity [transition-duration:300ms] [transition-timing-function:var(--ease-out)]"
              style={{ color: `${project.accent}99` }}
              aria-hidden="true"
            >
              {project.year}
            </div>
            <div
              aria-hidden="true"
              className="project-border-accent pointer-events-none absolute inset-0 rounded-md border border-transparent transition-[border-color] [transition-duration:400ms] [transition-timing-function:var(--ease-out)]"
            />
          </div>

          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs tracking-wider text-text-tertiary uppercase">{project.category}</p>
                <h3 className="font-display text-2xl font-light tracking-tight text-text-primary">{project.title}</h3>
              </div>
              <IconArrowUpRight
                size={20}
                className="project-arrow mt-1 shrink-0 text-text-tertiary transition-colors [transition-duration:var(--duration-base)]"
              />
            </div>

            <p className="mb-5 text-sm leading-relaxed text-text-secondary">{project.proofFit}</p>

            <div className="inline-flex items-center gap-2 rounded-sm border border-accent-muted bg-accent-subtle px-3 py-2 text-xs font-medium text-accent">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
              {project.result}
            </div>
          </div>
        </article>
      </Link>
    </ScrollReveal>
  );
}
