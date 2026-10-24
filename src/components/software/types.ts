// UI level shapes for the software components. The content schemas (Zod) in Phase 2
// map onto these.

export type ComplianceStatus = "ja" | "nein" | "teilweise" | "aufpreis" | "unbekannt";

export type ComplianceRow = {
  criterion: string;
  status: ComplianceStatus;
  note?: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type ScoreCriterion = {
  label: string;
  /** 0 to 10 */
  value: number;
  /** 0 to 1 */
  weight: number;
};

export type SoftwareSummary = {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  /** Editorial score 0 to 10, or null while not rated. */
  score: number | null;
  /** Cheapest paid plan per month; free plans are flagged by freePlan. */
  priceFromCents: number | null;
  freePlan: boolean;
  priceNet: boolean;
  priceCheckedAt: string;
  keyFacts: string[];
  logo?: { src: string; alt: string; width: number; height: number };
  affiliate: boolean;
  vendorUrl: string;
};

export type PricePlan = {
  name: string;
  /** Per month with monthly billing. */
  monthlyCents: number | null;
  /** Per month with yearly billing. */
  yearlyMonthlyCents: number | null;
  perUser: boolean;
  net: boolean;
  includes: string[];
  note?: string;
  sourceUrl: string;
  checkedAt: string;
};
