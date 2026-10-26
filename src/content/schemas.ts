import { z } from "zod";
import { COMPLIANCE_KEYS, FEATURE_KEYS } from "./features.ts";

// Content schemas (docs/BUILD_PROMPT.md, Section 6). Every content file is validated against
// these at build time; `pnpm content:validate` turns every error into a failed build.
// Money is integer cents in euro, dates are ISO dates (YYYY-MM-DD).

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: Kleinbuchstaben, Ziffern und Bindestriche");

export const isoDateSchema = z.iso.date();

export const httpsUrlSchema = z.url({ protocol: /^https$/ });

export const sourceSchema = z.strictObject({
  url: httpsUrlSchema,
  title: z.string().min(3),
  accessed: isoDateSchema,
});
export type Source = z.infer<typeof sourceSchema>;

export const statusSchema = z.enum(["draft", "published"]);

const centsSchema = z.number().int().nonnegative();

// ---------------------------------------------------------------------------------------------
// Vendor

export const vendorSchema = z.strictObject({
  slug: slugSchema,
  name: z.string().min(2),
  legalName: z.string().min(2),
  country: z.string().min(2),
  // null while the seat is not confirmed on the vendor's own Impressum.
  city: z.string().min(2).nullable(),
  website: httpsUrlSchema,
  sources: z.array(sourceSchema).min(1),
});
export type Vendor = z.infer<typeof vendorSchema>;

// ---------------------------------------------------------------------------------------------
// Category

export const categorySchema = z.strictObject({
  slug: slugSchema,
  name: z.string().min(3),
  description: z.string().min(10).max(155),
  intro: z.string().min(40),
  launchOrder: z.number().int().positive(),
  status: statusSchema,
});
export type Category = z.infer<typeof categorySchema>;

// ---------------------------------------------------------------------------------------------
// Author (real people only)

export const authorSchema = z.strictObject({
  slug: slugSchema,
  name: z.string().min(3),
  role: z.string().min(3),
  bio: z.string().min(40),
  realPerson: z.literal(true),
  photo: z
    .string()
    .regex(/^\/authors\/.+\.(jpg|jpeg|png|webp|avif)$/)
    .optional(),
  expertise: z.array(z.string()).min(1),
  links: z.array(z.strictObject({ label: z.string(), url: httpsUrlSchema })).default([]),
});
export type Author = z.infer<typeof authorSchema>;

// ---------------------------------------------------------------------------------------------
// Software

export const factStatusSchema = z.enum(["ja", "nein", "teilweise", "aufpreis", "unbekannt"]);
export type FactStatus = z.infer<typeof factStatusSchema>;

/** A sourced fact. "unbekannt" is allowed without a source; every other value needs one. */
export const factSchema = z
  .strictObject({
    status: factStatusSchema,
    note: z.string().min(3).optional(),
    source: sourceSchema.optional(),
  })
  .refine((fact) => fact.status === "unbekannt" || fact.source !== undefined, {
    message: "Jede Angabe außer „unbekannt“ braucht eine Quelle.",
    path: ["source"],
  });
export type Fact = z.infer<typeof factSchema>;

export const planSchema = z
  .strictObject({
    name: z.string().min(1),
    /** Price per month when billed monthly. null: plan not offered monthly. */
    monthlyCents: centsSchema.nullable(),
    /** Price per month when billed yearly. null: plan not offered yearly. */
    yearlyMonthlyCents: centsSchema.nullable(),
    perUser: z.boolean(),
    net: z.boolean(),
    includes: z.array(z.string().min(2)).min(1),
    note: z.string().optional(),
    source: sourceSchema,
  })
  .refine((plan) => plan.monthlyCents !== null || plan.yearlyMonthlyCents !== null, {
    message: "Ein Tarif braucht mindestens einen Preis (monatlich oder jährlich).",
  });
export type Plan = z.infer<typeof planSchema>;

export const targetGroupSchema = z.enum([
  "freiberufler",
  "kleinunternehmer",
  "selbststaendige",
  "kmu",
  "mittelstand",
  "agenturen",
  "handwerk",
  "e-commerce",
  "vereine",
  "gruender",
]);

export const ratingSchema = z.strictObject({
  method: z.literal("1.0"),
  date: isoDateSchema,
  criteria: z.strictObject({
    funktionen: z.number().min(0).max(10),
    bedienung: z.number().min(0).max(10),
    preisLeistung: z.number().min(0).max(10),
    rechtssicherheit: z.number().min(0).max(10),
    supportDatenschutz: z.number().min(0).max(10),
  }),
  /** A rating requires a documented hands-on test (Section 3.3). */
  test: z.strictObject({
    date: isoDateSchema,
    tester: slugSchema,
    plan: z.string().min(1),
    notes: z.string().min(20),
  }),
});
export type Rating = z.infer<typeof ratingSchema>;

/**
 * Long-form profile text, written from the sources (Section 3: no hands-on claim without a test).
 * Every section names the pages it is based on, so readers can check each paragraph.
 */
export const reviewSchema = z.strictObject({
  sections: z
    .array(
      z.strictObject({
        id: slugSchema,
        title: z.string().min(3),
        paragraphs: z.array(z.string().min(40)).min(1),
        sources: z.array(sourceSchema).min(1),
      }),
    )
    .min(4),
});
export type Review = z.infer<typeof reviewSchema>;

export const softwareSchema = z.strictObject({
  slug: slugSchema,
  name: z.string().min(2),
  vendor: slugSchema,
  categories: z.array(slugSchema).min(1),
  status: statusSchema,
  /** "verified": every fact was checked against the sources on the access date. */
  verification: z.enum(["verified", "unverified"]),
  lastReviewed: isoDateSchema,
  author: slugSchema.nullable(),
  reviewer: slugSchema.nullable().default(null),
  /** Also the meta description, so at most 155 characters (Section 11). */
  summary: z.string().min(40).max(155),
  website: httpsUrlSchema,
  marketAvailability: z.strictObject({
    status: z.enum(["verfuegbar", "eingeschraenkt", "nicht-verfuegbar"]),
    note: z.string().min(10).optional(),
    source: sourceSchema,
  }),
  targetGroups: z.array(targetGroupSchema).min(1),
  deployment: z.array(z.enum(["cloud", "desktop", "hybrid"])).min(1),
  /** null: not stated by the vendor on the checked pages. */
  apps: z.strictObject({
    web: z.boolean().nullable(),
    ios: z.boolean().nullable(),
    android: z.boolean().nullable(),
  }),
  freeTrialDays: z.number().int().nonnegative().nullable(),
  freePlan: z.boolean(),
  trialSource: sourceSchema.optional(),
  compliance: z.record(z.enum(COMPLIANCE_KEYS), factSchema),
  features: z.partialRecord(z.enum(FEATURE_KEYS), factSchema),
  plans: z.array(planSchema).min(1),
  pros: z.array(z.string().min(10)).min(3).max(6),
  cons: z.array(z.string().min(10)).min(3).max(6),
  idealFor: z.array(z.string().min(5)).min(1),
  notIdealFor: z.array(z.string().min(5)).min(1),
  verdict: z.string().min(40).optional(),
  review: reviewSchema.optional(),
  rating: ratingSchema.nullable().default(null),
  logo: z
    .strictObject({
      file: z.string().regex(/^\/logos\/.+\.(svg|png|webp)$/),
      /** Intrinsic size of the file, so the logo keeps its aspect ratio. */
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      sourceUrl: httpsUrlSchema,
      accessed: isoDateSchema,
    })
    .optional(),
});
export type Software = z.infer<typeof softwareSchema>;

// ---------------------------------------------------------------------------------------------
// Comparison, affiliate link, guide

export const comparisonSchema = z.strictObject({
  slug: slugSchema,
  software: z.array(slugSchema).min(2).max(3),
  centralQuestion: z.string().min(10),
  verdict: z.string().min(40),
  status: statusSchema,
  lastReviewed: isoDateSchema,
  author: slugSchema,
});
export type Comparison = z.infer<typeof comparisonSchema>;

const LINK_SHORTENERS =
  /^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|rebrand\.ly|shorturl\.at)$/i;

export const affiliateLinkSchema = z.strictObject({
  software: slugSchema,
  network: z.string().min(2),
  targetUrl: httpsUrlSchema.refine((url) => !LINK_SHORTENERS.test(new URL(url).hostname), {
    message: "Keine Linkverkürzer als Affiliate-Ziel.",
  }),
  subIdParam: z.string().regex(/^[a-zA-Z0-9_]+$/),
  active: z.boolean(),
  added: isoDateSchema,
  checked: isoDateSchema,
});
export type AffiliateLink = z.infer<typeof affiliateLinkSchema>;

/** Thumbnail drawn in code from the brand palette (Section 13.11: no stock or AI images). */
export const guideThumbnailSchema = z.strictObject({
  tone: z.enum(["primary", "ink", "tint"]),
  /** Small uppercase line above the headline, e.g. the vendor or the topic. */
  kicker: z.string().min(2).max(32),
  /** Two to five words, set large on the thumbnail. */
  headline: z.string().min(3).max(44),
  art: z.enum(["rayburst", "nestedsquares", "lattice", "stacklines", "arcs"]),
  /** Software slugs whose real logos appear on white plates. */
  logos: z.array(slugSchema).max(4).default([]),
});

/**
 * Ratgeber article, written from the sourced profiles and primary legal sources. Like the
 * profile reviews, every section names the pages it is based on.
 */
export const guideSchema = z.strictObject({
  slug: slugSchema,
  title: z.string().min(10).max(90),
  /** Also the meta description. */
  description: z.string().min(50).max(155),
  centralQuestion: z.string().min(10),
  topic: z.string().min(2),
  tags: z.array(z.string().min(2).max(40)).min(1).max(4),
  status: statusSchema,
  published: isoDateSchema,
  updated: isoDateSchema,
  author: slugSchema.nullable(),
  reviewer: slugSchema.nullable().default(null),
  thumbnail: guideThumbnailSchema,
  intro: z.string().min(80),
  sections: z
    .array(
      z.strictObject({
        id: slugSchema,
        title: z.string().min(3),
        paragraphs: z.array(z.string().min(40)).min(1),
        points: z.array(z.string().min(5)).optional(),
        /** Software discussed in this section, shown as compact cards below it. */
        software: z.array(slugSchema).optional(),
        sources: z.array(sourceSchema).min(1),
      }),
    )
    .min(3),
  /** Software the article recommends looking at, shown at the end with both actions. */
  software: z.array(slugSchema).default([]),
  sources: z.array(sourceSchema).min(1),
});
export type Guide = z.infer<typeof guideSchema>;

// ---------------------------------------------------------------------------------------------
// Glossary

export const glossaryTermSchema = z.strictObject({
  slug: slugSchema,
  term: z.string().min(2),
  /** One sentence, also the meta description. */
  short: z.string().min(30).max(155),
  definition: z.string().min(80),
  status: statusSchema,
  lastReviewed: isoDateSchema,
  author: slugSchema.nullable(),
  related: z.array(slugSchema).default([]),
  sources: z.array(sourceSchema).min(1),
});
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;
