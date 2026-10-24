import { checkCopy, TEST_CLAIM } from "./copy-rules.ts";
import type {
  AffiliateLink,
  Author,
  Category,
  Comparison,
  Guide,
  Software,
  Source,
  Vendor,
} from "./schemas.ts";

// Build guards (docs/BUILD_PROMPT.md, Section 6): rules that must never break. Pure functions
// over parsed content, so every guard is proven by a unit test.

export type ContentSet = {
  vendors: Vendor[];
  categories: Category[];
  software: Software[];
  authors: Author[];
  comparisons: Comparison[];
  affiliateLinks: AffiliateLink[];
  guides: Guide[];
};

export type Issue = {
  severity: "error" | "warning";
  code:
    | "duplicate-slug"
    | "unresolved-reference"
    | "future-date"
    | "stale-price"
    | "stale-fact"
    | "copy"
    | "test-claim"
    | "unverified-published"
    | "missing-author"
    | "unavailable-without-note";
  where: string;
  message: string;
};

export type GuardOptions = {
  /** ISO date of the build in UTC. */
  today: string;
  /** Production build: stale data on published pages is an error, not a warning. */
  production: boolean;
};

export const PRICE_MAX_AGE_DAYS = 90;
export const FACT_MAX_AGE_DAYS = 180;

function daysBetween(fromIso: string, toIso: string): number {
  return Math.round(
    (Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86_400_000,
  );
}

/** Today's date in UTC, independent of the build server's time zone. */
export function utcToday(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function duplicates(collection: string, slugs: string[]): Issue[] {
  const seen = new Set<string>();
  const issues: Issue[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) {
      issues.push({
        severity: "error",
        code: "duplicate-slug",
        where: `${collection}/${slug}`,
        message: `Slug „${slug}“ kommt in ${collection} mehrfach vor.`,
      });
    }
    seen.add(slug);
  }
  return issues;
}

function reference(
  where: string,
  target: string,
  slug: string | null | undefined,
  known: Set<string>,
): Issue[] {
  if (slug == null || known.has(slug)) return [];
  return [
    {
      severity: "error",
      code: "unresolved-reference",
      where,
      message: `Verweis auf ${target} „${slug}“ existiert nicht.`,
    },
  ];
}

function futureDate(where: string, date: string, today: string): Issue[] {
  return date > today
    ? [
        {
          severity: "error",
          code: "future-date",
          where,
          message: `Datum ${date} liegt in der Zukunft (heute ${today}, UTC).`,
        },
      ]
    : [];
}

function copyIssues(where: string, texts: Array<string | undefined>): Issue[] {
  return texts.flatMap((text) =>
    text
      ? checkCopy(text).map((rule) => ({
          severity: "error" as const,
          code: "copy" as const,
          where,
          message: `${rule.message} („${text.slice(0, 60)}“)`,
        }))
      : [],
  );
}

function softwareSources(
  s: Software,
): Array<{ where: string; source: Source; kind: "price" | "fact" }> {
  const list: Array<{ where: string; source: Source; kind: "price" | "fact" }> = [];
  s.plans.forEach((p, i) =>
    list.push({ where: `plans[${i}] ${p.name}`, source: p.source, kind: "price" }),
  );
  for (const [key, fact] of Object.entries(s.compliance)) {
    if (fact.source) list.push({ where: `compliance.${key}`, source: fact.source, kind: "fact" });
  }
  for (const [key, fact] of Object.entries(s.features)) {
    if (fact?.source) list.push({ where: `features.${key}`, source: fact.source, kind: "fact" });
  }
  list.push({ where: "marketAvailability", source: s.marketAvailability.source, kind: "fact" });
  if (s.trialSource) list.push({ where: "trialSource", source: s.trialSource, kind: "fact" });
  return list;
}

export function checkContent(content: ContentSet, options: GuardOptions): Issue[] {
  const { today, production } = options;
  const issues: Issue[] = [];

  issues.push(
    ...duplicates(
      "vendors",
      content.vendors.map((v) => v.slug),
    ),
  );
  issues.push(
    ...duplicates(
      "categories",
      content.categories.map((c) => c.slug),
    ),
  );
  issues.push(
    ...duplicates(
      "software",
      content.software.map((s) => s.slug),
    ),
  );
  issues.push(
    ...duplicates(
      "authors",
      content.authors.map((a) => a.slug),
    ),
  );
  issues.push(
    ...duplicates(
      "comparisons",
      content.comparisons.map((c) => c.slug),
    ),
  );
  issues.push(
    ...duplicates(
      "guides",
      content.guides.map((g) => g.slug),
    ),
  );

  const vendors = new Set(content.vendors.map((v) => v.slug));
  const categories = new Set(content.categories.map((c) => c.slug));
  const software = new Set(content.software.map((s) => s.slug));
  const authors = new Set(content.authors.map((a) => a.slug));

  for (const s of content.software) {
    const at = `software/${s.slug}`;
    const published = s.status === "published";

    issues.push(...reference(`${at}.vendor`, "Anbieter", s.vendor, vendors));
    s.categories.forEach((c) =>
      issues.push(...reference(`${at}.categories`, "Kategorie", c, categories)),
    );
    issues.push(...reference(`${at}.author`, "Autor", s.author, authors));
    issues.push(...reference(`${at}.reviewer`, "Prüfer", s.reviewer, authors));
    if (s.rating)
      issues.push(
        ...reference(`${at}.rating.test.tester`, "Tester", s.rating.test.tester, authors),
      );

    issues.push(...futureDate(`${at}.lastReviewed`, s.lastReviewed, today));
    if (s.rating) {
      issues.push(...futureDate(`${at}.rating.date`, s.rating.date, today));
      issues.push(...futureDate(`${at}.rating.test.date`, s.rating.test.date, today));
    }

    for (const { where, source, kind } of softwareSources(s)) {
      issues.push(...futureDate(`${at}.${where}`, source.accessed, today));
      const age = daysBetween(source.accessed, today);
      const max = kind === "price" ? PRICE_MAX_AGE_DAYS : FACT_MAX_AGE_DAYS;
      if (age > max) {
        issues.push({
          severity: production && published ? "error" : "warning",
          code: kind === "price" ? "stale-price" : "stale-fact",
          where: `${at}.${where}`,
          message: `${kind === "price" ? "Preis" : "Angabe"} zuletzt am ${source.accessed} geprüft (${age} Tage, erlaubt ${max}).`,
        });
      }
    }

    const texts = [
      s.summary,
      s.verdict,
      s.marketAvailability.note,
      ...s.pros,
      ...s.cons,
      ...s.idealFor,
      ...s.notIdealFor,
      ...s.plans.flatMap((p) => [p.note, ...p.includes]),
      ...Object.values(s.compliance).map((f) => f.note),
      ...Object.values(s.features).map((f) => f?.note),
    ];
    issues.push(...copyIssues(at, texts));

    if (!s.rating) {
      for (const text of texts) {
        if (text && TEST_CLAIM.test(text)) {
          issues.push({
            severity: "error",
            code: "test-claim",
            where: at,
            message: `Testaussage ohne dokumentierten Test: „${text.slice(0, 60)}“`,
          });
        }
      }
    }

    if (published && s.verification !== "verified") {
      issues.push({
        severity: "error",
        code: "unverified-published",
        where: at,
        message: "Veröffentlicht, aber nicht verifiziert.",
      });
    }
    if (published && !s.author) {
      issues.push({
        severity: "error",
        code: "missing-author",
        where: at,
        message: "Veröffentlicht ohne echte Autorin oder echten Autor.",
      });
    }
    if (s.marketAvailability.status !== "verfuegbar" && !s.marketAvailability.note) {
      issues.push({
        severity: "error",
        code: "unavailable-without-note",
        where: `${at}.marketAvailability`,
        message: "Eingeschränkte Verfügbarkeit in Deutschland braucht eine Erklärung.",
      });
    }
  }

  for (const c of content.comparisons) {
    const at = `comparisons/${c.slug}`;
    c.software.forEach((slug) =>
      issues.push(...reference(`${at}.software`, "Software", slug, software)),
    );
    issues.push(...reference(`${at}.author`, "Autor", c.author, authors));
    issues.push(...futureDate(`${at}.lastReviewed`, c.lastReviewed, today));
    issues.push(...copyIssues(at, [c.centralQuestion, c.verdict]));
  }

  for (const link of content.affiliateLinks) {
    const at = `affiliate/${link.software}`;
    issues.push(...reference(`${at}.software`, "Software", link.software, software));
    issues.push(...futureDate(`${at}.added`, link.added, today));
    issues.push(...futureDate(`${at}.checked`, link.checked, today));
  }

  for (const g of content.guides) {
    const at = `guides/${g.slug}`;
    issues.push(...reference(`${at}.author`, "Autor", g.author, authors));
    issues.push(...reference(`${at}.reviewer`, "Prüfer", g.reviewer, authors));
    issues.push(...futureDate(`${at}.published`, g.published, today));
    issues.push(...futureDate(`${at}.updated`, g.updated, today));
    g.sources.forEach((src, i) =>
      issues.push(...futureDate(`${at}.sources[${i}]`, src.accessed, today)),
    );
    issues.push(...copyIssues(at, [g.title, g.description, g.centralQuestion]));
  }

  for (const c of content.categories) {
    issues.push(...copyIssues(`categories/${c.slug}`, [c.name, c.description, c.intro]));
  }

  return issues;
}
