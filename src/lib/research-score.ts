// Recherche-Wertung (method R1.0): computed by a fixed formula from the sourced facts and the
// published prices, without a hands-on test (Section 3.3). "Bedienung" needs a test and is left
// out until one exists. Pure functions, unit tested, explained on /methodik.

import { COMPLIANCE, FEATURES, type ComplianceKey, type FeatureKey } from "../content/features.ts";
import type { FactStatus, Software } from "../content/schemas.ts";

export const RESEARCH_METHOD_VERSION = "R1.0";
export const RESEARCH_SCORE_NAME = "Recherche-Wertung";

/** Only documented facts earn points. "Keine Angabe" earns none, like "Nein". */
export const STATUS_POINTS: Record<FactStatus, number> = {
  ja: 1,
  aufpreis: 0.75,
  teilweise: 0.5,
  nein: 0,
  unbekannt: 0,
};

export const RESEARCH_CRITERIA = [
  { key: "funktionen", label: "Funktionsumfang", weight: 0.3 },
  { key: "rechtssicherheit", label: "Rechtssicherheit in Deutschland", weight: 0.25 },
  { key: "preis", label: "Einstiegspreis", weight: 0.25 },
  { key: "supportDatenschutz", label: "Support und Datenschutz", weight: 0.2 },
] as const;

export type ResearchCriterionKey = (typeof RESEARCH_CRITERIA)[number]["key"];

/** The score measures each program against the needs of its main (first) category. */
export const SCORED_CATEGORIES = [
  "rechnungsprogramme",
  "buchhaltungssoftware",
  "erp-software",
] as const;
export type ScoredCategory = (typeof SCORED_CATEGORIES)[number];

type Item = { kind: "feature"; key: FeatureKey } | { kind: "compliance"; key: ComplianceKey };
const f = (key: FeatureKey): Item => ({ kind: "feature", key });
const c = (key: ComplianceKey): Item => ({ kind: "compliance", key });

const INVOICING: Item[] = [
  f("angebote"),
  f("rechnungen"),
  f("wiederkehrendeRechnungen"),
  f("mahnwesen"),
  f("belegerfassungOcr"),
  f("bankabgleich"),
  c("bankanbindung"),
];

export const FEATURE_SETS: Record<ScoredCategory, Item[]> = {
  rechnungsprogramme: [
    ...INVOICING,
    f("mehrwaehrung"),
    f("api"),
    f("steuerberaterzugang"),
    f("mobileApp"),
  ],
  buchhaltungssoftware: [
    ...INVOICING.filter((i) => i.key !== "wiederkehrendeRechnungen"),
    f("kassenbuch"),
    f("euer"),
    f("bilanz"),
    f("api"),
    f("steuerberaterzugang"),
    f("mobileApp"),
  ],
  "erp-software": [
    ...INVOICING,
    f("kassenbuch"),
    f("euer"),
    f("bilanz"),
    f("lohn"),
    f("lager"),
    f("projektzeiten"),
    f("mehrwaehrung"),
    f("api"),
    f("steuerberaterzugang"),
    f("mobileApp"),
  ],
};

export const LEGAL_SETS: Record<ScoredCategory, ComplianceKey[]> = {
  rechnungsprogramme: [
    "gobd",
    "eRechnungEmpfang",
    "eRechnungVersand",
    "datevExport",
    "kleinunternehmer",
  ],
  buchhaltungssoftware: [
    "gobd",
    "eRechnungEmpfang",
    "eRechnungVersand",
    "datevExport",
    "elster",
    "kleinunternehmer",
  ],
  "erp-software": ["gobd", "eRechnungEmpfang", "eRechnungVersand", "datevExport", "elster"],
};

export const SUPPORT_SET: ComplianceKey[] = ["serverstandort", "avv", "deutscherSupport"];

/** Entry price per month (net) that still earns the full price points. */
export const REFERENCE_PRICE_CENTS: Record<ScoredCategory, number> = {
  rechnungsprogramme: 500,
  buchhaltungssoftware: 500,
  "erp-software": 2500,
};
/** Points lost each time the entry price doubles above the reference price. */
export const POINTS_PER_DOUBLING = 2;
export const FREE_PLAN_BONUS = 1;
const VAT = 1.19;

export type ScoreItem = { label: string; status: FactStatus; points: number };

export type EntryPrice = {
  planName: string;
  /** Net per month for the minimum number of seats, yearly billing where offered. */
  monthlyNetCents: number;
  seats: number;
};

export type ResearchCriterion = {
  key: ResearchCriterionKey;
  label: string;
  weight: number;
  /** 0 to 10, one decimal */
  value: number;
  /** Facts behind the value; empty for the price criterion, which uses `entry`. */
  items: ScoreItem[];
};

export type ResearchScore = {
  method: string;
  category: ScoredCategory;
  /** 0 to 10, one decimal, computed from the rounded criteria. */
  total: number;
  criteria: ResearchCriterion[];
  entry: EntryPrice | null;
  referenceCents: number;
  freePlan: boolean;
};

export type ScorableSoftware = Pick<
  Software,
  "categories" | "features" | "compliance" | "plans" | "freePlan"
>;

const round1 = (value: number) => Math.round(value * 10) / 10;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function isScoredCategory(slug: string): slug is ScoredCategory {
  return (SCORED_CATEGORIES as readonly string[]).includes(slug);
}

function itemFor(software: ScorableSoftware, item: Item): ScoreItem {
  const fact =
    item.kind === "feature" ? software.features[item.key] : software.compliance[item.key];
  const status = fact?.status ?? "unbekannt";
  const label = item.kind === "feature" ? FEATURES[item.key].label : COMPLIANCE[item.key].label;
  return { label, status, points: STATUS_POINTS[status] };
}

/** Share of the possible points, on the 0 to 10 scale. */
export function coverage(items: readonly ScoreItem[]): number {
  if (items.length === 0) return 0;
  return (10 * items.reduce((sum, i) => sum + i.points, 0)) / items.length;
}

/** Cheapest paid plan as net per month, times its minimum number of seats. */
export function entryPrice(plans: ScorableSoftware["plans"]): EntryPrice | null {
  let best: EntryPrice | null = null;
  for (const plan of plans) {
    const prices = [plan.yearlyMonthlyCents, plan.monthlyCents].filter(
      (v): v is number => v !== null && v > 0,
    );
    if (prices.length === 0) continue;
    const seats = plan.minUsers ?? 1;
    const perMonth = Math.min(...prices) * (plan.perUser ? seats : 1);
    const net = Math.round(plan.net ? perMonth : perMonth / VAT);
    if (!best || net < best.monthlyNetCents) {
      best = { planName: plan.name, monthlyNetCents: net, seats: plan.perUser ? seats : 1 };
    }
  }
  return best;
}

/** 10 points up to the reference price, minus two for each doubling, plus one for a free plan. */
export function pricePoints(
  entry: EntryPrice | null,
  referenceCents: number,
  freePlan: boolean,
): number {
  const bonus = freePlan ? FREE_PLAN_BONUS : 0;
  if (!entry) return freePlan ? 10 : 0;
  const base = clamp(
    10 - POINTS_PER_DOUBLING * Math.log2(entry.monthlyNetCents / referenceCents),
    0,
    10,
  );
  return clamp(base + bonus, 0, 10);
}

export function researchScore(software: ScorableSoftware): ResearchScore | null {
  const category = software.categories[0];
  if (!isScoredCategory(category)) return null;

  const features = FEATURE_SETS[category].map((i) => itemFor(software, i));
  const legal = LEGAL_SETS[category].map((key) => itemFor(software, c(key)));
  const support = SUPPORT_SET.map((key) => itemFor(software, c(key)));
  const entry = entryPrice(software.plans);
  const referenceCents = REFERENCE_PRICE_CENTS[category];

  const values: Record<ResearchCriterionKey, { value: number; items: ScoreItem[] }> = {
    funktionen: { value: coverage(features), items: features },
    rechtssicherheit: { value: coverage(legal), items: legal },
    preis: { value: pricePoints(entry, referenceCents, software.freePlan), items: [] },
    supportDatenschutz: { value: coverage(support), items: support },
  };

  const criteria = RESEARCH_CRITERIA.map((criterion) => ({
    ...criterion,
    value: round1(values[criterion.key].value),
    items: values[criterion.key].items,
  }));
  const total = round1(criteria.reduce((sum, cr) => sum + cr.value * cr.weight, 0));

  return {
    method: RESEARCH_METHOD_VERSION,
    category,
    total,
    criteria,
    entry,
    referenceCents,
    freePlan: software.freePlan,
  };
}
