import { isCollection, parseDocument, visit } from "yaml";

// Content YAML must use block style. In flow style (`{ note: a, b }` or `[a, b]`) an unquoted
// comma ends the value, so "12,90 €" silently becomes "12" plus a stray key. This happened in
// Phase 2 and is now a build error.

export type FlowFinding = { line: number; text: string };

export function findFlowCollections(source: string): FlowFinding[] {
  const doc = parseDocument(source);
  const lineStarts = [0];
  for (let i = 0; i < source.length; i++) if (source[i] === "\n") lineStarts.push(i + 1);
  const lineOf = (offset: number) => {
    let line = 0;
    while (line + 1 < lineStarts.length && lineStarts[line + 1] <= offset) line++;
    return line + 1;
  };
  const findings: FlowFinding[] = [];
  visit(doc, {
    Collection(_, node) {
      if (isCollection(node) && node.flow && node.range) {
        const line = lineOf(node.range[0]);
        findings.push({ line, text: source.split("\n")[line - 1].trim().slice(0, 80) });
      }
    },
  });
  return findings;
}
