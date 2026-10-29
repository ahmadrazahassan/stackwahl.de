import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { getLiveCategories, getSoftwareInCategory } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Software-Kategorien: Buchhaltung, Rechnungen und ERP",
  description:
    "Alle Software-Kategorien bei Stackwahl: Buchhaltungssoftware und Rechnungsprogramme für Unternehmen in Deutschland im Vergleich.",
  alternates: { canonical: routes.categories() },
};

export default function CategoriesPage() {
  const categories = getLiveCategories();
  // A hub without categories would be an empty page (Section 6: hide what has no content).
  if (categories.length === 0) notFound();
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Kategorien" }]}
        eyebrow="Kategorien"
        title="Software nach Aufgabe."
        lead="Jede Kategorie zeigt die recherchierten Programme, ihre Preise und die Rechtssicherheit für Unternehmen in Deutschland."
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <ul className="grid gap-4 md:grid-cols-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={routes.category(c.slug)}
                  className="group flex h-full flex-col justify-between gap-10 rounded-card border border-line p-6 transition-colors hover:border-ink sm:p-8"
                >
                  <div>
                    <h2 className="text-h3 group-hover:underline group-hover:underline-offset-4">
                      {c.name}
                    </h2>
                    <p className="mt-3 text-small text-muted">{c.description}</p>
                  </div>
                  <p className="text-small font-medium tabular">
                    {getSoftwareInCategory(c.slug).length} Programme im Vergleich
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Panel>
    </main>
  );
}
