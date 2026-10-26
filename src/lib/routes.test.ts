import { describe, expect, it } from "vitest";
import { routes, slugify } from "./routes.ts";

describe("slugify", () => {
  it("transliterates German umlauts and ß", () => {
    expect(slugify("Größe & Übersicht für Bäcker")).toBe("groesse-und-uebersicht-fuer-baecker");
  });

  it("removes accents and punctuation", () => {
    expect(slugify("  Café-Software: Kassen (2026)!  ")).toBe("cafe-software-kassen-2026");
  });
});

describe("routes", () => {
  it("builds German URLs without trailing slashes", () => {
    expect(routes.category("buchhaltungssoftware")).toBe("/kategorien/buchhaltungssoftware");
    expect(routes.softwareAlternatives("sevdesk")).toBe("/software/sevdesk/alternativen");
    expect(routes.comparison("sevdesk-vs-papierkram")).toBe("/vergleich/sevdesk-vs-papierkram");
    expect(routes.useCase("handwerk")).toBe("/software-fuer/handwerk");
  });

  it("never returns a trailing slash except for home", () => {
    for (const [name, build] of Object.entries(routes)) {
      const url = (build as (arg: never) => string)(["a", "b"] as never);
      if (name === "home") continue;
      expect(url.endsWith("/"), name).toBe(false);
    }
  });
});
