import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { colorTokens, textPairings } from "../styles/tokens.ts";
import { contrastRatio, parseHex } from "./contrast.ts";

function cssTokens(): Record<string, string> {
  const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
  return Object.fromEntries(
    [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)].map((m) => [
      m[1],
      m[2].toLowerCase(),
    ]),
  );
}

describe("contrastRatio", () => {
  it("matches known WCAG values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  it("rejects invalid colors", () => {
    expect(() => parseHex("blue")).toThrow();
  });
});

describe("design tokens", () => {
  it("tokens.ts mirrors globals.css exactly", () => {
    expect(cssTokens()).toEqual(colorTokens);
  });

  // Every text pairing the design uses must pass WCAG 2.2 AA (4.5:1 for normal text).
  it.each(textPairings)("%s on %s meets 4.5:1", (fg, bg) => {
    expect(contrastRatio(colorTokens[fg], colorTokens[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring (primary) is visible on both backgrounds (3:1)", () => {
    expect(contrastRatio(colorTokens.primary, colorTokens.bg)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(colorTokens.primary, colorTokens.surface)).toBeGreaterThanOrEqual(3);
  });
});
