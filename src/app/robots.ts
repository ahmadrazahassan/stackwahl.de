import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

// Before launch everything is blocked (features.indexing). After launch only pages without
// own search value stay out: redirects, internal pages, search and personal tool results.
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.features.indexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/go/",
        "/intern/",
        routes.search(),
        routes.finderResults(),
        "/newsletter/bestaetigen",
        "/nicht-gefunden",
      ],
    },
    sitemap: `${siteConfig.brand.url}/sitemap.xml`,
    host: siteConfig.brand.url,
  };
}
