import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex } from "./contrast.ts";

function tokens(): Record<string, string> {
  const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
  return Object.fromEntries(
    [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)].map((m) => [m[1], m[2]]),
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

// Every text pairing the design uses must pass WCAG 2.2 AA (4.5:1 for normal text).
describe("design tokens meet WCAG 2.2 AA", () => {
  const t = tokens();
  const pairs: Array<[foreground: string, background: string]> = [
    ["ink", "bg"],
    ["ink", "surface"],
    ["ink", "primary-tint"],
    ["muted", "bg"],
    ["muted", "surface"],
    ["primary", "bg"],
    ["primary", "surface"],
    ["surface", "primary"],
    ["surface", "primary-hover"],
    ["surface", "ink"],
    ["positive", "surface"],
    ["negative", "surface"],
    ["positive", "bg"],
    ["negative", "bg"],
  ];

  it.each(pairs)("%s on %s", (fg, bg) => {
    expect(t[fg], `token ${fg}`).toBeDefined();
    expect(t[bg], `token ${bg}`).toBeDefined();
    expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring (primary) is visible on both backgrounds (3:1)", () => {
    expect(contrastRatio(t.primary, t.bg)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(t.primary, t.surface)).toBeGreaterThanOrEqual(3);
  });
});
