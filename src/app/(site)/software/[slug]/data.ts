import "server-only";
import { getCategory, getSoftware, getVendor, PLACEHOLDER_SLUG } from "@/lib/content";
import { routes } from "@/lib/routes";

/** Shared loader for the profile and its sub-pages. undefined means notFound(). */
export function loadProfile(slug: string) {
  if (slug === PLACEHOLDER_SLUG) return undefined;
  const software = getSoftware(slug);
  if (!software) return undefined;
  const category = getCategory(software.categories[0]);
  const vendor = getVendor(software.vendor);
  const crumbs = [
    { label: "Start", href: routes.home() },
    ...(category ? [{ label: category.name, href: routes.category(category.slug) }] : []),
    { label: software.name, href: routes.software(software.slug) },
  ];
  return { software, category, vendor, crumbs };
}
