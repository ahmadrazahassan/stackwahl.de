"use client";

import { Button } from "@/components/ui/button";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="inhalt" className="pt-3 sm:pt-4">
      <Panel>
        <Container className="py-24 sm:py-32">
          <Eyebrow className="text-muted">Fehler</Eyebrow>
          <Headline as="h1" size="h1" tail="Bitte versuchen Sie es erneut." className="mt-6">
            Etwas ist schiefgelaufen.
          </Headline>
          <Lead className="mt-6">
            Die Seite konnte nicht geladen werden. Wenn der Fehler bleibt, schreiben Sie uns über
            die Kontaktseite.
          </Lead>
          <Button onClick={reset} className="mt-10">
            Erneut laden
          </Button>
        </Container>
      </Panel>
    </main>
  );
}
