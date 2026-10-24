import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";

export type FeatureTile = {
  title: string;
  text: string;
  art: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

const tones = ["bg-primary text-surface", "bg-ink text-surface", "bg-surface text-ink"] as const;

/**
 * Three tile band (reference 1): flat fills primary, ink, white; number top right,
 * line illustration top left, title and one line at the bottom.
 */
export function FeatureTiles({ tiles, className }: { tiles: FeatureTile[]; className?: string }) {
  return (
    <ul
      className={cn(
        "mx-3 grid overflow-hidden rounded-[1.25rem] sm:mx-4 sm:rounded-panel md:grid-cols-3",
        className,
      )}
    >
      {tiles.map((tile, index) => {
        const Art = tile.art;
        return (
          <li
            key={tile.title}
            className={cn(
              "flex min-h-[20rem] flex-col justify-between gap-12 p-6 sm:p-8 lg:min-h-[24rem]",
              tones[index % tones.length],
              index % tones.length === 2 && "border-t border-line md:border-t-0",
            )}
          >
            <div className="flex items-start justify-between">
              <Art size={88} />
              <span className="text-small tabular" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}.
              </span>
            </div>
            <div className="max-w-[34ch]">
              <h3 className="text-h3">{tile.title}</h3>
              <p className={cn("mt-3 text-small", index % tones.length === 2 ? "text-muted" : "")}>
                {tile.text}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
