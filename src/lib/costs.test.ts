import { describe, expect, it } from "vitest";
import { rankSoftware } from "../content/ranking.ts";
import { computeCost, costOverview, netGross, yearlySaving } from "./costs.ts";

describe("netGross", () => {
  it("adds 19 % VAT to net prices and removes it from gross prices", () => {
    expect(netGross(1000, true)).toEqual({ net: 1000, gross: 1190 });
    expect(netGross(1190, false)).toEqual({ net: 1000, gross: 1190 });
  });

  it("rounds to whole cents", () => {
    expect(netGross(990, true).gross).toBe(1178);
  });
});

describe("costOverview", () => {
  it("returns lines only for billing periods the vendor offers", () => {
    const lines = costOverview({ monthlyCents: null, yearlyMonthlyCents: 1090, net: true });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toEqual({
      billing: "jährlich",
      months12: { net: 13080, gross: 15565 },
      months36: { net: 39240, gross: 46696 },
    });
  });

  it("computes monthly and yearly billing", () => {
    expect(
      costOverview({ monthlyCents: 1000, yearlyMonthlyCents: 900, net: true }).map(
        (l) => l.billing,
      ),
    ).toEqual(["monatlich", "jährlich"]);
    expect(yearlySaving({ monthlyCents: 1000, yearlyMonthlyCents: 900, net: true })).toBe(1200);
    expect(yearlySaving({ monthlyCents: null, yearlyMonthlyCents: 900, net: true })).toBeNull();
  });
});

describe("rankSoftware", () => {
  it("sorts alphabetically (German collation) while nothing is rated", () => {
    const result = rankSoftware([
      { name: "WISO MeinBüro", score: null },
      { name: "easybill", score: null },
      { name: "Billomat", score: null },
    ]);
    expect(result.basis).toBe("alphabetical");
    expect(result.items.map((s) => s.name)).toEqual(["Billomat", "easybill", "WISO MeinBüro"]);
    expect(result.explanation).toMatch(/Praxistest/);
  });

  it("puts rated software first by score, unrated after, ties by name", () => {
    const result = rankSoftware([
      { name: "C", score: null },
      { name: "B", score: 8.1 },
      { name: "A", score: 8.1 },
      { name: "D", score: 9 },
    ]);
    expect(result.basis).toBe("score");
    expect(result.items.map((s) => s.name)).toEqual(["D", "A", "B", "C"]);
  });
});

describe("computeCost", () => {
  const flat = { monthlyCents: 1990, yearlyMonthlyCents: 1590, net: true, perUser: false };
  const seat = { monthlyCents: 990, yearlyMonthlyCents: null, net: true, perUser: true };

  it("multiplies by users only for per-user plans", () => {
    expect(computeCost({ plan: flat, billing: "monatlich", users: 5, months: 12 })?.total.net).toBe(
      23880,
    );
    expect(computeCost({ plan: seat, billing: "monatlich", users: 3, months: 12 })?.total.net).toBe(
      35640,
    );
  });

  it("returns null for a billing period the vendor does not offer", () => {
    expect(computeCost({ plan: seat, billing: "jährlich", users: 1, months: 12 })).toBeNull();
  });

  it("adds VAT for net prices", () => {
    expect(computeCost({ plan: flat, billing: "jährlich", users: 1, months: 1 })?.perMonth).toEqual(
      { net: 1590, gross: 1892 },
    );
  });

  it("rejects invalid input", () => {
    expect(() => computeCost({ plan: flat, billing: "monatlich", users: 0, months: 12 })).toThrow();
  });
});
