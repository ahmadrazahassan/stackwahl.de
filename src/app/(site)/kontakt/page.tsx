import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { ConfigValue } from "@/components/page/legal";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { contactFormAvailable } from "@/lib/forms/availability";
import { isPlaceholder } from "@/lib/placeholders";
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
  const email = legal.email;
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
          <div className="flex justify-between gap-6 border-t border-line py-3">
            <dt className="text-muted">E-Mail</dt>
            <dd className="text-right">
              {isPlaceholder(email) ? (
                <ConfigValue value={email} />
              ) : (
                <a href={`mailto:${email}`} className="underline decoration-1 underline-offset-4">
                  {email}
                </a>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-t border-line py-3">
            <dt className="text-muted">Post</dt>
            <dd className="text-right">
              {legal.ownerName}
              <br />
              {legal.street}
              <br />
              {legal.postalCode} {legal.city}
            </dd>
          </div>
        </dl>
        <Prose className="mt-8">
          <p>
            Anbieter: Korrekturen zu Fakten sind willkommen, bitte mit Link zur Quelle. Kommerzielle
            Beziehungen beeinflussen weder Profile noch Wertungen, siehe Transparenz.
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
