import { cn } from "@/lib/cn";

// Three wordmark options for the owner to choose from (Section 13.10). Flat, no gradient,
// no container. Option B carries the mark: three stacked bars, one in primary (the choice).

export type WordmarkOption = "a" | "b" | "c";

export function StackMark({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2" y="4" width="24" height="5" rx="1.5" fill="currentColor" />
      <rect x="2" y="11.5" width="24" height="5" rx="1.5" fill="var(--color-primary)" />
      <rect x="2" y="19" width="24" height="5" rx="1.5" fill="currentColor" />
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
