import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Byline } from "@/components/page/byline";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { getGlossary, getTerm, PLACEHOLDER_SLUG, staticSlugs } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbLd, pageMetadata } from "@/lib/seo";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getGlossary().map((t) => t.slug));
}

function load(slug: string) {
  return slug === PLACEHOLDER_SLUG ? undefined : getTerm(slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/glossar/[slug]">): Promise<Metadata> {
  const term = load((await params).slug);
  if (!term) return {};
  return pageMetadata({
    title: `${term.term}: Erklärung`,
    description: term.short,
    path: routes.glossaryTerm(term.slug),
  });
}

export default async function TermPage({ params }: PageProps<"/glossar/[slug]">) {
  const term = load((await params).slug);
  if (!term) notFound();
  const related = term.related.map((slug) => getTerm(slug)).filter((t) => t !== undefined);

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.term,
            description: term.short,
            url: absoluteUrl(routes.glossaryTerm(term.slug)),
            inDefinedTermSet: absoluteUrl(routes.glossary()),
          },
          breadcrumbLd(
            [
              { label: "Start", href: routes.home() },
              { label: "Glossar", href: routes.glossary() },
              { label: term.term },
            ],
            routes.glossaryTerm(term.slug),
          ),
        ]}
      />
      <PageHeader
        crumbs={[
          { label: "Start", href: routes.home() },
          { label: "Glossar", href: routes.glossary() },
          { label: term.term },
        ]}
        eyebrow="Glossar"
        title={term.term}
        lead={term.short}
        meta={
          <>
            <Byline author={term.author} />
          </>
        }
        draft={term.status === "draft"}
      />
      <PageSection id="erklaerung" label="Erklärung" title={`Was ${term.term} bedeutet`}>
        <Prose>
          <p>{term.definition}</p>
        </Prose>
        <h3 className="mt-10 eyebrow text-muted">Quellen</h3>
        <ul className="mt-3">
          {term.sources.map((s) => (
            <li
              key={s.url}
              className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-line py-3 text-small"
            >
              <a
                href={s.url}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-1 font-medium underline decoration-1 underline-offset-4 hover:text-primary"
              >
                {s.title}
                <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
              <span className="text-muted">abgerufen am {formatDate(s.accessed)}</span>
            </li>
          ))}
        </ul>
      </PageSection>
      {related.length > 0 ? (
        <PageSection id="verwandt" label="Verwandt" title="Verwandte Begriffe">
          <ul className="flex flex-wrap gap-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link
                  href={routes.glossaryTerm(t.slug)}
                  className="inline-flex min-h-11 items-center rounded-pill bg-bg px-4 text-small font-medium hover:bg-primary-tint"
                >
                  {t.term}
                </Link>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}
    </main>
  );
}
