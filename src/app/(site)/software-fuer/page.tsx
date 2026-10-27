import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, Panel } from "@/components/ui/layout";
import { getUseCases, softwareForUseCase } from "@/lib/content";
import { routes } from "@/lib/routes";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software nach Branche und Rechtsform",
  description:
    "Welche Buchhaltungs- und Rechnungsprogramme zu GmbH und UG, Handwerk, Freiberuflern, Onlinehandel und Lohnabrechnung passen, nach fester Regel ausgewählt.",
  path: routes.useCases(),
});

export default function UseCasesPage() {
  const useCases = getUseCases();
  if (useCases.length === 0) notFound();
  const crumbs = [{ label: "Start", href: routes.home() }, { label: "Software für …" }];
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd data={breadcrumbLd(crumbs, routes.useCases())} />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Software für …"
        title="Die passende Software für Ihren Betrieb."
        lead="Jede Seite nennt die Regel, nach der die Programme ausgewählt sind, und sortiert sie nach der Recherche-Wertung. Dazu erklären wir, worauf es in Ihrer Branche oder Rechtsform ankommt."
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <ul className="grid gap-4 md:grid-cols-2">
            {useCases.map((u) => (
              <li key={u.slug}>
                <Link
                  href={routes.useCase(u.slug)}
                  className="group flex h-full flex-col gap-3 rounded-card border border-line p-6 transition-colors hover:border-ink"
                >
                  <p className="eyebrow text-muted">{softwareForUseCase(u).length} Programme</p>
                  <h2 className="text-h3 group-hover:underline group-hover:underline-offset-4">
                    {u.title}
                  </h2>
                  <p className="text-small text-muted">{u.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Panel>
    </main>
  );
}
