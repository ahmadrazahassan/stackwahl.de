import { Check } from "lucide-react";
import Image from "next/image";
import { SoftwareLogo } from "@/components/software/software-card";
import { ArrowLink, VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import type { PartnerBannerData } from "@/lib/content/home";
import { formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/routes";

/**
 * Advertising for one partner, outside every ranking. "Anzeige" and "Affiliate-Link" stand
 * first. Button and image both leave through /go with rel="sponsored"; the image link is
 * hidden from keyboard and screen readers because the button carries the same target.
 */
export function PartnerBanner({ banner }: { banner: PartnerBannerData }) {
  const { summary, vendor } = banner;
  const facts = [
    banner.trialDays ? `${banner.trialDays} Tage kostenlos testen` : null,
    summary.freePlan ? "Kostenloser Tarif verfügbar" : null,
    summary.priceFromCents !== null
      ? `Danach ${formatPriceFrom(summary.priceFromCents, { net: summary.priceNet })}`
      : null,
  ].filter((f): f is string => f !== null);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-5">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="border border-ink px-2 py-0.5 text-label font-medium tracking-[0.08em] uppercase">
            Anzeige
          </span>
          <DisclosureLabel kind="affiliate" />
        </p>
        <div className="mt-8">
          {summary.logo ? <SoftwareLogo software={summary} size={34} /> : null}
        </div>
        <h2 id="partner-titel" className="mt-6 max-w-[20ch] text-h2">
          {banner.headline}
        </h2>
        <p className="mt-4 max-w-[52ch] text-body text-muted">{banner.text}</p>
        {facts.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-2 text-small">
            {facts.map((fact) => (
              <li key={fact} className="flex gap-2">
                <Check
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="mt-0.5 size-4 shrink-0 text-positive"
                />
                {fact}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <VendorButton href={vendor.href} affiliate={vendor.affiliate} size="lg">
            {banner.trialDays ? `${summary.name} testen` : `Zu ${summary.name}`}
          </VendorButton>
          <ArrowLink href={routes.software(summary.slug)}>Unser Profil lesen</ArrowLink>
        </div>
      </div>
      <a
        href={vendor.href}
        target="_blank"
        rel="sponsored nofollow noopener"
        tabIndex={-1}
        aria-hidden="true"
        className="block overflow-hidden rounded-card bg-ink lg:col-span-7"
      >
        <Image
          src={banner.image.src}
          alt={banner.image.alt}
          width={banner.image.width}
          height={banner.image.height}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="h-auto w-full transition-transform duration-500 ease-out hover:scale-[1.02]"
        />
      </a>
    </div>
  );
}
