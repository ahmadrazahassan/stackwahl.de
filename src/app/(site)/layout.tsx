import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { buildNavigation } from "@/components/layout/navigation";
import { CONSENT_SERVICES } from "@/lib/consent";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import searchIndex from "@/generated/search-index.json";
import {
  getAvailability,
  getLiveCategories,
  getSoftwareInCategory,
  getUseCases,
} from "@/lib/content";
import { routes } from "@/lib/routes";

async function currentYear() {
  "use cache";
  return new Date().getUTCFullYear();
}

/** Public shell: header and footer for every public page (Section 5.6). */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const nav = buildNavigation(getAvailability());
  const categories = getLiveCategories().map((c) => ({
    label: c.name,
    href: routes.category(c.slug),
    description: `${getSoftwareInCategory(c.slug).length} Programme im Vergleich`,
  }));
  const useCases = getUseCases();
  const footerColumns = [
    ...(useCases.length > 0
      ? [
          {
            title: "Software für",
            links: useCases.map((u) => ({ label: u.label, href: routes.useCase(u.slug) })),
          },
        ]
      : []),
    ...nav.footer,
  ];
  return (
    <NuqsAdapter>
      <SiteHeader
        categories={categories}
        searchEntries={searchIndex}
        primary={nav.primary}
        cta={nav.cta}
      />
      {children}
      <SiteFooter
        categories={categories}
        columns={footerColumns}
        cta={nav.cta}
        year={await currentYear()}
      />
      {CONSENT_SERVICES.length > 0 ? <ConsentBanner services={CONSENT_SERVICES} /> : null}
    </NuqsAdapter>
  );
}
