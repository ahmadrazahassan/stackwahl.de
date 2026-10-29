import { z } from "zod";

// The ONE place for brand, legal, contact and feature flag values (docs/BUILD_PROMPT.md, Section 0).
// Open values are written as "{{NAME}}" and listed by `pnpm placeholders`.

const placeholder = z.string().regex(/^\{\{[A-Z0-9_]+\}\}$/);
const openString = z.union([z.string().min(1), placeholder]);

const siteConfigSchema = z.object({
  brand: z.object({
    name: z.literal("Stackwahl"),
    domain: z.literal("stackwahl.de"),
    url: z.url(),
    tagline: z.string().min(1),
    locale: z.literal("de-DE"),
    language: z.literal("de"),
    currency: z.literal("EUR"),
  }),
  legal: z.object({
    /** Operator with legal form, exactly as in the Handelsregister (§ 5 Abs. 1 Nr. 1 DDG). */
    companyName: z.string().min(1),
    managingDirector: z.string().min(1),
    // Required for a company (ladungsfähige Anschrift). No phone number on the site.
    street: z.string().min(1),
    postalCode: z.string().regex(/^\d{5}$/),
    city: z.string().min(1),
    register: z.object({ court: z.string().min(1), number: z.string().min(1) }),
    email: openString,
    /** Corrections, reader mail, press. */
    editorialEmail: openString,
    /** Vendors, affiliate networks, partnerships. */
    partnerEmail: openString,
    // null hides the block in the Impressum.
    vatId: z.union([openString, z.null()]),
    responsibleEditor: z.object({
      name: openString,
    }),
  }),
  /** The company profile on LinkedIn (null hides it). Personal profiles are in the author record. */
  social: z.object({
    linkedinCompany: z.url().nullable(),
  }),
  services: z.object({
    hosting: z.string().min(1),
    domain: z.string().min(1),
    mailProvider: openString,
    database: openString,
    analytics: openString,
    affiliateNetworks: openString,
  }),
  score: z.object({
    name: openString,
  }),
  features: z.object({
    // false blocks every page (noindex and robots.txt); true since the launch preparation.
    indexing: z.boolean(),
    newsletter: z.boolean(),
    userReviews: z.boolean(),
    consultationRequest: z.boolean(),
    affiliateLinks: z.boolean(),
    analytics: z.boolean(),
    // Interactive tools from Phase 4. Navigation links appear only when a tool exists.
    finder: z.boolean(),
    comparisonTool: z.boolean(),
    costCalculator: z.boolean(),
    // false shows a visible "Entwurf" notice on every legal page (Section 9).
    legalReviewed: z.boolean(),
    // Shown only when mail is configured too (src/lib/forms/availability.ts).
    contactForm: z.boolean(),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export const siteConfig: SiteConfig = siteConfigSchema.parse({
  brand: {
    name: "Stackwahl",
    domain: "stackwahl.de",
    url: "https://stackwahl.de",
    tagline: "Business-Software unabhängig verglichen",
    locale: "de-DE",
    language: "de",
    currency: "EUR",
  },
  legal: {
    companyName: "Stackwahl UG (haftungsbeschränkt)",
    managingDirector: "Milan Schultheis",
    street: "Charlottenstr. 14",
    postalCode: "52070",
    city: "Aachen",
    register: { court: "Amtsgericht Aachen", number: "HRB 24686" },
    email: "info@stackwahl.de",
    editorialEmail: "milan.schultheis@stackwahl.de",
    partnerEmail: "milan.schultheis@stackwahl.de",
    vatId: "DE342188146",
    responsibleEditor: {
      name: "Milan Schultheis",
    },
  },
  social: {
    linkedinCompany: null,
  },
  services: {
    hosting: "Vercel Inc., Region Frankfurt (fra1)",
    domain: "IONOS SE",
    mailProvider: "{{MAIL_PROVIDER}}",
    database: "{{DATABASE_PROVIDER}}",
    analytics: "{{ANALYTICS_PROVIDER}}",
    affiliateNetworks: "Lexware, FastBill und sevdesk Partnerprogramm (direkt)",
  },
  score: {
    name: "Stackwahl-Wertung",
  },
  features: {
    indexing: true,
    newsletter: true,
    userReviews: false,
    consultationRequest: false,
    affiliateLinks: true,
    analytics: false,
    finder: true,
    comparisonTool: true,
    costCalculator: true,
    legalReviewed: false,
    contactForm: true,
  },
});
