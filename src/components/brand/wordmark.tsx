import { cn } from "@/lib/cn";

// Three wordmark options for the owner to choose from (Section 13.10). Flat, no gradient,
// no container. Option B carries the mark "Stapel-S": three stacked bars shifted into an S.
// The full-width middle bar is set in primary (the choice, "Wahl"). The offsets keep it from
// reading as a menu icon, and the 32-unit grid keeps every edge on whole pixels at 16 and 32 px.

export type WordmarkOption = "a" | "b" | "c";

export function StackMark({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2" y="3" width="19" height="7.5" rx="2" fill="currentColor" />
      <rect x="2" y="12.25" width="28" height="7.5" rx="2" fill="var(--color-primary)" />
      <rect x="11" y="21.5" width="19" height="7.5" rx="2" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({
  option = "b",
  className,
}: {
  option?: WordmarkOption;
  className?: string;
}) {
  if (option === "a") {
    return (
      <span
        className={cn(
          "font-display text-[1.5rem] leading-none font-medium tracking-[-0.045em]",
          className,
        )}
      >
        Stackwahl
      </span>
    );
  }
  if (option === "c") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline font-display text-[1.5rem] leading-none font-medium tracking-[-0.045em]",
          className,
        )}
      >
        stackwahl
        <span aria-hidden="true" className="ml-0.5 inline-block size-[0.28em] bg-primary" />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <StackMark size={26} />
      <span className="font-display text-[1.5rem] leading-none font-medium tracking-[-0.045em]">
        Stackwahl
      </span>
    </span>
  );
}

/** The approved option used in header and footer. */
export const ACTIVE_WORDMARK: WordmarkOption = "b"; // approved by the owner on 24.10.2026
