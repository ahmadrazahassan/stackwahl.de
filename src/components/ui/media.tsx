import Image from "next/image";
import { cn } from "@/lib/cn";

export type RealImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Photographer or source, shown as credit where the license requires it. */
  credit?: string;
};

/**
 * Rounded image frame. Only real, licensed images (Section 3.8). Without an image it renders
 * a labeled empty frame, which is allowed only on the internal styleguide.
 */
export function MediaFrame({
  image,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  missingLabel = "Platz für ein echtes Foto",
  className,
}: {
  image?: RealImage;
  sizes?: string;
  priority?: boolean;
  missingLabel?: string;
  className?: string;
}) {
  if (!image) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] items-center justify-center rounded-card border border-dashed border-muted bg-bg p-6 text-center text-small text-muted",
          className,
        )}
      >
        {missingLabel}
      </div>
    );
  }
  return (
    <figure className={cn("relative overflow-hidden rounded-card", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
      {image.credit ? (
        <figcaption className="absolute right-3 bottom-3 rounded-pill bg-surface px-2 py-1 text-label text-muted">
          {image.credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
