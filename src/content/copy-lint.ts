import ts from "typescript";
import { parse as parseYaml } from "yaml";
import { checkCopy } from "./copy-rules.ts";

// Extracts user facing text from TypeScript/TSX (via the TypeScript AST) and YAML content and
// checks it against the copy rules. Technical strings (class names, imports, URLs, ids) are
// skipped so the rules only see words people read.

export type CopyFinding = { file: string; line: number; text: string; message: string };

const TECHNICAL_ATTRIBUTES = new Set([
  "className",
  "href",
  "src",
  "id",
  "key",
  "type",
  "rel",
  "target",
  "role",
  "name",
  "value",
  "htmlFor",
  "autoComplete",
  "inputMode",
  "viewBox",
  "d",
  "fill",
  "stroke",
  "strokeLinecap",
  "sizes",
  "dateTime",
  "defaultValue",
  "tone",
  "variant",
  "size",
  "arrow",
  "as",
  "kind",
  "option",
]);

function looksTechnical(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return true;
  if (/^(https?:|mailto:|\/|#|\.\/|\.\.\/|@\/)/.test(t)) return true; // URLs and paths
  if (/^[a-z0-9]+([-_:/.][a-z0-9[\]()%.,#=&-]+)+$/i.test(t) && !/\s/.test(t)) return true; // tokens
  if (
    /^[\w-]+(\s+[\w:/[\]().%#&=-]+)*$/.test(t) &&
    /(^|\s)(flex|grid|text-|bg-|px-|py-|mt-|size-|rounded|border|items-|gap-)/.test(t)
  )
    return true; // class lists
  if (/^use (client|server|cache)$/.test(t)) return true;
  return false;
}

function attributeName(node: ts.Node): string | undefined {
  let current: ts.Node | undefined = node.parent;
  while (current) {
    if (ts.isJsxAttribute(current)) return current.name.getText();
    if (ts.isPropertyAssignment(current)) return current.name.getText().replace(/["']/g, "");
    if (ts.isCallExpression(current)) {
      const callee = current.expression.getText();
      if (/^(cn|cva|clsx|twMerge|require|import)$/.test(callee)) return "className";
      return undefined;
    }
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current) || ts.isBlock(current))
      return undefined;
    current = current.parent;
  }
  return undefined;
}

export function lintTypeScript(file: string, source: string): CopyFinding[] {
  const sf = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const findings: CopyFinding[] = [];

  const check = (node: ts.Node, text: string) => {
    if (looksTechnical(text)) return;
    const attr = attributeName(node);
    if (attr && TECHNICAL_ATTRIBUTES.has(attr)) return;
    for (const rule of checkCopy(text)) {
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
      findings.push({
        file,
        line: line + 1,
        text: text.trim().slice(0, 80),
        message: rule.message,
      });
    }
  };

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      check(node, node.text);
    else if (ts.isTemplateExpression(node)) {
      check(node, [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(" … "));
    } else if (ts.isJsxText(node)) {
      const text = node.getText().replace(/\s+/g, " ");
      if (text.trim()) check(node, text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return findings;
}

/** Checks every string value in a YAML content file. */
export function lintYaml(file: string, source: string): CopyFinding[] {
  const findings: CopyFinding[] = [];
  const lines = source.split("\n");
  const walk = (value: unknown, key?: string) => {
    if (typeof value === "string") {
      if (
        key &&
        [
          "url",
          "slug",
          "website",
          "file",
          "sourceUrl",
          "vendor",
          "author",
          "reviewer",
          "accessed",
          // Quoted vendor wording of an embedded video, shown as a quote, never as our text.
          "originalTitle",
          "channel",
        ].includes(key)
      )
        return;
      if (looksTechnical(value)) return;
      for (const rule of checkCopy(value)) {
        const probe = value.slice(0, 20);
        const index = lines.findIndex((l) => l.includes(probe));
        findings.push({ file, line: index + 1, text: value.slice(0, 80), message: rule.message });
      }
    } else if (Array.isArray(value)) value.forEach((v) => walk(v, key));
    else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, k);
    }
  };
  walk(parseYaml(source));
  return findings;
}
