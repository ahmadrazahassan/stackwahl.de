import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page/page-header";
import { ComparisonTool } from "@/components/tools/comparison-tool";
import { Container, Panel } from "@/components/ui/layout";
import { EditorialLinks } from "@/components/page/editorial-links";
import { finderProducts, getComparisons, getUseCases } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Vergleich: Buchhaltungssoftware nebeneinander",
  description:
    "Zwei oder drei Programme direkt vergleichen: Preise, Testphase, GoBD, E-Rechnung, DATEV, ELSTER und Funktionen, jeweils mit Quelle im Profil.",
  alternates: { canonical: routes.comparisonTool() },
};

export default function ComparisonPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Vergleich" }]}
        eyebrow="Vergleich"
        title="Programme nebeneinander."
        tail="Bis zu drei auf einmal."
        lead="„Keine Angabe“ heißt: Der Anbieter nennt es auf den geprüften Seiten nicht. Die Quellen stehen im jeweiligen Profil."
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <Suspense fallback={<p className="text-small text-muted">Vergleich wird geladen …</p>}>
            <ComparisonTool products={finderProducts()} />
          </Suspense>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <EditorialLinks
              title="Ausführliche Vergleiche"
              links={getComparisons().map((c) => ({
                href: routes.comparison(c.slug),
                label: c.title,
              }))}
            />
            <EditorialLinks
              title="Software für Ihren Betrieb"
              links={getUseCases().map((u) => ({ href: routes.useCase(u.slug), label: u.title }))}
            />
          </div>
        </Container>
      </Panel>
    </main>
  );
}
