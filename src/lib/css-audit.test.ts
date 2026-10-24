import { describe, expect, it } from "vitest";
import { auditCss, extractTokenColors } from "./css-audit.ts";

const tokens = extractTokenColors("--color-primary: #2f2fc1; --color-ink: #191919;");

describe("auditCss", () => {
  it("accepts brand fonts, their fallbacks and token colors", () => {
    const css =
      "a{font-family:inter,inter Fallback;color:#2F2FC1}b{font-family:var(--font-display);background:#fff}" +
      "@font-face{font-family:inter Fallback;src:local(Arial)}";
    expect(auditCss(css, tokens)).toEqual([]);
  });

  it("flags system fonts", () => {
    expect(auditCss("a{font-family:system-ui,sans-serif}", tokens)).toEqual([
      { kind: "font", value: "system-ui" },
      { kind: "font", value: "sans-serif" },
    ]);
  });

  it("flags colors outside the tokens", () => {
    expect(auditCss("a{color:#ff0000}b{color:oklch(60% 0.2 20)}", tokens)).toHaveLength(2);
  });

  it("allows ink with alpha (shadow token) but no other alpha color", () => {
    expect(auditCss("a{box-shadow:0 1px 2px #1919192e}", tokens)).toEqual([]);
    expect(auditCss("a{color:#2f2fc180}", tokens)).toHaveLength(1);
  });

  it("flags gradients", () => {
    const violations = auditCss("a{background:linear-gradient(red,blue)}", tokens);
    expect(violations.some((v) => v.kind === "gradient")).toBe(true);
  });

  it("flags local sources other than the metric fallback", () => {
    expect(auditCss("@font-face{src:local(Helvetica)}", tokens)).toEqual([
      { kind: "font", value: "local(Helvetica)" },
    ]);
  });
});
