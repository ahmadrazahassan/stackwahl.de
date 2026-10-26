import { Check, CircleHelp, Minus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Byline } from "@/components/page/byline";
import { PageHeader } from "@/components/page/page-header";
import { SourcedSection, SourceList } from "@/components/page/sourced-section";
import { JsonLd } from "@/components/seo/json-ld";
import { ResearchScoreDisplay } from "@/components/software/research-score";
import { SoftwareLogo } from "@/components/software/software-card";
import { ButtonLink, VendorButton } from "@/components/ui/button";
import { DisclosureLabel } from "@/components/ui/labels";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow } from "@/components/ui/typography";
import { COMPLIANCE, FEATURES } from "@/content/features";
import type { Fact, FactStatus, Software } from "@/content/schemas";
import {
  getAuthor,
  getComparison,
  getGuide,
  getUseCase,
  getUseCases,
  PLACEHOLDER_SLUG,
  staticSlugs,
  toSummary,
  softwareForUseCase,
  vendorLink,
} from "@/lib/content";
import { formatDate, formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/routes";
import { breadcrumbLd, itemListLd, pageMetadata, editorialAuthorLd, publisher } from "@/lib/seo";
import { siteConfig } from "@/site.config";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getUseCases().map((u) => u.slug));
}

function load(slug: string) {
  return slug === PLACEHOLDER_SLUG ? undefined : getUseCase(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/software-fuer/[slug]">): Promise<Metadata> {
  const useCase = load((await params).slug);
  if (!useCase) return {};
  return pageMetadata({
    title: useCase.title,
    description: useCase.description,
    path: routes.useCase(useCase.slug),
    type: "article",
    published: useCase.published,
    modified: useCase.updated,
  });
}

const STATUS: Record<FactStatus, string> = {
  ja: "Ja",
  nein: "Nein",
  teilweise: "Teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

function factOf(software: Software, key: string): { label: string; fact: Fact } | null {
  if (key in COMPLIANCE) {
    const k = key as keyof typeof COMPLIANCE;
    return { label: COMPLIANCE[k].label, fact: software.compliance[k] };
  }
  if (key in FEATURES) {
    const k = key as keyof typeof FEATURES;
    return { label: FEATURES[k].label, fact: software.features[k] ?? { status: "unbekannt" } };
  }
  return null;
}

function StatusIcon({ status }: { status: FactStatus }) {
  const props = { "aria-hidden": true, strokeWidth: 1.75, className: "mt-0.5 size-4 shrink-0" };
  if (status === "ja") return <Check {...props} className={`${props.className} text-positive`} />;
  if (status === "unbekannt")
    return <CircleHelp {...props} className={`${props.className} text-muted`} />;
  return <Minus {...props} />;
}

export default async function UseCasePage({ params }: PageProps<"/software-fuer/[slug]">) {
  const useCase = load((await params).slug);
  if (!useCase) notFound();

  const programs = softwareForUseCase(useCase);
  const author = getAuthor(useCase.author);
  const path = routes.useCase(useCase.slug);
  const crumbs = [
    { label: "Start", href: routes.home() },
    { label: "Software für …", href: routes.useCases() },
    { label: useCase.label },
  ];
  const guides = useCase.related.guides.map((g) => getGuide(g)).filter((g) => g !== undefined);
  const comparisons = useCase.related.comparisons
    .map((c) => getComparison(c))
    .filter((c) => c !== undefined);

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: useCase.title,
            description: useCase.description,
            datePublished: useCase.published,
            dateModified: useCase.updated,
            inLanguage: "de-DE",
            mainEntityOfPage: `${siteConfig.brand.url}${path}`,
            publisher,
            ...(author ? editorialAuthorLd(author) : {}),
          },
          itemListLd(
            useCase.title,
            programs.map((p) => ({ name: p.name, path: routes.software(p.slug) })),
          ),
          breadcrumbLd(crumbs, path),
        ]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow={`Software für ${useCase.label}`}
        title={useCase.title}
        lead={useCase.intro}
        meta={
          <>
            Veröffentlicht am {formatDate(useCase.published)}
            {useCase.updated !== useCase.published
              ? `, aktualisiert am ${formatDate(useCase.updated)}`
              : ""}
            {" · "}
            <Byline author={useCase.author} />
            {" · Recherchiert auf den Seiten der Anbieter, ohne eigenen Praxistest."}
          </>
        }
        draft={useCase.status === "draft"}
      />

      <Panel as="section" aria-labelledby="auswahl-titel">
        <Container className="py-12 sm:py-16">
          <aside className="rounded-card bg-primary-tint p-6 sm:p-8">
            <p className="eyebrow text-ink">Die Frage dieser Seite</p>
            <p className="mt-3 max-w-[60ch] text-h3 text-balance">{useCase.centralQuestion}</p>
          </aside>
          <h2 id="auswahl-titel" className="mt-12 text-h2">
            {programs.length} Programme für {useCase.label}
          </h2>
          <p className="mt-4 max-w-[68ch] text-small text-muted">
            {useCase.rule.explanation} Sortiert nach der Recherche-Wertung, bei gleicher Wertung
            nach Name. Provisionen haben keinen Einfluss auf Auswahl und Reihenfolge.{" "}
            <Link
              href={`${routes.methodology()}#recherche-wertung`}
              className="underline decoration-1 underline-offset-4 hover:text-ink"
            >
              So entsteht die Wertung
            </Link>
          </p>
          <ol className="mt-8 flex flex-col gap-4">
            {programs.map((software, i) => {
              const summary = toSummary(software);
              const vendor = vendorLink(software, "branche", i + 1);
              const highlights = useCase.highlights
                .map((key) => factOf(software, key))
                .filter((h) => h !== null);
              return (
                <li key={software.slug}>
                  <article
                    aria-labelledby={`programm-${software.slug}`}
                    className="grid gap-8 rounded-card border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12"
                  >
                    <div className="min-w-0 lg:col-span-8">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <span className="eyebrow text-muted tabular">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {summary.logo ? <SoftwareLogo software={summary} size={32} /> : null}
                      </div>
                      <h3 id={`programm-${software.slug}`} className="mt-4 text-h3">
                        <Link
                          href={routes.software(software.slug)}
                          className="underline-offset-4 hover:underline"
                        >
                          {software.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-small text-muted">
                        {summary.category} · {summary.vendor}
                      </p>
                      <p className="mt-4 max-w-[62ch] text-body">{software.summary}</p>
                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="eyebrow text-muted">Für {useCase.label}</p>
                          <ul className="mt-3 flex flex-col gap-2 text-small">
                            {highlights.map((h) => (
                              <li key={h.label} className="flex gap-2">
                                <StatusIcon status={h.fact.status} />
                                <span>
                                  {h.label}: {STATUS[h.fact.status]}
                                  {h.fact.note ? (
                                    <span className="block text-muted">{h.fact.note}</span>
                                  ) : null}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="eyebrow text-muted">Beachten Sie</p>
                          <ul className="mt-3 flex flex-col gap-2 text-small">
                            {software.cons.slice(0, 2).map((con) => (
                              <li key={con} className="flex gap-2">
                                <Minus
                                  aria-hidden="true"
                                  strokeWidth={1.75}
                                  className="mt-0.5 size-4 shrink-0 text-negative"
                                />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-col gap-5 border-t border-line pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                      {summary.research !== null ? (
                        <ResearchScoreDisplay value={summary.research} size="sm" />
                      ) : null}
                      <p className="text-small">
                        {summary.freePlan ? (
                          <span className="block font-medium">Kostenloser Tarif verfügbar</span>
                        ) : null}
                        {summary.priceFromCents !== null ? (
                          <span className="block font-medium tabular">
                            {formatPriceFrom(summary.priceFromCents, { net: summary.priceNet })}
                          </span>
                        ) : null}
                        {software.freeTrialDays ? (
                          <span className="block text-muted">
                            {software.freeTrialDays} Tage kostenlos testen
                          </span>
                        ) : null}
                      </p>
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
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </Container>
      </Panel>

      <Panel as="div">
        <Container className="py-4 sm:py-8">
          <div className="max-w-4xl">
            {useCase.sections.map((section) => (
              <SourcedSection key={section.id} section={section} />
            ))}
          </div>
        </Container>
      </Panel>

      {guides.length > 0 || comparisons.length > 0 ? (
        <Panel as="section" aria-labelledby="weiter-titel" tone="bg">
          <Container className="py-12 sm:py-16">
            <Eyebrow className="text-muted">Weiterlesen</Eyebrow>
            <h2 id="weiter-titel" className="mt-4 text-h3">
              Passende Vergleiche und Ratgeber
            </h2>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {comparisons.map((c) => (
                <li key={c.slug} className="border-t border-line">
                  <Link
                    href={routes.comparison(c.slug)}
                    className="flex min-h-11 items-center py-2 text-small font-medium underline-offset-4 hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
              {guides.map((g) => (
                <li key={g.slug} className="border-t border-line">
                  <Link
                    href={routes.guide(g.slug)}
                    className="flex min-h-11 items-center py-2 text-small font-medium underline-offset-4 hover:underline"
                  >
                    {g.title}
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
            Alle Quellen dieser Seite
          </h2>
          <p className="mt-2 text-small text-muted">
            Die Angaben zu den einzelnen Programmen stehen mit Quelle im jeweiligen Profil.
          </p>
          <div className="mt-6">
            <SourceList
              sources={[...useCase.sections.flatMap((s) => s.sources), ...useCase.sources]}
            />
          </div>
        </Container>
      </Panel>
    </main>
  );
}
