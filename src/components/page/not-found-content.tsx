import { ButtonLink } from "@/components/ui/button";
import { Container, Panel } from "@/components/ui/layout";
import { Eyebrow, Headline, Lead } from "@/components/ui/typography";
import { routes } from "@/lib/routes";

export function NotFoundContent() {
  return (
    <main id="inhalt" className="pt-3 sm:pt-4">
      <Panel>
        <Container className="py-24 sm:py-32">
          <Eyebrow className="text-muted">Fehler 404</Eyebrow>
          <Headline as="h1" size="h1" tail="Diese Seite gibt es nicht." className="mt-6">
            Nicht gefunden.
          </Headline>
          <Lead className="mt-6">
            Vielleicht ist der Link veraltet oder die Adresse hat einen Tippfehler. Von der
            Startseite aus finden Sie alle Kategorien und Programme.
          </Lead>
          <ButtonLink href={routes.home()} className="mt-10">
            Zur Startseite
          </ButtonLink>
        </Container>
      </Panel>
    </main>
  );
}
