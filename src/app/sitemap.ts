import type { MetadataRoute } from "next";
import {
  getAllSoftware,
  getGlossary,
  getGuides,
  getLiveCategories,
  getSoftwareInCategory,
} from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

// Only indexable pages with content (Section 11). noindex pages (alternatives, cookie settings,
// search, internal) stay out. lastModified comes from the content, never from the build time.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.brand.url;
  const entry = (path: string, lastModified?: string) => ({
    url: `${base}${path === "/" ? "" : path}`,
    ...(lastModified ? { lastModified } : {}),
  });
  const software = getAllSoftware();
  const categories = getLiveCategories();
  const glossary = getGlossary();
  const guides = getGuides();
  const latest = (dates: string[]) => dates.sort().at(-1);
  return [
    entry(routes.home(), latest(software.map((s) => s.lastReviewed))),
    ...(categories.length > 0 ? [entry(routes.categories())] : []),
    ...categories.map((c) =>
      entry(
        routes.category(c.slug),
        latest(getSoftwareInCategory(c.slug).map((s) => s.lastReviewed)),
      ),
    ),
    ...software.flatMap((s) => [
      entry(routes.software(s.slug), s.lastReviewed),
      entry(routes.softwarePricing(s.slug), latest(s.plans.map((p) => p.source.accessed))),
    ]),
    ...(guides.length > 0 ? [entry(routes.guides(), latest(guides.map((g) => g.updated)))] : []),
    ...guides.map((g) => entry(routes.guide(g.slug), g.updated)),
    ...(glossary.length > 0 ? [entry(routes.glossary())] : []),
    ...glossary.map((t) => entry(routes.glossaryTerm(t.slug), t.lastReviewed)),
    entry(routes.methodology()),
    entry(routes.transparency()),
    entry(routes.about()),
    entry(routes.contact()),
    entry(routes.imprint()),
    entry(routes.privacy()),
    entry(routes.accessibility()),
  ];
}
