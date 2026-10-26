// The single URL builder (docs/BUILD_PROMPT.md, Section 5). Every internal link comes from here.
// German slugs, lowercase, no trailing slash.

export const routes = {
  home: () => "/",
  categories: () => "/kategorien",
  category: (slug: string) => `/kategorien/${slug}`,
  software: (slug: string) => `/software/${slug}`,
  softwarePricing: (slug: string) => `/software/${slug}/preise`,
  softwareAlternatives: (slug: string) => `/software/${slug}/alternativen`,
  softwareReviews: (slug: string) => `/software/${slug}/bewertungen`,
  comparisonTool: () => "/vergleich",
  comparison: (slug: string) => `/vergleich/${slug}`,
  useCases: () => "/software-fuer",
  useCase: (slug: string) => `/software-fuer/${slug}`,
  finder: () => "/software-finder",
  finderResults: () => "/software-finder/ergebnis",
  costCalculator: () => "/kostenrechner",
  guides: () => "/ratgeber",
  guide: (slug: string) => `/ratgeber/${slug}`,
  glossary: () => "/glossar",
  glossaryTerm: (slug: string) => `/glossar/${slug}`,
  writeReview: () => "/bewertung-schreiben",
  methodology: () => "/methodik",
  reviewPolicy: () => "/bewertungsrichtlinien",
  transparency: () => "/transparenz",
  editorial: () => "/redaktion",
  author: (slug: string) => `/redaktion/${slug}`,
  about: () => "/ueber-uns",
  contact: () => "/kontakt",
  newsletter: () => "/newsletter",
  imprint: () => "/impressum",
  privacy: () => "/datenschutz",
  accessibility: () => "/barrierefreiheit",
  cookieSettings: () => "/cookie-einstellungen",
  search: () => "/suche",
  styleguide: () => "/intern/styleguide",
  affiliate: (slug: string, from: string, pos = 1) => `/go/${slug}?from=${from}&pos=${pos}`,
} as const;

const UMLAUTS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

/** Builds a URL slug from German text: umlauts transliterated, lowercase, hyphenated. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => UMLAUTS[char] ?? char)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " und ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
