import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { MailLink } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { contactFormAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";
import { sendContact } from "./actions";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "So erreichen Sie Stackwahl: Hinweise auf veraltete Angaben, Fragen zur Methodik und Anfragen von Anbietern.",
  alternates: { canonical: routes.contact() },
};

export default function ContactPage() {
  const { legal } = siteConfig;
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Kontakt" }]}
        eyebrow="Kontakt"
        title="Schreiben Sie uns."
        lead="Hinweise auf veraltete Preise oder falsche Angaben prüfen wir an der Originalquelle und korrigieren das Profil mit neuem Datum."
      />
      <PageSection id="kontaktdaten" label="Kontaktdaten" title="So erreichen Sie uns">
        <dl className="max-w-xl text-body">
          {[
            { label: "Allgemein", address: legal.email },
            { label: "Redaktion und Korrekturen", address: legal.editorialEmail },
            { label: "Anbieter und Partner", address: legal.partnerEmail },
          ].map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line py-3"
            >
              <dt className="text-muted">{row.label}</dt>
              <dd className="text-right">
                <MailLink address={row.address} />
              </dd>
            </div>
          ))}
        </dl>
        <Prose className="mt-8">
          <p>
            Hinweise auf veraltete oder falsche Angaben schicken Sie bitte an die Redaktion, am
            besten mit Link zur Quelle. Anbieter und Partnerprogramme erreichen uns unter der
            Partner-Adresse. Kommerzielle Beziehungen beeinflussen weder Profile noch Wertungen,
            siehe Transparenz.
          </p>
        </Prose>
      </PageSection>
      {contactFormAvailable() ? (
        <PageSection id="formular" label="Formular" title="Nachricht schreiben">
          <ContactForm action={sendContact} />
        </PageSection>
      ) : null}
    </main>
  );
}
