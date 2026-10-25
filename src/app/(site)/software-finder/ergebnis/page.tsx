import type { Metadata } from "next";
import { Suspense } from "react";
import { FinderResults } from "@/components/finder/finder-results";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { finderProducts } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Ihr Ergebnis im Software-Finder",
  // Results depend on the query string and have no unique value for search (Section 8).
  robots: { index: false, follow: true },
  alternates: { canonical: routes.finderResults() },
};

export default function FinderResultsPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[
          { label: "Start", href: routes.home() },
          { label: "Software-Finder", href: routes.finder() },
          { label: "Ergebnis" },
        ]}
        eyebrow="Software-Finder"
        title="Ihr Ergebnis"
        tail="Mit Begründung."
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <Suspense fallback={<p className="text-small text-muted">Ergebnis wird berechnet …</p>}>
            <FinderResults products={finderProducts()} />
          </Suspense>
        </Container>
      </Panel>
    </main>
  );
}
