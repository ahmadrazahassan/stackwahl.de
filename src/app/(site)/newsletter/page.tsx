import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterPanel } from "@/components/marketing/newsletter-panel";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { newsletterAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { subscribeNewsletter } from "./actions";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Einmal im Monat: neue Softwareprofile, Preisänderungen und Fristen für Unternehmen in Deutschland. Anmeldung mit Bestätigung per E-Mail.",
  alternates: { canonical: routes.newsletter() },
};

export default function NewsletterPage() {
  if (!newsletterAvailable()) notFound();
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Newsletter" }]}
        eyebrow="Newsletter"
        title="Der Stackwahl-Newsletter"
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <NewsletterPanel action={subscribeNewsletter} />
        </Container>
      </Panel>
    </main>
  );
}
