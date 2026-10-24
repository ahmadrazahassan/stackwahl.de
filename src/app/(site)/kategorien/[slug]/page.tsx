import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { ComparisonTable, type ComparisonGroup } from "@/components/software/comparison-table";
import { SoftwareCard } from "@/components/software/software-card";
import { Container, Panel } from "@/components/ui/layout";
import { COMPLIANCE, COMPLIANCE_KEYS } from "@/content/features";
import { rankSoftware } from "@/content/ranking";
import type { FactStatus } from "@/content/schemas";
import { MIN_PROFILES_PER_CATEGORY } from "@/content/visibility";
import { formatDate, formatEuro } from "@/lib/format";
import {
  getCategory,
  getLiveCategories,
  getSoftwareInCategory,
  staticSlugs,
  toSummary,
} from "@/lib/content";
import { routes } from "@/lib/routes";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getLiveCategories().map((c) => c.slug));
}

function liveCategory(slug: string) {
  const category = getCategory(slug);
  if (!category) return undefined;
  const software = getSoftwareInCategory(slug);
  return software.length >= MIN_PROFILES_PER_CATEGORY ? { category, software } : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/kategorien/[slug]">): Promise<Metadata> {
  const data = liveCategory((await params).slug);
  if (!data) return {};
  return {
    title: `${data.category.name} im Vergleich`,
    description: data.category.description,
    alternates: { canonical: routes.category(data.category.slug) },
  };
}

const factLabel: Record<FactStatus, string> = {
  ja: "ja",
  nein: "nein",
  teilweise: "teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

export default async function CategoryPage({ params }: PageProps<"/kategorien/[slug]">) {
  const data = liveCategory((await params).slug);
  if (!data) notFound();
  const { category, software } = data;

  const summaries = software.map((s) => toSummary(s));
  const ranking = rankSoftware(summaries);
  const ordered = ranking.items.map((summary) => software.find((s) => s.slug === summary.slug)!);
  const latest = software
    .map((s) => s.lastReviewed)
    .sort()
    .at(-1)!;

  const groups: ComparisonGroup[] = [
    {
      title: "Rechtssicherheit",
      rows: COMPLIANCE_KEYS.map((key) => ({
        label: COMPLIANCE[key].label,
        values: ordered.map((s) => factLabel[s.compliance[key].status]),
      })),
    },
    {
      title: "Preise und Test",
      rows: [
        {
          label: "Einstiegspreis netto pro Monat",
          values: ranking.items.map((s) =>
            s.priceFromCents === null ? "Auf Anfrage" : formatEuro(s.priceFromCents),
          ),
        },
        { label: "Kostenloser Tarif", values: ordered.map((s) => (s.freePlan ? "ja" : "nein")) },
        {
          label: "Kostenlose Testphase",
          values: ordered.map((s) =>
            s.freeTrialDays ? `${s.freeTrialDays} Tage` : "Keine Angabe",
          ),
        },
      ],
    },
  ];

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[
          { label: "Start", href: routes.home() },
          { label: "Kategorien", href: routes.categories() },
          { label: category.name },
        ]}
        eyebrow="Kategorie"
        title={category.name}
        tail="im Vergleich."
        lead={category.intro}
        meta={`${software.length} Programme recherchiert · Stand ${formatDate(latest)}`}
        draft={category.status === "draft"}
      />

      <Panel as="section" aria-labelledby="liste-titel">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="liste-titel" className="text-h2">
              Die Programme
            </h2>
            <p className="max-w-[60ch] text-small text-muted">
              {ranking.explanation} Provisionen beeinflussen die Reihenfolge nicht.{" "}
              <Link
                href={routes.methodology()}
                className="underline decoration-1 underline-offset-4 hover:text-ink"
              >
                Mehr zur Methodik
              </Link>
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ranking.items.map((s) => (
              <li key={s.slug}>
                <SoftwareCard software={s} />
              </li>
            ))}
          </ul>
        </Container>
      </Panel>

      <PageSection
        id="vergleich"
        label="Vergleich"
        title="Rechtssicherheit und Preise im Überblick"
      >
        <p className="mb-6 max-w-[62ch] text-body text-muted">
          „Keine Angabe“ heißt: Der Anbieter nennt das auf den geprüften Seiten nicht. Das ist kein
          Nein. Die Quellen stehen im jeweiligen Profil.
        </p>
        <ComparisonTable
          caption={`Rechtssicherheit und Preise: ${category.name}`}
          products={ranking.items.map((s) => s.name)}
          groups={groups}
        />
      </PageSection>
    </main>
  );
}
