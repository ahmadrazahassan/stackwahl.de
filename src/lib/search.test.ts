import { describe, expect, it } from "vitest";
import { germanFilter, normalizeGerman } from "./search.ts";

describe("normalizeGerman", () => {
  it("folds umlauts, ß and accents", () => {
    expect(normalizeGerman("Größe Übersicht Café")).toBe("groesse uebersicht cafe");
  });
});

describe("germanFilter", () => {
  it("matches umlaut and transliterated spellings both ways", () => {
    expect(germanFilter("Lohnabrechnung für Bäckereien", "baeckerei")).toBe(1);
    expect(germanFilter("Buchhaltung fuer Vereine", "für")).toBe(1);
  });

  it("requires every term", () => {
    expect(germanFilter("Rechnungsprogramm", "rechnung datev")).toBe(0);
    expect(germanFilter("Rechnungsprogramm", "rechnung", ["DATEV-Export"])).toBe(1);
  });
});
