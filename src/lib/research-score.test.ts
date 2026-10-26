import { describe, expect, it } from "vitest";
import type { Fact, FactStatus, Plan } from "../content/schemas.ts";
import {
  coverage,
  entryPrice,
  FEATURE_SETS,
  LEGAL_SETS,
  pricePoints,
  RESEARCH_CRITERIA,
  researchScore,
  type ScorableSoftware,
} from "./research-score.ts";

const source = { url: "https://example.com/preise", title: "Preise", accessed: "2026-10-26" };
const fact = (status: FactStatus): Fact =>
  status === "unbekannt" ? { status } : { status, source };

const plan = (over: Partial<Plan>): Plan => ({
  name: "Basis",
  monthlyCents: 1000,
  yearlyMonthlyCents: null,
  perUser: false,
  net: true,
  includes: ["Rechnungen"],
  source,
  ...over,
});

const compliance = (status: FactStatus) =>
  Object.fromEntries(
    [
      "gobd",
      "eRechnungEmpfang",
      "eRechnungVersand",
      "datevExport",
      "elster",
      "kleinunternehmer",
      "bankanbindung",
      "serverstandort",
      "avv",
      "deutscherSupport",
    ].map((k) => [k, fact(status)]),
  ) as ScorableSoftware["compliance"];

const allFeatures = (status: FactStatus) =>
  Object.fromEntries(
    FEATURE_SETS["erp-software"]
      .filter((i) => i.kind === "feature")
      .map((i) => [i.key, fact(status)]),
  ) as ScorableSoftware["features"];

const software = (over: Partial<ScorableSoftware> = {}): ScorableSoftware => ({
  categories: ["buchhaltungssoftware"],
  features: allFeatures("ja"),
  compliance: compliance("ja"),
  plans: [plan({ monthlyCents: 500 })],
  freePlan: false,
  ...over,
});

describe("RESEARCH_CRITERIA", () => {
  it("adds up to 100 % and leaves out usability, which needs a test", () => {
    expect(RESEARCH_CRITERIA.reduce((s, c) => s + c.weight, 0)).toBeCloseTo(1, 10);
    expect(RESEARCH_CRITERIA.map((c) => c.key)).not.toContain("bedienung");
  });

  it("asks for ELSTER only where the category needs it", () => {
    expect(LEGAL_SETS.buchhaltungssoftware).toContain("elster");
    expect(LEGAL_SETS.rechnungsprogramme).not.toContain("elster");
  });
});

describe("coverage", () => {
  it("gives full points for yes, partial ones for add-ons and partly, none for unknown", () => {
    const items = (["ja", "aufpreis", "teilweise", "nein", "unbekannt"] as const).map((s) => ({
      label: s,
      status: s,
      points: { ja: 1, aufpreis: 0.75, teilweise: 0.5, nein: 0, unbekannt: 0 }[s],
    }));
    expect(coverage(items)).toBeCloseTo((10 * 2.25) / 5, 10);
    expect(coverage([])).toBe(0);
  });
});

describe("entryPrice", () => {
  it("takes the cheapest paid price, converts gross to net and multiplies minimum seats", () => {
    expect(
      entryPrice([
        plan({ name: "Brutto", monthlyCents: 1190, net: false }),
        plan({
          name: "Sitz",
          monthlyCents: null,
          yearlyMonthlyCents: 600,
          perUser: true,
          minUsers: 2,
        }),
        plan({ name: "Gratis", monthlyCents: 0 }),
      ]),
    ).toEqual({ planName: "Brutto", monthlyNetCents: 1000, seats: 1 });
    expect(
      entryPrice([plan({ monthlyCents: 3500, perUser: true, minUsers: 2 })])?.monthlyNetCents,
    ).toBe(7000);
  });

  it("is null without a paid plan", () => {
    expect(entryPrice([plan({ monthlyCents: 0 })])).toBeNull();
  });
});

describe("pricePoints", () => {
  const at = (cents: number) => ({ planName: "A", monthlyNetCents: cents, seats: 1 });

  it("loses two points per doubling above the reference price", () => {
    expect(pricePoints(at(500), 500, false)).toBe(10);
    expect(pricePoints(at(1000), 500, false)).toBeCloseTo(8, 10);
    expect(pricePoints(at(2000), 500, false)).toBeCloseTo(6, 10);
    expect(pricePoints(at(5_000_000), 500, false)).toBe(0);
  });

  it("adds one point for a free plan, capped at ten", () => {
    expect(pricePoints(at(1000), 500, true)).toBeCloseTo(9, 10);
    expect(pricePoints(at(100), 500, true)).toBe(10);
  });
});

describe("researchScore", () => {
  it("scores a program that documents everything at the reference price with 10", () => {
    const score = researchScore(software());
    expect(score?.total).toBe(10);
    expect(score?.criteria.every((c) => c.value === 10)).toBe(true);
  });

  it("counts unknown facts as zero, so missing evidence lowers the score", () => {
    const known = researchScore(software())!;
    const unknown = researchScore(software({ compliance: compliance("unbekannt") }))!;
    expect(unknown.total).toBeLessThan(known.total);
    expect(unknown.criteria.find((c) => c.key === "rechtssicherheit")?.value).toBe(0);
  });

  it("computes the total from the rounded criteria, with one decimal", () => {
    const score = researchScore(software({ plans: [plan({ monthlyCents: 900 })] }))!;
    const fromCriteria = score.criteria.reduce((s, c) => s + c.value * c.weight, 0);
    expect(score.total).toBe(Math.round(fromCriteria * 10) / 10);
    expect(score.criteria.find((c) => c.key === "preis")?.value).toBe(8.3);
  });

  it("scores against another listed category on request, never an unlisted one", () => {
    const both = software({ categories: ["rechnungsprogramme", "buchhaltungssoftware"] });
    expect(researchScore(both)?.category).toBe("rechnungsprogramme");
    expect(researchScore(both, "buchhaltungssoftware")?.category).toBe("buchhaltungssoftware");
    expect(researchScore(both, "erp-software")?.category).toBe("rechnungsprogramme");
  });

  it("keeps the vendor note of each fact", () => {
    const withNote = software({
      compliance: { ...compliance("ja"), elster: { status: "nein", note: "Erst ab Pro.", source } },
    });
    const legal = researchScore(withNote)!.criteria.find((c) => c.key === "rechtssicherheit")!;
    expect(legal.items.find((i) => i.status === "nein")?.note).toBe("Erst ab Pro.");
  });

  it("uses the main category and returns null for categories without a rule set", () => {
    expect(researchScore(software({ categories: ["erp-software"] }))?.category).toBe(
      "erp-software",
    );
    expect(researchScore(software({ categories: ["lohnabrechnung"] }))).toBeNull();
  });

  it("lists every fact it used, so nothing is hidden", () => {
    const score = researchScore(software())!;
    const funktionen = score.criteria.find((c) => c.key === "funktionen")!;
    expect(funktionen.items).toHaveLength(FEATURE_SETS.buchhaltungssoftware.length);
  });
});
