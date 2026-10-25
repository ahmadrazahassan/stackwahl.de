// Software-Finder matching (docs/BUILD_PROMPT.md, Section 8). Pure and unit tested.
// Commercial relationships are not an input: the function never sees affiliate data.

import type { ComplianceKey, FeatureKey } from "../content/features.ts";
import type { FactStatus } from "../content/schemas.ts";

export const NEEDS = ["rechnungen", "buchhaltung", "belege", "lohn", "lager"] as const;
export const MUSTS = [
  "eRechnungEmpfang",
  "elster",
  "serverDe",
  "freePlan",
  "trial",
  "mobileApp",
] as const;
export const PROFITS = ["euer", "bilanz", "unklar"] as const;
export const BUDGETS = ["10", "25", "50", "egal"] as const;

export type Need = (typeof NEEDS)[number];
export type Must = (typeof MUSTS)[number];

export type FinderAnswers = {
  needs: Need[];
  gewinn: (typeof PROFITS)[number];
  kleinunternehmer: boolean;
  datev: boolean;
  budget: (typeof BUDGETS)[number];
  musts: Must[];
};

/** The data the Finder needs per product, built on the server from the content. */
export type FinderProduct = {
  slug: string;
  name: string;
  category: string;
  freePlan: boolean;
  freeTrialDays: number | null;
  /** Cheapest paid plan per month, net. */
  entryPriceCents: number | null;
  features: Partial<Record<FeatureKey, FactStatus>>;
  compliance: Record<ComplianceKey, FactStatus>;
};

export type Check = {
  id: string;
  label: string;
  status: FactStatus;
  /** Hard requirement: a clear "nein" removes the product from the shortlist. */
  must: boolean;
};

export type FinderMatch = {
  product: FinderProduct;
  /** 0 to 1 */
  fit: number;
  checks: Check[];
  excluded: boolean;
};

const VALUE: Record<FactStatus, number> = {
  ja: 1,
  aufpreis: 0.75,
  teilweise: 0.5,
  unbekannt: 0.25,
  nein: 0,
};

const NEED_LABEL: Record<Need, string> = {
  rechnungen: "Rechnungen schreiben",
  buchhaltung: "Buchhaltung selbst erledigen",
  belege: "Belege digital erfassen",
  lohn: "Lohnabrechnung",
  lager: "Lager und Warenwirtschaft",
};

const MUST_LABEL: Record<Must, string> = {
  eRechnungEmpfang: "E-Rechnungen empfangen",
  elster: "Umsatzsteuer-Voranmeldung per ELSTER",
  serverDe: "Server in Deutschland oder der EU",
  freePlan: "Kostenloser Tarif",
  trial: "Kostenlose Testphase",
  mobileApp: "Mobile App",
};

const BUDGET_CENTS: Record<FinderAnswers["budget"], number | null> = {
  "10": 1000,
  "25": 2500,
  "50": 5000,
  egal: null,
};

const feature = (p: FinderProduct, key: FeatureKey): FactStatus => p.features[key] ?? "unbekannt";
const bool = (value: boolean): FactStatus => (value ? "ja" : "nein");

function needStatus(p: FinderProduct, need: Need, gewinn: FinderAnswers["gewinn"]): FactStatus {
  switch (need) {
    case "rechnungen":
      return feature(p, "rechnungen");
    case "buchhaltung": {
      if (gewinn === "euer") return feature(p, "euer");
      if (gewinn === "bilanz") return feature(p, "bilanz");
      const best = [feature(p, "euer"), feature(p, "bilanz")].sort((a, b) => VALUE[b] - VALUE[a]);
      return best[0];
    }
    case "belege":
      return feature(p, "belegerfassungOcr");
    case "lohn":
      return feature(p, "lohn");
    case "lager":
      return feature(p, "lager");
  }
}

function mustStatus(p: FinderProduct, must: Must): FactStatus {
  switch (must) {
    case "eRechnungEmpfang":
      return p.compliance.eRechnungEmpfang;
    case "elster":
      return p.compliance.elster;
    case "serverDe":
      return p.compliance.serverstandort;
    case "freePlan":
      return bool(p.freePlan);
    case "trial":
      return p.freeTrialDays === null ? "unbekannt" : bool(p.freeTrialDays > 0);
    case "mobileApp":
      return feature(p, "mobileApp");
  }
}

export function checksFor(p: FinderProduct, answers: FinderAnswers): Check[] {
  const checks: Check[] = answers.needs.map((need) => ({
    id: `need:${need}`,
    label: NEED_LABEL[need],
    status: needStatus(p, need, answers.gewinn),
    must: false,
  }));
  if (answers.kleinunternehmer) {
    checks.push({
      id: "kleinunternehmer",
      label: "Kleinunternehmerregelung",
      status: p.compliance.kleinunternehmer,
      must: false,
    });
  }
  if (answers.datev) {
    checks.push({
      id: "datev",
      label: "DATEV-Export für die Steuerberatung",
      status: p.compliance.datevExport,
      must: true,
    });
  }
  for (const must of answers.musts) {
    checks.push({
      id: `must:${must}`,
      label: MUST_LABEL[must],
      status: mustStatus(p, must),
      must: true,
    });
  }
  const limit = BUDGET_CENTS[answers.budget];
  if (limit !== null) {
    const affordable = p.freePlan || (p.entryPriceCents !== null && p.entryPriceCents <= limit);
    checks.push({
      id: "budget",
      label: `Einstieg bis ${limit / 100} € im Monat netto`,
      status: affordable ? "ja" : "nein",
      must: false,
    });
  }
  return checks;
}

export function matchSoftware(
  products: readonly FinderProduct[],
  answers: FinderAnswers,
): FinderMatch[] {
  return products
    .map((product) => {
      const checks = checksFor(product, answers);
      const fit =
        checks.length === 0 ? 0 : checks.reduce((s, c) => s + VALUE[c.status], 0) / checks.length;
      const excluded = checks.some((c) => c.must && c.status === "nein");
      return { product, fit, checks, excluded };
    })
    .sort(
      (a, b) =>
        Number(a.excluded) - Number(b.excluded) ||
        b.fit - a.fit ||
        a.product.name.localeCompare(b.product.name, "de"),
    );
}

/** Up to three products that meet every hard requirement, best fit first. */
export function shortlist(matches: readonly FinderMatch[]): FinderMatch[] {
  return matches.filter((m) => !m.excluded).slice(0, 3);
}

export const DEFAULT_ANSWERS: FinderAnswers = {
  needs: [],
  gewinn: "unklar",
  kleinunternehmer: false,
  datev: false,
  budget: "egal",
  musts: [],
};
