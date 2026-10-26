import Image from "next/image";
import type { ComponentType } from "react";
import {
  Arcs,
  Lattice,
  NestedSquares,
  RayBurst,
  StackLines,
} from "@/components/illustrations/line-art";
import type { Guide } from "@/content/schemas";
import { cn } from "@/lib/cn";
import type { ThumbLogo } from "@/lib/content/guides";

// Article thumbnail drawn in code (Section 13.11): a flat brand colour, the topic as pills, a
// kicker and a large headline, one fine line illustration and the real vendor logos on white
// plates. Text scales with the thumbnail through container query units, so the same
// component works as a card image and as the article hero. Purely decorative for assistive
// technology: the title is always repeated as real text next to it.

const ART: Record<
  Guide["thumbnail"]["art"],
  ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
> = {
  rayburst: RayBurst,
  nestedsquares: NestedSquares,
  lattice: Lattice,
  stacklines: StackLines,
  arcs: Arcs,
};

const TONE = {
  primary: { panel: "bg-primary text-surface", pill: "bg-surface text-ink", art: "text-surface" },
  ink: { panel: "bg-ink text-surface", pill: "bg-surface text-ink", art: "text-primary-tint" },
  tint: { panel: "bg-primary-tint text-ink", pill: "bg-ink text-surface", art: "text-primary" },
} as const;

export function ArticleThumbnail({
  thumbnail,
  tags,
  logos,
  className,
  priority = false,
}: {
  thumbnail: Guide["thumbnail"];
  tags: string[];
  logos: ThumbLogo[];
  className?: string;
  priority?: boolean;
}) {
  const tone = TONE[thumbnail.tone];
  const Art = ART[thumbnail.art];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "@container relative aspect-[16/9] overflow-hidden rounded-card",
        tone.panel,
        className,
      )}
    >
      <ul className="absolute top-[4.5cqw] left-[4.5cqw] flex max-w-[60%] flex-wrap gap-[1.5cqw]">
        {tags.slice(0, 2).map((tag) => (
          <li
            key={tag}
            className={cn(
              "rounded-pill px-[2.6cqw] py-[1cqw] text-[2.5cqw] leading-none font-medium tracking-[0.06em] uppercase",
              tone.pill,
            )}
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* The art is drawn at 96 units; a thinner stroke keeps a fine line at thumbnail size. */}
      <Art
        size={256}
        strokeWidth={0.6}
        className={cn(
          "absolute -right-[6cqw] -bottom-[8cqw] h-auto w-[52cqw] opacity-90",
          tone.art,
        )}
      />

      {logos.length > 0 ? (
        <ul className="absolute top-[4.5cqw] right-[4.5cqw] flex w-[28cqw] flex-col gap-[1.8cqw]">
          {logos.slice(0, 3).map((logo) => (
            <li
              key={logo.src}
              className="flex h-[8.5cqw] items-center justify-center rounded-[1.4cqw] bg-surface px-[2.2cqw]"
            >
              <Image
                src={logo.src}
                alt=""
                width={logo.width}
                height={logo.height}
                priority={priority}
                className="h-[4.4cqw] w-auto max-w-full object-contain"
              />
            </li>
          ))}
        </ul>
      ) : null}

      <div className="absolute right-[34cqw] bottom-[5cqw] left-[4.5cqw]">
        <p className="flex items-center gap-[1.4cqw] text-[2.4cqw] leading-none font-medium tracking-[0.08em] uppercase">
          <span
            className={cn("size-[1.2cqw]", thumbnail.tone === "tint" ? "bg-primary" : "bg-surface")}
          />
          {thumbnail.kicker}
        </p>
        <p className="mt-[2cqw] font-display text-[7.4cqw] leading-[1.02] font-medium tracking-[-0.03em] text-balance">
          {thumbnail.headline}
        </p>
      </div>
    </div>
  );
}
