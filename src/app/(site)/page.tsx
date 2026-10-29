import Link from "next/link";
import { Search } from "lucide-react";
import { FeaturedSoftware } from "@/components/home/featured-software";
import { GuideSpotlight } from "@/components/home/guide-spotlight";
import { ScreenshotGallery } from "@/components/home/screenshot-gallery";
import { SoftwareShowcase } from "@/components/home/software-showcase";
import { EditorialLinks } from "@/components/page/editorial-links";
import { LogoRow } from "@/components/marketing/logo-row";
import { NewsletterPanel } from "@/components/marketing/newsletter-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowLink } from "@/components/ui/button";
import { AffiliateNote } from "@/components/ui/labels";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";
import { getAllSoftware, getComparisons, getLiveCategories, getUseCases } from "@/lib/content";
import { articleTeasers } from "@/lib/content/guides";
import { featuredSoftware, homeLogos, homeScreenshots, showcaseTabs } from "@/lib/content/home";
import { newsletterAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { organizationLd, websiteLd } from "@/lib/seo";
import { siteConfig } from "@/site.config";
import { subscribeNewsletter } from "./newsletter/actions";

// Home page, kept to the structure the large portals share (OMR Reviews, G2, Trusted,
// Trustpilot): search first, software by category, the best rated, then reading and trust.

/** Section heading row: title left, an optional link to the full list right. */
function SectionHead({
  id,
  title,
  text,
  link,
}: {
  id: string;
  title: string;
  text?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 id={id} className="text-h2">
          {title}
        </h2>
        {text ? <p className="mt-3 max-w-[62ch] text-body text-muted">{text}</p> : null}
      </div>
      {link ? (
        <ArrowLink href={link.href} className="shrink-0">
          {link.label}
        </ArrowLink>
      ) : null}
    </div>
  );
}

const principles = [
  {
    title: "Kostenlos für Sie",
    text: "Stackwahl kann eine Provision erhalten, wenn Sie über einen Link zu einem Anbieter einen Vertrag abschließen. Für Sie ändert sich der Preis dadurch nicht.",
    link: { href: routes.transparency(), label: "So finanzieren wir uns" },
  },
  {
    title: "Wertung ohne Einfluss",
    text: "Die Recherche-Wertung folgt einer festen Formel. Provisionen ändern weder Wertung noch Reihenfolge, und Nachteile nennen wir immer.",
    link: { href: routes.methodology(), label: "Zur Methodik" },
  },
  {
    title: "Jede Angabe mit Quelle",
    text: "Preise, Funktionen und Rechtslage lesen wir auf den Seiten der Anbieter und speichern zu jeder Angabe Quelle und Prüfdatum.",
    link: { href: routes.editorial(), label: "Zur Redaktion" },
  },
];

export default function HomePage() {
  const categories = getLiveCategories();
  const software = getAllSoftware();
  const showcase = showcaseTabs();
  const logos = homeLogos();
  const screenshots = homeScreenshots(4);
  const articles = articleTeasers(4);
  const articleCount = articleTeasers().length;
  const featured = featuredSoftware(4);
  const comparisons = getComparisons();
  const useCases = getUseCases();
  const finder = siteConfig.features.finder;

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd data={[organizationLd(), websiteLd()]} />

      <Panel as="section" aria-labelledby="start-titel">
        <Container className="pt-12 pb-10 sm:pt-16 lg:pt-20">
          <div className="max-w-4xl">
            <Eyebrow className="text-muted">Business-Software für Deutschland</Eyebrow>
            <Headline
              as="h1"
              id="start-titel"
              size="h1"
              tail="Unabhängig verglichen."
              className="mt-5 max-w-[22ch]"
            >
              Die passende Software für Ihr Unternehmen.
            </Headline>
            <Lead className="mt-6 max-w-[60ch]">
              {software.length > 0
                ? `${software.length} Programme für Buchhaltung, Rechnungen und ERP, mit Preisen, Funktionen und Rechtslage aus den Quellen der Anbieter.`
                : "Programme für Buchhaltung, Rechnungen und ERP, mit Preisen, Funktionen und Rechtslage aus den Quellen der Anbieter."}
            </Lead>

            <form
              action={routes.search()}
              method="get"
              role="search"
              // One rectangle: the border wraps field and button, both share the height.
              className="mt-10 flex h-14 max-w-2xl border border-ink bg-surface focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
            >
              <label htmlFor="start-suche" className="sr-only">
                Software, Kategorie oder Begriff suchen
              </label>
              <input
                id="start-suche"
                name="q"
                type="search"
                autoComplete="off"
                placeholder="Software suchen"
                className="h-full min-w-0 flex-1 appearance-none bg-transparent px-5 text-body text-ink outline-none placeholder:text-muted focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              <button
                type="submit"
                className="inline-flex h-full shrink-0 items-center gap-2 bg-accent px-6 text-small font-medium text-ink transition-colors hover:bg-accent-hover focus-visible:outline-none max-sm:px-4"
              >
                <Search aria-hidden="true" className="size-4" strokeWidth={1.5} />
                Suchen
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 text-small">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={routes.category(c.slug)}
                  className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
              {finder ? (
                <Link
                  href={routes.finder()}
                  className="inline-flex min-h-11 items-center font-medium text-primary underline decoration-1 underline-offset-4"
                >
                  Unsicher? Software-Finder in sechs Fragen
                </Link>
              ) : null}
            </div>
          </div>
          {logos.length > 0 ? (
            <LogoRow logos={logos} className="mt-14 border-t border-line pt-8 sm:mt-20" />
          ) : null}
        </Container>
      </Panel>

      {showcase.length > 0 ? (
        <Panel as="section" aria-labelledby="kategorien-titel">
          <Container className="py-14 sm:py-20">
            <SectionHead
              id="kategorien-titel"
              title="Software nach Kategorie"
              text="Innerhalb jeder Kategorie sortiert nach dem günstigsten bezahlten Tarif."
              link={{ href: routes.categories(), label: "Alle Kategorien" }}
            />
            <div className="mt-10">
              <SoftwareShowcase tabs={showcase} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {screenshots.length > 0 ? (
        <Panel as="section" aria-labelledby="einblicke-titel">
          <Container className="py-14 sm:py-20">
            <SectionHead
              id="einblicke-titel"
              title="So sehen die Programme aus"
              text="Bilder aus dem Pressematerial der Anbieter. Sie zeigen die Programme so, wie die Anbieter sie darstellen, und ersetzen keinen eigenen Test."
            />
            <div className="mt-10">
              <ScreenshotGallery items={screenshots} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {featured.length > 0 ? (
        <Panel as="section" aria-labelledby="fokus-titel">
          <Container className="py-14 sm:py-20">
            <SectionHead
              id="fokus-titel"
              title="Am besten bewertet"
              text="Die vier Programme mit der höchsten Recherche-Wertung über alle Kategorien, berechnet aus Funktionen, Rechtssicherheit, Einstiegspreis sowie Support und Datenschutz."
              link={{
                href: `${routes.methodology()}#recherche-wertung`,
                label: "So entsteht die Wertung",
              }}
            />
            <AffiliateNote className="mt-6 max-w-[80ch]" />
            <div className="mt-8">
              <FeaturedSoftware items={featured} />
            </div>
          </Container>
        </Panel>
      ) : null}

      {comparisons.length > 0 || useCases.length > 0 ? (
        <Panel as="section" aria-labelledby="vergleiche-titel">
          <Container className="py-14 sm:py-20">
            <SectionHead
              id="vergleiche-titel"
              title="Vergleiche und Empfehlungen"
              link={
                siteConfig.features.comparisonTool
                  ? { href: routes.comparisonTool(), label: "Eigenen Vergleich erstellen" }
                  : undefined
              }
            />
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <EditorialLinks
                title="Programme im Direktvergleich"
                links={comparisons.map((c) => ({
                  href: routes.comparison(c.slug),
                  label: c.title,
                }))}
              />
              <EditorialLinks
                title="Software für Ihren Betrieb"
                links={useCases.map((u) => ({ href: routes.useCase(u.slug), label: u.title }))}
              />
            </div>
          </Container>
        </Panel>
      ) : null}

      {articles.length > 0 ? (
        <Panel
          as="section"
          tone="primary"
          aria-labelledby="ratgeber-titel"
          className="overflow-hidden"
        >
          <Container className="relative z-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-12 sm:pt-16">
            <h2 id="ratgeber-titel" className="text-h2">
              Ratgeber
            </h2>
            <Link
              href={routes.guides()}
              className="inline-flex min-h-11 items-center text-small font-medium underline decoration-1 underline-offset-4"
            >
              Alle {articleCount} Artikel
            </Link>
          </Container>
          <GuideSpotlight articles={articles} />
        </Panel>
      ) : null}

      <Panel as="section" aria-labelledby="grundsaetze-titel">
        <Container className="py-14 sm:py-20">
          <SectionHead id="grundsaetze-titel" title="So arbeitet Stackwahl" />
          <ul className="mt-10 grid gap-x-10 md:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="flex flex-col border-t border-ink py-6">
                <h3 className="text-h3">{p.title}</h3>
                <p className="mt-3 text-body text-muted">{p.text}</p>
                <ArrowLink href={p.link.href} className="mt-4">
                  {p.link.label}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </Container>
      </Panel>

      {newsletterAvailable() ? (
        <Panel as="section" aria-label="Newsletter">
          <Container className="py-14 sm:py-20">
            <NewsletterPanel action={subscribeNewsletter} />
          </Container>
        </Panel>
      ) : null}
    </main>
  );
}
