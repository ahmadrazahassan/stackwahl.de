// Mirror of the color tokens in src/app/globals.css for the styleguide and contrast checks.
// `tokens.test.ts` fails when the two drift apart.

export const colorTokens = {
  primary: "#2f2fc1",
  "primary-hover": "#2424a0",
  "primary-tint": "#e6e6f8",
  ink: "#191919",
  bg: "#f1f1f1",
  surface: "#ffffff",
  muted: "#5f5f5f",
  line: "#dcdcdc",
  positive: "#1d6f3a",
  negative: "#b3261e",
} as const;

export type ColorToken = keyof typeof colorTokens;

export const colorTokenUse: Record<ColorToken, string> = {
  primary: "Primäre Buttons, Links, Fokus, Akzente",
  "primary-hover": "Hover und gedrückt",
  "primary-tint": "Auswahl, Hervorhebung",
  ink: "Text, dunkle Flächen, Footer",
  bg: "Seitenhintergrund",
  surface: "Karten und Panels",
  muted: "Sekundärer Text",
  line: "Haarlinien (nur dekorativ)",
  positive: "Vorteile, Bestätigung (nie allein)",
  negative: "Nachteile, Fehler (nie allein)",
};

/** Text on background pairings used by the design, all checked against 4.5:1. */
export const textPairings: Array<[ColorToken, ColorToken]> = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["ink", "primary-tint"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["primary", "bg"],
  ["primary", "surface"],
  ["surface", "primary"],
  ["surface", "primary-hover"],
  ["surface", "ink"],
  ["positive", "surface"],
  ["negative", "surface"],
  ["positive", "bg"],
  ["negative", "bg"],
];
