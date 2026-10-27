import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { PriceTable } from "@/components/software/price-table";
import { ArrowLink } from "@/components/ui/button";
import { getAllSoftware, staticSlugs, toPricePlans } from "@/lib/content";
import { costOverview, yearlySaving } from "@/lib/costs";
import { formatDate, formatEuro } from "@/lib/format";
import { routes } from "@/lib/routes";
import { loadProfile } from "../data";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

// Every known slug is prerendered and unknown slugs are answered in src/proxy.ts, so this route
// may block on navigation instead of streaming a skeleton (docs/DECISIONS.md).
export const instant = false;

export function generateStaticParams() {
  return staticSlugs(getAllSoftware().map((s) => s.slug));
}

export async function generateMetadata({
  params,
}: PageProps<"/software/[slug]/preise">): Promise<Metadata> {
  const data = loadProfile((await params).slug);
  if (!data) return {};
  const { software } = data;
  return pageMetadata({
    title: `${software.name} Preise: alle Tarife und Kosten`,
    description: `Alle Tarife von ${software.name} mit Listenpreisen netto und brutto, hochgerechnet auf 12 und 36 Monate. Mit Prüfdatum und Quelle.`,
    path: routes.softwarePricing(software.slug),
  });
}

export default async function PricingPage({ params }: PageProps<"/software/[slug]/preise">) {
  const data = loadProfile((await params).slug);
  if (!data) notFound();
  const { software, crumbs } = data;
  const checked = software.plans.map((p) => p.source.accessed).sort()[0];

  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd
        data={breadcrumbLd([...crumbs, { label: "Preise" }], routes.softwarePricing(software.slug))}
      />
      <PageHeader
        crumbs={[...crumbs, { label: "Preise" }]}
        eyebrow="Preise"
        title={`${software.name} Preise`}
        lead="Listenpreise ohne Aktionen. Laufende Rabatte stehen beim jeweiligen Tarif, weitere Nutzer und Zusatzmodule sind nicht eingerechnet."
        meta={`Preisstand ${formatDate(checked)}`}
        draft={software.status === "draft"}
      />

      <PageSection id="tarife" label="Tarife" title="Preise pro Monat">
        <PriceTable plans={toPricePlans(software)} />
      </PageSection>

      <PageSection id="kosten" label="Kosten" title="Kosten über 12 und 36 Monate">
        <div
          role="region"
          aria-label="Kostenübersicht"
          tabIndex={0}
          className="relative overflow-x-auto"
        >
          <table className="w-full min-w-[40rem] border-collapse text-small">
            <caption className="pb-4 text-left text-muted">
              Hochrechnung der Listenpreise, Umsatzsteuer 19 %. Stand {formatDate(checked)}.
            </caption>
            <thead>
              <tr className="text-left">
                <th scope="col" className="pb-3 eyebrow text-muted">
                  Tarif
                </th>
                <th scope="col" className="pb-3 eyebrow text-muted">
                  Zahlweise
                </th>
                <th scope="col" className="pb-3 text-right eyebrow text-muted">
                  12 Monate netto
                </th>
                <th scope="col" className="pb-3 text-right eyebrow text-muted">
                  12 Monate brutto
                </th>
                <th scope="col" className="pb-3 text-right eyebrow text-muted">
                  36 Monate netto
                </th>
                <th scope="col" className="pb-3 text-right eyebrow text-muted">
                  36 Monate brutto
                </th>
              </tr>
            </thead>
            <tbody>
              {software.plans.flatMap((plan) =>
                costOverview(plan).map((line) => (
                  <tr key={`${plan.name}-${line.billing}`} className="border-t border-line">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      {plan.name}
                      {plan.perUser ? (
                        <span className="font-normal text-muted"> je Nutzer</span>
                      ) : null}
                    </th>
                    <td className="py-3 pr-4">
                      {line.billing === "monatlich" ? "Monatlich" : "Jährlich"}
                    </td>
                    <td className="py-3 text-right tabular">{formatEuro(line.months12.net)}</td>
                    <td className="py-3 text-right tabular">{formatEuro(line.months12.gross)}</td>
                    <td className="py-3 text-right tabular">{formatEuro(line.months36.net)}</td>
                    <td className="py-3 text-right tabular">{formatEuro(line.months36.gross)}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
        <ul className="mt-8 flex flex-col gap-2 text-small text-muted">
          {software.plans.map((plan) => {
            const saving = yearlySaving(plan);
            return saving !== null && saving > 0 ? (
              <li key={plan.name}>
                {plan.name}: Bei jährlicher Zahlung sparen Sie {formatEuro(saving)} netto pro Jahr
                {plan.perUser ? " je Nutzer" : ""}.
              </li>
            ) : null;
          })}
        </ul>
        <ArrowLink href={routes.software(software.slug)} className="mt-6">
          Zurück zum Profil
        </ArrowLink>
      </PageSection>
    </main>
  );
}
