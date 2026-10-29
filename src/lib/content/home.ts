import "server-only";
import type { VendorLogo } from "@/components/marketing/logo-row";
import type { SoftwareSummary } from "@/components/software/types";
import type { Screenshot, Software } from "@/content/schemas";
import { entryPriceCents } from "@/content/visibility";
import type { CompareProduct } from "@/lib/content/compare-types";
import { entryPrice, researchScore, type ResearchScore } from "@/lib/research-score";
import { routes } from "@/lib/routes";
import {
  getAllSoftware,
  getLiveCategories,
  getSoftwareInCategory,
  getVendor,
  toSummary,
  vendorLink,
} from "./index";

// Data for the home page sections. Everything is derived from the sourced profiles: no
// popularity, user ratings or review counts are shown, because none exist yet (Section 3.2).
// The only score is the Recherche-Wertung, computed by a published formula.

/**
 * The order used on the home page lists: cheapest paid plan first, then name. Commercial
 * interest never changes it (Section 3.4), and the page says so next to the list.
 */
export function byEntryPrice(a: Software, b: Software): number {
  const pa = entryPriceCents(a) ?? Number.POSITIVE_INFINITY;
  const pb = entryPriceCents(b) ?? Number.POSITIVE_INFINITY;
  return pa - pb || a.name.localeCompare(b.name, "de");
}

export function homeLogos(): VendorLogo[] {
  return getAllSoftware()
    .filter((s) => s.logo)
    .filter((s, i, list) => list.findIndex((o) => o.logo?.file === s.logo?.file) === i)
    .map((s) => ({
      name: getVendor(s.vendor)?.name ?? s.name,
      src: s.logo!.file,
      width: s.logo!.width,
      height: s.logo!.height,
    }));
}

export type ScreenshotTeaser = {
  name: string;
  vendor: string;
  href: string;
  shot: Screenshot;
};

/**
 * One real screenshot per program (the first one in the profile, usually the dashboard),
 * alphabetical. Only press material or editor screenshots exist in the content (Section 3.8).
 */
export function homeScreenshots(limit = 4): ScreenshotTeaser[] {
  return getAllSoftware()
    .filter((s) => s.screenshots.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, "de"))
    .slice(0, limit)
    .map((s) => ({
      name: s.name,
      vendor: getVendor(s.vendor)?.name ?? s.name,
      href: `${routes.software(s.slug)}#einblicke`,
      shot: s.screenshots[0],
    }));
}

export type FeaturedItem = {
  rank: number;
  summary: SoftwareSummary;
  score: ResearchScore;
  pros: string[];
  idealFor: string;
  vendor: { href: string; affiliate: boolean };
};

/**
 * "Im Fokus": the programs with the highest Recherche-Wertung across all categories, ties by
 * name. The rule is stated next to the section and on /methodik; commissions are no input.
 */
export function featuredSoftware(limit = 4): FeaturedItem[] {
  return getAllSoftware()
    .flatMap((s) => {
      const score = s.rating ? null : researchScore(s);
      return score ? [{ software: s, score }] : [];
    })
    .sort(
      (a, b) =>
        b.score.total - a.score.total || a.software.name.localeCompare(b.software.name, "de"),
    )
    .slice(0, limit)
    .map(({ software, score }, i) => ({
      rank: i + 1,
      summary: toSummary(software),
      score,
      pros: software.pros.slice(0, 2),
      idealFor: software.idealFor[0],
      vendor: vendorLink(software, "fokus", i + 1),
    }));
}

export type ShowcaseTab = {
  slug: string;
  label: string;
  href: string;
  total: number;
  items: SoftwareSummary[];
};

/** One tab per live category, cards in the explained price order. */
export function showcaseTabs(limit = 8): ShowcaseTab[] {
  return getLiveCategories().map((c) => {
    const list = getSoftwareInCategory(c.slug).sort(byEntryPrice);
    return {
      slug: c.slug,
      label: c.name,
      href: routes.category(c.slug),
      total: list.length,
      items: list.slice(0, limit).map((s) => toSummary(s)),
    };
  });
}

const COMPARE_COMPLIANCE = [
  "eRechnungVersand",
  "eRechnungEmpfang",
  "datevExport",
  "elster",
  "gobd",
  "serverstandort",
] as const;
const COMPARE_FEATURES = [
  "angebote",
  "mahnwesen",
  "belegerfassungOcr",
  "bankabgleich",
  "euer",
  "bilanz",
  "lohn",
  "lager",
  "steuerberaterzugang",
  "mobileApp",
] as const;

/** Every published program with the facts the home page comparison shows. */
export function compareProducts(): CompareProduct[] {
  return getAllSoftware()
    .map((s) => {
      const summary = toSummary(s);
      const entry = entryPrice(s.plans);
      const plan = entry ? s.plans.find((p) => p.name === entry.planName) : undefined;
      const facts = Object.fromEntries([
        ...COMPARE_COMPLIANCE.map((k) => [k, s.compliance[k].status]),
        ...COMPARE_FEATURES.map((k) => [k, s.features[k]?.status ?? "unbekannt"]),
      ]) as CompareProduct["facts"];
      return {
        slug: s.slug,
        name: s.name,
        category: summary.category,
        ...(summary.logo ? { logo: summary.logo } : {}),
        research: summary.research,
        entry: entry
          ? {
              cents: entry.monthlyNetCents,
              perUser: plan?.perUser ?? false,
              seats: entry.seats,
              plan: entry.planName,
            }
          : null,
        freePlan: s.freePlan,
        freeTrialDays: s.freeTrialDays,
        facts,
        profileHref: routes.software(s.slug),
        pricingHref: routes.softwarePricing(s.slug),
        vendor: {
          ...vendorLink(s, "start"),
          host: new URL(s.website).hostname.replace(/^www./, ""),
        },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

/**
 * Partner banners: advertising material a partner gave us (docs/MEDIA.md, "Partner banners").
 * A banner only appears while its affiliate link is active, so an ad never points anywhere
 * but through /go. It sits outside every ranking and is labeled "Anzeige".
 */
const PARTNER_BANNERS = [
  {
    software: "lexware-office",
    headline: "Rechnungen, Belege, Bank und Buchhaltung in einem Programm.",
    image: {
      src: "/partner/lexware-office/plattform-geraete-dunkel.webp",
      width: 1600,
      height: 937,
      alt: "Lexware Office im Browser, auf Smartphone und Smartwatch, daneben die Lexware Visa Business Karte (Werbematerial von Lexware)",
    },
  },
] as const;

export type PartnerBannerData = {
  summary: SoftwareSummary;
  headline: string;
  text: string;
  trialDays: number | null;
  vendor: { href: string; affiliate: boolean };
  image: { src: string; width: number; height: number; alt: string };
};

export function partnerBanner(pos = 1): PartnerBannerData | null {
  for (const banner of PARTNER_BANNERS) {
    const software = getAllSoftware().find((s) => s.slug === banner.software);
    if (!software) continue;
    const vendor = vendorLink(software, "banner", pos);
    if (!vendor.affiliate) continue;
    return {
      summary: toSummary(software),
      headline: banner.headline,
      text: software.summary,
      trialDays: software.freeTrialDays ?? null,
      vendor,
      image: banner.image,
    };
  }
  return null;
}
