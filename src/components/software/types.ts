// UI level shapes for the software components. The content schemas (Zod) in Phase 2
// map onto these.

export type ComplianceStatus = "ja" | "nein" | "teilweise" | "aufpreis";

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
  priceFromCents: number | null;
  priceNet: boolean;
  priceCheckedAt: string;
  keyFacts: string[];
  logo?: { src: string; alt: string; width: number; height: number };
  affiliate: boolean;
  vendorUrl: string;
};

export type PricePlan = {
  name: string;
  monthlyCents: number | null;
  yearlyCents: number | null;
  perUser: boolean;
  net: boolean;
  includes: string[];
  sourceUrl: string;
  checkedAt: string;
};
