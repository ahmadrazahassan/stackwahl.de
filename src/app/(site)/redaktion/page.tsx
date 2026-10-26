import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MailLink } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/ui/typography";
import { getAuthors } from "@/lib/content";
import { routes } from "@/lib/routes";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Redaktion: Wer hinter Stackwahl steht",
  description:
    "Wer bei Stackwahl Programme auswählt, Angaben prüft und Profile und Ratgeber freigibt, und wie wir dabei arbeiten.",
  path: routes.editorial(),
});

export default function EditorialPage() {
  const authors = getAuthors();
  if (authors.length === 0) notFound();
  const crumbs = [{ label: "Start", href: routes.home() }, { label: "Redaktion" }];
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <JsonLd data={breadcrumbLd(crumbs, routes.editorial())} />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Redaktion"
        title="Wer hinter Stackwahl steht."
        tail="Mit Namen."
        lead="Jedes Profil und jeder Ratgeber nennt die Person, die für den Inhalt verantwortlich ist. Hier stehen alle, die bei Stackwahl Inhalte freigeben."
      />
      <PageSection id="personen" label="Personen" title="Die Redaktion">
        <ul className="grid gap-4 md:grid-cols-2">
          {authors.map((a) => (
            <li key={a.slug}>
              <Link
                href={routes.author(a.slug)}
                className="group flex h-full flex-col gap-3 rounded-card border border-line p-6 transition-colors hover:border-ink"
              >
                <h2 className="text-h3 group-hover:underline group-hover:underline-offset-4">
                  {a.name}
                </h2>
                <p className="text-small font-medium">{a.role}</p>
                <p className="text-small text-muted">{a.bio}</p>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="arbeitsweise" label="Arbeitsweise" title="Wie wir arbeiten">
        <Prose>
          <p>
            Wir lesen die Preisseiten, Funktionslisten, Datenschutzangaben und das Impressum der
            Anbieter selbst und speichern zu jeder Angabe die Quelle und das Abrufdatum. Was ein
            Anbieter nicht nennt, steht als „Keine Angabe“. Einen eigenen Praxistest in einem
            Kundenkonto gibt es bisher für kein Programm, deshalb sprechen wir von „recherchiert“
            und nicht von „getestet“.
          </p>
          <p>
            Wie die Recherche-Wertung entsteht und wie wir sortieren, steht in der{" "}
            <Link href={routes.methodology()}>Methodik</Link>. Wie wir uns finanzieren, steht unter{" "}
            <Link href={routes.transparency()}>Transparenz</Link>. Fehler können Sie uns jederzeit
            an <MailLink address={siteConfig.legal.editorialEmail} className="" /> oder über die{" "}
            <Link href={routes.contact()}>Kontaktseite</Link> melden.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
