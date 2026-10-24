import { buildNavigation } from "@/components/layout/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import searchIndex from "@/generated/search-index.json";
import { getAvailability, getLiveCategories, getSoftwareInCategory } from "@/lib/content";
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
  return (
    <>
      <SiteHeader
        categories={categories}
        searchEntries={searchIndex}
        primary={nav.primary}
        cta={nav.cta}
      />
      {children}
      <SiteFooter
        categories={categories}
        columns={nav.footer}
        cta={nav.cta}
        year={await currentYear()}
      />
    </>
  );
}
