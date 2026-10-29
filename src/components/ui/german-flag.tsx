import { cn } from "@/lib/cn";

// The federal flag in its official colours (Schwarz, Rot RGB 221 0 0, Gold RGB 255 206 0), 5:3.
// The colours are SVG attributes, not CSS, because they belong to the flag, not the palette.
// Decorative by default: the text next to it always says "Deutschland" or names the place.

export function GermanFlag({
  className,
  label,
}: {
  className?: string;
  /** Accessible name when the flag stands alone. */
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 5 3"
      className={cn("h-[0.75em] w-auto shrink-0 rounded-[2px]", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      focusable="false"
    >
      <rect width="5" height="1" y="0" fill="#000000" />
      <rect width="5" height="1" y="1" fill="#dd0000" />
      <rect width="5" height="1" y="2" fill="#ffce00" />
    </svg>
  );
}
