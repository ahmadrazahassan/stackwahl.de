// Mirror of the color tokens in src/app/globals.css for the styleguide and contrast checks.
// `tokens.test.ts` fails when the two drift apart.

export const colorTokens = {
  primary: "#2f2fc1",
  "primary-hover": "#2424a0",
  "primary-tint": "#e6e6f8",
  accent: "#a8c8ff",
  "accent-hover": "#8cb5ff",
  mango: "#ffc142",
  ink: "#191919",
  bg: "#f1f1f1",
  surface: "#ffffff",
  muted: "#5f5f5f",
  line: "#dcdcdc",
  positive: "#1d6f3a",
  negative: "#b3261e",
  frost: "#ffffffe0",
  glass: "#ffffff29",
  "glass-line": "#ffffff47",
  "glass-soft": "#ffffffb3",
  "glass-ink": "#19191926",
  "glass-ink-strong": "#19191940",
} as const;

export type ColorToken = keyof typeof colorTokens;

export const colorTokenUse: Record<ColorToken, string> = {
  primary: "Primäre Buttons, Links, Fokus, Akzente",
  "primary-hover": "Hover und gedrückt",
  "primary-tint": "Auswahl, Hervorhebung",
  accent: "Primäre Buttons und Suche, immer mit Text in Ink",
  "accent-hover": "Hover der hellblauen Buttons",
  mango: "Ausgewählter Navigationspunkt, mit Text in Ink",
  ink: "Text, dunkle Flächen, Footer",
  bg: "Seitenhintergrund",
  surface: "Karten und Panels",
  muted: "Sekundärer Text",
  line: "Haarlinien (nur dekorativ)",
  positive: "Vorteile, Bestätigung (nie allein)",
  negative: "Nachteile, Fehler (nie allein)",
  frost: "Mattglas des Headers",
  glass: "Glaskarte im Ratgeber der Startseite",
  "glass-line": "Rand der Glaskarte",
  "glass-soft": "Inaktive Punkte auf Glas",
  "glass-ink": "Button auf Glas",
  "glass-ink-strong": "Button auf Glas, Hover",
};

/** Text on background pairings used by the design, all checked against 4.5:1. */
export const textPairings: Array<[ColorToken, ColorToken]> = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["ink", "primary-tint"],
  ["ink", "accent"],
  ["ink", "accent-hover"],
  ["ink", "mango"],
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
