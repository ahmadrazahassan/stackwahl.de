import { Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SoftwareLogo } from "@/components/software/software-card";
import { ArrowLink, ButtonLink, VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import {
  SegmentedContent,
  SegmentedList,
  SegmentedRoot,
  SegmentedTrigger,
} from "@/components/ui/segmented";
import type { OverviewRow, OverviewTab } from "@/lib/content/home";
import { formatDate, formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/routes";

/**
 * Market overview in list form (home): summary, strengths and limits next to price, trial and
 * the two actions. The order is the cheapest paid plan, explained above the list.
 */
export function OverviewList({ tabs }: { tabs: OverviewTab[] }) {
  if (tabs.length === 0) return null;
  return (
    <SegmentedRoot defaultValue={tabs[0].slug}>
      <SegmentedList aria-label="Kategorie wählen">
        {tabs.map((tab) => (
          <SegmentedTrigger key={tab.slug} value={tab.slug}>
            {tab.label}
          </SegmentedTrigger>
        ))}
      </SegmentedList>
      {tabs.map((tab) => (
        <SegmentedContent key={tab.slug} value={tab.slug} className="mt-8">
          <ol className="flex flex-col gap-4">
            {tab.rows.map((row, i) => (
              <li key={row.summary.slug}>
                <Row row={row} position={i + 1} />
              </li>
            ))}
          </ol>
          <ArrowLink href={tab.href} className="mt-6">
            Alle {tab.total} Programme mit Filtern und Vergleichstabelle
          </ArrowLink>
        </SegmentedContent>
      ))}
    </SegmentedRoot>
  );
}

function Row({ row, position }: { row: OverviewRow; position: number }) {
  const { summary } = row;
  const profile = routes.software(summary.slug);
  return (
    <article
      aria-labelledby={`uebersicht-${summary.slug}`}
      className="grid gap-8 rounded-card border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12"
    >
      <div className="min-w-0 lg:col-span-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="eyebrow text-muted tabular">{String(position).padStart(2, "0")}</span>
          {summary.logo ? <SoftwareLogo software={summary} size={32} /> : null}
        </div>
        <h3 id={`uebersicht-${summary.slug}`} className="mt-4 text-h3">
          <Link href={profile} className="underline-offset-4 hover:underline">
            {summary.name}
          </Link>
        </h3>
        <p className="mt-1 text-small text-muted">
          {summary.vendor}
          {row.vendorSeat ? `, ${row.vendorSeat}` : ""}
        </p>
        <p className="mt-4 max-w-[62ch] text-body">{row.tagline}</p>
        <p className="mt-4 rounded-card bg-bg px-4 py-3 text-small">
          <span className="font-medium">Geeignet für: </span>
          {row.idealFor}
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <PointList title="Stärken" items={row.pros} kind="pro" />
          <PointList title="Beachten Sie" items={row.cons} kind="con" />
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-5 border-t border-line pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <p className="text-small">
          {summary.freePlan ? (
            <span className="block font-medium">Kostenloser Tarif verfügbar</span>
          ) : null}
          {summary.priceFromCents !== null ? (
            <span className="block text-h3 font-medium tabular">
              {formatPriceFrom(summary.priceFromCents, { net: summary.priceNet })}
            </span>
          ) : null}
          <span className="block text-muted">Preisstand {formatDate(summary.priceCheckedAt)}</span>
        </p>
        <ul className="flex flex-col gap-2 text-small">
          {row.facts.map((fact) => (
            <Fact key={fact.text} ok={fact.ok}>
              {fact.text}
            </Fact>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <VendorButton
            href={row.vendor.href}
            affiliate={row.vendor.affiliate}
            variant="dark"
            size="lg"
            className="w-full"
          >
            Website besuchen
            <span className="sr-only"> von {summary.name}</span>
          </VendorButton>
          <p className="flex flex-wrap items-center justify-between gap-2 text-small text-muted">
            <span>Weiter zu {hostname(summary.vendorUrl)}</span>
            {row.vendor.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ButtonLink href={profile} variant="outline" arrow="none" className="w-full">
              Profil lesen
              <span className="sr-only"> zu {summary.name}</span>
            </ButtonLink>
            <ButtonLink
              href={`${routes.comparisonTool()}?software=${summary.slug}`}
              variant="outline"
              arrow="none"
              className="w-full"
            >
              Vergleichen
              <span className="sr-only"> mit {summary.name}</span>
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

/** "https://www.lexware.de/..." -> "lexware.de" */
function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www./, "");
  } catch {
    return url;
  }
}

function PointList({
  title,
  items,
  kind,
}: {
  title: string;
  items: string[];
  kind: "pro" | "con";
}) {
  const Icon = kind === "pro" ? Plus : Minus;
  return (
    <div>
      <h4 className="eyebrow text-muted">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2 text-small">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Icon
              aria-hidden="true"
              strokeWidth={1.75}
              className={`mt-0.5 size-4 shrink-0 ${kind === "pro" ? "text-positive" : "text-negative"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Check for documented facts, a neutral dash otherwise; the text always states the status. */
function Fact({ ok, children }: { ok: boolean; children: ReactNode }) {
  const Icon = ok ? Check : Minus;
  return (
    <li className="flex gap-2">
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className={`mt-0.5 size-4 shrink-0 ${ok ? "text-positive" : "text-muted"}`}
      />
      <span className={ok ? undefined : "text-muted"}>{children}</span>
    </li>
  );
}
