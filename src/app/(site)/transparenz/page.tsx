import type { Metadata } from "next";
import Link from "next/link";
import { MailLink } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Transparenz: So finanziert sich Stackwahl",
  description:
    "Wie sich Stackwahl finanziert, welche Partnerschaften bestehen und was kommerzielle Interessen beeinflussen dürfen und was nicht.",
  alternates: { canonical: routes.transparency() },
};

export default function TransparencyPage() {
  const affiliateActive = siteConfig.features.affiliateLinks;
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Transparenz" }]}
        eyebrow="Transparenz"
        title="Wie sich Stackwahl finanziert."
        tail="Offen gesagt."
        lead="Unabhängigkeit heißt für uns: Jede kommerzielle Beziehung ist sichtbar, und keine davon beeinflusst eine Wertung."
      />

      <PageSection id="heute" label="Heute" title="Aktueller Stand">
        <Prose>
          {affiliateActive ? (
            <p>
              Einige Links zu Anbietern sind Affiliate-Links. Schließen Sie über einen solchen Link
              einen Vertrag ab, erhalten wir eine Provision. Für Sie ändert sich der Preis dadurch
              nicht. Jeder dieser Links ist direkt daneben als „Affiliate-Link“ gekennzeichnet.
            </p>
          ) : (
            <p>
              Derzeit hat Stackwahl keine Partnerschaften mit Softwareanbietern und erhält keine
              Provisionen. Links zu Anbietern führen direkt auf deren Website, ohne Tracking.
            </p>
          )}
        </Prose>
      </PageSection>

      <PageSection id="kuenftig" label="Finanzierung" title="Wie wir uns finanzieren wollen">
        <Prose>
          <p>
            Künftig wollen wir uns über Affiliate-Links finanzieren: Wenn Sie über einen
            gekennzeichneten Link ein Programm buchen, kann uns der Anbieter eine Provision zahlen.
            Möglich sind später auch bezahlte Platzierungen. Diese würden immer als „Anzeige“
            gekennzeichnet und nie als Teil einer Rangfolge dargestellt.
          </p>
          <p>
            Anbieter und Partnerprogramme erreichen uns unter{" "}
            <MailLink address={siteConfig.legal.partnerEmail} className="" />. Korrekturen zu Fakten
            gehen an <MailLink address={siteConfig.legal.editorialEmail} className="" /> und werden
            wie jeder andere Hinweis an der Originalquelle geprüft.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="grenzen" label="Grenzen" title="Was Geld nicht kauft">
        <Prose>
          <p>
            Kommerzielle Interessen haben keinen Einfluss auf die Wertung, die Reihenfolge auf
            Kategorieseiten, die Auswahl der verglichenen Programme oder die Nennung von Nachteilen.
            Ob ein Programm einen Affiliate-Link hat, ist kein Kriterium unserer{" "}
            <Link href={routes.methodology()}>Methodik</Link>.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
