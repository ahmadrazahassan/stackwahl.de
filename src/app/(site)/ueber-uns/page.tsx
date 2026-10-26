import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Stackwahl vergleicht Business-Software für Unternehmen in Deutschland: unabhängig, mit Quelle für jede Angabe und mit Blick auf GoBD, DATEV und E-Rechnung.",
  alternates: { canonical: routes.about() },
};

export default function AboutPage() {
  const { legal } = siteConfig;
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Über uns" }]}
        eyebrow="Über uns"
        title="Warum es Stackwahl gibt."
        lead="Die Wahl einer Buchhaltungssoftware entscheidet über Jahre, wie viel Zeit Rechnungen, Belege und Steuern kosten. Dafür braucht es Vergleiche, die Fakten von Werbung trennen."
      />
      <PageSection id="idee" label="Idee" title="Was wir anders machen">
        <Prose>
          <p>
            Wir wollen Vergleiche, bei denen Sie jede Angabe selbst nachprüfen können: jede Angabe
            mit Quelle und Datum, eine Wertung nach veröffentlichter Formel statt nach Bauchgefühl
            und eine Reihenfolge, die keine Provision verschieben kann.
          </p>
          <p>
            Unser Schwerpunkt ist der deutsche Markt: GoBD, E-Rechnung, DATEV, ELSTER und die Frage,
            wo Ihre Daten liegen. So steht es auch in unserer{" "}
            <Link href={routes.methodology()}>Methodik</Link>.
          </p>
        </Prose>
      </PageSection>
      <PageSection id="betreiber" label="Betreiber" title="Wer dahintersteht">
        <Prose>
          <p>
            Stackwahl wird betrieben von {legal.ownerName}, {legal.street}, {legal.postalCode}{" "}
            {legal.city}. Alle Pflichtangaben stehen im{" "}
            <Link href={routes.imprint()}>Impressum</Link>. Wer Profile und Ratgeber verantwortet,
            steht in der <Link href={routes.editorial()}>Redaktion</Link>.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
