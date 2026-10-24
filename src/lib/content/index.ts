import "server-only";
import {
  allAffiliateLinks,
  allAuthors,
  allCategories,
  allComparisons,
  allGuides,
  allSoftware,
  allVendors,
} from "content-collections";
import type { SoftwareSummary } from "@/components/software/types";
import { COMPLIANCE } from "@/content/features";
import type { Software } from "@/content/schemas";
import {
  entryPriceCents,
  isVisible,
  MIN_PROFILES_PER_CATEGORY,
  visibleSoftware,
} from "@/content/visibility";
import { routes } from "@/lib/routes";
import { SCORE_CRITERIA, weightedScore } from "@/lib/scoring";

// Data access layer (Section 5.1): pages call these functions and never read files.

export function getAllSoftware(): Software[] {
  return visibleSoftware(allSoftware).sort((a, b) => a.name.localeCompare(b.name, "de"));
}

export function getSoftware(slug: string): Software | undefined {
  return getAllSoftware().find((s) => s.slug === slug);
}

export function getSoftwareInCategory(category: string): Software[] {
  return getAllSoftware().filter((s) => s.categories.includes(category));
}

export function getVendor(slug: string) {
  return allVendors.find((v) => v.slug === slug);
}

export function getAuthor(slug: string | null) {
  return slug ? allAuthors.find((a) => a.slug === slug) : undefined;
}

export function getAllCategories() {
  return allCategories.filter((c) => isVisible(c)).sort((a, b) => a.launchOrder - b.launchOrder);
}

export function getCategory(slug: string) {
  return getAllCategories().find((c) => c.slug === slug);
}

/** Categories with enough visible profiles to go live (docs/PLAN.md). */
export function getLiveCategories() {
  return getAllCategories().filter(
    (c) => getSoftwareInCategory(c.slug).length >= MIN_PROFILES_PER_CATEGORY,
  );
}

export function getComparisons() {
  return allComparisons.filter((c) => isVisible(c));
}

export function getGuides() {
  return allGuides.filter((g) => isVisible(g));
}

/** Active affiliate link for a software, only when the feature flag allows it. */
export function getAffiliateLink(software: string, enabled: boolean) {
  if (!enabled) return undefined;
  return allAffiliateLinks.find((l) => l.software === software && l.active);
}

export function editorialScore(software: Software): number | null {
  if (!software.rating) return null;
  const c = software.rating.criteria;
  const values: Record<(typeof SCORE_CRITERIA)[number]["key"], number> = {
    funktionen: c.funktionen,
    bedienung: c.bedienung,
    preisLeistung: c.preisLeistung,
    rechtssicherheit: c.rechtssicherheit,
    supportDatenschutz: c.supportDatenschutz,
  };
  return weightedScore(SCORE_CRITERIA.map((k) => ({ weight: k.weight, value: values[k.key] })));
}

/** Maps a content record to the UI summary used by cards and headers. */
export function toSummary(software: Software, affiliateEnabled = false): SoftwareSummary {
  const vendor = getVendor(software.vendor);
  const category = getCategory(software.categories[0]);
  const cheapest = software.plans.reduce(
    (min, p) => {
      const price = Math.min(
        ...[p.monthlyCents, p.yearlyMonthlyCents].filter((v): v is number => v !== null),
      );
      return price < min.price ? { price, plan: p } : min;
    },
    { price: Number.POSITIVE_INFINITY, plan: software.plans[0] },
  );
  const priceDates = software.plans.map((p) => p.source.accessed).sort();
  const keyFacts = (["datevExport", "eRechnungVersand", "serverstandort"] as const)
    .filter((key) => software.compliance[key].status === "ja")
    .map((key) => COMPLIANCE[key].label);
  return {
    slug: software.slug,
    name: software.name,
    vendor: vendor?.name ?? software.vendor,
    category: category?.name ?? software.categories[0],
    score: editorialScore(software),
    priceFromCents: entryPriceCents(software),
    priceNet: cheapest.plan.net,
    priceCheckedAt: priceDates[0],
    keyFacts,
    affiliate: Boolean(getAffiliateLink(software.slug, affiliateEnabled)),
    vendorUrl: software.website,
    logo: software.logo
      ? { src: software.logo.file, alt: `Logo ${software.name}`, width: 160, height: 40 }
      : undefined,
  };
}

export function profileHref(software: Pick<Software, "slug">) {
  return routes.software(software.slug);
}
