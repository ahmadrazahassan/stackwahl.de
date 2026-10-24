// Audits compiled CSS against the design brief (docs/BUILD_PROMPT.md, Sections 13.3 and 13.4):
// only the two brand fonts, only token colors, no gradients.

export type CssViolation = { kind: "font" | "color" | "gradient"; value: string };

const ALLOWED_FONT_FAMILIES = new Set([
  "googleSansFlex",
  "googleSansFlex Fallback",
  "inter",
  "inter Fallback",
  "inherit",
]);

// The "Fallback" faces are next/font's metric adjusted local(Arial) faces that prevent layout
// shift while the brand fonts load. They are never shown once the WOFF2 files have loaded.
const ALLOWED_LOCAL_SOURCES = new Set(["Arial"]);

const INK = "#191919";

export function extractTokenColors(globalsCss: string): Set<string> {
  const colors = new Set<string>();
  for (const match of globalsCss.matchAll(/--color-[a-z-]+:\s*(#[0-9a-f]{3,8})\s*;/gi)) {
    colors.add(normalizeHex(match[1]));
  }
  return colors;
}

function normalizeHex(hex: string): string {
  const raw = hex.slice(1).toLowerCase();
  if (raw.length === 3 || raw.length === 4) return `#${[...raw].map((c) => c + c).join("")}`;
  return `#${raw}`;
}

export function auditCss(css: string, tokenColors: Set<string>): CssViolation[] {
  const violations: CssViolation[] = [];
  const allowedColors = new Set([...tokenColors, "#ffffff", "#00000000"]);

  for (const match of css.matchAll(/font-family:\s*([^;}]+)/g)) {
    const value = match[1].trim();
    if (value.startsWith("var(")) continue;
    for (const family of value.split(",")) {
      const name = family.trim().replace(/^["']|["']$/g, "");
      if (!ALLOWED_FONT_FAMILIES.has(name)) violations.push({ kind: "font", value: name });
    }
  }

  for (const match of css.matchAll(/local\(([^)]+)\)/g)) {
    const name = match[1].trim().replace(/^["']|["']$/g, "");
    if (!ALLOWED_LOCAL_SOURCES.has(name))
      violations.push({ kind: "font", value: `local(${name})` });
  }

  for (const match of css.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    const hex = normalizeHex(match[0]);
    if (allowedColors.has(hex)) continue;
    // The minifier writes the shadow token as ink with alpha (#191919xx).
    if (hex.length === 9 && hex.startsWith(INK)) continue;
    violations.push({ kind: "color", value: match[0] });
  }

  for (const match of css.matchAll(/\b(rgba?|hsla?|oklch|oklab|lab|lch)\(([^)]*)\)/g)) {
    const value = match[0];
    // Tailwind's own feature detection inside @supports, not a rendered color.
    if (value === "rgb(from red r g b)") continue;
    // The single soft ink shadow token (--shadow-float).
    if (/^rgba?\(25 25 25 \/ [0-9.]+\)$/.test(value)) continue;
    violations.push({ kind: "color", value });
  }

  for (const match of css.matchAll(/[a-z-]*gradient\(/gi)) {
    violations.push({ kind: "gradient", value: match[0] });
  }

  return violations;
}
