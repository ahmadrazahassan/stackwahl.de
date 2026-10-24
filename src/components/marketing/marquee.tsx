import { cn } from "@/lib/cn";

/**
 * One oversized statement that drifts slowly (reference 1). Pure CSS; under
 * `prefers-reduced-motion` it stands still. The text is read once by screen readers.
 */
export function Marquee({ text, className }: { text: string; className?: string }) {
  const item = (
    <span className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
      {text}
      <span aria-hidden="true" className="inline-block size-[0.18em] bg-primary" />
    </span>
  );
  return (
    <div className={cn("overflow-hidden", className)}>
      <p className="sr-only">{text}</p>
      <div
        aria-hidden="true"
        className="flex w-max animate-[marquee_48s_linear_infinite] font-display text-[clamp(3.5rem,9vw,9rem)] leading-none font-normal tracking-[-0.04em] whitespace-nowrap motion-reduce:animate-none"
      >
        {item}
        {item}
        {item}
        {item}
      </div>
    </div>
  );
}
