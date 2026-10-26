import type { Metadata } from "next";
import Link from "next/link";
import { MailLink } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { METHOD_VERSION, scoreName } from "@/components/software/score";
import { Prose } from "@/components/ui/typography";
import { COMPLIANCE, COMPLIANCE_KEYS, FEATURES } from "@/content/features";
import { FACT_MAX_AGE_DAYS, PRICE_MAX_AGE_DAYS } from "@/content/guards";
import { MIN_PROFILES_PER_CATEGORY } from "@/content/visibility";
import { getCategory } from "@/lib/content";
import { formatEuro, formatPercent } from "@/lib/format";
import {
  FEATURE_SETS,
  FREE_PLAN_BONUS,
  LEGAL_SETS,
  POINTS_PER_DOUBLING,
  REFERENCE_PRICE_CENTS,
  RESEARCH_CRITERIA,
  RESEARCH_METHOD_VERSION,
  RESEARCH_SCORE_NAME,
  SCORED_CATEGORIES,
  SUPPORT_SET,
} from "@/lib/research-score";
import { routes } from "@/lib/routes";
import { SCORE_CRITERIA } from "@/lib/scoring";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Methodik: So vergleichen und bewerten wir",
  description:
    "Wie Stackwahl Software recherchiert, Preise prüft, Rechtssicherheit bewertet und die Reihenfolge festlegt. Kriterien, Gewichtung und Prüfintervalle.",
  alternates: { canonical: routes.methodology() },
};

export default function MethodologyPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Methodik" }]}
        eyebrow="Methodik"
        title="So vergleichen wir."
        tail="Nachvollziehbar und mit Quelle."
        lead="Diese Seite erklärt, woher unsere Angaben stammen, wie die Wertung entsteht und nach welchen Kriterien wir Programme sortieren."
        meta={`Methode ${METHOD_VERSION}`}
      />

      <PageSection id="recherche" label="Recherche" title="Woher die Angaben stammen">
        <Prose>
          <p>
            Wir lesen die Preisseiten, Funktionsübersichten, Datenschutzerklärungen und das
            Impressum der Anbieter selbst. Zu jeder Angabe speichern wir die Quelle und das Datum,
            an dem wir sie abgerufen haben. Beides steht im Profil unter „Quellen“.
          </p>
          <p>
            Was ein Anbieter auf den geprüften Seiten nicht nennt, steht bei uns als „Keine Angabe“.
            Das ist bewusst kein Nein: Eine fehlende Erwähnung beweist nicht, dass eine Funktion
            fehlt. Aussagen des Anbieters, die wir nicht selbst prüfen können, kennzeichnen wir als
            Angabe des Anbieters.
          </p>
          <p>
            Preise geben wir als Listenpreise an, netto oder brutto so, wie der Anbieter sie nennt.
            Laufende Aktionen nennen wir beim jeweiligen Tarif mit ihren Bedingungen.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="aktualitaet" label="Aktualität" title="Wie oft wir prüfen">
        <Prose>
          <p>
            Preise prüfen wir spätestens nach {PRICE_MAX_AGE_DAYS} Tagen erneut, alle anderen
            Angaben spätestens nach {FACT_MAX_AGE_DAYS} Tagen. Ist eine Angabe älter, lässt sich die
            Seite technisch nicht veröffentlichen, bis wir sie neu geprüft haben.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="wertung" label="Wertung" title={`Die ${scoreName()}`}>
        <Prose>
          <p>
            Die Wertung reicht von 0,0 bis 10,0 mit einer Nachkommastelle. Sie entsteht aus fünf
            Kriterien mit fester Gewichtung. Wir vergeben sie erst, wenn eine Person aus der
            Redaktion das Programm in einem eigenen Konto ausprobiert hat. Bis dahin zeigen wir die
            Recherche-Wertung, die weiter unten erklärt ist.
          </p>
        </Prose>
        <div
          role="region"
          aria-label="Kriterien der Wertung"
          tabIndex={0}
          className="relative mt-8 overflow-x-auto"
        >
          <table className="w-full min-w-[28rem] border-collapse text-small">
            <caption className="pb-3 text-left text-muted">
              Kriterien und Gewichtung, Methode {METHOD_VERSION}
            </caption>
            <thead>
              <tr className="text-left">
                <th scope="col" className="pb-3 eyebrow text-muted">
                  Kriterium
                </th>
                <th scope="col" className="pb-3 text-right eyebrow text-muted">
                  Gewichtung
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORE_CRITERIA.map((c) => (
                <tr key={c.key} className="border-t border-line">
                  <th scope="row" className="py-3 text-left font-medium">
                    {c.label}
                  </th>
                  <td className="py-3 text-right tabular">{formatPercent(c.weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose className="mt-8">
          <p>
            Rechtssicherheit in Deutschland umfasst diese Punkte:{" "}
            {COMPLIANCE_KEYS.map((k) => COMPLIANCE[k].label).join(", ")}.
          </p>
        </Prose>
      </PageSection>

      <PageSection
        id="recherche-wertung"
        label={RESEARCH_SCORE_NAME}
        title={`Die ${RESEARCH_SCORE_NAME}`}
      >
        <Prose>
          <p>
            Solange kein Programm getestet ist, berechnen wir die {RESEARCH_SCORE_NAME} (Methode{" "}
            {RESEARCH_METHOD_VERSION}). Sie entsteht ohne Ermessen nach fester Formel aus den
            Angaben im Profil, die jeweils eine Quelle haben. Die Bedienung lässt sich ohne
            Praxistest nicht beurteilen und fehlt deshalb. Die übrigen vier Kriterien sind so
            gewichtet:
          </p>
        </Prose>
        <div
          role="region"
          aria-label="Kriterien der Recherche-Wertung"
          tabIndex={0}
          className="relative mt-8 overflow-x-auto"
        >
          <table className="w-full min-w-[28rem] border-collapse text-small">
            <caption className="pb-3 text-left text-muted">
              Kriterien und Gewichtung, Methode {RESEARCH_METHOD_VERSION}
            </caption>
            <thead>
              <tr className="text-left">
                <th scope="col" className="pb-3 eyebrow text-muted">
                  Kriterium
                </th>
                <th scope="col" className="pb-3 text-right eyebrow text-muted">
                  Gewichtung
                </th>
              </tr>
            </thead>
            <tbody>
              {RESEARCH_CRITERIA.map((c) => (
                <tr key={c.key} className="border-t border-line">
                  <th scope="row" className="py-3 text-left font-medium">
                    {c.label}
                  </th>
                  <td className="py-3 text-right tabular">{formatPercent(c.weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Prose className="mt-8">
          <h3>Punkte je Angabe</h3>
          <p>
            Für Funktionsumfang, Rechtssicherheit sowie Support und Datenschutz zählen wir feste
            Punkte. „Ja“ bringt einen Punkt, „Gegen Aufpreis“ 0,75, „Teilweise“ 0,5. „Nein“ und
            „Keine Angabe“ bringen keinen Punkt, denn wir werten nur, was belegt ist. Die Summe
            teilen wir durch die Zahl der Punkte und rechnen sie auf 0 bis 10 um.
          </p>
          <p>
            Gemessen wird jedes Programm an den Anforderungen seiner Hauptkategorie, also der ersten
            Kategorie im Profil. Ein Rechnungsprogramm muss keine Umsatzsteuer-Voranmeldung senden,
            eine Buchhaltungssoftware schon. Auf einer Kategorieseite gelten für alle Programme die
            Anforderungen dieser Kategorie, damit die Liste vergleichbar ist. Ein Programm in zwei
            Kategorien kann dort deshalb eine andere Wertung haben als im Profil.
          </p>
          {SCORED_CATEGORIES.map((slug) => (
            <div key={slug}>
              <h3>{getCategory(slug)?.name ?? slug}</h3>
              <p>
                Funktionsumfang:{" "}
                {FEATURE_SETS[slug]
                  .map((i) =>
                    i.kind === "feature" ? FEATURES[i.key].label : COMPLIANCE[i.key].label,
                  )
                  .join(", ")}
                .
              </p>
              <p>
                Rechtssicherheit: {LEGAL_SETS[slug].map((k) => COMPLIANCE[k].label).join(", ")}.
              </p>
              <p>Volle Preispunkte bis {formatEuro(REFERENCE_PRICE_CENTS[slug])} netto im Monat.</p>
            </div>
          ))}
          <h3>Support und Datenschutz</h3>
          <p>In allen Kategorien: {SUPPORT_SET.map((k) => COMPLIANCE[k].label).join(", ")}.</p>
          <h3>Einstiegspreis</h3>
          <p>
            Maßgeblich ist der günstigste bezahlte Tarif, netto im Monat, bei jährlicher Zahlung, wo
            der Anbieter sie anbietet, und mit der Mindestzahl an Nutzern, die der Anbieter
            verkauft. Bis zum Referenzpreis der Kategorie gibt es 10 Punkte, jede Verdopplung des
            Preises kostet {POINTS_PER_DOUBLING} Punkte. Ein dauerhaft kostenloser Tarif bringt{" "}
            {FREE_PLAN_BONUS} Punkt dazu, höchstens 10.
          </p>
          <h3>Rundung und Grenzen</h3>
          <p>
            Jedes Kriterium runden wir auf eine Nachkommastelle, die Gesamtwertung berechnen wir aus
            den gerundeten Werten. Jedes Profil zeigt alle Angaben, aus denen seine Wertung
            entsteht. Die {RESEARCH_SCORE_NAME} sagt nichts darüber, wie angenehm sich ein Programm
            bedienen lässt, und sie wertet Funktionen gleich, egal in welchem Tarif sie stecken. Sie
            ersetzt keinen Test in einer eigenen Testphase.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="reihenfolge" label="Reihenfolge" title="Wie wir sortieren">
        <Prose>
          <p>
            Hauptparameter der Reihenfolge auf Kategorieseiten ist unsere Wertung, absteigend. Bei
            gleicher Wertung sortieren wir alphabetisch. Programme ohne Wertung stehen alphabetisch
            am Ende. Solange in einer Kategorie noch kein Programm getestet ist, sortieren wir nach
            der {RESEARCH_SCORE_NAME}. Die Programme auf der Startseite unter „Im Fokus“ sind die
            vier mit der höchsten {RESEARCH_SCORE_NAME} über alle Kategorien.
          </p>
          <p>
            Provisionen, Partnerschaften oder Anzeigen haben keinen Einfluss auf Reihenfolge,
            Wertung oder Auswahl. Eine Kategorie erscheint erst, wenn sie mindestens{" "}
            {MIN_PROFILES_PER_CATEGORY} Profile enthält. Wie wir uns finanzieren, steht auf der
            Seite <Link href={routes.transparency()}>Transparenz</Link>.
          </p>
        </Prose>
      </PageSection>

      <PageSection id="korrekturen" label="Korrekturen" title="Fehler gefunden?">
        <Prose>
          <p>
            Anbieter und Leser können uns veraltete oder falsche Angaben melden. Wir prüfen jeden
            Hinweis an der Originalquelle und passen das Profil mit neuem Datum an. Schreiben Sie an{" "}
            <MailLink address={siteConfig.legal.editorialEmail} className="" /> oder nutzen Sie die{" "}
            <Link href={routes.contact()}>Kontaktseite</Link>.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
