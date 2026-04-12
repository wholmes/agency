import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProject } from "@/lib/projects";
import ScrollReveal from "@/components/ScrollReveal";
import { IconArrowUpRight } from "@/components/icons";
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
      <section className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-height)+6rem)] pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `radial-gradient(ellipse at 70% 30%, ${project.accent}08 0%, transparent 60%)` }}
        />
        <div className="container relative">
          <ScrollReveal>
            <Link
              href="/work"
              className="back-link mb-8 inline-flex items-center gap-2 text-sm text-text-tertiary no-underline transition-colors [transition-duration:var(--duration-base)] hover:text-text-primary"
            >
              ← All Work
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <p className="text-overline mb-4">
              {project.category} · {project.year}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <h1 className="text-h1 mb-6">{project.title}</h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="mb-10 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-sm border border-accent-muted bg-accent-subtle px-5 py-3">
                <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-wide text-accent">{project.result}</span>
              </div>
              <p className="text-sm text-text-tertiary">{project.resultDetail}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <div className="flex flex-wrap gap-2">
              {project.services.map((s) => (
                <span
                  key={s}
                  className="rounded-sm border border-border bg-surface px-3 py-2 text-xs tracking-wider text-text-secondary uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal>
        <div
          className="relative flex h-[clamp(280px,40vw,480px)] items-center justify-center overflow-hidden"
          style={{ background: project.color }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, ${project.accent}28 0%, transparent 55%), radial-gradient(circle at 75% 70%, ${project.accent}14 0%, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.02)_1px,transparent_1px)] bg-size-[60px_60px]" />
          <span
            className="relative select-none font-display text-[clamp(6rem,18vw,14rem)] font-light tracking-tighter"
            style={{ color: project.accent, opacity: 0.1 }}
          >
            {project.title.split(" ")[0]}
          </span>
        </div>
      </ScrollReveal>

      <section aria-label="Case study details" className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ScrollReveal>
              <div className="rounded-lg border border-border bg-surface p-10">
                <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-accent uppercase">01 — Problem</p>
                <p className="font-display text-lg font-light leading-relaxed tracking-tight text-text-primary">
                  {project.problem}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="rounded-lg border border-border bg-surface p-10">
                <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-accent uppercase">02 — Approach</p>
                <p className="font-display text-lg font-light leading-relaxed tracking-tight text-text-primary">
                  {project.approach}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="relative overflow-hidden rounded-lg border border-accent-muted bg-accent-subtle p-10 md:col-span-2">
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 left-0 h-0.5 bg-[linear-gradient(to_right,var(--color-accent),transparent)]"
                />
                <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-accent uppercase">03 — Result</p>
                <p className="font-display text-lg font-light leading-relaxed tracking-tight text-text-primary">
                  {project.outcome}
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal
            delay={100}
            className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-24"
          >
            <Link
              href="/work"
              className="back-link text-sm text-text-secondary no-underline transition-colors [transition-duration:var(--duration-base)] hover:text-text-primary"
            >
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
    </>
  );
}
