import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/guides/article-card";
import { ArticleProductCard } from "@/components/guides/article-product";
import { ArticleThumbnail } from "@/components/guides/article-thumbnail";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow, Prose } from "@/components/ui/typography";
import type { Source } from "@/content/schemas";
import { getGuide, getGuides, PLACEHOLDER_SLUG, staticSlugs } from "@/lib/content";
import { articleProduct, readingMinutes, relatedArticles, thumbLogos } from "@/lib/content/guides";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getGuides().map((g) => g.slug));
}

function load(slug: string) {
  return slug === PLACEHOLDER_SLUG ? undefined : getGuide(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/ratgeber/[slug]">): Promise<Metadata> {
  const guide = load((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: routes.guide(guide.slug) },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

function SourceLink({ source }: { source: Source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener"
      className="inline-flex min-h-11 items-center gap-1 underline decoration-1 underline-offset-4 hover:text-primary"
    >
      {source.title}
      <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}

export default async function GuidePage({ params }: PageProps<"/ratgeber/[slug]">) {
  const guide = load((await params).slug);
  if (!guide) notFound();

  const minutes = readingMinutes(guide);
  const related = relatedArticles(guide);
  const products = guide.software
    .map((slug, i) => articleProduct(slug, i + 1))
    .filter((p) => p !== null);
  const allSources = [...guide.sections.flatMap((s) => s.sources), ...guide.sources].filter(
    (s, i, list) => list.findIndex((o) => o.url === s.url) === i,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: "de-DE",
    mainEntityOfPage: `${siteConfig.brand.url}${routes.guide(guide.slug)}`,
    publisher: { "@type": "Organization", name: siteConfig.brand.name, url: siteConfig.brand.url },
    citation: allSources.map((s) => s.url),
  };

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader
        crumbs={[
          { label: "Start", href: routes.home() },
          { label: "Ratgeber", href: routes.guides() },
          { label: guide.title },
        ]}
        eyebrow={guide.topic}
        title={guide.title}
        lead={guide.intro}
        meta={
          <>
            Veröffentlicht am {formatDate(guide.published)}
            {guide.updated !== guide.published
              ? `, aktualisiert am ${formatDate(guide.updated)}`
              : ""}
            {` · ${minutes} Min. Lesezeit · Recherchiert auf den Seiten der Anbieter und in den Gesetzestexten, ohne eigenen Praxistest.`}
          </>
        }
        draft={guide.status === "draft"}
      >
        <ArticleThumbnail
          thumbnail={guide.thumbnail}
          tags={guide.tags}
          logos={thumbLogos(guide.thumbnail.logos)}
          priority
          className="mt-12"
        />
      </PageHeader>

      <Panel as="div">
        <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-12">
          <nav aria-label="Inhalt des Artikels" className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <Eyebrow className="text-muted">Inhalt</Eyebrow>
              <ol className="mt-4 flex flex-col text-small">
                {guide.sections.map((section, i) => (
                  <li key={section.id} className="border-t border-line first:border-t-0">
                    <a
                      href={`#${section.id}`}
                      className="flex min-h-11 items-start gap-3 py-2 underline-offset-4 hover:text-primary hover:underline"
                    >
                      <span className="text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0 lg:col-span-9">
            <aside className="rounded-card bg-primary-tint p-6 sm:p-8">
              <p className="eyebrow text-ink">Die Frage dieses Artikels</p>
              <p className="mt-3 max-w-[60ch] text-h3 text-balance">{guide.centralQuestion}</p>
            </aside>

            {guide.sections.map((section) => {
              const sectionProducts = (section.software ?? [])
                .map((slug, i) => articleProduct(slug, i + 1))
                .filter((p) => p !== null);
              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-titel`}
                  className="scroll-mt-24 border-b border-line py-12 last:border-b-0"
                >
                  <h2 id={`${section.id}-titel`} className="max-w-[30ch] text-h2 text-balance">
                    {section.title}
                  </h2>
                  <Prose className="mt-6">
                    {section.paragraphs.map((paragraph, i) => (
                      <p key={`${section.id}-${i}`}>{paragraph}</p>
                    ))}
                  </Prose>
                  {section.points ? (
                    <ul className="mt-6 flex max-w-[68ch] flex-col gap-3 text-body">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 shrink-0 bg-primary"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {sectionProducts.length > 0 ? (
                    <ul className="mt-8 grid gap-4 md:grid-cols-2">
                      {sectionProducts.map((product) => (
                        <li key={product.summary.slug}>
                          <ArticleProductCard product={product} compact />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-8 text-small text-muted">
                    <p>Grundlage dieses Abschnitts:</p>
                    <ul className="mt-1 flex flex-col">
                      {section.sources.map((source) => (
                        <li key={source.url}>
                          <SourceLink source={source} />
                          <span>, abgerufen am {formatDate(source.accessed)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        </Container>
      </Panel>

      {products.length > 0 ? (
        <Panel as="section" aria-labelledby="programme-titel" tone="bg">
          <Container className="py-12 sm:py-16">
            <Eyebrow className="text-muted">Weiter zur Auswahl</Eyebrow>
            <h2 id="programme-titel" className="mt-4 text-h2">
              Die Programme aus diesem Artikel
            </h2>
            <p className="mt-4 max-w-[62ch] text-small text-muted">
              In der Reihenfolge des Artikels. Provisionen beeinflussen weder Auswahl noch
              Reihenfolge. Preise sind Listenpreise mit Prüfdatum.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <li key={product.summary.slug}>
                  <ArticleProductCard product={product} />
                </li>
              ))}
            </ul>
          </Container>
        </Panel>
      ) : null}

      <Panel as="section" aria-labelledby="quellen-titel">
        <Container className="py-12 sm:py-16">
          <h2 id="quellen-titel" className="text-h3">
            Alle Quellen dieses Artikels
          </h2>
          <ul className="mt-6 flex flex-col">
            {allSources.map((source) => (
              <li
                key={source.url}
                className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-line py-2 text-small"
              >
                <SourceLink source={source} />
                <span className="text-muted">abgerufen am {formatDate(source.accessed)}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Panel>

      {related.length > 0 ? (
        <Panel as="section" aria-labelledby="weiterlesen-titel">
          <Container className="py-12 sm:py-16">
            <h2 id="weiterlesen-titel" className="text-h2">
              Weiterlesen
            </h2>
            <ArticleGrid articles={related} className="mt-10" />
          </Container>
        </Panel>
      ) : null}
    </main>
  );
}
