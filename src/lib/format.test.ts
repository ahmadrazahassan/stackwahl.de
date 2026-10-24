import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatEuro,
  formatLongDate,
  formatPercent,
  formatPriceFrom,
  formatScore,
} from "./format.ts";

// Intl uses a no-break space before the euro sign.
const nbsp = (s: string) => s.replace(/ /g, " ");

describe("formatEuro", () => {
  it("formats cents in German style", () => {
    expect(nbsp(formatEuro(990))).toBe("9,90 €");
    expect(nbsp(formatEuro(123456))).toBe("1.234,56 €");
    expect(nbsp(formatEuro(4900, { whole: true }))).toBe("49 €");
  });

  it("rejects non-integer cents", () => {
    expect(() => formatEuro(9.9)).toThrow();
  });
});

describe("formatScore", () => {
  it("uses one decimal with a comma", () => {
    expect(formatScore(8.43)).toBe("8,4");
    expect(formatScore(8.45)).toBe("8,5");
    expect(formatScore(10)).toBe("10,0");
  });

  it("rejects values outside 0 to 10", () => {
    expect(() => formatScore(10.1)).toThrow();
  });
});

describe("formatDate", () => {
  it("formats ISO dates independent of the build server's time zone", () => {
    expect(formatDate("2026-10-24")).toBe("24.10.2026");
    expect(formatLongDate("2026-03-01")).toBe("1. März 2026");
  });

  it("rejects invalid dates", () => {
    expect(() => formatDate("2026-02-30")).toThrow();
    expect(() => formatDate("24.10.2026")).toThrow();
  });
});

describe("formatPriceFrom and formatPercent", () => {
  it("states net or gross and the period", () => {
    expect(nbsp(formatPriceFrom(990))).toBe("ab 9,90 € / Monat zzgl. MwSt.");
    expect(nbsp(formatPriceFrom(11900, { period: "jahr", net: false }))).toBe(
      "ab 119,00 € / Jahr inkl. MwSt.",
    );
    expect(formatPriceFrom(0)).toBe("Kostenloser Tarif");
  });

  it("formats percentages", () => {
    expect(nbsp(formatPercent(0.25))).toBe("25 %");
  });
});
