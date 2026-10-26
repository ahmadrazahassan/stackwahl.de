import "server-only";
import {
  allAffiliateLinks,
  allAuthors,
  allCategories,
  allComparisons,
  allGlossaries,
  allGuides,
  allSoftware,
  allVendors,
} from "content-collections";
import type { Availability } from "@/components/layout/navigation";
import type { ComplianceRow, PricePlan, SoftwareSummary } from "@/components/software/types";
import { COMPLIANCE, COMPLIANCE_KEYS, FEATURES, type FeatureKey } from "@/content/features";
import type { Fact, Software, Source } from "@/content/schemas";
import { siteConfig } from "@/site.config";
import {
  entryPriceCents,
  isVisible,
  MIN_PROFILES_PER_CATEGORY,
  visibleSoftware,
} from "@/content/visibility";
import type { CalculatorProduct } from "@/lib/content/calculator-types";
import type { Placement } from "@/lib/affiliate";
import type { FinderProduct } from "@/lib/finder";
import { researchScore } from "@/lib/research-score";
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

export function getAuthors() {
  return [...allAuthors].sort((a, b) => a.name.localeCompare(b.name, "de"));
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

/** Visible guides, newest first. */
export function getGuides() {
  return allGuides
    .filter((g) => isVisible(g))
    .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title, "de"));
}

export function getGuide(slug: string) {
  return getGuides().find((g) => g.slug === slug);
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

/** Highest published monthly price of any plan, for the price range in structured data. */
export function highestPriceCents(software: Software): number | null {
  const prices = software.plans.flatMap((p) =>
    [p.monthlyCents, p.yearlyMonthlyCents].filter((v): v is number => v !== null && v > 0),
  );
  return prices.length > 0 ? Math.max(...prices) : null;
}

/** Maps a content record to the UI summary used by cards and headers. */
export function toSummary(
  software: Software,
  affiliateEnabled = siteConfig.features.affiliateLinks,
  /** Category whose requirements the Recherche-Wertung uses (category pages). */
  scoreCategory?: string,
): SoftwareSummary {
  const vendor = getVendor(software.vendor);
  const category = getCategory(software.categories[0]);
  const cheapest = software.plans.reduce(
    (min, p) => {
      const price = Math.min(
        ...[p.monthlyCents, p.yearlyMonthlyCents].filter((v): v is number => v !== null && v > 0),
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
    research: researchScore(software, scoreCategory)?.total ?? null,
    priceFromCents: entryPriceCents(software),
    freePlan: software.freePlan,
    priceNet: cheapest.plan.net,
    priceCheckedAt: priceDates[0],
    keyFacts,
    affiliate: Boolean(getAffiliateLink(software.slug, affiliateEnabled)),
    vendorUrl: software.website,
    logo: software.logo
      ? {
          src: software.logo.file,
          alt: `Logo ${vendor?.name ?? software.name}`,
          width: software.logo.width,
          height: software.logo.height,
        }
      : undefined,
  };
}

export function profileHref(software: Pick<Software, "slug">) {
  return routes.software(software.slug);
}

// ---------------------------------------------------------------------------------------------
// Glossary

export function getGlossary() {
  return allGlossaries
    .filter((t) => isVisible(t))
    .sort((a, b) => a.term.localeCompare(b.term, "de"));
}

export function getTerm(slug: string) {
  return getGlossary().find((t) => t.slug === slug);
}

// ---------------------------------------------------------------------------------------------
// Availability: navigation only links to pages that have content (Section 6, hide empty pages).

export function getAvailability(): Availability {
  const { features } = siteConfig;
  return {
    finder: features.finder,
    comparisonTool: features.comparisonTool,
    costCalculator: features.costCalculator,
    guides: getGuides().length > 0,
    glossary: getGlossary().length > 0,
    authors: allAuthors.length > 0,
    reviewPolicy: features.userReviews,
    categories: getLiveCategories().length > 0,
  };
}

/**
 * Params for generateStaticParams. Cache Components needs at least one entry, so an empty list
 * becomes a placeholder that the page answers with notFound() (pitfall 4.2).
 */
export const PLACEHOLDER_SLUG = "__keine-inhalte__";
export function staticSlugs(slugs: string[]): { slug: string }[] {
  return slugs.length > 0 ? slugs.map((slug) => ({ slug })) : [{ slug: PLACEHOLDER_SLUG }];
}

// ---------------------------------------------------------------------------------------------
// Profile helpers

export function toPricePlans(software: Software): PricePlan[] {
  return software.plans.map((p) => ({
    name: p.name,
    monthlyCents: p.monthlyCents,
    yearlyMonthlyCents: p.yearlyMonthlyCents,
    perUser: p.perUser,
    minUsers: p.minUsers,
    net: p.net,
    includes: p.includes,
    note: p.note,
    sourceUrl: p.source.url,
    checkedAt: p.source.accessed,
  }));
}

export function toComplianceRows(software: Software): ComplianceRow[] {
  return COMPLIANCE_KEYS.map((key) => {
    const fact = software.compliance[key];
    return {
      criterion: COMPLIANCE[key].label,
      status: fact.status,
      note: fact.note,
      sourceUrl: fact.source?.url,
      sourceLabel: fact.source ? "Quelle" : undefined,
    };
  });
}

/** Oldest access date among the facts shown, so the "Stand" never overstates freshness. */
export function factsCheckedAt(software: Software): string {
  const dates = Object.values(software.compliance)
    .map((f) => f.source?.accessed)
    .filter((d): d is string => Boolean(d))
    .sort();
  return dates[0] ?? software.lastReviewed;
}

export type FeatureEntry = { key: FeatureKey; label: string; fact: Fact };

export function featureGroups(software: Software): { group: string; items: FeatureEntry[] }[] {
  const groups = new Map<string, FeatureEntry[]>();
  for (const key of Object.keys(FEATURES) as FeatureKey[]) {
    const fact = software.features[key];
    if (!fact) continue;
    const { group, label } = FEATURES[key];
    groups.set(group, [...(groups.get(group) ?? []), { key, label, fact }]);
  }
  return [...groups].map(([group, items]) => ({ group, items }));
}

/** Every distinct source used in a profile, for the "Quellen" section. */
export function profileSources(software: Software): Source[] {
  const all: Source[] = [
    software.marketAvailability.source,
    ...(software.trialSource ? [software.trialSource] : []),
    ...software.plans.map((p) => p.source),
    ...Object.values(software.compliance).flatMap((f) => (f.source ? [f.source] : [])),
    ...Object.values(software.features).flatMap((f) => (f?.source ? [f.source] : [])),
    ...(software.review?.sections.flatMap((section) => section.sources) ?? []),
  ];
  const seen = new Map<string, Source>();
  for (const source of all) if (!seen.has(source.url)) seen.set(source.url, source);
  return [...seen.values()];
}

export function alternativesFor(software: Software): Software[] {
  return getAllSoftware().filter(
    (s) => s.slug !== software.slug && s.categories.some((c) => software.categories.includes(c)),
  );
}

// ---------------------------------------------------------------------------------------------
// Tools (Phase 4)

/** Product data for the Software-Finder. Deliberately without any affiliate information. */
export function finderProducts(): FinderProduct[] {
  return getAllSoftware().map((s) => ({
    slug: s.slug,
    name: s.name,
    category: getCategory(s.categories[0])?.name ?? s.categories[0],
    freePlan: s.freePlan,
    freeTrialDays: s.freeTrialDays,
    entryPriceCents: entryPriceCents(s),
    features: Object.fromEntries(
      Object.entries(s.features).map(([k, f]) => [k, f?.status ?? "unbekannt"]),
    ) as FinderProduct["features"],
    compliance: Object.fromEntries(
      COMPLIANCE_KEYS.map((k) => [k, s.compliance[k].status]),
    ) as FinderProduct["compliance"],
  }));
}

export function calculatorProducts(): CalculatorProduct[] {
  return getAllSoftware().map((s) => ({
    slug: s.slug,
    name: s.name,
    plans: toPricePlans(s)
      .filter((p) => (p.monthlyCents ?? 0) > 0 || (p.yearlyMonthlyCents ?? 0) > 0)
      .map((p) => ({
        name: p.name,
        monthlyCents: p.monthlyCents,
        yearlyMonthlyCents: p.yearlyMonthlyCents,
        perUser: p.perUser,
        minUsers: p.minUsers,
        net: p.net,
        note: p.note,
        sourceUrl: p.sourceUrl,
        checkedAt: p.checkedAt,
      })),
  }));
}

/**
 * Where "Zum Anbieter" points: the internal /go route when an active affiliate link exists and
 * the feature is on, otherwise the vendor's website directly (no tracking, no label).
 */
export function vendorLink(software: Software, from: Placement, pos = 1) {
  const link = getAffiliateLink(software.slug, siteConfig.features.affiliateLinks);
  return link
    ? { href: routes.affiliate(software.slug, from, pos), affiliate: true }
    : { href: software.website, affiliate: false };
}
