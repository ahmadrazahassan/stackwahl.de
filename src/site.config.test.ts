import { describe, expect, it } from "vitest";
import { findPlaceholders, isPlaceholder } from "./lib/placeholders.ts";
import { siteConfig } from "./site.config.ts";

describe("siteConfig", () => {
  it("uses the approved brand and market", () => {
    expect(siteConfig.brand.name).toBe("Stackwahl");
    expect(siteConfig.brand.domain).toBe("stackwahl.de");
    expect(siteConfig.brand.currency).toBe("EUR");
    expect(siteConfig.brand.locale).toBe("de-DE");
  });

  it("is indexable for the launch", () => {
    expect(siteConfig.features.indexing).toBe(true);
  });

  it("lists open placeholders", () => {
    const names = findPlaceholders(siteConfig).map((p) => p.name);
    // The contact e-mail is set; phone and VAT ID stay optional and open.
    expect(names).not.toContain("CONTACT_EMAIL");
    expect(names).toContain("CONTACT_PHONE");
    expect(names).not.toContain("BRAND_NAME");
  });
});

describe("findPlaceholders", () => {
  it("finds nested placeholders with their path", () => {
    expect(findPlaceholders({ a: { b: "{{X}}" }, c: ["ok", "{{Y_2}}"] })).toEqual([
      { path: "a.b", name: "X" },
      { path: "c[1]", name: "Y_2" },
    ]);
  });

  it("does not treat normal text as a placeholder", () => {
    expect(isPlaceholder("Preis {{ab}}")).toBe(false);
    expect(isPlaceholder("{{CONTACT_EMAIL}}")).toBe(true);
  });
});
