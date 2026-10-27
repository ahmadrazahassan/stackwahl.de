import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/guides/article-card";
import { ArticleThumbnail } from "@/components/guides/article-thumbnail";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { articleTeasers } from "@/lib/content/guides";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Ratgeber: Buchhaltung, E-Rechnung und Software für Unternehmen",
  description:
    "Antworten auf die Fragen vor der Softwarewahl: E-Rechnung, ELSTER, DATEV, Kleinunternehmer, Kosten und Alternativen, mit Quellen und Prüfdatum.",
  alternates: { canonical: routes.guides() },
};

export default function GuidesPage() {
  const articles = articleTeasers();
  // No empty overview page: without visible articles the route answers 404 (Section 3.3).
  if (articles.length === 0) notFound();
  const [featured, ...rest] = articles;
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Ratgeber" }]}
        eyebrow="Ratgeber"
        title="Wissen für die Softwarewahl."
        lead="Was die E-Rechnungspflicht verlangt, welche Programme die UStVA selbst senden, was Software wirklich kostet und welche Alternativen es gibt. Jeder Artikel nennt die Seiten und Gesetze, auf denen er beruht."
      />
      {featured ? (
        <Panel as="section" aria-label="Neuester Artikel">
          <Container className="py-12 sm:py-16">
            <Link
              href={featured.href}
              className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
            >
              <ArticleThumbnail
                thumbnail={featured.thumbnail}
                tags={featured.tags}
                logos={featured.logos}
                priority
                className="lg:col-span-7"
              />
              <div className="lg:col-span-5">
                <p className="flex flex-wrap items-center gap-x-3 text-small text-muted">
                  <span className="eyebrow text-ink">Neu</span>
                  <time dateTime={featured.published} className="tabular">
                    {formatDate(featured.published)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="tabular">{featured.minutes} Min. Lesezeit</span>
                </p>
                <h2 className="mt-4 text-h2 text-balance underline-offset-4 group-hover:underline">
                  {featured.title}
                </h2>
                <p className="mt-4 text-body text-muted">{featured.description}</p>
              </div>
            </Link>
          </Container>
        </Panel>
      ) : null}
      {rest.length > 0 ? (
        <Panel as="section" aria-label="Alle Artikel">
          <Container className="py-12 sm:py-16">
            <ArticleGrid articles={rest} headingLevel={2} />
          </Container>
        </Panel>
      ) : null}
    </main>
  );
}
