import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { CONSENT_SERVICES } from "@/lib/consent";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen",
  robots: { index: false, follow: true },
  alternates: { canonical: routes.cookieSettings() },
};

export default function CookieSettingsPage() {
  return (
    <main id="inhalt" className="flex flex-col gap-3 pt-3 sm:gap-4 sm:pt-4">
      <PageHeader
        crumbs={[{ label: "Start", href: routes.home() }, { label: "Cookie-Einstellungen" }]}
        eyebrow="Rechtliches"
        title="Cookie-Einstellungen"
      />
      <PageSection id="stand" label="Stand" title="Was diese Website speichert">
        <Prose>
          {CONSENT_SERVICES.length === 0 ? (
            <p>
              Stackwahl setzt derzeit keine Cookies und lädt von sich aus keine Dienste, die Ihre
              Einwilligung brauchen. Es gibt deshalb nichts einzustellen. Videos der Anbieter auf
              YouTube oder Vimeo laden nur, wenn Sie beim einzelnen Video auf „Video laden“ klicken;
              diese Entscheidung speichern wir nicht. Sobald sich das ändert, können Sie Ihre
              Auswahl hier jederzeit anpassen. Details stehen in der{" "}
              <Link href={routes.privacy()}>Datenschutzerklärung</Link>.
            </p>
          ) : null}
        </Prose>
      </PageSection>
    </main>
  );
}
