import { ImageResponse } from "next/og";
import { getProject } from "@/lib/projects";
import { OgCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id).catch(() => null);

  const title = project ? `${project.title}` : "Case Study";
  const description = project?.result ?? "A BrandMeetsCode case study.";

  return new ImageResponse(
    <OgCard
      title={title}
      description={description}
      eyebrow="BrandMeetsCode · Case Study"
    />,
    { ...size },
  );
}
