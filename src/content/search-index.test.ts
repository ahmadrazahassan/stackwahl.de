import { describe, expect, it } from "vitest";
import type { ContentSet } from "./guards.ts";
import type { Software } from "./schemas.ts";
import { buildSearchIndex } from "./search-index.ts";

const software = (slug: string, status: "draft" | "published"): Software =>
  ({
    slug,
    name: slug.toUpperCase(),
    categories: ["buchhaltungssoftware"],
    status,
    verification: "verified",
  }) as Software;

const content = (list: Software[]): ContentSet => ({
  vendors: [],
  categories: [
    {
      slug: "buchhaltungssoftware",
      name: "Buchhaltungssoftware",
      description: "x",
      intro: "x",
      launchOrder: 1,
      status: "published",
    },
  ],
  software: list,
  authors: [],
  comparisons: [],
  affiliateLinks: [],
  guides: [],
});

describe("buildSearchIndex", () => {
  it("leaves out drafts in production", () => {
    const index = buildSearchIndex(
      content([software("a", "draft"), software("b", "published")]),
      false,
    );
    expect(index.map((e) => e.label)).toEqual(["B"]);
  });

  it("lists a category only once it has five visible profiles", () => {
    const four = ["a", "b", "c", "d"].map((s) => software(s, "published"));
    expect(buildSearchIndex(content(four), false).some((e) => e.group === "Kategorien")).toBe(
      false,
    );
    const five = [...four, software("e", "published")];
    expect(buildSearchIndex(content(five), false).some((e) => e.group === "Kategorien")).toBe(true);
  });

  it("builds German URLs", () => {
    const [entry] = buildSearchIndex(content([software("lexware-office", "published")]), false);
    expect(entry?.href).toBe("/software/lexware-office");
  });
});
