import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.features.indexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/intern/", "/suche"] },
    sitemap: `${siteConfig.brand.url}/sitemap.xml`,
  };
}
