import { describe, expect, it } from "vitest";
import { lintTypeScript, lintYaml } from "./copy-lint.ts";

describe("lintTypeScript", () => {
  it("finds banned phrases in JSX text and string props", () => {
    const source = `export const A = () => <p title="Ein nahtloser Ablauf">Die ultimative Lösung</p>;`;
    expect(lintTypeScript("a.tsx", source).map((f) => f.message)).toHaveLength(2);
  });

  it("finds Du-form, emoji and English UI text", () => {
    const source = `export const B = () => <><p>Hast du Fragen?</p><p>Super 🎉</p><button>Read more</button></>;`;
    expect(lintTypeScript("b.tsx", source)).toHaveLength(3);
  });

  it("ignores class names, imports, URLs and ids", () => {
    const source = `import { x } from "./ultimativ";
export const C = () => <a href="https://example.com/du" className="flex gap-2 text-small" id="nahtlos-1">Weiter</a>;`;
    expect(lintTypeScript("c.tsx", source)).toEqual([]);
  });

  it("reports the line number", () => {
    const source = `const a = 1;\nexport const t = "Kostet 9.90 € im Monat";`;
    expect(lintTypeScript("d.ts", source)[0]?.line).toBe(2);
  });
});

describe("lintYaml", () => {
  it("checks text values but not URLs and slugs", () => {
    const source = `slug: ultimativ\nsummary: Ein bahnbrechendes Programm\nwebsite: https://example.com/garantiert\n`;
    const findings = lintYaml("x.yaml", source);
    expect(findings).toHaveLength(1);
    expect(findings[0]?.line).toBe(2);
  });
});
