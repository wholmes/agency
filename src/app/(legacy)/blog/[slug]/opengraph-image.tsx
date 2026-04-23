import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/cms/queries";
import { OgCard } from "@/app/opengraph-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);

  // If the post has a cover image, redirect to it — Next.js will use it as-is
  // Otherwise render the branded card
  const title = post?.title ?? "Journal";
  const description = post?.excerpt ?? "BrandMeetsCode Journal";

  return new ImageResponse(
    <OgCard
      title={title}
      description={description}
      eyebrow="BrandMeetsCode · Journal"
    />,
    { ...size },
  );
}
