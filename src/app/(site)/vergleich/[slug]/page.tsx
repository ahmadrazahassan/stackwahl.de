import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeCompare } from "@/components/home/home-compare";
import { Byline } from "@/components/page/byline";
import { PageHeader } from "@/components/page/page-header";
import { SourcedSection, SourceList } from "@/components/page/sourced-section";
import { JsonLd } from "@/components/seo/json-ld";
import { SoftwareLogo } from "@/components/software/software-card";
import { ButtonLink, VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow } from "@/components/ui/typography";
import {
  getAuthor,
  getComparison,
  getComparisons,
  getSoftware,
  getUseCases,
  PLACEHOLDER_SLUG,
  staticSlugs,
  toSummary,
  vendorLink,
} from "@/lib/content";
import { compareProducts } from "@/lib/content/home";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { breadcrumbLd, pageMetadata, editorialAuthorLd, publisher } from "@/lib/seo";
import { siteConfig } from "@/site.config";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getComparisons().map((c) => c.slug));
}

function load(slug: string) {
  return slug === PLACEHOLDER_SLUG ? undefined : getComparison(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/vergleich/[slug]">): Promise<Metadata> {
  const comparison = load((await params).slug);
  if (!comparison) return {};
  return pageMetadata({
    title: comparison.title,
    description: comparison.description,
    path: routes.comparison(comparison.slug),
    type: "article",
    published: comparison.published,
    modified: comparison.updated,
  });
}

export default async function ComparisonPage({ params }: PageProps<"/vergleich/[slug]">) {
  const comparison = load((await params).slug);
  if (!comparison) notFound();

  const programs = comparison.software
    .map((slug) => getSoftware(slug))
    .filter((s) => s !== undefined);
  const products = compareProducts().filter((p) => comparison.software.includes(p.slug));
  const author = getAuthor(comparison.author);
  const path = routes.comparison(comparison.slug);
  const crumbs = [
    { label: "Start", href: routes.home() },
    { label: "Vergleich", href: routes.comparisonTool() },
    { label: comparison.title },
  ];
  const others = getComparisons().filter((c) => c.slug !== comparison.slug);
  const useCases = getUseCases().filter((u) =>
    u.rule.targetGroups?.some((g) => programs.some((p) => p.targetGroups.includes(g))),
  );

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: comparison.title,
            description: comparison.description,
            datePublished: comparison.published,
            dateModified: comparison.updated,
            inLanguage: "de-DE",
            mainEntityOfPage: `${siteConfig.brand.url}${path}`,
            publisher,
            ...(author ? editorialAuthorLd(author) : {}),
            about: programs.map((p) => ({ "@type": "SoftwareApplication", name: p.name })),
          },
          breadcrumbLd(crumbs, path),
        ]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Vergleich"
        title={comparison.title}
        lead={comparison.intro}
        meta={
          <>
            Veröffentlicht am {formatDate(comparison.published)}
            {comparison.updated !== comparison.published
              ? `, aktualisiert am ${formatDate(comparison.updated)}`
              : ""}
            {" · "}
            <Byline author={comparison.author} />
            {" · Recherchiert auf den Seiten der Anbieter, ohne eigenen Praxistest."}
          </>
        }
        draft={comparison.status === "draft"}
      >
        <ul
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
          aria-label="Verglichene Programme"
        >
          {programs.map((p, i) => (
            <li key={p.slug} className="flex items-center gap-8">
              {i > 0 ? (
                <span aria-hidden="true" className="font-display text-h3 text-muted">
                  vs.
                </span>
              ) : null}
              <SoftwareLogo software={toSummary(p)} size={40} />
            </li>
          ))}
        </ul>
      </PageHeader>

      <Panel as="section" aria-labelledby="ueberblick-titel">
        <Container className="py-12 sm:py-16">
          <aside className="rounded-card bg-primary-tint p-6 sm:p-8">
            <p className="eyebrow text-ink">Die Frage dieses Vergleichs</p>
            <p className="mt-3 max-w-[60ch] text-h3 text-balance">{comparison.centralQuestion}</p>
          </aside>
          <h2 id="ueberblick-titel" className="mt-12 text-h2">
            Auf einen Blick
          </h2>
          <div className="mt-8">
            <HomeCompare
              products={products}
              presets={[]}
              initial={comparison.software}
              picker={false}
            />
          </div>
        </Container>
      </Panel>

      <Panel as="div">
        <Container className="py-4 sm:py-8">
          <div className="max-w-4xl">
            {comparison.sections.map((section) => (
              <SourcedSection key={section.id} section={section} />
            ))}
          </div>
        </Container>
      </Panel>

      <Panel as="section" aria-labelledby="wahl-titel" tone="bg">
        <Container className="py-12 sm:py-16">
          <Eyebrow className="text-muted">Entscheidungshilfe</Eyebrow>
          <h2 id="wahl-titel" className="mt-4 text-h2">
            Welches Programm passt zu Ihnen?
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comparison.choose.map((choice, i) => {
              const software = getSoftware(choice.software);
              if (!software) return null;
              const summary = toSummary(software);
              const vendor = vendorLink(software, "vergleich", i + 1);
              return (
                <li key={choice.software}>
                  <article
                    aria-labelledby={`wahl-${software.slug}`}
                    className="flex h-full flex-col gap-5 rounded-card border border-line bg-surface p-6"
                  >
                    <SoftwareLogo software={summary} size={32} />
                    <h3 id={`wahl-${software.slug}`} className="text-h3">
                      {software.name} passt, wenn …
                    </h3>
                    <ul className="flex flex-col gap-2 text-small">
                      {choice.reasons.map((reason) => (
                        <li key={reason} className="flex gap-2">
                          <Check
                            aria-hidden="true"
                            strokeWidth={1.75}
                            className="mt-0.5 size-4 shrink-0 text-positive"
                          />
                          {reason}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-col gap-2">
                      <VendorButton
                        href={vendor.href}
                        affiliate={vendor.affiliate}
                        variant="dark"
                        className="w-full"
                      >
                        Website besuchen<span className="sr-only"> von {software.name}</span>
                      </VendorButton>
                      {vendor.affiliate ? <DisclosureLabel kind="affiliate" /> : null}
                      <ButtonLink
                        href={routes.software(software.slug)}
                        variant="outline"
                        arrow="none"
                        className="w-full"
                      >
                        Profil lesen<span className="sr-only"> zu {software.name}</span>
                      </ButtonLink>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <aside className="mt-8 rounded-card border border-line bg-surface p-6 sm:p-8">
            <p className="eyebrow text-muted">Fazit</p>
            <p className="mt-3 max-w-[70ch] text-body">{comparison.verdict}</p>
          </aside>
        </Container>
      </Panel>

      {others.length > 0 || useCases.length > 0 ? (
        <Panel as="section" aria-labelledby="weiter-titel">
          <Container className="py-12 sm:py-16">
            <h2 id="weiter-titel" className="text-h3">
              Weiterlesen
            </h2>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {others.map((c) => (
                <li key={c.slug} className="border-t border-line">
                  <Link
                    href={routes.comparison(c.slug)}
                    className="flex min-h-11 items-center py-2 text-small font-medium underline-offset-4 hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
              {useCases.map((u) => (
                <li key={u.slug} className="border-t border-line">
                  <Link
                    href={routes.useCase(u.slug)}
                    className="flex min-h-11 items-center py-2 text-small font-medium underline-offset-4 hover:underline"
                  >
                    {u.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Panel>
      ) : null}

      <Panel as="section" aria-labelledby="quellen-titel">
        <Container className="py-12 sm:py-16">
          <h2 id="quellen-titel" className="text-h3">
            Alle Quellen dieses Vergleichs
          </h2>
          <div className="mt-6">
            <SourceList
              sources={[...comparison.sections.flatMap((s) => s.sources), ...comparison.sources]}
            />
          </div>
        </Container>
      </Panel>
    </main>
  );
}
