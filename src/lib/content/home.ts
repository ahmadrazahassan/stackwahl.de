import "server-only";
import type { VendorLogo } from "@/components/marketing/logo-row";
import type { SoftwareSummary } from "@/components/software/types";
import type { Software } from "@/content/schemas";
import { entryPriceCents } from "@/content/visibility";
import type { ComparePreset, CompareProduct } from "@/lib/content/compare-types";
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

export type OverviewRow = {
  summary: SoftwareSummary;
  tagline: string;
  idealFor: string;
  pros: string[];
  cons: string[];
  vendorSeat: string | null;
  /** Short status lines; "ok" only when the fact is documented as "ja". */
  facts: { ok: boolean; text: string }[];
  vendor: { href: string; affiliate: boolean };
};

export type OverviewTab = {
  slug: string;
  label: string;
  href: string;
  total: number;
  rows: OverviewRow[];
};

export function overviewTabs(limit = 5): OverviewTab[] {
  return getLiveCategories().map((c) => {
    const list = getSoftwareInCategory(c.slug).sort(byEntryPrice);
    return {
      slug: c.slug,
      label: c.name,
      href: routes.category(c.slug),
      total: list.length,
      rows: list.slice(0, limit).map((s, i) => {
        const vendor = getVendor(s.vendor);
        return {
          summary: toSummary(s),
          tagline: s.summary,
          idealFor: s.idealFor[0],
          pros: s.pros.slice(0, 3),
          cons: s.cons.slice(0, 3),
          vendorSeat: vendor?.city ?? null,
          facts: overviewFacts(s),
          vendor: vendorLink(s, "start", i + 1),
        };
      }),
    };
  });
}

const statusWord = {
  ja: "ja",
  nein: "nein",
  teilweise: "teilweise",
  aufpreis: "gegen Aufpreis",
  unbekannt: "keine Angabe",
} as const;

function overviewFacts(s: Software): { ok: boolean; text: string }[] {
  const send = s.compliance.eRechnungVersand.status;
  const receive = s.compliance.eRechnungEmpfang.status;
  const elster = s.compliance.elster.status;
  return [
    s.freeTrialDays
      ? { ok: true, text: `${s.freeTrialDays} Tage kostenlos testen` }
      : { ok: false, text: s.freePlan ? "Testen im kostenlosen Tarif" : "Testphase: keine Angabe" },
    send === "ja" && receive === "ja"
      ? { ok: true, text: "E-Rechnung senden und empfangen" }
      : {
          ok: false,
          text: `E-Rechnung senden: ${statusWord[send]}, empfangen: ${statusWord[receive]}`,
        },
    elster === "ja"
      ? { ok: true, text: "UStVA direkt per ELSTER" }
      : { ok: false, text: `UStVA per ELSTER: ${statusWord[elster]}` },
  ];
}

export type FactList = {
  id: string;
  title: string;
  text: string;
  items: { slug: string; name: string; detail?: string }[];
};

/** Three questions readers ask first, answered from the compliance and plan data. */
export function factLists(): FactList[] {
  const all = getAllSoftware();
  const link = (s: Software, detail?: string) => ({ slug: s.slug, name: s.name, detail });
  return [
    {
      id: "kostenlos",
      title: "Kostenlos starten",
      text: "Programme mit einem dauerhaft kostenlosen Tarif. Die Grenzen stehen im jeweiligen Profil.",
      items: all.filter((s) => s.freePlan).map((s) => link(s)),
    },
    {
      id: "elster",
      title: "UStVA direkt ans Finanzamt",
      text: "Programme, die die Umsatzsteuer-Voranmeldung laut Anbieter selbst per ELSTER übermitteln.",
      items: all.filter((s) => s.compliance.elster.status === "ja").map((s) => link(s)),
    },
    {
      id: "testen",
      title: "Vor dem Kauf testen",
      text: "Programme mit kostenloser Testphase, die längste zuerst.",
      items: all
        .filter((s) => s.freeTrialDays)
        .sort(
          (a, b) =>
            (b.freeTrialDays ?? 0) - (a.freeTrialDays ?? 0) || a.name.localeCompare(b.name, "de"),
        )
        .map((s) => link(s, `${s.freeTrialDays} Tage`)),
    },
  ].filter((list) => list.items.length > 0);
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

/** Pairings people search for; only presets whose programs are all published are shown. */
export function comparePresets(products: CompareProduct[]): ComparePreset[] {
  const presets: ComparePreset[] = [
    { label: "sevdesk oder Lexware Office", slugs: ["sevdesk", "lexware-office"] },
    {
      label: "Sage 50, Sage Active, Lexware Office",
      slugs: ["sage-50", "sage-active", "lexware-office"],
    },
    { label: "Kostenlos starten", slugs: ["collmex", "papierkram", "sevdesk"] },
    { label: "Rechnungen schreiben", slugs: ["easybill", "fastbill", "billomat"] },
    { label: "ERP für Händler", slugs: ["weclapp", "xentral", "sage-100"] },
  ];
  const known = new Set(products.map((p) => p.slug));
  return presets.filter((p) => p.slugs.every((slug) => known.has(slug)));
}
