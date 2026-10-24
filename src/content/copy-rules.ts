// Copy rules (docs/BUILD_PROMPT.md, Sections 3 and 10). Shared by the content guards and the
// copy lint, so content files and UI strings follow the same rules.

export type CopyRule = { id: string; pattern: RegExp; message: string };

/** Hype and filler phrases that a German Fachredakteur would never write. */
const BANNED_PHRASES = [
  "revolutionär",
  "bahnbrechend",
  "game-changer",
  "gamechanger",
  "nahtlos",
  "im heutigen digitalen zeitalter",
  "tauchen wir ein",
  "ultimativ",
  "100 % rechtssicher",
  "100% rechtssicher",
  "garantiert",
  "entfesseln sie",
  "lorem ipsum",
];

export const COPY_RULES: CopyRule[] = [
  ...BANNED_PHRASES.map((phrase) => ({
    id: `banned:${phrase}`,
    pattern: new RegExp(phrase.replace(/[.*+?^${}()|[\]\\%]/g, "\\$&"), "i"),
    message: `Verbotene Formulierung: „${phrase}“`,
  })),
  {
    id: "unattributed-leader",
    pattern: /\beiner? der führenden\b/i,
    message: "„einer der führenden“ nur als zitierte Herstelleraussage mit Quelle.",
  },
  {
    id: "best-without-qualifier",
    pattern: /\bdie beste Software\b(?! für)/i,
    message: "„die beste Software“ nur mit Einschränkung („für …“).",
  },
  {
    id: "du-form",
    pattern: /\b(du|dich|dir|dein|deine|deinen|deinem|deiner|deines)\b/i,
    message: "Bitte die Sie-Form verwenden.",
  },
  {
    id: "emoji",
    pattern: /\p{Extended_Pictographic}/u,
    message: "Keine Emojis in Inhalten und Oberfläche.",
  },
  {
    id: "english-decimal-euro",
    pattern: /\b\d+\.\d{2}\s?€/,
    message: "Deutsches Zahlenformat verwenden: 9,90 € statt 9.90 €.",
  },
  {
    id: "euro-before-amount",
    pattern: /€\s?\d/,
    message: "Das Euro-Zeichen steht hinter dem Betrag: 9,90 €.",
  },
  {
    id: "arrow-character",
    pattern: /[→←↗]/,
    message: "Pfeile sind Icons, keine Textzeichen (nicht in der Schrift enthalten).",
  },
  {
    id: "english-ui",
    pattern: /^(read more|learn more|click here|submit|loading\.*|sign up|get started|more info)$/i,
    message: "Englischer Oberflächentext.",
  },
];

/** Words that claim a hands-on test. Allowed only when a documented test exists. */
export const TEST_CLAIM = /\b(getestet|im test|testsieger|unser test|wir haben .* getestet)\b/i;

export function checkCopy(text: string): CopyRule[] {
  return COPY_RULES.filter((rule) => rule.pattern.test(text));
}
