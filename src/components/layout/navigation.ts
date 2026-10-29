import { routes } from "@/lib/routes";

export type NavLink = { label: string; href: string; description?: string };

/** What exists right now. A link to a page that does not exist is never shown. */
export type Availability = {
  finder: boolean;
  comparisonTool: boolean;
  costCalculator: boolean;
  guides: boolean;
  glossary: boolean;
  authors: boolean;
  reviewPolicy: boolean;
  categories: boolean;
  useCases: boolean;
};

const when = (condition: boolean, link: NavLink) => (condition ? [link] : []);

export function buildNavigation(a: Availability) {
  const primary: NavLink[] = [
    ...when(a.comparisonTool, { label: "Vergleich", href: routes.comparisonTool() }),
    ...when(a.finder, { label: "Software-Finder", href: routes.finder() }),
    ...when(a.guides, { label: "Ratgeber", href: routes.guides() }),
    ...when(a.glossary, { label: "Glossar", href: routes.glossary() }),
  ];

  // Header: pills on the left, the wordmark in the centre, dropdowns and Kontakt on the right.
  const header = {
    left: [
      { label: "Start", href: routes.home() },
      ...when(a.comparisonTool, { label: "Vergleich", href: routes.comparisonTool() }),
      ...when(a.finder, { label: "Software-Finder", href: routes.finder() }),
    ],
    knowledge: [
      ...when(a.guides, {
        label: "Ratgeber",
        href: routes.guides(),
        description: "Die Fragen vor dem Kauf, mit Quellen",
      }),
      ...when(a.useCases, {
        label: "Software für …",
        href: routes.useCases(),
        description: "Empfehlungen nach Branche und Rechtsform",
      }),
      ...when(a.glossary, {
        label: "Glossar",
        href: routes.glossary(),
        description: "Begriffe von E-Rechnung bis UStVA",
      }),
      ...when(a.costCalculator, {
        label: "Kostenrechner",
        href: routes.costCalculator(),
        description: "Listenpreise für Ihr Team, netto und brutto",
      }),
      {
        label: "Methodik",
        href: routes.methodology(),
        description: "So recherchieren und werten wir",
      },
    ],
    contact: { label: "Kontakt", href: routes.contact() },
  };

  const cta: NavLink | null = a.finder
    ? { label: "Software finden", href: routes.finder() }
    : a.categories
      ? { label: "Kategorien ansehen", href: routes.categories() }
      : null;

  const tools: NavLink[] = [
    ...when(a.finder, { label: "Software-Finder", href: routes.finder() }),
    ...when(a.comparisonTool, { label: "Vergleich", href: routes.comparisonTool() }),
    ...when(a.costCalculator, { label: "Kostenrechner", href: routes.costCalculator() }),
    ...when(a.guides, { label: "Ratgeber", href: routes.guides() }),
    ...when(a.glossary, { label: "Glossar", href: routes.glossary() }),
  ];

  const about: NavLink[] = [
    { label: "Methodik", href: routes.methodology() },
    ...when(a.reviewPolicy, { label: "Bewertungsrichtlinien", href: routes.reviewPolicy() }),
    { label: "Transparenz", href: routes.transparency() },
    ...when(a.authors, { label: "Redaktion", href: routes.editorial() }),
    { label: "Über uns", href: routes.about() },
    { label: "Kontakt", href: routes.contact() },
  ];

  const footer = [
    ...(tools.length > 0 ? [{ title: "Werkzeuge", links: tools }] : []),
    { title: "Über Stackwahl", links: about },
  ];

  return { primary, header, cta, footer, legal: legalNav };
}

export const legalNav: NavLink[] = [
  { label: "Impressum", href: routes.imprint() },
  { label: "Datenschutz", href: routes.privacy() },
  { label: "Barrierefreiheit", href: routes.accessibility() },
  { label: "Cookie-Einstellungen", href: routes.cookieSettings() },
];
