import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import { cn } from "@/lib/cn";
import { formatDate, formatPriceFrom } from "@/lib/format";
import { ScoreDisplay } from "./score";
import { SoftwareLogo } from "./software-card";
import type { SoftwareSummary } from "./types";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Brotkrumen" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-small text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="py-2 underline-offset-4 hover:text-ink hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn("py-2", last && "text-ink")}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Profile header: logo, name, vendor, score, price with date and one primary action. */
export function ProfileHeader({
  software,
  summary,
  vendorHref,
  className,
}: {
  software: SoftwareSummary;
  summary: string;
  /** Internal /go/[slug] route once affiliate links are active, else the vendor site. */
  vendorHref: string;
  className?: string;
}) {
  return (
    <header className={cn("grid gap-10 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        {software.logo ? <SoftwareLogo software={software} size={56} className="mb-6" /> : null}
        <h1 className="text-h1">
          {software.name} <span className="text-muted">im Test</span>
        </h1>
        <p className="mt-4 text-small text-muted">
          {software.category} · Anbieter: {software.vendor}
        </p>
        <p className="mt-6 max-w-[58ch] text-lead text-muted">{summary}</p>
      </div>
      <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
        {software.score !== null ? <ScoreDisplay value={software.score} /> : null}
        <div className="flex flex-col gap-3 border-t border-line pt-6">
          {software.priceFromCents !== null ? (
            <p className="text-small">
              <span className="font-medium tabular">
                {formatPriceFrom(software.priceFromCents, { net: software.priceNet })}
              </span>
              <span className="text-muted"> · Stand {formatDate(software.priceCheckedAt)}</span>
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <VendorButton href={vendorHref} affiliate={software.affiliate}>
              Zum Anbieter
            </VendorButton>
            {software.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
