import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page/page-header";
import { Container, Panel } from "@/components/ui/layout";
import { newsletterAvailable } from "@/lib/forms/availability";
import { routes } from "@/lib/routes";
import { confirmNewsletter } from "../actions";
import { ConfirmForm } from "./confirm-form";

export const metadata: Metadata = {
  title: "Newsletter bestätigen",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  if (!newsletterAvailable()) notFound();
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[
          { label: "Start", href: routes.home() },
          { label: "Newsletter", href: routes.newsletter() },
          { label: "Bestätigen" },
        ]}
        eyebrow="Newsletter"
        title="Anmeldung bestätigen"
      />
      <Panel>
        <Container className="py-12 sm:py-16">
          <Suspense fallback={<p className="text-small text-muted">Wird geladen …</p>}>
            <ConfirmForm action={confirmNewsletter} />
          </Suspense>
        </Container>
      </Panel>
    </main>
  );
}
