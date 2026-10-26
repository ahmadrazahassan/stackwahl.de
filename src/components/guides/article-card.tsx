import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ArticleTeaser } from "@/lib/content/guides";
import { formatDate } from "@/lib/format";
import { ArticleThumbnail } from "./article-thumbnail";

/** Ratgeber card: thumbnail, topic, date and reading time, title, short description. */
export function ArticleCard({
  article,
  headingLevel = 3,
  className,
}: {
  article: ArticleTeaser;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={cn("group relative flex h-full flex-col", className)}>
      <ArticleThumbnail
        thumbnail={article.thumbnail}
        tags={article.tags}
        logos={article.logos}
        className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      />
      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
        <span className="eyebrow text-ink">{article.tags[0]}</span>
        <time dateTime={article.published} className="tabular">
          {formatDate(article.published)}
        </time>
        <span aria-hidden="true">·</span>
        <span className="tabular">{article.minutes} Min. Lesezeit</span>
      </p>
      <Heading className="mt-3 text-h3 text-balance">
        <Link
          href={article.href}
          className="underline-offset-4 group-hover:underline after:absolute after:inset-0"
        >
          {article.title}
        </Link>
      </Heading>
      <p className="mt-3 text-small text-muted">{article.description}</p>
    </article>
  );
}

export function ArticleGrid({
  articles,
  headingLevel = 3,
  className,
}: {
  articles: ArticleTeaser[];
  headingLevel?: 2 | 3;
  className?: string;
}) {
  if (articles.length === 0) return null;
  return (
    <ul className={cn("grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3", className)}>
      {articles.map((article) => (
        <li key={article.slug}>
          <ArticleCard article={article} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
