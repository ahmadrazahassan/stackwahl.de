import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/seo/og-card";
import { getGuide, getGuides, staticSlugs } from "@/lib/content";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Ratgeber von Stackwahl";

export function generateStaticParams() {
  return staticSlugs(getGuides().map((g) => g.slug));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  return new ImageResponse(
    <OgCard
      kicker={guide ? `Ratgeber · ${guide.topic}` : "Ratgeber"}
      title={guide?.thumbnail.headline ?? "Stackwahl Ratgeber"}
      detail={guide?.title}
    />,
    size,
  );
}
