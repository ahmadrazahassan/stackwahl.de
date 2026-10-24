import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageSection } from "@/components/page/page-header";
import { Prose } from "@/components/ui/typography";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen",
  robots: { index: false, follow: true },
  alternates: { canonical: routes.cookieSettings() },
};

// The consent module (Section 9) is driven by a list of services. While the list is empty there
// is no banner, but this page stays so the footer link always works.
const consentServices: Array<{ name: string; purpose: string }> = [];

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
          {consentServices.length === 0 ? (
            <p>
              Stackwahl setzt derzeit keine Cookies und lädt keine Dienste, die Ihre Einwilligung
              brauchen. Es gibt deshalb nichts einzustellen. Sobald sich das ändert, können Sie Ihre
              Auswahl hier jederzeit anpassen. Details stehen in der{" "}
              <Link href={routes.privacy()}>Datenschutzerklärung</Link>.
            </p>
          ) : null}
        </Prose>
      </PageSection>
    </main>
  );
}
