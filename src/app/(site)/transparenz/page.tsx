import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { MailLink } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { getAffiliatePartners } from "@/lib/content";
import { partnerBanners } from "@/lib/content/home";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Transparenz: So finanziert sich Stackwahl",
  description:
    "Wie sich Stackwahl finanziert, welche Partnerschaften bestehen und was kommerzielle Interessen beeinflussen dürfen und was nicht.",
  alternates: { canonical: routes.transparency() },
};

/** "A, B und C" with each name linked to its profile. */
function NameList({ items }: { items: { slug: string; name: string }[] }) {
  return items.map((item, i) => (
    <Fragment key={item.slug}>
      {i > 0 ? (i === items.length - 1 ? " und " : ", ") : null}
      <Link href={routes.software(item.slug)}>{item.name}</Link>
    </Fragment>
  ));
}

export default function TransparencyPage() {
  const partners = getAffiliatePartners();
  const affiliateActive = partners.length > 0;
  const banners = partnerBanners().map((b) => ({ slug: b.summary.slug, name: b.summary.name }));
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Transparenz" }]}
        eyebrow="Transparenz"
        title="Wie sich Stackwahl finanziert."
        lead="Unabhängigkeit heißt für uns: Jede kommerzielle Beziehung ist sichtbar, und keine davon beeinflusst eine Wertung."
      />

      <PageSection id="heute" label="Heute" title="Aktueller Stand">
        <Prose>
          {affiliateActive ? (
            <>
              <p>
                Stackwahl finanziert sich über Affiliate-Links. Schließen Sie über einen solchen
                Link einen Vertrag ab, zahlt uns der Anbieter eine Provision. Für Sie ändert sich
                der Preis dadurch nicht. Jeder dieser Links ist direkt daneben als „Affiliate-Link“
                gekennzeichnet und führt über unsere{" "}
                <Link href={`${routes.privacy()}#links`}>Weiterleitung</Link>.
              </p>
              <p>
                Partnerprogramme bestehen derzeit mit <NameList items={partners} />. Für alle
                anderen Programme führen die Links direkt auf die Website des Anbieters, ohne
                Provision.
              </p>
              {banners.length > 0 ? (
                <p>
                  Auf der Startseite zeigen wir außerdem Werbeflächen für{" "}
                  <NameList items={banners} />. Sie sind als „Anzeige“ und „Affiliate-Link“
                  gekennzeichnet, stehen außerhalb jeder Rangfolge und werden wie jeder
                  Affiliate-Link nur über die Provision vergütet.
                </p>
              ) : null}
            </>
          ) : (
            <p>
              Derzeit hat Stackwahl keine Partnerschaften mit Softwareanbietern und erhält keine
              Provisionen. Links zu Anbietern führen direkt auf deren Website, ohne Tracking.
            </p>
          )}
        </Prose>
      </PageSection>

      <PageSection
        id="finanzierung"
        label="Finanzierung"
        title={affiliateActive ? "Was Anbieter bezahlen" : "Wie wir uns finanzieren wollen"}
      >
        <Prose>
          {affiliateActive ? (
            <p>
              Anbieter bezahlen uns nur die Provision für einen Vertrag, der über einen
              gekennzeichneten Link zustande kommt. Bezahlte Platzierungen, bei denen ein Anbieter
              für eine Fläche oder eine Position zahlt, gibt es derzeit nicht. Kämen sie hinzu,
              wären sie immer als „Anzeige“ gekennzeichnet, nie Teil einer Rangfolge und auf dieser
              Seite aufgeführt.
            </p>
          ) : (
            <p>
              Künftig wollen wir uns über Affiliate-Links finanzieren: Wenn Sie über einen
              gekennzeichneten Link ein Programm buchen, kann uns der Anbieter eine Provision
              zahlen. Möglich sind später auch bezahlte Platzierungen. Diese würden immer als
              „Anzeige“ gekennzeichnet und nie als Teil einer Rangfolge dargestellt.
            </p>
          )}
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
