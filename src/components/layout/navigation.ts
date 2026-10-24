import { routes } from "@/lib/routes";

export type NavLink = { label: string; href: string; description?: string };

/** Header routes (docs/PLAN.md, navigation). Categories are passed in: only live ones show. */
export const primaryNav: NavLink[] = [
  { label: "Vergleich", href: routes.comparisonTool() },
  { label: "Software-Finder", href: routes.finder() },
  { label: "Ratgeber", href: routes.guides() },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Werkzeuge",
    links: [
      { label: "Software-Finder", href: routes.finder() },
      { label: "Vergleich", href: routes.comparisonTool() },
      { label: "Kostenrechner", href: routes.costCalculator() },
      { label: "Ratgeber", href: routes.guides() },
      { label: "Glossar", href: routes.glossary() },
    ],
  },
  {
    title: "Über Stackwahl",
    links: [
      { label: "Methodik", href: routes.methodology() },
      { label: "Bewertungsrichtlinien", href: routes.reviewPolicy() },
      { label: "Transparenz", href: routes.transparency() },
      { label: "Redaktion", href: routes.editorial() },
      { label: "Über uns", href: routes.about() },
      { label: "Kontakt", href: routes.contact() },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Impressum", href: routes.imprint() },
  { label: "Datenschutz", href: routes.privacy() },
  { label: "Barrierefreiheit", href: routes.accessibility() },
  { label: "Cookie-Einstellungen", href: routes.cookieSettings() },
];
