import { routes } from "../lib/routes.ts";
import type { ContentSet } from "./guards.ts";
import { isVisible, MIN_PROFILES_PER_CATEGORY } from "./visibility.ts";

// Build time search index (Section 8, search). Only visible content; categories only when live.

export type SearchIndexEntry = {
  group: "Software" | "Kategorien" | "Ratgeber";
  label: string;
  href: string;
  hint?: string;
};

export function buildSearchIndex(content: ContentSet, showDrafts: boolean): SearchIndexEntry[] {
  const software = content.software.filter((s) => isVisible(s, showDrafts));
  const categoryName = new Map(content.categories.map((c) => [c.slug, c.name]));

  const categories = content.categories
    .filter((c) => isVisible(c, showDrafts))
    .filter(
      (c) =>
        software.filter((s) => s.categories.includes(c.slug)).length >= MIN_PROFILES_PER_CATEGORY,
    )
    .sort((a, b) => a.launchOrder - b.launchOrder)
    .map((c): SearchIndexEntry => ({
      group: "Kategorien",
      label: c.name,
      href: routes.category(c.slug),
    }));

  const softwareEntries = software
    .sort((a, b) => a.name.localeCompare(b.name, "de"))
    .map((s): SearchIndexEntry => ({
      group: "Software",
      label: s.name,
      href: routes.software(s.slug),
      hint: categoryName.get(s.categories[0]),
    }));

  const guides = content.guides
    .filter((g) => isVisible(g, showDrafts))
    .map((g): SearchIndexEntry => ({
      group: "Ratgeber",
      label: g.title,
      href: routes.guide(g.slug),
      hint: g.topic,
    }));

  return [...softwareEntries, ...categories, ...guides];
}
