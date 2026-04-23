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
  const url = `https://brandmeetscode.com/work/${id}`;
  const description = `How BrandMeetsCode helped ${project.title}${project.result ? `: ${project.result}` : ""}.${project.resultDetail ? ` ${project.resultDetail}` : ""}`;
  const ogImages = project.heroImage
    ? [{ url: project.heroImage, width: 1200, height: 630, alt: project.title }]
    : undefined;
  return {
    title: `${project.title} — Selected Work | BrandMeetsCode`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — BrandMeetsCode`,
      description,
      url,
      siteName: "BrandMeetsCode",
      type: "website",
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — BrandMeetsCode`,
      description,
      ...(ogImages && { images: [project.heroImage!] }),
    },
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
