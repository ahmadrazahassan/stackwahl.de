import "server-only";
import type { Guide } from "@/content/schemas";
import { routes } from "@/lib/routes";
import { getGuides, getSoftware, toSummary, vendorLink } from "./index";

// Ratgeber helpers: thumbnails, teasers, reading time and the software mentioned in an article.

export type ThumbLogo = { src: string; alt: string; width: number; height: number };

export type ArticleTeaser = {
  slug: string;
  href: string;
  title: string;
  description: string;
  tags: string[];
  published: string;
  minutes: number;
  thumbnail: Guide["thumbnail"];
  logos: ThumbLogo[];
};

/** Words of all visible text, at 200 words per minute, at least one minute. */
export function readingMinutes(guide: Guide): number {
  const text = [
    guide.intro,
    ...guide.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.points ?? [])]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export function thumbLogos(slugs: readonly string[]): ThumbLogo[] {
  return slugs.flatMap((slug) => {
    const s = getSoftware(slug);
    if (!s?.logo) return [];
    return [
      { src: s.logo.file, alt: `Logo ${s.name}`, width: s.logo.width, height: s.logo.height },
    ];
  });
}

export function toTeaser(guide: Guide): ArticleTeaser {
  return {
    slug: guide.slug,
    href: routes.guide(guide.slug),
    title: guide.title,
    description: guide.description,
    tags: guide.tags,
    published: guide.published,
    minutes: readingMinutes(guide),
    thumbnail: guide.thumbnail,
    logos: thumbLogos(guide.thumbnail.logos),
  };
}

export function articleTeasers(limit?: number): ArticleTeaser[] {
  const all = getGuides().map(toTeaser);
  return limit ? all.slice(0, limit) : all;
}

/** Articles that share a tag with this one, then the newest others. */
export function relatedArticles(guide: Guide, limit = 3): ArticleTeaser[] {
  const others = getGuides().filter((g) => g.slug !== guide.slug);
  const shared = (g: Guide) => g.tags.filter((t) => guide.tags.includes(t)).length;
  return others
    .map((g, i) => ({ g, score: shared(g), i }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map(({ g }) => toTeaser(g));
}

export type ArticleProduct = ReturnType<typeof articleProduct>;

/** A program mentioned in an article, with the same actions as on the home page. */
export function articleProduct(slug: string, pos: number) {
  const software = getSoftware(slug);
  if (!software) return null;
  return {
    summary: toSummary(software),
    tagline: software.summary,
    vendor: vendorLink(software, "ratgeber", pos),
  };
}
