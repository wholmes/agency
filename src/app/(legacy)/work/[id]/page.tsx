import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import { getCaseStudyUiLabels } from "@/lib/cms/queries";
import CaseStudyContent from "./CaseStudyContent";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} — Selected Work`,
    description: `How BrandMeetsCode helped ${project.title}: ${project.result}. ${project.resultDetail}`,
    alternates: { canonical: `https://brandmeetscode.com/work/${id}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const [project, labels] = await Promise.all([
    getProject(id),
    getCaseStudyUiLabels(),
  ]);
  if (!project) notFound();

  return (
    <>
      <CaseStudyContent project={project} labels={labels} />
    </>
  );
}
