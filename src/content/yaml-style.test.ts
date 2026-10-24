import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { factSchema } from "./schemas.ts";
import { findFlowCollections } from "./yaml-style.ts";

describe("findFlowCollections", () => {
  it("accepts block style", () => {
    expect(
      findFlowCollections("a:\n  status: ja\n  note: Für 12,90 € im Monat\nb:\n  - eins\n"),
    ).toEqual([]);
  });

  it("finds flow mappings and sequences with their line", () => {
    const findings = findFlowCollections("x: 1\na: { status: ja }\nb: [eins, zwei]\n");
    expect(findings.map((f) => f.line)).toEqual([2, 3]);
  });
});

describe("the Phase 2 comma bug", () => {
  it("shows why flow style is banned: the comma splits the note", () => {
    const parsed = parse("lohn: { status: ja, note: Für 12,90 € im Monat }") as {
      lohn: Record<string, unknown>;
    };
    expect(parsed.lohn.note).toBe("Für 12");
  });

  it("strict schemas reject the stray key instead of dropping it", () => {
    const result = factSchema.safeParse({
      status: "unbekannt",
      note: "Für 12",
      "90 € im Monat": null,
    });
    expect(result.success).toBe(false);
  });
});
