// Copy lint (docs/BUILD_PROMPT.md, Section 6): checks UI strings in src/ and all content files
// against the banned phrases and the punctuation and register rules.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { lintTypeScript, lintYaml, type CopyFinding } from "../src/content/copy-lint.ts";

const root = process.cwd();

// The rule definitions themselves, tests and fixtures contain the banned words on purpose.
const EXCLUDE = [/copy-rules\.ts$/, /\.test\.tsx?$/, /__fixtures__/, /[\\/]generated[\\/]/];

function walk(dir: string, extensions: string[]): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (entry.startsWith(".")) return [];
    if (statSync(full).isDirectory()) return walk(full, extensions);
    return extensions.some((ext) => full.endsWith(ext)) ? [full] : [];
  });
}

const findings: CopyFinding[] = [];
const files = [
  ...walk(join(root, "src"), [".ts", ".tsx"]),
  ...walk(join(root, "content"), [".yaml", ".mdx"]),
].filter((f) => !EXCLUDE.some((re) => re.test(f)));

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const rel = relative(root, file);
  if (file.endsWith(".yaml")) findings.push(...lintYaml(rel, source));
  else if (file.endsWith(".mdx")) findings.push(...lintYaml(rel, source.split(/^---$/m)[1] ?? ""));
  else findings.push(...lintTypeScript(rel, source));
}

if (findings.length > 0) {
  for (const f of findings) console.error(`  ✗ ${f.file}:${f.line}  ${f.message}  „${f.text}“`);
  console.error(`lint:copy: ${findings.length} Fund(e) in ${files.length} Dateien.`);
  process.exit(1);
}
console.log(`lint:copy: ${files.length} Dateien geprüft, keine Funde.`);
