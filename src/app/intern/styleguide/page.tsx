import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Wordmark, type WordmarkOption } from "@/components/brand/wordmark";
import {
  Arcs,
  Lattice,
  NestedSquares,
  RayBurst,
  StackLines,
} from "@/components/illustrations/line-art";
import { CommandPalette } from "@/components/layout/command-palette";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FeatureTiles } from "@/components/marketing/feature-tiles";
import { GuideCards } from "@/components/marketing/guide-cards";
import { Marquee } from "@/components/marketing/marquee";
import { NewsletterPanel } from "@/components/marketing/newsletter-panel";
import { StepCards } from "@/components/marketing/step-cards";
import { VerdictCard } from "@/components/marketing/verdict-card";
import { ComparisonTable } from "@/components/software/comparison-table";
import { ComplianceChecklist } from "@/components/software/compliance-checklist";
import { PriceTable } from "@/components/software/price-table";
import { Breadcrumbs, ProfileHeader } from "@/components/software/profile-header";
import { ProfileTabs } from "@/components/software/profile-tabs";
import { ProsCons } from "@/components/software/pros-cons";
import { ScoreBadge, ScoreBreakdown, ScoreDisplay } from "@/components/software/score";
import { SoftwareCard } from "@/components/software/software-card";
import { ArrowLink, Button, ButtonLink, VendorButton } from "@/components/ui/button";
import { FormSpecimen } from "./form-specimen";
import { DemoNote, DisclosureLabel, Tag } from "@/components/ui/labels";
import { Container, Panel, Section, SplitGrid } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";
import { contrastRatio } from "@/lib/contrast";
import { routes } from "@/lib/routes";
import { colorTokens, colorTokenUse, textPairings, type ColorToken } from "@/styles/tokens";
import {
  DEMO_DATE,
  demoCategories,
  demoComparison,
  demoCompliance,
  demoCons,
  demoCriteria,
  demoGuides,
  demoPlans,
  demoPros,
  demoSearch,
  demoSoftware,
  demoSteps,
  demoTiles,
} from "./demo-data";

export const metadata: Metadata = {
  title: "Styleguide (intern)",
};

const swatchClass: Record<ColorToken, string> = {
  primary: "bg-primary",
  "primary-hover": "bg-primary-hover",
  "primary-tint": "bg-primary-tint",
  ink: "bg-ink",
  bg: "bg-bg",
  surface: "bg-surface",
  muted: "bg-muted",
  line: "bg-line",
  positive: "bg-positive",
  negative: "bg-negative",
};

const toc = [
  ["farben", "Farben"],
  ["typografie", "Typografie"],
  ["wortmarke", "Wortmarke"],
  ["buttons", "Buttons und Links"],
  ["formulare", "Formulare"],
  ["kacheln", "Kacheln und Illustrationen"],
  ["software", "Software-Karten und Wertung"],
  ["profil", "Profil"],
  ["vergleich", "Vergleich"],
  ["schritte", "Schritte"],
  ["fazit", "Fazit"],
  ["ratgeber", "Ratgeber"],
  ["newsletter", "Newsletter"],
  ["shell", "Header, Suche und Footer"],
] as const;

function Specimen({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      className="scroll-mt-16 border-t border-line pt-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id={`${id}-titel`} className="text-h3">
          {title}
        </h2>
        <DemoNote />
      </div>
      {note ? <p className="mt-2 max-w-[70ch] text-small text-muted">{note}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  const demo = demoSoftware[0];
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <Panel>
        <Container className="py-14 sm:py-20">
          <Eyebrow className="text-muted">Intern · nicht indexiert</Eyebrow>
          <Headline as="h1" size="h1" tail="Stackwahl." className="mt-6">
            Styleguide
          </Headline>
          <Lead className="mt-6">
            Alle Komponenten und Zustände aus dem Design-Briefing (Abschnitt 13). Sämtliche
            Produkte, Personen, Preise und Quellen auf dieser Seite sind frei erfunden und dienen
            nur der Ansicht.
          </Lead>
          <nav aria-label="Inhalt des Styleguides" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex min-h-11 items-center rounded-pill bg-bg px-4 text-small font-medium hover:bg-primary-tint"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Panel>

      <Panel>
        <Container className="flex flex-col gap-16 py-14 sm:py-20">
          <Specimen
            id="farben"
            title="Farben und Kontraste"
            note="Nur flache Farben, keine Verläufe. Jede Textkombination ist per Unit-Test gegen WCAG 2.2 AA (4,5:1) geprüft."
          >
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {(Object.keys(colorTokens) as ColorToken[]).map((token) => (
                <li key={token} className="flex flex-col gap-3">
                  <span
                    className={`block aspect-[4/3] rounded-card border border-line ${swatchClass[token]}`}
                  />
                  <span className="text-small font-medium">{token}</span>
                  <span className="-mt-2 text-small text-muted tabular">
                    {colorTokens[token].toUpperCase()}
                  </span>
                  <span className="-mt-2 text-small text-muted">{colorTokenUse[token]}</span>
                </li>
              ))}
            </ul>
            <div
              role="region"
              aria-label="Kontrasttabelle"
              tabIndex={0}
              className="relative mt-10 overflow-x-auto"
            >
              <table className="w-full min-w-[28rem] border-collapse text-small">
                <caption className="pb-3 text-left text-muted">
                  Kontrastverhältnisse der verwendeten Textkombinationen
                </caption>
                <thead>
                  <tr className="text-left">
                    <th scope="col" className="pb-3 eyebrow text-muted">
                      Text
                    </th>
                    <th scope="col" className="pb-3 eyebrow text-muted">
                      Hintergrund
                    </th>
                    <th scope="col" className="pb-3 text-right eyebrow text-muted">
                      Verhältnis
                    </th>
                    <th scope="col" className="pb-3 text-right eyebrow text-muted">
                      AA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {textPairings.map(([fg, bg]) => {
                    const ratio = contrastRatio(colorTokens[fg], colorTokens[bg]);
                    return (
                      <tr key={`${fg}-${bg}`} className="border-t border-line">
                        <td className="py-3">{fg}</td>
                        <td className="py-3">{bg}</td>
                        <td className="py-3 text-right tabular">
                          {ratio.toFixed(2).replace(".", ",")} : 1
                        </td>
                        <td className="py-3 text-right font-medium">
                          {ratio >= 4.5 ? "bestanden" : "nicht bestanden"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Specimen>

          <Specimen
            id="typografie"
            title="Typografie"
            note="Google Sans Flex für Überschriften, Inter für Text und Bedienelemente. Keine weitere Schrift, keine Monospace."
          >
            <div className="flex flex-col gap-8">
              <p className="text-display">Display 112</p>
              <Headline as="p" size="h1" tail="mit Ton.">
                Überschrift 1
              </Headline>
              <p className="text-h2">Überschrift 2: Größe, Übersicht, ß</p>
              <p className="text-h3">Überschrift 3: Preise ab 9,90 € zzgl. MwSt.</p>
              <Lead>
                Lead: Testberichte, Preise und Vergleiche für Buchhaltung, Rechnungen, ERP und CRM.
              </Lead>
              <p className="max-w-[68ch] text-body">
                Fließtext: Eine Freiberuflerin mit 15 Rechnungen pro Monat braucht andere Funktionen
                als ein Handwerksbetrieb mit Lager. Die Zeilenlänge bleibt zwischen 60 und 72
                Zeichen.
              </p>
              <p className="text-small text-muted">Klein: Preisstand 24.10.2026 · Quelle</p>
              <Eyebrow>Eyebrow-Label mit Marker</Eyebrow>
              <p className="text-h3 tabular">1.234,56 € · 8,6 / 10 · 19 %</p>
            </div>
          </Specimen>

          <Specimen
            id="wortmarke"
            title="Wortmarke: drei Optionen"
            note="Bitte eine Option wählen. Aktiv im Header und Footer ist vorläufig Option B."
          >
            <ul className="grid gap-4 md:grid-cols-3">
              {(["a", "b", "c"] as WordmarkOption[]).map((option) => (
                <li key={option} className="flex flex-col gap-4">
                  <div className="flex min-h-36 items-center justify-center rounded-card border border-line bg-surface">
                    <Wordmark option={option} className="scale-150" />
                  </div>
                  <div className="flex min-h-36 items-center justify-center rounded-card bg-ink text-surface">
                    <Wordmark option={option} className="scale-150" />
                  </div>
                  <p className="text-small font-medium">
                    Option {option.toUpperCase()}
                    <span className="font-normal text-muted">
                      {option === "a"
                        ? ": reine Wortmarke"
                        : option === "b"
                          ? ": Zeichen (drei Balken) und Wortmarke"
                          : ": Kleinschreibung mit Quadrat"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </Specimen>

          <Specimen
            id="buttons"
            title="Buttons und Links"
            note="Split-Button: Das Pfeilsegment ist Teil der Buttonform. Ein primärer Button pro Ansicht."
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLink href={routes.finder()}>Software finden</ButtonLink>
                <ButtonLink href={routes.categories()} variant="dark">
                  Kategorien ansehen
                </ButtonLink>
                <ButtonLink href={routes.comparisonTool()} variant="outline">
                  Vergleichen
                </ButtonLink>
                <Button arrow="none" variant="outline">
                  Ohne Pfeil
                </Button>
                <Button disabled>Deaktiviert</Button>
                <ButtonLink href={routes.finder()} size="lg">
                  Groß
                </ButtonLink>
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-card bg-ink p-6">
                <ButtonLink href={routes.finder()} variant="light">
                  Auf Dunkel
                </ButtonLink>
                <ButtonLink href={routes.finder()}>Primär auf Dunkel</ButtonLink>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <VendorButton href="https://example.com" affiliate>
                  Zum Anbieter
                </VendorButton>
                <DisclosureLabel kind="affiliate" />
                <DisclosureLabel kind="ad" />
                <ArrowLink href={routes.guides()}>Weiterlesen</ArrowLink>
                <Tag>Buchhaltung</Tag>
              </div>
            </div>
          </Specimen>

          <Specimen
            id="formulare"
            title="Formulare"
            note="Label, Hinweis und Fehler sind per aria-describedby verbunden. Native Auswahlliste für beste Bedienbarkeit."
          >
            <FormSpecimen />
          </Specimen>
        </Container>
      </Panel>

      <div id="kacheln" className="scroll-mt-16">
        <Panel tone="bg" className="mx-0 sm:mx-0">
          <Container className="pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-10">
              <h2 className="text-h3">Kacheln und Illustrationen</h2>
              <DemoNote />
            </div>
          </Container>
        </Panel>
        <FeatureTiles tiles={demoTiles} />
        <Panel className="mt-3 sm:mt-4">
          <Container className="py-10">
            <ul className="flex flex-wrap gap-10 text-ink">
              {[RayBurst, NestedSquares, Lattice, StackLines, Arcs].map((Art, i) => (
                <li key={i}>
                  <Art size={96} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-small text-muted">
              Eigene Linienillustrationen, 1,5 px, in Textfarbe, ohne Flächen.
            </p>
          </Container>
        </Panel>
      </div>

      <Panel>
        <Container className="flex flex-col gap-16 py-14 sm:py-20">
          <Specimen
            id="software"
            title="Software-Karten und Wertung"
            note="Echte Logos kommen aus Pressekits. Ohne Logodatei steht der Name als Text, nie eine Nachbildung."
          >
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {demoSoftware.map((s) => (
                <li key={s.slug}>
                  <SoftwareCard software={s} />
                </li>
              ))}
            </ul>
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              <ScoreBreakdown criteria={demoCriteria} />
              <div className="flex flex-col gap-6">
                <ScoreDisplay value={7.4} size="sm" />
                <ScoreBadge value={9.1} />
                <ScoreBadge value={null} />
              </div>
            </div>
          </Specimen>

          <Specimen id="profil" title="Profil: Kopf, Abschnittsnavigation, Inhalte">
            <Breadcrumbs
              items={[
                { label: "Start", href: routes.home() },
                { label: "Buchhaltungssoftware", href: routes.category("buchhaltungssoftware") },
                { label: demo.name },
              ]}
            />
            <ProfileHeader
              className="mt-8"
              software={demo}
              vendorHref="https://example.com"
              summary="Beispieltext: Für Selbstständige und kleine Teams, die Rechnungen, Belege und den DATEV-Export in einem Werkzeug wollen."
            />
            <ProfileTabs
              className="mt-12"
              sections={[
                { id: "profil-preise", label: "Preise" },
                { id: "profil-vor-nachteile", label: "Vor- und Nachteile" },
                { id: "profil-recht", label: "Rechtssicherheit" },
              ]}
            />
            <div className="flex flex-col gap-16 pt-12">
              <div id="profil-preise" className="scroll-mt-16">
                <h3 className="mb-6 eyebrow text-muted">Preise</h3>
                <PriceTable plans={demoPlans} />
              </div>
              <div id="profil-vor-nachteile" className="scroll-mt-16">
                <ProsCons pros={demoPros} cons={demoCons} />
              </div>
              <div id="profil-recht" className="scroll-mt-16">
                <ComplianceChecklist rows={demoCompliance} checkedAt={DEMO_DATE} />
              </div>
            </div>
          </Specimen>

          <Specimen
            id="vergleich"
            title="Vergleichstabelle"
            note="Kopfzeile und erste Spalte bleiben beim Scrollen stehen. Hervorhebung mit Balken und Fettschrift, nicht nur Farbe."
          >
            <ComparisonTable
              caption="Beispielvergleich dreier fiktiver Produkte"
              {...demoComparison}
            />
          </Specimen>
        </Container>
      </Panel>

      <Panel
        tone="ink"
        as="section"
        aria-labelledby="schritte-titel"
        id="schritte"
        className="scroll-mt-16"
      >
        <Container className="py-14 sm:py-20">
          <SplitGrid aside={<Eyebrow marker="current">So funktioniert es</Eyebrow>}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Headline id="schritte-titel" size="h2" tail="In vier Schritten." tailTone="soft">
                Zur passenden Software.
              </Headline>
              <DemoNote className="border-surface text-surface" />
            </div>
          </SplitGrid>
          <StepCards steps={demoSteps} label="Schritte zur Softwarewahl" className="mt-12" />
        </Container>
      </Panel>

      <Panel>
        <Container className="flex flex-col gap-16 py-14 sm:py-20">
          <Specimen
            id="fazit"
            title="Fazit der Redaktion"
            note="Nur echte redaktionelle Fazits oder verifizierte Bewertungen. Das Foto folgt mit der echten Redaktion."
          >
            <VerdictCard
              quote="Beispielzitat: Für kleine Teams mit Steuerberater die runde Lösung, solange keine Lohnabrechnung gebraucht wird."
              author="Vorname Nachname (fiktiv)"
              role="Redaktion Buchhaltung"
              date={DEMO_DATE}
            />
          </Specimen>
          <Specimen id="ratgeber" title="Ratgeber-Karten">
            <div className="rounded-panel bg-bg p-3 sm:p-4">
              <GuideCards guides={demoGuides} />
            </div>
          </Specimen>
        </Container>
      </Panel>

      <Marquee text="Klar vergleichen. Sicher entscheiden." className="py-6" />

      <Panel id="newsletter" className="scroll-mt-16">
        <Container className="py-14 sm:py-20">
          <div className="mb-10 flex justify-end">
            <DemoNote>Nur Zustände, Versand folgt in Phase 4</DemoNote>
          </div>
          <NewsletterPanel />
        </Container>
      </Panel>

      <section id="shell" aria-labelledby="shell-titel" className="scroll-mt-16">
        <Panel tone="bg">
          <Container className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-10">
              <h2 id="shell-titel" className="text-h3">
                Header, Suche und Footer
              </h2>
              <DemoNote />
            </div>
            <p className="mt-2 text-small text-muted">
              Kategorien erscheinen nur, wenn sie mindestens fünf veröffentlichte Profile haben.
              Suche mit Strg K oder ⌘ K.
            </p>
          </Container>
        </Panel>
        <SiteHeader categories={demoCategories} searchEntries={demoSearch} />
        <Section className="py-8 sm:py-10 lg:py-10">
          <Container>
            <CommandPalette entries={demoSearch} />
          </Container>
        </Section>
        <SiteFooter categories={demoCategories} year={2026} />
      </section>
    </main>
  );
}
