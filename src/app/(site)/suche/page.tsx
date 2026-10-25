import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page/page-header";
import { SearchPage } from "@/components/tools/search-page";
import { Container, Panel } from "@/components/ui/layout";
import searchIndex from "@/generated/search-index.json";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Suche",
  robots: { index: false, follow: true },
  alternates: { canonical: routes.search() },
};

export default function Search() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Suche" }]}
        eyebrow="Suche"
        title="Suchen"
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <Suspense fallback={<p className="text-small text-muted">Suche wird geladen …</p>}>
            <SearchPage entries={searchIndex} />
          </Suspense>
        </Container>
      </Panel>
    </main>
  );
}
