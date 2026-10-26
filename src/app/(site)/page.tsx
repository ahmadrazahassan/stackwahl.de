import { ArticleGrid } from "@/components/guides/article-card";
import { FactBoard } from "@/components/home/fact-board";
import { FeaturedSoftware } from "@/components/home/featured-software";
import { HomeCompare } from "@/components/home/home-compare";
import { OverviewList } from "@/components/home/overview-list";
import { SituationLinks } from "@/components/home/situation-links";
import { SoftwareShowcase } from "@/components/home/software-showcase";
import { Lattice, NestedSquares, RayBurst, StackLines } from "@/components/illustrations/line-art";
import { FeatureTiles } from "@/components/marketing/feature-tiles";
import { LogoRow } from "@/components/marketing/logo-row";
import { Marquee } from "@/components/marketing/marquee";
import { NewsletterPanel } from "@/components/marketing/newsletter-panel";
import { StepCards, type Step } from "@/components/marketing/step-cards";
import { ArrowLink, ButtonLink } from "@/components/ui/button";
import { Container, Panel, SplitGrid } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";
import { getAllSoftware, getLiveCategories } from "@/lib/content";
import {
  comparePresets,
  compareProducts,
  factLists,
  featuredSoftware,
  homeLogos,
  latestReview,
  overviewTabs,
  showcaseTabs,
} from "@/lib/content/home";
import { articleTeasers } from "@/lib/content/guides";
import { formatDate } from "@/lib/format";
import { newsletterAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";
import { subscribeNewsletter } from "./newsletter/actions";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, websiteLd } from "@/lib/seo";

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
  const showcase = showcaseTabs();
  const overview = overviewTabs();
  const facts = factLists();
  const logos = homeLogos();
  const stand = latestReview();
  const articles = articleTeasers(6);
  const featured = featuredSoftware(4);
  const compare = compareProducts();
  const presets = comparePresets(compare);
  const finder = siteConfig.features.finder;

  const steps: Step[] = [
    {
      id: "anforderungen",
      label: "Anforderungen",
      title: "Was Ihr Unternehmen braucht",
      text: "Rechtsform, Umsatz und Steuerberatung bestimmen, welche Funktionen Pflicht sind: etwa E-Rechnung, ELSTER oder ein DATEV-Export.",
      cta: finder ? { label: "Software-Finder starten", href: routes.finder() } : undefined,
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
      cta: siteConfig.features.costCalculator
        ? { label: "Zum Kostenrechner", href: routes.costCalculator() }
        : undefined,
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
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <Panel as="section" aria-labelledby="start-titel">
        <Container className="pt-16 pb-10 sm:pt-24 lg:pt-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-8">
              <Eyebrow className="text-muted">Business-Software für Deutschland</Eyebrow>
              <Headline
                as="h1"
                id="start-titel"
                size="display"
                tail="Unabhängig verglichen."
                className="mt-6 max-w-[16ch] max-sm:text-h1"
              >
                Die passende Software für Ihr Unternehmen.
              </Headline>
              <Lead className="mt-8">
                {software.length > 0
                  ? `${software.length} Programme für Buchhaltung, Rechnungen und ERP, recherchiert auf den Seiten der Anbieter: Preise mit Datum und Quelle, Funktionen und Rechtssicherheit von GoBD bis E-Rechnung.`
                  : "Buchhaltung, Rechnungen und ERP, recherchiert auf den Seiten der Anbieter: Preise mit Datum und Quelle, Funktionen und Rechtssicherheit von GoBD bis E-Rechnung."}
              </Lead>
              <div className="mt-10 flex flex-wrap gap-3">
                {finder ? (
                  <ButtonLink href={routes.finder()} size="lg">
                    Software finden
                  </ButtonLink>
                ) : null}
                {categories.length > 0 ? (
                  <ButtonLink href={routes.categories()} variant="outline" size="lg">
                    Kategorien ansehen
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <div className="hidden justify-end text-ink lg:col-span-4 lg:flex">
              <StackLines size={260} />
            </div>
          </div>
          {logos.length > 0 ? (
            <LogoRow logos={logos} className="mt-16 border-t border-line pt-8 sm:mt-24" />
          ) : null}
        </Container>
      </Panel>

      {featured.length > 0 ? (
        <Panel as="section" aria-labelledby="fokus-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Im Fokus</Eyebrow>}>
              <Headline id="fokus-titel" size="h2" tail="Nach Recherche-Wertung.">
                Die Programme mit den meisten belegten Stärken.
              </Headline>
              <p className="mt-6 max-w-[62ch] text-body text-muted">
                Die vier Programme mit der höchsten Recherche-Wertung über alle Kategorien. Sie
                entsteht nach fester Formel aus Funktionen, Rechtssicherheit, Einstiegspreis sowie
                Support und Datenschutz, jeweils mit Quelle, aber ohne Praxistest. Provisionen haben
                keinen Einfluss auf Auswahl und Reihenfolge.
              </p>
              <ArrowLink href={`${routes.methodology()}#recherche-wertung`} className="mt-6">
                So entsteht die Wertung
              </ArrowLink>
            </SplitGrid>
            <div className="mt-12">
              <FeaturedSoftware items={featured} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {compare.length >= 2 && presets.length > 0 ? (
        <Panel as="section" aria-labelledby="vergleich-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Direktvergleich</Eyebrow>}>
              <Headline id="vergleich-titel" size="h2" tail="Zwei oder drei auf einmal.">
                Programme direkt vergleichen.
              </Headline>
              <p className="mt-6 max-w-[62ch] text-body text-muted">
                Wählen Sie zwei oder drei Programme und sehen Sie auf einen Blick, welches am
                günstigsten startet, welches Sie kostenlos testen können und was jedes Programm für
                E-Rechnung, DATEV und ELSTER mitbringt.
              </p>
            </SplitGrid>
            <div className="mt-12">
              <HomeCompare products={compare} presets={presets} initial={presets[0].slugs} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {finder && software.length > 0 ? (
        <Panel as="section" aria-labelledby="schnellstart-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Schnellstart</Eyebrow>}>
              <Headline id="schnellstart-titel" size="h2" tail="Ein Klick zur Auswahl.">
                Was ist Ihnen am wichtigsten?
              </Headline>
              <p className="mt-6 max-w-[62ch] text-body text-muted">
                Wählen Sie die Lage, die zu Ihrem Unternehmen passt. Der Software-Finder zeigt Ihnen
                dann die Programme, die dazu passen, und begründet jede Empfehlung mit den belegten
                Funktionen.
              </p>
            </SplitGrid>
            <div className="mt-12">
              <SituationLinks />
            </div>
          </Container>
        </Panel>
      ) : null}

      {showcase.length > 0 ? (
        <Panel as="section" aria-labelledby="entdecken-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Software entdecken</Eyebrow>}>
              <Headline id="entdecken-titel" size="h2" tail="Nach Aufgabe sortiert.">
                Software für Ihr Büro.
              </Headline>
              <p className="mt-6 max-w-[62ch] text-small text-muted">
                Innerhalb jeder Kategorie sortiert nach dem günstigsten bezahlten Tarif. Provisionen
                haben keinen Einfluss auf die Reihenfolge.
              </p>
            </SplitGrid>
            <div className="mt-12">
              <SoftwareShowcase tabs={showcase} />
            </div>
          </Container>
        </Panel>
      ) : null}

      <Panel as="section" aria-labelledby="methode-titel">
        <Container className="py-16 sm:py-24">
          <SplitGrid aside={<Eyebrow className="text-muted">Unsere Methode</Eyebrow>}>
            <Headline id="methode-titel" size="h2" tail="Jede Angabe mit Datum.">
              Fakten mit Quelle statt Werbeversprechen.
            </Headline>
            <p className="mt-6 max-w-[62ch] text-body text-muted">
              Wir lesen die Preisseiten, Funktionslisten und Datenschutzangaben der Anbieter selbst
              und speichern zu jeder Angabe die Quelle und das Prüfdatum. Was ein Anbieter nicht
              angibt, steht bei uns als „Keine Angabe“, nicht als Nein. Aus diesen Angaben berechnen
              wir nach fester Formel die Recherche-Wertung; eine Note für die Bedienung vergeben wir
              erst nach einem Praxistest.
            </p>
            <ArrowLink href={routes.methodology()} className="mt-6">
              Methodik lesen
            </ArrowLink>
          </SplitGrid>
        </Container>
      </Panel>

      <FeatureTiles tiles={pillars} />

      {overview.length > 0 ? (
        <Panel as="section" aria-labelledby="ueberblick-titel" tone="bg">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Marktüberblick</Eyebrow>}>
              <Headline id="ueberblick-titel" size="h2" tail="Mit Stärken und Grenzen.">
                Die Programme im Überblick.
              </Headline>
              <p className="mt-6 max-w-[62ch] text-body text-muted">
                Je Kategorie die fünf Programme mit dem günstigsten bezahlten Einstieg, jeweils mit
                Zielgruppe, den wichtigsten Stärken und dem, was Sie vor dem Abschluss wissen
                sollten. Provisionen beeinflussen weder Auswahl noch Reihenfolge.
                {stand ? ` Stand der Recherche: ${formatDate(stand)}.` : ""}
              </p>
            </SplitGrid>
            <div className="mt-12">
              <OverviewList tabs={overview} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {facts.length > 0 ? (
        <Panel as="section" aria-labelledby="fakten-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Auf einen Blick</Eyebrow>}>
              <Headline id="fakten-titel" size="h2" tail="Schnell beantwortet.">
                Drei Fragen vor jeder Entscheidung.
              </Headline>
            </SplitGrid>
            <div className="mt-12">
              <FactBoard lists={facts} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {articles.length > 0 ? (
        <Panel as="section" aria-labelledby="ratgeber-titel">
          <Container className="py-16 sm:py-24">
            <SplitGrid aside={<Eyebrow className="text-muted">Ratgeber</Eyebrow>}>
              <Headline id="ratgeber-titel" size="h2" tail="Mit Quellen belegt.">
                Antworten auf die Fragen vor dem Kauf.
              </Headline>
              <p className="mt-6 max-w-[62ch] text-body text-muted">
                E-Rechnung, Umsatzsteuer, versteckte Kosten oder der Wechsel von einem Programm zum
                anderen: Unsere Artikel beantworten die häufigsten Fragen mit den Angaben der
                Anbieter und den Gesetzestexten.
              </p>
              <ArrowLink href={routes.guides()} className="mt-6">
                Alle Artikel
              </ArrowLink>
            </SplitGrid>
            <ArticleGrid articles={articles} className="mt-12" />
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
