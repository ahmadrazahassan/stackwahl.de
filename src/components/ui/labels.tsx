import { Info } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

/**
 * Visible disclosure next to commercial content (Section 3.4, UWG § 5a Abs. 4).
 * "affiliate": we may earn a commission. "ad": paid placement.
 */
export function DisclosureLabel({
  kind,
  className,
}: {
  kind: "affiliate" | "ad";
  className?: string;
}) {
  const label = kind === "affiliate" ? "Affiliate-Link" : "Anzeige";
  const explanation =
    kind === "affiliate"
      ? "Wir erhalten eine Provision, wenn Sie über diesen Link einen Vertrag abschließen. Unsere Bewertung beeinflusst das nicht."
      : "Bezahlte Platzierung. Sie beeinflusst keine Bewertung und keine Rangfolge.";
  return (
    <Link
      href={routes.transparency()}
      title={explanation}
      className={cn(
        "inline-flex min-h-6 items-center gap-1 text-label font-medium tracking-[0.04em] text-muted uppercase underline-offset-2 hover:text-ink hover:underline",
        className,
      )}
    >
      <Info aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      {label}
      <span className="sr-only">: {explanation} Mehr zur Finanzierung von Stackwahl.</span>
    </Link>
  );
}

/** Neutral tag for categories and topics. */
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill bg-bg px-3 py-1.5 eyebrow text-ink",
        className,
      )}
      {...props}
    />
  );
}

/** Marks fictitious demo data in the styleguide and drafts in dev. */
export function DemoNote({
  children = "Fiktive Demodaten",
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-dashed border-muted px-3 py-1 text-label font-medium tracking-[0.04em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
