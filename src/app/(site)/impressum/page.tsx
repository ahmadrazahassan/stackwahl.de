import Link from "next/link";
import type { Metadata } from "next";
import { ConfigValue, MailLink } from "@/components/page/legal";
import { isPlaceholder } from "@/lib/placeholders";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum von Stackwahl: Angaben nach § 5 DDG und Verantwortlicher nach § 18 Abs. 2 MStV.",
  alternates: { canonical: routes.imprint() },
};

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-line py-4 sm:grid-cols-3 sm:gap-6">
      <dt className="text-muted">{term}</dt>
      <dd className="sm:col-span-2">{children}</dd>
    </div>
  );
}

export default function ImprintPage() {
  const { legal } = siteConfig;
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Impressum" }]}
        eyebrow="Rechtliches"
        title="Impressum"
      />
      <PageSection id="anbieter" label="§ 5 DDG" title="Angaben zum Anbieter">
        <dl className="max-w-3xl text-body">
          <Row term="Anbieter">
            {legal.companyName}
            <br />
            {legal.street}
            <br />
            {legal.postalCode} {legal.city}
          </Row>
          <Row term="Vertreten durch">{legal.managingDirector} (Geschäftsführer)</Row>
          <Row term="E-Mail">
            <MailLink address={legal.email} />
          </Row>
          <Row term="Kontaktformular">
            <Link href={routes.contact()} className="underline decoration-1 underline-offset-4">
              Zur Kontaktseite
            </Link>
          </Row>
          <Row term="Registereintrag">
            Eintragung im Handelsregister
            <br />
            Registergericht: {legal.register.court}
            <br />
            Registernummer: {legal.register.number}
          </Row>
          {legal.vatId !== null && !isPlaceholder(legal.vatId) ? (
            <Row term="Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz">
              <ConfigValue value={legal.vatId} />
            </Row>
          ) : null}
        </dl>
      </PageSection>
      <PageSection
        id="verantwortlich"
        label="§ 18 Abs. 2 MStV"
        title="Verantwortlich für den Inhalt"
      >
        <dl className="max-w-3xl text-body">
          <Row term="Name">
            <ConfigValue value={legal.responsibleEditor.name} />
          </Row>
          <Row term="Anschrift">
            {legal.street}
            <br />
            {legal.postalCode} {legal.city}
          </Row>
        </dl>
      </PageSection>
      <PageSection id="marken" label="Hinweis" title="Marken und Logos">
        <Prose>
          <p>
            Produktnamen, Marken und Logos gehören ihren jeweiligen Inhabern. Wir verwenden sie nur,
            um die besprochenen Produkte zu kennzeichnen. Eine Partnerschaft oder Empfehlung durch
            die Inhaber ist damit nicht verbunden.
          </p>
        </Prose>
      </PageSection>
    </main>
  );
}
