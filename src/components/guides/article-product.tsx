import Link from "next/link";
import { SoftwareLogo } from "@/components/software/software-card";
import { ButtonLink, VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import type { ArticleProduct } from "@/lib/content/guides";
import { cn } from "@/lib/cn";
import { formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/routes";

/**
 * A program named in an article: logo, name, one line, price with date and the two actions.
 * "compact" sits inside a section, the full variant in the list at the end of the article.
 */
export function ArticleProductCard({
  product,
  compact = false,
  className,
}: {
  product: NonNullable<ArticleProduct>;
  compact?: boolean;
  className?: string;
}) {
  const { summary, vendor } = product;
  const profile = routes.software(summary.slug);
  return (
    <article
      aria-label={summary.name}
      className={cn(
        "flex h-full flex-col gap-5 rounded-card border border-line bg-surface p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex min-h-10 items-center justify-between gap-4">
        {summary.logo ? <SoftwareLogo software={summary} size={28} /> : <span />}
        {vendor.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
      </div>
      <div>
        <h3 className="text-h3">
          <Link href={profile} className="underline-offset-4 hover:underline">
            {summary.name}
          </Link>
        </h3>
        {compact ? null : <p className="mt-2 text-small text-muted">{product.tagline}</p>}
      </div>
      <p className="text-small">
        {summary.freePlan ? <span className="block font-medium">Kostenloser Tarif</span> : null}
        {summary.priceFromCents !== null ? (
          <span className="block font-medium tabular">
            {formatPriceFrom(summary.priceFromCents, { net: summary.priceNet })}
          </span>
        ) : null}
      </p>
      <div className="mt-auto grid gap-3 sm:grid-cols-2">
        <VendorButton
          href={vendor.href}
          affiliate={vendor.affiliate}
          variant="dark"
          className="w-full"
        >
          Website besuchen
          <span className="sr-only"> von {summary.name}</span>
        </VendorButton>
        <ButtonLink href={profile} variant="outline" arrow="none" className="w-full">
          Profil lesen
          <span className="sr-only"> zu {summary.name}</span>
        </ButtonLink>
      </div>
    </article>
  );
}
