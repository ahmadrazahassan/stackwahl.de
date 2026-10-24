import { describe, expect, it } from "vitest";
import { SCORE_CRITERIA, weightedScore } from "./scoring.ts";

describe("SCORE_CRITERIA", () => {
  it("matches the approved weights and adds up to 100 %", () => {
    expect(SCORE_CRITERIA.map((c) => c.weight)).toEqual([0.25, 0.2, 0.2, 0.2, 0.15]);
    expect(SCORE_CRITERIA.reduce((s, c) => s + c.weight, 0)).toBeCloseTo(1, 10);
  });
});

describe("weightedScore", () => {
  it("weights the criteria", () => {
    const values = [9, 8, 7, 10, 6];
    const total = weightedScore(
      SCORE_CRITERIA.map((c, i) => ({ weight: c.weight, value: values[i] })),
    );
    expect(total).toBeCloseTo(9 * 0.25 + 8 * 0.2 + 7 * 0.2 + 10 * 0.2 + 6 * 0.15, 10);
  });

  it("rejects weights that do not add up to 100 %", () => {
    expect(() => weightedScore([{ value: 5, weight: 0.5 }])).toThrow(/100 %/);
  });

  it("rejects values outside 0 to 10", () => {
    expect(() => weightedScore([{ value: 11, weight: 1 }])).toThrow();
  });
});
