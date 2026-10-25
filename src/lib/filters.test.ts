import { describe, expect, it } from "vitest";
import { applyFilters, FILTER_KEYS, type Filterable } from "./filters.ts";

const item = (slug: string, on: string[]): Filterable => ({
  slug,
  flags: Object.fromEntries(FILTER_KEYS.map((k) => [k, on.includes(k)])) as Filterable["flags"],
});

describe("applyFilters", () => {
  const items = [item("a", ["datev", "kostenlos"]), item("b", ["datev"]), item("c", [])];

  it("returns everything without active filters", () => {
    expect(applyFilters(items, []).map((i) => i.slug)).toEqual(["a", "b", "c"]);
  });

  it("combines filters with AND", () => {
    expect(applyFilters(items, ["datev"]).map((i) => i.slug)).toEqual(["a", "b"]);
    expect(applyFilters(items, ["datev", "kostenlos"]).map((i) => i.slug)).toEqual(["a"]);
  });
});
