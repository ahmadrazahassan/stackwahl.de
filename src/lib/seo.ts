// Metadata and structured data (Section 11). Every page builds its canonical URL, Open Graph and
// JSON-LD from here, so titles, URLs and the publisher stay consistent. Structured data only
// describes what the page shows: no ratings or reviews, because no hands-on test exists yet.

import type { Metadata } from "next";
import { isPlaceholder } from "@/lib/placeholders";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

const { brand } = siteConfig;

export function absoluteUrl(path: string): string {
  return `${brand.url}${path === "/" ? "" : path}`;
}

/** Title, description, canonical, Open Graph and Twitter for one page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  published,
  modified,
  ownImage = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  published?: string;
  modified?: string;
  /** The route has its own opengraph-image file; then no default image is set. */
  ownImage?: boolean;
}): Metadata {
  const image = ownImage
    ? {}
    : { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: brand.name }] };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "de_DE",
      siteName: brand.name,
      title,
      description,
      url: absoluteUrl(path),
      ...image,
      ...(type === "article" && published
        ? { publishedTime: published, modifiedTime: modified ?? published }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ownImage ? {} : { images: ["/opengraph-image"] }),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

type Crumb = { label: string; href?: string };

export const publisher = {
  "@type": "Organization",
  "@id": `${brand.url}/#organization`,
  name: brand.name,
  url: brand.url,
  logo: absoluteUrl("/brand/stackwahl-mark.svg"),
} as const;

export function organizationLd() {
  const { legal } = siteConfig;
  return {
    "@context": "https://schema.org",
    ...publisher,
    legalName: legal.companyName,
    address: {
      "@type": "PostalAddress",
      streetAddress: legal.street,
      postalCode: legal.postalCode,
      addressLocality: legal.city,
      addressCountry: "DE",
    },
    ...(legal.vatId !== null && !isPlaceholder(legal.vatId) ? { vatID: legal.vatId } : {}),
    email: legal.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: legal.email,
        availableLanguage: "de",
      },
      {
        "@type": "ContactPoint",
        contactType: "editorial",
        email: legal.editorialEmail,
        availableLanguage: "de",
      },
      {
        "@type": "ContactPoint",
        contactType: "partnerships",
        email: legal.partnerEmail,
        availableLanguage: "de",
      },
    ],
    ...(siteConfig.social.linkedinCompany ? { sameAs: [siteConfig.social.linkedinCompany] } : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${brand.url}/#website`,
    name: brand.name,
    url: brand.url,
    inLanguage: brand.locale,
    publisher: { "@id": publisher["@id"] },
  };
}

/** Breadcrumbs as shown on the page; the last crumb is the page itself. */
export function breadcrumbLd(crumbs: Crumb[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href ?? currentPath),
    })),
  };
}

/**
 * A researched software profile: what the program is and what it costs. No aggregateRating or
 * review, because the Recherche-Wertung is not a user or test rating.
 */
export function softwareLd(s: {
  name: string;
  summary: string;
  path: string;
  vendorName: string;
  website: string;
  cloud: boolean;
  lowPriceCents: number | null;
  highPriceCents: number | null;
  priceDate: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    description: s.summary,
    url: absoluteUrl(s.path),
    applicationCategory: "BusinessApplication",
    ...(s.cloud ? { operatingSystem: "Web" } : {}),
    author: { "@type": "Organization", name: s.vendorName, url: s.website },
    ...(s.lowPriceCents !== null
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: (s.lowPriceCents / 100).toFixed(2),
            ...(s.highPriceCents !== null
              ? { highPrice: (s.highPriceCents / 100).toFixed(2) }
              : {}),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    dateModified: s.priceDate,
  };
}

export function itemListLd(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

/**
 * Articles are written by the editorial team; the managing director is the accountable person.
 * Both are real: the team as an organization, the managing director by name.
 */
export function editorialAuthorLd(author: { slug: string; name: string; role: string }) {
  return {
    author: {
      "@type": "Organization",
      name: `Redaktion ${brand.name}`,
      url: absoluteUrl(routes.editorial()),
    },
    accountablePerson: personLd(author),
  };
}

export function personLd(author: {
  slug: string;
  name: string;
  role: string;
  links?: { label: string; url: string }[];
}) {
  return {
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    url: absoluteUrl(routes.author(author.slug)),
    ...(author.links && author.links.length > 0 ? { sameAs: author.links.map((l) => l.url) } : {}),
  };
}
