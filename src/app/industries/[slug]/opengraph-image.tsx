import { ImageResponse } from "next/og";
import { getIndustryPage } from "@/lib/cms/queries";
import { OgCard } from "@/app/opengraph-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const page = await getIndustryPage(slug).catch(() => null);

  return new ImageResponse(
    <OgCard
      title={page?.heroHeadline ?? page?.name ?? "Industry Focus"}
      description={page?.heroSubheadline ?? undefined}
      eyebrow="BrandMeetsCode · Industry"
    />,
    { ...size },
  );
}
