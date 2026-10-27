import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Erklärung zur Barrierefreiheit",
  description:
    "Wie barrierefrei Stackwahl ist, nach welchem Standard wir die Website bauen und prüfen und wie Sie uns Barrieren melden.",
  alternates: { canonical: routes.accessibility() },
};

export default function AccessibilityPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Barrierefreiheit" }]}
        eyebrow="Rechtliches"
        title="Erklärung zur Barrierefreiheit"
      ></PageHeader>
      <PageSection id="standard" label="Standard" title="Unser Ziel">
        <Prose>
          <p>
            Wir bauen Stackwahl nach den Web Content Accessibility Guidelines (WCAG) 2.2 auf Stufe
            AA. Dazu gehören ausreichende Kontraste, eine vollständige Bedienung per Tastatur,
            sichtbarer Fokus, Textalternativen für Grafiken, Tabellen statt reiner Diagramme und die
            Berücksichtigung der Einstellung „Bewegung reduzieren“.
          </p>
        </Prose>
      </PageSection>
      <PageSection id="pruefung" label="Prüfung" title="Wie wir prüfen">
        <Prose>
          <p>
            Jede Seitenvorlage wird bei jeder Änderung automatisch mit dem Prüfwerkzeug axe auf
            Verstöße gegen WCAG 2.2 AA getestet, auf Desktop- und Smartphone-Breite. Eine manuelle
            Prüfung mit Screenreader steht noch aus; das Ergebnis tragen wir hier ein.
          </p>
        </Prose>
      </PageSection>
      <PageSection id="melden" label="Feedback" title="Barriere gefunden?">
        <Prose>
          <p>
            Wenn Sie auf eine Barriere stoßen, schreiben Sie uns über die{" "}
            <Link href={routes.contact()}>Kontaktseite</Link>. Wir antworten und beheben das Problem
            so schnell wie möglich.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
