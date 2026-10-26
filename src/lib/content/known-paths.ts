import "server-only";
import {
  getAllSoftware,
  getAuthors,
  getComparisons,
  getGlossary,
  getGuides,
  getLiveCategories,
  getUseCases,
} from "./index";

// Visible slugs per dynamic route, for the request-time 404 check in src/proxy.ts. Computed once
// per server start from the generated content, so the check stays fast.
export const knownSlugs = {
  software: new Set(getAllSoftware().map((s) => s.slug)),
  kategorien: new Set(getLiveCategories().map((c) => c.slug)),
  glossar: new Set(getGlossary().map((t) => t.slug)),
  ratgeber: new Set(getGuides().map((g) => g.slug)),
  redaktion: new Set(getAuthors().map((a) => a.slug)),
  vergleich: new Set(getComparisons().map((c) => c.slug)),
  "software-fuer": new Set(getUseCases().map((u) => u.slug)),
};

const SOFTWARE_SUBPAGES = new Set(["preise", "alternativen"]);
/** Generated social images: Next adds a build hash, e.g. "opengraph-image-kdupue". */
const isOgImage = (segment: string | undefined) =>
  /^opengraph-image(-[a-z0-9]+)?$/.test(segment ?? "");

/** true when the path belongs to a dynamic route but names content that does not exist. */
export function isUnknownContentPath(pathname: string): boolean {
  const [, section, slug, subpage, ...rest] = pathname.split("/");
  if (section === "software") {
    if (!slug || !knownSlugs.software.has(slug)) return true;
    return (
      rest.length > 0 ||
      (subpage !== undefined && !SOFTWARE_SUBPAGES.has(subpage) && !isOgImage(subpage))
    );
  }
  if (section === "kategorien" && slug)
    return subpage !== undefined || !knownSlugs.kategorien.has(slug);
  if (section === "glossar" && slug) return subpage !== undefined || !knownSlugs.glossar.has(slug);
  if (section === "ratgeber" && slug)
    return (subpage !== undefined && !isOgImage(subpage)) || !knownSlugs.ratgeber.has(slug);
  if (section === "redaktion" && slug)
    return subpage !== undefined || !knownSlugs.redaktion.has(slug);
  if (section === "vergleich" && slug)
    return subpage !== undefined || !knownSlugs.vergleich.has(slug);
  if (section === "software-fuer" && slug)
    return subpage !== undefined || !knownSlugs["software-fuer"].has(slug);
  return false;
}
