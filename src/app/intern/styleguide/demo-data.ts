// FICTITIOUS DEMO DATA for the internal styleguide only (Section 5.6).
// Every product, person, price and fact here is invented and labeled as such on the page.
// Nothing from this file may be imported by a public route.

import type { FeatureTile } from "@/components/marketing/feature-tiles";
import type { GuideTeaser } from "@/components/marketing/guide-cards";
import type { Step } from "@/components/marketing/step-cards";
import type { SearchEntry } from "@/components/layout/command-palette";
import type { NavLink } from "@/components/layout/navigation";
import type { ComparisonGroup } from "@/components/software/comparison-table";
import type {
  ComplianceRow,
  PricePlan,
  ScoreCriterion,
  SoftwareSummary,
} from "@/components/software/types";
import { Lattice, NestedSquares, RayBurst } from "@/components/illustrations/line-art";
import { routes } from "@/lib/routes";
import { SCORE_CRITERIA } from "@/lib/scoring";

export const DEMO_DATE = "2026-10-24";
const demoSource = "https://example.com/demo-quelle";

export const demoSoftware: SoftwareSummary[] = [
  {
    slug: "beispiel-buchhaltung-a",
    name: "Musterbuch A",
    vendor: "Demo-Anbieter GmbH",
    category: "Buchhaltungssoftware",
    score: 8.6,
    research: null,
    priceFromCents: 990,
    priceNet: true,
    freePlan: false,
    priceCheckedAt: DEMO_DATE,
    keyFacts: ["DATEV-Export", "E-Rechnung senden und empfangen", "Server in Deutschland"],
    affiliate: true,
    vendorUrl: "https://example.com",
  },
  {
    slug: "beispiel-buchhaltung-b",
    name: "Kontoklar B",
    vendor: "Beispiel AG",
    category: "Rechnungsprogramm",
    score: 7.4,
    research: null,
    priceFromCents: 0,
    priceNet: true,
    freePlan: false,
    priceCheckedAt: DEMO_DATE,
    keyFacts: ["Kostenloser Einstiegstarif", "Keine Lohnabrechnung"],
    affiliate: false,
    vendorUrl: "https://example.com",
  },
  {
    slug: "beispiel-erp-c",
    name: "Werkplan C",
    vendor: "Fiktiv Software KG",
    category: "ERP-Software",
    score: null,
    research: null,
    priceFromCents: 4900,
    priceNet: true,
    freePlan: false,
    priceCheckedAt: DEMO_DATE,
    keyFacts: ["Lager und Warenwirtschaft", "Mehrwährung"],
    affiliate: false,
    vendorUrl: "https://example.com",
  },
];

const demoValues = [8.8, 8.2, 8.0, 9.4, 8.5];
export const demoCriteria: ScoreCriterion[] = SCORE_CRITERIA.map((c, i) => ({
  label: c.label,
  weight: c.weight,
  value: demoValues[i],
}));

export const demoPros = [
  "Belege lassen sich per App fotografieren und werden automatisch zugeordnet.",
  "DATEV-Export ohne Aufpreis in allen Tarifen.",
  "Deutschsprachiger Support per Telefon an Werktagen.",
];

export const demoCons = [
  "Keine Lohnabrechnung, dafür ist ein Zusatztool nötig.",
  "Mahnwesen erst ab dem mittleren Tarif.",
  "Keine Mehrwährungsbuchhaltung.",
];

export const demoCompliance: ComplianceRow[] = [
  {
    criterion: "GoBD-konforme Archivierung",
    status: "ja",
    note: "Verfahrensdokumentation verfügbar",
    sourceUrl: demoSource,
    sourceLabel: "Demo-Quelle",
  },
  {
    criterion: "E-Rechnung empfangen (XRechnung, ZUGFeRD)",
    status: "ja",
    sourceUrl: demoSource,
    sourceLabel: "Demo-Quelle",
  },
  {
    criterion: "E-Rechnung senden",
    status: "teilweise",
    note: "Nur ZUGFeRD, XRechnung geplant",
    sourceUrl: demoSource,
    sourceLabel: "Demo-Quelle",
  },
  {
    criterion: "DATEV-Export",
    status: "aufpreis",
    note: "Ab Tarif Plus",
    sourceUrl: demoSource,
    sourceLabel: "Demo-Quelle",
  },
  { criterion: "ELSTER / UStVA", status: "nein" },
];

export const demoPlans: PricePlan[] = [
  {
    name: "Start",
    monthlyCents: 990,
    yearlyMonthlyCents: 790,
    perUser: false,
    net: true,
    includes: ["Angebote und Rechnungen", "Belegerfassung", "1 Nutzer"],
    sourceUrl: demoSource,
    checkedAt: DEMO_DATE,
  },
  {
    name: "Plus",
    monthlyCents: 1990,
    yearlyMonthlyCents: 1590,
    perUser: false,
    net: true,
    includes: ["Alles aus Start", "DATEV-Export", "Mahnwesen", "3 Nutzer"],
    sourceUrl: demoSource,
    checkedAt: DEMO_DATE,
  },
  {
    name: "Team",
    monthlyCents: 990,
    yearlyMonthlyCents: null,
    perUser: true,
    net: true,
    includes: ["Alles aus Plus", "Rollen und Rechte", "Steuerberaterzugang"],
    sourceUrl: demoSource,
    checkedAt: DEMO_DATE,
  },
];

export const demoComparison: { products: string[]; groups: ComparisonGroup[] } = {
  products: ["Musterbuch A", "Kontoklar B", "Werkplan C"],
  groups: [
    {
      title: "Rechtssicherheit",
      rows: [
        { label: "GoBD-konform", values: ["ja", "ja", "ja"] },
        { label: "E-Rechnung senden", values: ["ja", "teilweise", "nein"] },
        { label: "DATEV-Export", values: ["ja", "nein", "ja"] },
      ],
    },
    {
      title: "Preise",
      rows: [
        { label: "Einstiegspreis netto", values: ["9,90 €", "0,00 €", "49,00 €"] },
        { label: "Kostenlose Testphase", values: ["30 Tage", "30 Tage", "14 Tage"] },
      ],
    },
  ],
};

export const demoTiles: FeatureTile[] = [
  {
    title: "Unabhängig bewertet",
    text: "Feste Kriterien und Gewichte. Provisionen ändern keine Wertung.",
    art: RayBurst,
  },
  {
    title: "Deutsche Rechtslage im Blick",
    text: "GoBD, E-Rechnung, DATEV und ELSTER prüfen wir für jedes Produkt.",
    art: NestedSquares,
  },
  {
    title: "Passend zu Ihrem Bedarf",
    text: "Der Software-Finder erklärt, warum ein Tool passt und was Sie beachten sollten.",
    art: Lattice,
  },
];

export const demoSteps: Step[] = [
  {
    id: "anforderungen",
    label: "Anforderungen",
    title: "Was Ihr Unternehmen braucht",
    text: "Rechtsform, Teamgröße, Branche und Steuerberater: daraus ergibt sich, welche Funktionen Pflicht sind.",
    cta: { label: "Finder starten", href: routes.finder() },
  },
  {
    id: "vergleich",
    label: "Vergleich",
    title: "Funktionen nebeneinander",
    text: "Bis zu drei Tools mit allen Funktionen, Preisen und Rechtsfragen auf einen Blick.",
  },
  {
    id: "kosten",
    label: "Kosten",
    title: "Was es wirklich kostet",
    text: "Nutzer, Tarif und Zusatzmodule über 12 und 36 Monate, netto und brutto.",
  },
  {
    id: "entscheidung",
    label: "Entscheidung",
    title: "Mit gutem Gefühl wählen",
    text: "Testphase nutzen, Daten importieren, Steuerberater einbinden.",
  },
];

export const demoGuides: GuideTeaser[] = [
  {
    href: routes.guide("beispiel-e-rechnung"),
    topic: "Ratgeber",
    title: "Beispielartikel: Was die E-Rechnung für kleine Betriebe bedeutet",
    excerpt: "Platzhaltertext für die Vorschau eines Ratgeberartikels im Styleguide.",
    date: DEMO_DATE,
  },
  {
    href: routes.guide("beispiel-gobd"),
    topic: "Recht",
    title: "Beispielartikel zur GoBD",
    date: "2026-10-12",
  },
  {
    href: routes.guide("beispiel-datev"),
    topic: "Steuerberater",
    title: "Beispielartikel zum DATEV-Export",
    date: "2026-10-03",
  },
  {
    href: routes.guide("beispiel-kleinunternehmer"),
    topic: "Gründung",
    title: "Beispielartikel für Kleinunternehmer",
    date: "2026-09-21",
  },
];

export const demoCategories: NavLink[] = [
  {
    label: "Buchhaltungssoftware",
    href: routes.category("buchhaltungssoftware"),
    description: "Belege, Bank, EÜR und Bilanz",
  },
  {
    label: "Rechnungsprogramme",
    href: routes.category("rechnungsprogramme"),
    description: "Angebote, Rechnungen, Mahnungen",
  },
  {
    label: "ERP-Software",
    href: routes.category("erp-software"),
    description: "Einkauf, Lager, Produktion",
  },
  {
    label: "CRM-Software",
    href: routes.category("crm-software"),
    description: "Kontakte, Pipeline, Angebote",
  },
];

export const demoSearch: SearchEntry[] = [
  ...demoSoftware.map((s) => ({
    group: "Software",
    label: s.name,
    href: routes.software(s.slug),
    hint: s.category,
  })),
  ...demoCategories.map((c) => ({ group: "Kategorien", label: c.label, href: c.href })),
  {
    group: "Ratgeber",
    label: "Beispielartikel E-Rechnung",
    href: routes.guide("beispiel-e-rechnung"),
    hint: "XRechnung ZUGFeRD",
  },
];
