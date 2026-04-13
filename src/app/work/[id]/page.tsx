import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import { getCaseStudyUiLabels, getCtaSectionCopy, getProjects } from "@/lib/cms/queries";
import CtaSection from "@/components/sections/CtaSection";
import CaseStudyContent from "./CaseStudyContent";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: `How BrandMeetsCode helped ${project.title}: ${project.result}. ${project.resultDetail}`,
    alternates: { canonical: `https://brandmeetscode.com/work/${id}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const [project, ctaCopy, labels] = await Promise.all([
    getProject(id),
    getCtaSectionCopy(),
    getCaseStudyUiLabels(),
  ]);
  if (!project) notFound();

  return (
    <>
      <CaseStudyContent project={project} labels={labels} />
      <CtaSection copy={ctaCopy} />
    </>
  );
}
