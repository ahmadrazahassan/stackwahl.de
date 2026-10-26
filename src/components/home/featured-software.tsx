import { Check } from "lucide-react";
import Link from "next/link";
import { ResearchScoreDisplay } from "@/components/software/research-score";
import { SoftwareLogo } from "@/components/software/software-card";
import { ButtonLink, VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import type { FeaturedItem } from "@/lib/content/home";
import { formatDate, formatPriceFrom, formatScore } from "@/lib/format";
import { routes } from "@/lib/routes";

/**
 * "Im Fokus" (home): the programs with the highest Recherche-Wertung, each with its criteria,
 * two sourced strengths, the entry price and both actions. The selection rule sits above.
 */
export function FeaturedSoftware({ items }: { items: FeaturedItem[] }) {
  if (items.length === 0) return null;
  return (
    <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.summary.slug} className="min-w-0">
          <FeaturedCard item={item} />
        </li>
      ))}
    </ol>
  );
}

function FeaturedCard({ item }: { item: FeaturedItem }) {
  const { summary, score } = item;
  const profile = routes.software(summary.slug);
  return (
    <article
      aria-labelledby={`fokus-${summary.slug}`}
      className="flex h-full flex-col gap-6 rounded-card border border-line bg-surface p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow text-muted tabular">
          Platz {String(item.rank).padStart(2, "0")}
        </span>
        <span className="text-small text-muted">{summary.category}</span>
      </div>

      <div className="min-h-10">
        {summary.logo ? <SoftwareLogo software={summary} size={36} /> : null}
      </div>

      <div>
        <h3 id={`fokus-${summary.slug}`} className="text-h3">
          <Link href={profile} className="underline-offset-4 hover:underline">
            {summary.name}
          </Link>
        </h3>
        {summary.vendor !== summary.name ? (
          <p className="mt-1 text-small text-muted">{summary.vendor}</p>
        ) : null}
      </div>

      <ResearchScoreDisplay value={score.total} size="sm" />

      <dl className="flex flex-col gap-3 text-small">
        {score.criteria.map((c) => (
          <div key={c.key} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3">
            <dt className="text-muted">{c.label}</dt>
            <dd className="font-medium tabular">{formatScore(c.value)}</dd>
            <dd className="col-span-2 mt-1.5 h-1 w-full rounded-pill bg-bg" aria-hidden="true">
              <span
                className="block h-1 rounded-pill bg-primary"
                style={{ width: `${c.value * 10}%` }}
              />
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-line pt-5">
        <p className="eyebrow text-muted">Stärken</p>
        <ul className="mt-3 flex flex-col gap-2 text-small">
          {item.pros.map((pro) => (
            <li key={pro} className="flex gap-2">
              <Check
                aria-hidden="true"
                strokeWidth={1.75}
                className="mt-0.5 size-4 shrink-0 text-positive"
              />
              {pro}
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-card bg-bg px-4 py-3 text-small">
        <span className="font-medium">Geeignet für: </span>
        {item.idealFor}
      </p>

      <div className="mt-auto flex flex-col gap-3">
        <p className="text-small">
          {summary.freePlan ? (
            <span className="block font-medium">Kostenloser Tarif verfügbar</span>
          ) : null}
          {summary.priceFromCents !== null ? (
            <span className="block font-medium tabular">
              {formatPriceFrom(summary.priceFromCents, { net: summary.priceNet })}
            </span>
          ) : null}
          <span className="block text-muted">Preisstand {formatDate(summary.priceCheckedAt)}</span>
        </p>
        <VendorButton
          href={item.vendor.href}
          affiliate={item.vendor.affiliate}
          variant="dark"
          size="lg"
          className="w-full"
        >
          Website besuchen
          <span className="sr-only"> von {summary.name}</span>
        </VendorButton>
        {item.vendor.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
        <ButtonLink href={profile} variant="outline" arrow="none" className="w-full">
          Profil und Wertung
          <span className="sr-only"> zu {summary.name}</span>
        </ButtonLink>
      </div>
    </article>
  );
}
