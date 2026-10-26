import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import { cn } from "@/lib/cn";
import { formatDate, formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/routes";
import { ScoreBadge } from "./score";
import type { SoftwareSummary } from "./types";

/**
 * Real vendor logo on white, no shape behind it. Without a logo file the name is set as
 * text: we never draw an imitation of a vendor logo.
 */
export function SoftwareLogo({
  software,
  size = 48,
  className,
}: {
  software: Pick<SoftwareSummary, "name" | "logo">;
  size?: number;
  className?: string;
}) {
  if (software.logo) {
    return (
      <Image
        src={software.logo.src}
        alt={software.logo.alt}
        width={software.logo.width}
        height={software.logo.height}
        className={cn("min-w-0 shrink object-contain object-left", className)}
        // Same height for every logo; very wide wordmarks shrink inside a box of 4:1 at most.
        style={{ height: size, maxWidth: `min(100%, ${size * 4}px)`, width: "auto" }}
      />
    );
  }
  return (
    <span
      className={cn("font-display text-h3 leading-none font-medium tracking-[-0.02em]", className)}
    >
      {software.name}
    </span>
  );
}

/** Software card (Section 13.6.5): logo, name, category, score, price with date, facts, one action. */
export function SoftwareCard({
  software,
  className,
}: {
  software: SoftwareSummary;
  className?: string;
}) {
  const profile = routes.software(software.slug);
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-6 rounded-card border border-line bg-surface p-6 transition-colors duration-200 hover:border-ink",
        className,
      )}
    >
      <div className="flex min-h-12 items-start justify-between gap-4">
        {/* Without a logo file the name stands only in the heading below. */}
        {software.logo ? <SoftwareLogo software={software} size={40} /> : <span />}
        <ScoreBadge value={software.score} research={software.research} />
      </div>
      <div>
        <h3 className="text-h3">
          <Link href={profile} className="after:absolute after:inset-0 after:rounded-card">
            {software.name}
          </Link>
        </h3>
        <p className="mt-1 text-small text-muted">
          {software.category} · {software.vendor}
        </p>
      </div>
      {software.priceFromCents !== null || software.freePlan ? (
        <p className="text-small">
          {software.freePlan ? (
            <span className="block font-medium">Kostenloser Tarif verfügbar</span>
          ) : null}
          <span className={software.freePlan ? "tabular" : "font-medium tabular"}>
            {software.priceFromCents !== null
              ? formatPriceFrom(software.priceFromCents, { net: software.priceNet })
              : null}
          </span>
          <span className="block text-muted">Preisstand {formatDate(software.priceCheckedAt)}</span>
        </p>
      ) : null}
      {software.keyFacts.length > 0 ? (
        <ul className="flex flex-col gap-2 border-t border-line pt-4 text-small">
          {software.keyFacts.map((fact) => (
            <li key={fact} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-primary" />
              {fact}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2">
        <ArrowLink href={profile}>
          {software.score !== null ? "Zum Testbericht" : "Zum Profil"}
        </ArrowLink>
        {software.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
      </div>
    </article>
  );
}
