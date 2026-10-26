// Builds the content collections and fails on ANY problem: parse errors, schema errors, skipped
// documents (pitfall 4.2) and every build guard in src/content/guards.ts.
//
//   pnpm content:validate               dev rules (stale data on drafts is a warning)
//   pnpm content:validate --production  production rules (used by `pnpm build`)
//   --config <path>                     another content-collections config (tests)

import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { createBuilder } from "@content-collections/core";
import { checkContent, utcToday, type ContentSet } from "../src/content/guards.ts";
import { findFlowCollections } from "../src/content/yaml-style.ts";

const production = process.argv.includes("--production") || process.env.NODE_ENV === "production";
const root = process.cwd();
const configArg = process.argv.indexOf("--config");
const configPath =
  configArg > -1 ? process.argv[configArg + 1] : join(root, "content-collections.ts");
const problems: string[] = [];

// Block style only (src/content/yaml-style.ts): flow style splits values at commas.
function yamlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return entry.startsWith(".") ? [] : yamlFiles(full);
    return full.endsWith(".yaml") ? [full] : [];
  });
}
function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}
for (const file of yamlFiles(join(configPath, "..", configArg > -1 ? "." : "content"))) {
  for (const f of findFlowCollections(readFileSync(file, "utf8"))) {
    problems.push(
      `Flow-Stil in ${relative(root, file)}:${f.line} („${f.text}“). Bitte Block-Stil verwenden.`,
    );
  }
}

// The Content Collections cache does not notice schema changes, so a stale cache can hide
// schema errors (seen in Phase 2). Validation always starts from a clean cache.
rmSync(join(configPath, "..", ".content-collections", "cache"), { recursive: true, force: true });

const builder = await createBuilder(configPath);
const outputDir = join(configPath, "..", ".content-collections", "generated");

builder.on("collector:read-error", (e) =>
  problems.push(`Lesefehler ${e.filePath}: ${e.error.message}`),
);
builder.on("collector:parse-error", (e) =>
  problems.push(`Parserfehler ${e.filePath}: ${e.error.message}`),
);
builder.on("transformer:validation-error", (e) =>
  problems.push(`Schemafehler ${e.collection.name}/${e.file.path}: ${e.error.message}`),
);
builder.on("transformer:result-error", (e) =>
  problems.push(`Ergebnisfehler ${e.collection.name}: ${e.error.message}`),
);
builder.on("transformer:error", (e) =>
  problems.push(`Transformfehler ${e.collection.name}: ${e.error.message}`),
);
builder.on("transformer:document-skipped", (e) =>
  problems.push(
    `Übersprungen ${e.collection.name}/${e.filePath}${e.reason ? `: ${e.reason}` : ""}`,
  ),
);
builder.on("_error", (e) =>
  problems.push(`Fehler: ${String((e as { error?: Error }).error?.message ?? e)}`),
);

await builder.build();

if (problems.length > 0) {
  console.error(`content:validate: ${problems.length} Problem(e) beim Einlesen der Inhalte:`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

const generated = await import(pathToFileURL(join(outputDir, "index.js")).href);

const content: ContentSet = {
  vendors: generated.allVendors ?? [],
  categories: generated.allCategories ?? [],
  software: generated.allSoftware ?? [],
  authors: generated.allAuthors ?? [],
  comparisons: generated.allComparisons ?? [],
  useCases: generated.allUseCases ?? [],
  affiliateLinks: generated.allAffiliateLinks ?? [],
  guides: generated.allGuides ?? [],
  glossary: generated.allGlossaries ?? [],
};

const publicDir = join(root, "public");
const publicFiles = new Set(
  listFiles(publicDir).map((f) => "/" + relative(publicDir, f).split("\\").join("/")),
);
const logosDoc = readFileSync(join(root, "docs", "LOGOS.md"), "utf8");
const mediaDoc = readFileSync(join(root, "docs", "MEDIA.md"), "utf8");

const issues = checkContent(content, {
  today: utcToday(),
  production,
  publicFiles,
  logosDoc,
  mediaDoc,
});
const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warning");

for (const w of warnings) console.warn(`  ! ${w.where}: ${w.message}`);
for (const e of errors) console.error(`  ✗ ${e.where}: ${e.message}`);

const counts = Object.entries(content)
  .map(([name, list]) => `${list.length} ${name}`)
  .join(", ");

if (errors.length > 0) {
  console.error(
    `content:validate: ${errors.length} Fehler, ${warnings.length} Warnung(en). (${counts})`,
  );
  process.exit(1);
}
console.log(
  `content:validate: ok (${production ? "Produktion" : "Entwicklung"}), ${warnings.length} Warnung(en). ${counts}.`,
);
