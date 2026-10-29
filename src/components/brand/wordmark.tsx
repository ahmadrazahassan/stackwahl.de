import { useId } from "react";
import { cn } from "@/lib/cn";

// The mark: two offset slabs merge into one solid block that reads as an "S" and as a stack
// ("Stack"). The ballot cross ("Wahl") is cut out where the slabs meet, so it always shows the
// background. Flat, no gradient. 36 x 32 grid, outer corners r6, inner fillets r2.

export const MARK_SHAPE =
  "M6 0H22A6 6 0 0 1 28 6V14A2 2 0 0 0 30 16A6 6 0 0 1 36 22V26A6 6 0 0 1 30 32H14A6 6 0 0 1 8 26V18A2 2 0 0 0 6 16A6 6 0 0 1 0 10V6A6 6 0 0 1 6 0Z";
export const MARK_CROSS = "M14.25 12.25L21.75 19.75M21.75 12.25L14.25 19.75";
export const MARK_CROSS_WIDTH = 2.6;

export function BrandMark({ className, size = 28 }: { className?: string; size?: number }) {
  const mask = useId();
  return (
    <svg
      width={(size * 36) / 32}
      height={size}
      viewBox="0 0 36 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <mask id={mask}>
        <rect x="-1" y="-1" width="38" height="34" fill="white" />
        <path d={MARK_CROSS} stroke="black" strokeWidth={MARK_CROSS_WIDTH} strokeLinecap="round" />
      </mask>
      <path d={MARK_SHAPE} fill="currentColor" mask={`url(#${mask})`} />
    </svg>
  );
}

/** Mark in brand blue and name in ink, used in header and mobile menu. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark size={24} className="text-primary" />
      <span className="font-display text-[1.5rem] leading-none font-semibold tracking-[-0.055em]">
        stackwahl
      </span>
    </span>
  );
}
