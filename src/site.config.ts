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
    ownerName: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string().regex(/^\d{5}$/),
    city: z.string().min(1),
    country: z.string().min(1),
    email: openString,
    phone: openString,
    // null hides the block in the Impressum.
    vatId: z.union([openString, z.null()]),
    responsibleEditor: z.object({
      name: openString,
      address: z.string().min(1),
    }),
  }),
  services: z.object({
    hosting: z.string().min(1),
    domain: z.string().min(1),
    mailProvider: openString,
    database: openString,
    analytics: openString,
    affiliateNetworks: openString,
    /** Date the Vercel DPA was concluded, or a placeholder until then. */
    hostingDpa: openString,
    /** How long the host keeps request logs (from the host's documentation). */
    hostingLogRetention: openString,
  }),
  score: z.object({
    name: openString,
  }),
  features: z.object({
    // Stays false until launch (Section 11): every page is noindex.
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
    ownerName: "Dietmar Riedel",
    street: "Neue Kräme 32",
    postalCode: "60314",
    city: "Frankfurt am Main",
    country: "Deutschland",
    email: "{{CONTACT_EMAIL}}",
    phone: "{{CONTACT_PHONE}}",
    vatId: "{{VAT_ID}}",
    responsibleEditor: {
      name: "{{RESPONSIBLE_EDITOR}}",
      address: "Neue Kräme 32, 60314 Frankfurt am Main",
    },
  },
  services: {
    hosting: "Vercel Inc., Region Frankfurt (fra1)",
    domain: "IONOS SE",
    mailProvider: "{{MAIL_PROVIDER}}",
    database: "{{DATABASE_PROVIDER}}",
    analytics: "{{ANALYTICS_PROVIDER}}",
    affiliateNetworks: "{{AFFILIATE_NETWORKS}}",
    hostingDpa: "{{HOSTING_DPA}}",
    hostingLogRetention: "{{HOSTING_LOG_RETENTION}}",
  },
  score: {
    name: "{{SCORE_NAME}}",
  },
  features: {
    indexing: false,
    newsletter: true,
    userReviews: false,
    consultationRequest: false,
    affiliateLinks: false,
    analytics: false,
    finder: true,
    comparisonTool: true,
    costCalculator: true,
    legalReviewed: false,
    contactForm: true,
  },
});
