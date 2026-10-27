import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page/page-header";
import { CostCalculator } from "@/components/tools/cost-calculator";
import { Container, Panel } from "@/components/ui/layout";
import { calculatorProducts } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Kostenrechner für Buchhaltungssoftware",
  description:
    "Was kostet ein Tarif über 12, 24 oder 36 Monate? Listenpreise netto und brutto, bei monatlicher oder jährlicher Zahlung, mit Preisstand und Quelle.",
  alternates: { canonical: routes.costCalculator() },
};

export default function CostCalculatorPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Kostenrechner" }]}
        eyebrow="Kostenrechner"
        title="Was kostet das wirklich?"
        lead="Wählen Sie Programm, Tarif und Zahlweise. Grundlage sind die Listenpreise der Anbieter ohne Aktionen."
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <Suspense fallback={<p className="text-small text-muted">Rechner wird geladen …</p>}>
            <CostCalculator products={calculatorProducts()} />
          </Suspense>
        </Container>
      </Panel>
    </main>
  );
}
