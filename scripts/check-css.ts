// Fails when the compiled CSS contains a font, color or gradient outside the design brief.
// Run after `pnpm build`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { auditCss, extractTokenColors } from "../src/lib/css-audit.ts";

const root = process.cwd();
const staticDir = join(root, ".next", "static");

function listCssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return listCssFiles(full);
    return full.endsWith(".css") ? [full] : [];
  });
}

let files: string[];
try {
  files = listCssFiles(staticDir);
} catch {
  console.error("check:css: .next/static not found. Run `pnpm build` first.");
  process.exit(1);
}

if (files.length === 0) {
  console.error("check:css: no compiled CSS found.");
  process.exit(1);
}

const tokens = extractTokenColors(readFileSync(join(root, "src", "app", "globals.css"), "utf8"));
let failed = false;

for (const file of files) {
  const violations = auditCss(readFileSync(file, "utf8"), tokens);
  for (const v of violations) {
    failed = true;
    console.error(`check:css: ${v.kind} not allowed: ${v.value} (${file})`);
  }
}

if (failed) process.exit(1);
console.log(`check:css: ${files.length} file(s) clean. Only brand fonts and token colors.`);
