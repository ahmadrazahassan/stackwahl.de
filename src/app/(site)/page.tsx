import Link from "next/link";
import { Lattice, NestedSquares, RayBurst, StackLines } from "@/components/illustrations/line-art";
import { FeatureTiles } from "@/components/marketing/feature-tiles";
import { Marquee } from "@/components/marketing/marquee";
import { NewsletterPanel } from "@/components/marketing/newsletter-panel";
import { StepCards, type Step } from "@/components/marketing/step-cards";
import { SoftwareCard } from "@/components/software/software-card";
import { ArrowLink, ButtonLink } from "@/components/ui/button";
import { Container, Panel, SplitGrid } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";
import { getAllSoftware, getLiveCategories, getSoftwareInCategory, toSummary } from "@/lib/content";
import { newsletterAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { subscribeNewsletter } from "./newsletter/actions";

const pillars = [
  {
    title: "Unabhängig bewertet",
    text: "Feste Kriterien und Gewichte. Provisionen ändern weder Reihenfolge noch Wertung.",
    art: RayBurst,
  },
  {
    title: "Deutsche Rechtslage im Blick",
    text: "GoBD, E-Rechnung, DATEV, ELSTER und Serverstandort, für jedes Programm mit Quelle.",
    art: NestedSquares,
  },
  {
    title: "Preise mit Datum",
    text: "Listenpreise netto und brutto, jede Angabe mit Prüfdatum und Link zur Preisseite.",
    art: Lattice,
  },
];

export default function HomePage() {
  const categories = getLiveCategories();
  const software = getAllSoftware();

  const steps: Step[] = [
    {
      id: "anforderungen",
      label: "Anforderungen",
      title: "Was Ihr Unternehmen braucht",
      text: "Rechtsform, Umsatz und Steuerberatung bestimmen, welche Funktionen Pflicht sind: etwa E-Rechnung, ELSTER oder ein DATEV-Export.",
    },
    {
      id: "vergleich",
      label: "Vergleich",
      title: "Funktionen nebeneinander",
      text: "Jede Kategorie zeigt die Rechtssicherheit aller Programme in einer Tabelle, mit Quelle für jede Angabe.",
      cta: categories[0]
        ? { label: "Zur Kategorie", href: routes.category(categories[0].slug) }
        : undefined,
    },
    {
      id: "kosten",
      label: "Kosten",
      title: "Was es wirklich kostet",
      text: "Jedes Profil rechnet die Listenpreise auf 12 und 36 Monate hoch, netto und brutto, bei monatlicher und jährlicher Zahlung.",
    },
    {
      id: "entscheidung",
      label: "Entscheidung",
      title: "Mit gutem Gefühl wählen",
      text: "Testphase nutzen, eigene Daten importieren und die Steuerberatung früh einbinden, bevor Sie sich festlegen.",
      cta: { label: "Zur Methodik", href: routes.methodology() },
    },
  ];

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <Panel as="section" aria-labelledby="start-titel">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:items-end lg:py-32">
          <div className="min-w-0 lg:col-span-8">
            <Eyebrow className="text-muted">Business-Software für Deutschland</Eyebrow>
            <Headline
              as="h1"
              id="start-titel"
              size="display"
              tail="Unabhängig verglichen."
              className="mt-6 max-w-[16ch]"
            >
              Die passende Software für Ihr Unternehmen.
            </Headline>
            <Lead className="mt-8">
              Stackwahl vergleicht Buchhaltungssoftware und Rechnungsprogramme für Unternehmen in
              Deutschland: Preise mit Datum und Quelle, Funktionen und Rechtssicherheit von GoBD bis
              E-Rechnung.
            </Lead>
            <div className="mt-10 flex flex-wrap gap-3">
              {categories.length > 0 ? (
                <ButtonLink href={routes.categories()} size="lg">
                  Kategorien ansehen
                </ButtonLink>
              ) : null}
              <ButtonLink href={routes.methodology()} variant="outline" size="lg">
                So vergleichen wir
              </ButtonLink>
            </div>
          </div>
          <div className="hidden justify-end text-ink lg:col-span-4 lg:flex">
            <StackLines size={260} />
          </div>
        </Container>
      </Panel>

      <Panel as="section" aria-labelledby="methode-titel">
        <Container className="py-16 sm:py-24">
          <SplitGrid aside={<Eyebrow className="text-muted">Unsere Methode</Eyebrow>}>
            <Headline id="methode-titel" size="h2" tail="Jede Angabe mit Datum.">
              Fakten mit Quelle statt Werbeversprechen.
            </Headline>
            <p className="mt-6 max-w-[62ch] text-body text-muted">
              Wir lesen die Preisseiten, Funktionslisten und Datenschutzangaben der Anbieter selbst
              und speichern zu jeder Angabe die Quelle und das Prüfdatum. Was ein Anbieter nicht
              angibt, steht bei uns als „Keine Angabe“, nicht als Nein. Eine Wertung gibt es erst
              nach einem Praxistest.
            </p>
            <ArrowLink href={routes.methodology()} className="mt-6">
              Methodik lesen
            </ArrowLink>
          </SplitGrid>
        </Container>
      </Panel>

      <FeatureTiles tiles={pillars} />

      {categories.length > 0 ? (
        <Panel as="section" aria-labelledby="kategorien-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Kategorien</Eyebrow>}>
              <Headline id="kategorien-titel" size="h2" tail="Nach Aufgabe sortiert.">
                Software für Ihr Büro.
              </Headline>
            </SplitGrid>
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={routes.category(c.slug)}
                    className="group flex h-full flex-col justify-between gap-10 rounded-card border border-line p-6 transition-colors hover:border-ink sm:p-8"
                  >
                    <div>
                      <h3 className="text-h3 group-hover:underline group-hover:underline-offset-4">
                        {c.name}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-small text-muted">{c.description}</p>
                    </div>
                    <p className="text-small font-medium tabular">
                      {getSoftwareInCategory(c.slug).length} Programme im Vergleich
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Panel>
      ) : null}

      <Panel tone="ink" as="section" aria-labelledby="schritte-titel">
        <Container className="py-16 sm:py-24">
          <SplitGrid aside={<Eyebrow marker="current">So gehen Sie vor</Eyebrow>}>
            <Headline id="schritte-titel" size="h2" tail="In vier Schritten." tailTone="soft">
              Zur passenden Software.
            </Headline>
          </SplitGrid>
          <StepCards steps={steps} label="Schritte zur Softwarewahl" className="mt-12" />
        </Container>
      </Panel>

      {software.length > 0 ? (
        <Panel as="section" aria-labelledby="programme-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Im Vergleich</Eyebrow>}>
              <Headline id="programme-titel" size="h2" tail="Alphabetisch sortiert.">
                Alle Programme im Überblick.
              </Headline>
            </SplitGrid>
            <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {software.map((s) => (
                <li key={s.slug}>
                  <SoftwareCard software={toSummary(s)} />
                </li>
              ))}
            </ul>
          </Container>
        </Panel>
      ) : null}

      <Marquee text="Klar vergleichen. Sicher entscheiden." className="py-6" />

      {newsletterAvailable() ? (
        <Panel as="section" aria-label="Newsletter">
          <Container className="py-16 sm:py-24">
            <NewsletterPanel action={subscribeNewsletter} />
          </Container>
        </Panel>
      ) : null}
    </main>
  );
}
