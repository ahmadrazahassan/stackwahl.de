import type { Metadata } from "next";
import Link from "next/link";
import { ConfigValue, MailLink } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { contactFormAvailable, newsletterAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Welche personenbezogenen Daten Stackwahl verarbeitet, zu welchem Zweck, auf welcher Rechtsgrundlage und welche Rechte Sie haben.",
  alternates: { canonical: routes.privacy() },
};

// Draft for lawyer review (Section 9). It describes the site as it is built today: hosting on
// Vercel, no cookies, no analytics, self-hosted fonts, vendor videos only after a click.
// Every new processor, cookie or form must be added here in the same commit (Section 3.10).

export default function PrivacyPage() {
  const { legal } = siteConfig;
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Datenschutz" }]}
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
      ></PageHeader>

      <PageSection
        id="verantwortlicher"
        label="Verantwortlicher"
        title="Wer für die Daten verantwortlich ist"
      >
        <Prose>
          <p>
            Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die{" "}
            {legal.companyName}, {legal.street}, {legal.postalCode} {legal.city}, vertreten durch
            den Geschäftsführer {legal.managingDirector}, E-Mail: <MailLink address={legal.email} />
            . Weitere Angaben zum Anbieter stehen im <Link href={routes.imprint()}>Impressum</Link>.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="hosting" label="Hosting" title="Aufruf der Website und Server-Protokolle">
        <Prose>
          <p>
            Die Website wird bei der Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723,
            USA, gehostet. Beim Aufruf einer Seite verarbeitet Vercel technisch notwendige Daten,
            insbesondere Ihre IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, die
            übertragene Datenmenge sowie Browser und Betriebssystem. Das ist erforderlich, um die
            Website auszuliefern und vor Angriffen zu schützen.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im
            sicheren und stabilen Betrieb der Website. Vercel ist nach dem EU-US Data Privacy
            Framework zertifiziert; eine Übermittlung in die USA stützt sich auf den
            Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO).
          </p>
          <p>
            Mit Vercel besteht ein Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO: Das{" "}
            <a href="https://vercel.com/legal/dpa" target="_blank" rel="noopener">
              Data Processing Addendum von Vercel
            </a>{" "}
            wird mit Abschluss des Nutzungsvertrags verbindlich und enthält zusätzlich die
            Standardvertragsklauseln der EU-Kommission (Beschluss 2021/914).
          </p>
          <p>
            Vercel speichert Protokolle der Seitenaufrufe nur für begrenzte Zeit. Laut Vercel
            beträgt die Speicherdauer je nach Tarif zwischen einer Stunde und 30 Tagen. Wir werten
            diese Protokolle nur aus, um Fehler und Angriffe zu erkennen.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="cookies" label="Cookies" title="Cookies, Analyse und eingebundene Dienste">
        <Prose>
          <p>
            Diese Website setzt keine Cookies und nutzt keine Analyse- oder Werbedienste. Die
            Schriften liegen auf unserem eigenen Server. Inhalte von Drittanbietern binden wir nur
            ein, wenn Sie es selbst auslösen: Videos der Softwareanbieter laden erst nach Ihrem
            Klick (siehe <Link href="#videos">Videos der Anbieter</Link>). Den aktuellen Stand
            finden Sie unter <Link href={routes.cookieSettings()}>Cookie-Einstellungen</Link>.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="videos" label="Videos" title="Videos der Anbieter">
        <Prose>
          <p>
            Einige Softwareprofile zeigen Videos der Anbieter, die auf YouTube oder Vimeo liegen.
            Solange Sie nicht auf „Video laden“ klicken, stellt Ihr Browser keine Verbindung zu
            diesen Diensten her, auch Vorschaubilder laden wir nicht. Erst mit dem Klick lädt Ihr
            Browser den Player des jeweiligen Dienstes. Dabei werden mindestens Ihre IP-Adresse, die
            aufgerufene Seite und technische Angaben zu Ihrem Browser an den Dienst übertragen. Der
            Dienst kann Cookies oder ähnliche Technologien einsetzen.
          </p>
          <p>
            YouTube wird betrieben von Google Ireland Limited, Gordon House, Barrow Street, Dublin
            4, Irland. Wir nutzen den erweiterten Datenschutzmodus (youtube-nocookie.com). Vimeo
            wird betrieben von Vimeo.com, Inc. mit Sitz in New York, USA. Wir binden Vimeo mit dem
            Parameter „dnt=1“ ein, mit dem der Player keine Nutzungsdaten der Sitzung erfassen soll.
            Bei Vimeo können Daten in die USA übermittelt werden. Wie die Dienste Ihre Daten
            verarbeiten und auf welcher Grundlage sie Daten in Drittländer übermitteln, steht in
            ihren Datenschutzerklärungen:{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
              Google
            </a>
            ,{" "}
            <a href="https://vimeo.com/privacy" target="_blank" rel="noopener">
              Vimeo
            </a>
            .
          </p>
          <p>
            Rechtsgrundlage ist Ihre Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a
            DSGVO, die Sie mit dem Klick für dieses eine Video erteilen. Wir speichern diese
            Entscheidung nicht: Beim nächsten Seitenaufruf ist das Video wieder gesperrt. Sie können
            die Einwilligung jederzeit widerrufen, indem Sie die Seite neu laden.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="links" label="Links" title="Links zu Anbietern">
        <Prose>
          <p>
            Links zu Softwareanbietern führen direkt auf deren Website. Links zu Partnern, als
            „Affiliate-Link“ gekennzeichnet, führen über unsere Weiterleitung unter
            stackwahl.de/go/. Dabei zählen wir nur, welches Programm an welcher Stelle der Seite
            geklickt wurde, ohne IP-Adresse, Cookie oder Kennung. An den Partner geben wir in der
            Adresse nur diese Stelle weiter (zum Beispiel „banner-1“), keine Daten über Sie. Mit dem
            Aufruf der Anbieterseite gilt deren Datenschutzerklärung; der Anbieter kann dort eigene
            Cookies setzen, etwa um die Provision zuzuordnen.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="kontakt" label="Kontakt" title="Wenn Sie uns schreiben">
        <Prose>
          <p>
            Schreiben Sie uns per E-Mail
            {contactFormAvailable() ? " oder über das Kontaktformular" : ""}, verarbeiten wir Ihren
            Namen, Ihre E-Mail-Adresse, das gewählte Thema und den Inhalt der Nachricht, um Ihre
            Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, bei
            vorvertraglichen Anfragen Art. 6 Abs. 1 lit. b DSGVO. Wir löschen die Daten, sobald die
            Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
          {contactFormAvailable() ? (
            <p>
              Zum Schutz vor Missbrauch begrenzen wir die Zahl der Nachrichten pro Absender. Dafür
              wird Ihre IP-Adresse kurzzeitig im Arbeitsspeicher des Servers gehalten und nicht
              gespeichert. Die Nachricht wird über unseren E-Mail-Dienstleister zugestellt:{" "}
              <ConfigValue value={siteConfig.services.mailProvider} />
            </p>
          ) : null}
        </Prose>
      </PageSection>

      {newsletterAvailable() ? (
        <PageSection id="newsletter" label="Newsletter" title="Newsletter">
          <Prose>
            <p>
              Für den Newsletter verarbeiten wir Ihre E-Mail-Adresse auf Grundlage Ihrer
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Nach der Anmeldung erhalten Sie eine E-Mail
              mit einem Bestätigungslink, der 48 Stunden gültig ist. Erst wenn Sie auf der
              verlinkten Seite die Anmeldung bestätigen, erhalten Sie den Newsletter
              (Double-Opt-in). Ohne Bestätigung wird die Adresse nicht für den Versand genutzt.
            </p>
            <p>
              Zum Nachweis der Einwilligung speichern wir den Zeitpunkt der Bestätigung, die Version
              des Einwilligungstextes und eine nicht umkehrbare Kennung der Anmeldung, aber nicht
              Ihre E-Mail-Adresse. Sie können die Einwilligung jederzeit widerrufen, etwa über den
              Abmeldelink in jeder Ausgabe oder per E-Mail. Versanddienstleister:{" "}
              <ConfigValue value={siteConfig.services.mailProvider} />
            </p>
          </Prose>
        </PageSection>
      ) : null}

      <PageSection id="rechte" label="Ihre Rechte" title="Ihre Rechte">
        <Prose>
          <p>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art.
            17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und
            Widerspruch gegen eine Verarbeitung auf Grundlage berechtigter Interessen (Art. 21).
          </p>
          <p>
            Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77
            DSGVO). Zuständig für uns ist: Der Hessische Beauftragte für Datenschutz und
            Informationsfreiheit, Wilhelmstraße 7, 65185 Wiesbaden.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
