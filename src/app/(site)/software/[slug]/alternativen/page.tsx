import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { ComparisonTable, type ComparisonGroup } from "@/components/software/comparison-table";
import { SoftwareCard } from "@/components/software/software-card";
import { rankSoftware } from "@/content/ranking";
import type { FactStatus, Software } from "@/content/schemas";
import { alternativesFor, getAllSoftware, staticSlugs, toSummary } from "@/lib/content";
import { formatEuro } from "@/lib/format";
import { routes } from "@/lib/routes";
import { loadProfile } from "../data";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getAllSoftware().map((s) => s.slug));
}

export async function generateMetadata({
  params,
}: PageProps<"/software/[slug]/alternativen">): Promise<Metadata> {
  const data = loadProfile((await params).slug);
  if (!data) return {};
  const { software } = data;
  return {
    title: `Alternativen zu ${software.name}`,
    description: `Programme, die ähnliche Aufgaben wie ${software.name} abdecken, mit Preisen und Rechtssicherheit im direkten Vergleich.`,
    alternates: { canonical: routes.softwareAlternatives(software.slug) },
    // A generated list without editorial text has no unique value yet (Section 11), so it
    // stays out of the index until the editors add a written comparison.
    robots: { index: false, follow: true },
  };
}

const label: Record<FactStatus, string> = {
  ja: "ja",
  nein: "nein",
  teilweise: "teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

export default async function AlternativesPage({
  params,
}: PageProps<"/software/[slug]/alternativen">) {
  const data = loadProfile((await params).slug);
  if (!data) notFound();
  const { software, crumbs } = data;
  const alternatives = alternativesFor(software);
  if (alternatives.length === 0) notFound();

  const ranking = rankSoftware(alternatives.map((s) => toSummary(s)));
  const columns: Software[] = [
    software,
    ...ranking.items.map((r) => alternatives.find((s) => s.slug === r.slug)!),
  ];
  const summaries = columns.map((s) => toSummary(s));
  const row = (title: string, pick: (s: Software) => string) => ({
    label: title,
    values: columns.map(pick),
  });
  const groups: ComparisonGroup[] = [
    {
      title: "Wichtige Punkte",
      rows: [
        {
          label: "Einstiegspreis netto pro Monat",
          values: summaries.map((s) =>
            s.priceFromCents === null ? "Auf Anfrage" : formatEuro(s.priceFromCents),
          ),
        },
        row("Kostenloser Tarif", (s) => (s.freePlan ? "ja" : "nein")),
        row("E-Rechnung senden", (s) => label[s.compliance.eRechnungVersand.status]),
        row("E-Rechnung empfangen", (s) => label[s.compliance.eRechnungEmpfang.status]),
        row("DATEV-Export", (s) => label[s.compliance.datevExport.status]),
        row("UStVA per ELSTER", (s) => label[s.compliance.elster.status]),
        row("Server in Deutschland oder EU", (s) => label[s.compliance.serverstandort.status]),
      ],
    },
  ];

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[...crumbs, { label: "Alternativen" }]}
        eyebrow="Alternativen"
        title={`Alternativen zu ${software.name}`}
        lead={`${alternatives.length} weitere Programme aus denselben Kategorien. ${ranking.explanation}`}
        draft={software.status === "draft"}
      />
      <PageSection id="vergleich" label="Vergleich" title="Im direkten Vergleich">
        <ComparisonTable
          caption={`${software.name} und Alternativen im Vergleich`}
          products={columns.map((s) => s.name)}
          groups={groups}
        />
      </PageSection>
      <PageSection id="programme" label="Programme" title="Die Alternativen">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ranking.items.map((s) => (
            <li key={s.slug}>
              <SoftwareCard software={s} />
            </li>
          ))}
        </ul>
      </PageSection>
    </main>
  );
}
