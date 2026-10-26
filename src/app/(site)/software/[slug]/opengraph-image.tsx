import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/seo/og-card";
import { getAllSoftware, getSoftware, staticSlugs, toSummary } from "@/lib/content";
import { formatPriceFrom, formatScore } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Softwareprofil auf Stackwahl";

export function generateStaticParams() {
  return staticSlugs(getAllSoftware().map((s) => s.slug));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const software = getSoftware((await params).slug);
  const summary = software ? toSummary(software) : null;
  const detail = summary
    ? [
        summary.research !== null
          ? `Recherche-Wertung ${formatScore(summary.research)} von 10`
          : null,
        summary.priceFromCents !== null
          ? formatPriceFrom(summary.priceFromCents, { net: summary.priceNet })
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : undefined;
  return new ImageResponse(
    <OgCard
      kicker={summary ? summary.category : "Softwareprofil"}
      title={software ? `${software.name} im Überblick` : "Stackwahl"}
      detail={detail}
    />,
    size,
  );
}
