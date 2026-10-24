// Writes src/generated/search-index.json from the generated content (run after content:validate).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { ContentSet } from "../src/content/guards.ts";
import { buildSearchIndex } from "../src/content/search-index.ts";

const root = process.cwd();
const showDrafts = !(
  process.argv.includes("--production") || process.env.NODE_ENV === "production"
);
const generated = await import(
  pathToFileURL(join(root, ".content-collections", "generated", "index.js")).href
);

const content: ContentSet = {
  vendors: generated.allVendors ?? [],
  categories: generated.allCategories ?? [],
  software: generated.allSoftware ?? [],
  authors: generated.allAuthors ?? [],
  comparisons: generated.allComparisons ?? [],
  affiliateLinks: generated.allAffiliateLinks ?? [],
  guides: generated.allGuides ?? [],
  glossary: generated.allGlossaries ?? [],
};

const index = buildSearchIndex(content, showDrafts);
mkdirSync(join(root, "src", "generated"), { recursive: true });
writeFileSync(
  join(root, "src", "generated", "search-index.json"),
  `${JSON.stringify(index, null, 2)}\n`,
);
console.log(
  `search:index: ${index.length} Einträge (${showDrafts ? "mit Entwürfen" : "nur veröffentlicht"}).`,
);
