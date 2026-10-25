import type { Metadata } from "next";
import { Suspense } from "react";
import { Finder } from "@/components/finder/finder";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Software-Finder: Welche Buchhaltungssoftware passt zu mir?",
  description:
    "Sechs kurze Fragen zu Bedarf, Gewinnermittlung, DATEV und Budget. Der Software-Finder zeigt passende Programme und erklärt, warum.",
  alternates: { canonical: routes.finder() },
};

export default function FinderPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Software-Finder" }]}
        eyebrow="Software-Finder"
        title="Welche Software passt zu Ihnen?"
        tail="Sechs Fragen."
        lead="Beantworten Sie ein paar Fragen zu Ihrem Unternehmen. Wir speichern nichts, Ihre Antworten stehen nur in der Adresszeile."
      />
      <Panel>
        <Container className="max-w-4xl py-12 sm:py-16">
          {/* useSearchParams needs a Suspense boundary on prerendered pages. */}
          <Suspense fallback={<p className="text-small text-muted">Fragen werden geladen …</p>}>
            <Finder />
          </Suspense>
        </Container>
      </Panel>
    </main>
  );
}
