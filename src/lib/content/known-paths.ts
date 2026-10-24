import "server-only";
import { getAllSoftware, getGlossary, getLiveCategories } from "./index";

// Visible slugs per dynamic route, for the request-time 404 check in src/proxy.ts. Computed once
// per server start from the generated content, so the check stays fast.
export const knownSlugs = {
  software: new Set(getAllSoftware().map((s) => s.slug)),
  kategorien: new Set(getLiveCategories().map((c) => c.slug)),
  glossar: new Set(getGlossary().map((t) => t.slug)),
};

const SOFTWARE_SUBPAGES = new Set(["preise", "alternativen"]);

/** true when the path belongs to a dynamic route but names content that does not exist. */
export function isUnknownContentPath(pathname: string): boolean {
  const [, section, slug, subpage, ...rest] = pathname.split("/");
  if (section === "software") {
    if (!slug || !knownSlugs.software.has(slug)) return true;
    return rest.length > 0 || (subpage !== undefined && !SOFTWARE_SUBPAGES.has(subpage));
  }
  if (section === "kategorien" && slug)
    return subpage !== undefined || !knownSlugs.kategorien.has(slug);
  if (section === "glossar" && slug) return subpage !== undefined || !knownSlugs.glossar.has(slug);
  return false;
}
