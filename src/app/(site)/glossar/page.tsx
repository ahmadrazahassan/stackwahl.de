import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { getGlossary } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Glossar",
  description:
    "Begriffe rund um Buchhaltung und Rechnungen in Deutschland, kurz erklärt und mit Gesetzesquelle: E-Rechnung, EÜR, UStVA und mehr.",
  alternates: { canonical: routes.glossary() },
};

export default function GlossaryPage() {
  const terms = getGlossary();
  if (terms.length === 0) notFound();
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Glossar" }]}
        eyebrow="Glossar"
        title="Begriffe kurz erklärt."
        tail="Mit Gesetzesquelle."
        lead="Die wichtigsten Begriffe für die Wahl einer Buchhaltungssoftware, jeweils mit dem Gesetz, auf das sie sich stützen."
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <ul className="grid gap-4 md:grid-cols-2">
            {terms.map((t) => (
              <li key={t.slug}>
                <Link
                  href={routes.glossaryTerm(t.slug)}
                  className="group flex h-full flex-col gap-3 rounded-card border border-line p-6 transition-colors hover:border-ink"
                >
                  <h2 className="text-h3 group-hover:underline group-hover:underline-offset-4">
                    {t.term}
                  </h2>
                  <p className="text-small text-muted">{t.short}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Panel>
    </main>
  );
}
