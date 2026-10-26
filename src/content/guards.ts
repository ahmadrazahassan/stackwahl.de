import { checkCopy, TEST_CLAIM } from "./copy-rules.ts";
import type {
  AffiliateLink,
  Author,
  Category,
  Comparison,
  GlossaryTerm,
  Guide,
  Software,
  Source,
  UseCase,
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
  useCases: UseCase[];
  affiliateLinks: AffiliateLink[];
  guides: Guide[];
  glossary: GlossaryTerm[];
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
    | "unavailable-without-note"
    | "logo-asset"
    | "media-asset";
  where: string;
  message: string;
};

export type GuardOptions = {
  /** ISO date of the build in UTC. */
  today: string;
  /** Production build: stale data on published pages is an error, not a warning. */
  production: boolean;
  /** Paths under public/ (for example "/logos/sevdesk.svg"). Omit to skip the asset check. */
  publicFiles?: ReadonlySet<string>;
  /** Text of docs/LOGOS.md. Every logo file must be listed there with its source. */
  logosDoc?: string;
  /** Text of docs/MEDIA.md. Every screenshot file and video must be listed there with its source. */
  mediaDoc?: string;
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
  s.review?.sections.forEach((section) =>
    section.sources.forEach((source, i) =>
      list.push({ where: `review.${section.id}.sources[${i}]`, source, kind: "fact" }),
    ),
  );
  s.videos.forEach((v, i) => list.push({ where: `videos[${i}]`, source: v.source, kind: "fact" }));
  s.screenshots.forEach((shot, i) =>
    list.push({ where: `screenshots[${i}]`, source: shot.source, kind: "fact" }),
  );
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
  issues.push(
    ...duplicates(
      "glossary",
      content.glossary.map((t) => t.slug),
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
      ...(s.review?.sections.flatMap((section) => [section.title, ...section.paragraphs]) ?? []),
      ...s.pros,
      ...s.cons,
      ...s.idealFor,
      ...s.notIdealFor,
      ...s.plans.flatMap((p) => [p.note, ...p.includes]),
      ...Object.values(s.compliance).map((f) => f.note),
      ...Object.values(s.features).map((f) => f?.note),
      ...s.screenshots.flatMap((shot) => [shot.alt, shot.caption]),
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
    if (s.logo) {
      issues.push(...futureDate(`${at}.logo.accessed`, s.logo.accessed, today));
      if (options.publicFiles && !options.publicFiles.has(s.logo.file)) {
        issues.push({
          severity: "error",
          code: "logo-asset",
          where: `${at}.logo`,
          message: `Logodatei ${s.logo.file} fehlt in public/.`,
        });
      }
      if (options.logosDoc !== undefined && !options.logosDoc.includes(s.logo.file)) {
        issues.push({
          severity: "error",
          code: "logo-asset",
          where: `${at}.logo`,
          message: `Logo ${s.logo.file} ist nicht mit Quelle in docs/LOGOS.md eingetragen.`,
        });
      }
    }
    s.screenshots.forEach((shot, i) => {
      if (options.publicFiles && !options.publicFiles.has(shot.file)) {
        issues.push({
          severity: "error",
          code: "media-asset",
          where: `${at}.screenshots[${i}]`,
          message: `Screenshot ${shot.file} fehlt in public/.`,
        });
      }
      if (!shot.file.startsWith(`/screenshots/${s.slug}/`)) {
        issues.push({
          severity: "error",
          code: "media-asset",
          where: `${at}.screenshots[${i}]`,
          message: `Screenshot gehört nach /screenshots/${s.slug}/.`,
        });
      }
      if (options.mediaDoc !== undefined && !options.mediaDoc.includes(shot.file)) {
        issues.push({
          severity: "error",
          code: "media-asset",
          where: `${at}.screenshots[${i}]`,
          message: `Screenshot ${shot.file} ist nicht mit Quelle in docs/MEDIA.md eingetragen.`,
        });
      }
    });
    s.videos.forEach((v, i) => {
      if (options.mediaDoc !== undefined && !options.mediaDoc.includes(v.id)) {
        issues.push({
          severity: "error",
          code: "media-asset",
          where: `${at}.videos[${i}]`,
          message: `Video ${v.id} ist nicht mit Quelle in docs/MEDIA.md eingetragen.`,
        });
      }
    });
    if (s.marketAvailability.status !== "verfuegbar" && !s.marketAvailability.note) {
      issues.push({
        severity: "error",
        code: "unavailable-without-note",
        where: `${at}.marketAvailability`,
        message: "Eingeschränkte Verfügbarkeit in Deutschland braucht eine Erklärung.",
      });
    }
  }

  // Comparisons and use cases follow the same rules as guides: sources with past dates,
  // resolvable references, copy rules, no test claims and a real responsible person.
  const editorial = (
    at: string,
    item: {
      status: "draft" | "published";
      author: string | null;
      published: string;
      updated: string;
      sources: Source[];
      sections: { sources: Source[] }[];
    },
    slugs: string[],
    texts: string[],
  ) => {
    issues.push(...reference(`${at}.author`, "Autor", item.author, authors));
    issues.push(...futureDate(`${at}.published`, item.published, today));
    issues.push(...futureDate(`${at}.updated`, item.updated, today));
    [...item.sources, ...item.sections.flatMap((s) => s.sources)].forEach((src, i) =>
      issues.push(...futureDate(`${at}.sources[${i}]`, src.accessed, today)),
    );
    slugs.forEach((slug) =>
      issues.push(...reference(`${at}.software`, "Software", slug, software)),
    );
    issues.push(...copyIssues(at, texts));
    for (const text of texts) {
      if (TEST_CLAIM.test(text)) {
        issues.push({
          severity: "error",
          code: "test-claim",
          where: at,
          message: `Testaussage ohne dokumentierten Test: „${text.slice(0, 60)}“`,
        });
      }
    }
    if (item.status === "published" && !item.author) {
      issues.push({
        severity: "error",
        code: "missing-author",
        where: at,
        message: "Veröffentlicht ohne echte Autorin oder echten Autor.",
      });
    }
  };
  const sectionTexts = (sections: Comparison["sections"]) =>
    sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.points ?? [])]);

  for (const c of content.comparisons) {
    const at = `comparisons/${c.slug}`;
    editorial(
      at,
      c,
      [...c.software, ...c.choose.map((x) => x.software)],
      [
        c.title,
        c.description,
        c.centralQuestion,
        c.intro,
        c.verdict,
        ...sectionTexts(c.sections),
        ...c.choose.flatMap((x) => x.reasons),
      ],
    );
    if (c.choose.some((x) => !c.software.includes(x.software))) {
      issues.push({
        severity: "error",
        code: "unresolved-reference",
        where: `${at}.choose`,
        message: "„Wählen Sie …“ nennt ein Programm, das nicht verglichen wird.",
      });
    }
  }

  const guideSlugs = new Set(content.guides.map((g) => g.slug));
  const comparisonSlugs = new Set(content.comparisons.map((c) => c.slug));
  const categorySlugs = new Set(content.categories.map((c) => c.slug));
  for (const u of content.useCases) {
    const at = `use-cases/${u.slug}`;
    editorial(
      at,
      u,
      [],
      [
        u.title,
        u.description,
        u.label,
        u.centralQuestion,
        u.intro,
        u.rule.explanation,
        ...sectionTexts(u.sections),
      ],
    );
    u.related.guides.forEach((g) =>
      issues.push(...reference(`${at}.related`, "Ratgeber", g, guideSlugs)),
    );
    u.related.comparisons.forEach((c) =>
      issues.push(...reference(`${at}.related`, "Vergleich", c, comparisonSlugs)),
    );
    (u.rule.categories ?? []).forEach((c) =>
      issues.push(...reference(`${at}.rule`, "Kategorie", c, categorySlugs)),
    );
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
    const guideSources = [...g.sources, ...g.sections.flatMap((s) => s.sources)];
    guideSources.forEach((src, i) =>
      issues.push(...futureDate(`${at}.sources[${i}]`, src.accessed, today)),
    );
    const slugs = [
      ...g.thumbnail.logos,
      ...g.software,
      ...g.sections.flatMap((s) => s.software ?? []),
    ];
    slugs.forEach((slug) =>
      issues.push(...reference(`${at}.software`, "Software", slug, software)),
    );
    const texts = [
      g.title,
      g.description,
      g.centralQuestion,
      g.intro,
      g.thumbnail.kicker,
      g.thumbnail.headline,
      ...g.tags,
      ...g.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.points ?? [])]),
    ];
    issues.push(...copyIssues(at, texts));
    for (const text of texts) {
      if (TEST_CLAIM.test(text)) {
        issues.push({
          severity: "error",
          code: "test-claim",
          where: at,
          message: `Testaussage ohne dokumentierten Test: „${text.slice(0, 60)}“`,
        });
      }
    }
    if (g.status === "published" && !g.author) {
      issues.push({
        severity: "error",
        code: "missing-author",
        where: at,
        message: "Veröffentlicht ohne echte Autorin oder echten Autor.",
      });
    }
  }

  const terms = new Set(content.glossary.map((t) => t.slug));
  for (const t of content.glossary) {
    const at = `glossary/${t.slug}`;
    issues.push(...reference(`${at}.author`, "Autor", t.author, authors));
    t.related.forEach((r) => issues.push(...reference(`${at}.related`, "Begriff", r, terms)));
    issues.push(...futureDate(`${at}.lastReviewed`, t.lastReviewed, today));
    t.sources.forEach((src, i) =>
      issues.push(...futureDate(`${at}.sources[${i}]`, src.accessed, today)),
    );
    issues.push(...copyIssues(at, [t.term, t.short, t.definition]));
    if (t.status === "published" && !t.author) {
      issues.push({
        severity: "error",
        code: "missing-author",
        where: at,
        message: "Veröffentlicht ohne echte Autorin oder echten Autor.",
      });
    }
  }

  for (const c of content.categories) {
    issues.push(...copyIssues(`categories/${c.slug}`, [c.name, c.description, c.intro]));
  }

  return issues;
}
