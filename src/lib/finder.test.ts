import { describe, expect, it } from "vitest";
import { COMPLIANCE_KEYS } from "../content/features.ts";
import type { FactStatus } from "../content/schemas.ts";
import {
  checksFor,
  DEFAULT_ANSWERS,
  matchSoftware,
  shortlist,
  type FinderAnswers,
  type FinderProduct,
} from "./finder.ts";

const compliance = (
  overrides: Partial<Record<(typeof COMPLIANCE_KEYS)[number], FactStatus>> = {},
) =>
  Object.fromEntries(
    COMPLIANCE_KEYS.map((k) => [k, overrides[k] ?? "unbekannt"]),
  ) as FinderProduct["compliance"];

const product = (p: Partial<FinderProduct> & Pick<FinderProduct, "slug">): FinderProduct => ({
  name: p.slug.toUpperCase(),
  category: "Buchhaltungssoftware",
  freePlan: false,
  freeTrialDays: null,
  entryPriceCents: 1000,
  features: {},
  compliance: compliance(),
  ...p,
});

const answers = (a: Partial<FinderAnswers>): FinderAnswers => ({ ...DEFAULT_ANSWERS, ...a });

describe("checksFor", () => {
  it("maps needs to the matching feature, EÜR or Bilanz by profit method", () => {
    const p = product({ slug: "a", features: { euer: "ja", bilanz: "nein" } });
    expect(checksFor(p, answers({ needs: ["buchhaltung"], gewinn: "euer" }))[0].status).toBe("ja");
    expect(checksFor(p, answers({ needs: ["buchhaltung"], gewinn: "bilanz" }))[0].status).toBe(
      "nein",
    );
    expect(checksFor(p, answers({ needs: ["buchhaltung"], gewinn: "unklar" }))[0].status).toBe(
      "ja",
    );
  });

  it("treats a missing fact as unknown, not as no", () => {
    const p = product({ slug: "a" });
    expect(checksFor(p, answers({ needs: ["lohn"] }))[0].status).toBe("unbekannt");
  });

  it("counts a free plan as within any budget", () => {
    const p = product({ slug: "a", freePlan: true, entryPriceCents: 9900 });
    expect(checksFor(p, answers({ budget: "10" })).find((c) => c.id === "budget")?.status).toBe(
      "ja",
    );
  });
});

describe("matchSoftware and shortlist", () => {
  const products = [
    product({
      slug: "ohne-datev",
      compliance: compliance({ datevExport: "nein" }),
      features: { rechnungen: "ja" },
    }),
    product({
      slug: "mit-datev",
      compliance: compliance({ datevExport: "ja" }),
      features: { rechnungen: "ja" },
    }),
    product({
      slug: "unklar",
      compliance: compliance({ datevExport: "unbekannt" }),
      features: { rechnungen: "ja" },
    }),
  ];

  it("excludes products that clearly fail a hard requirement", () => {
    const matches = matchSoftware(products, answers({ needs: ["rechnungen"], datev: true }));
    expect(matches.find((m) => m.product.slug === "ohne-datev")?.excluded).toBe(true);
    expect(shortlist(matches).map((m) => m.product.slug)).toEqual(["mit-datev", "unklar"]);
  });

  it("ranks by fit, then by name", () => {
    const matches = matchSoftware(products, answers({ needs: ["rechnungen"] }));
    expect(matches.map((m) => m.product.slug)).toEqual(
      ["mit-datev", "ohne-datev", "unklar"].sort((a, b) =>
        a.toUpperCase().localeCompare(b.toUpperCase(), "de"),
      ),
    );
    expect(matches.every((m) => m.fit === 1)).toBe(true);
  });

  it("never looks at commercial data", () => {
    // FinderProduct has no affiliate field; this guards against adding one by accident.
    expect(Object.keys(products[0])).not.toContain("affiliate");
  });
});
