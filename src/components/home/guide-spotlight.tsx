"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand/wordmark";
import { ArticleThumbnail } from "@/components/guides/article-thumbnail";
import { DotDate } from "@/components/ui/dot-date";
import type { ArticleTeaser } from "@/lib/content/guides";
import { cn } from "@/lib/cn";

export type SpotlightArticle = Pick<
  ArticleTeaser,
  "href" | "title" | "description" | "published" | "thumbnail" | "tags" | "logos"
>;

/**
 * Ratgeber on the home page: a frosted glass card over the brand mark at panel scale. The mark
 * behind the card shows blurred, the panel around it sharp. The light mark only reaches below
 * the text, so the white type keeps its contrast. The dots switch between the newest
 * articles; nothing rotates on its own.
 */
export function GuideSpotlight({ articles }: { articles: SpotlightArticle[] }) {
  const [index, setIndex] = useState(0);
  const article = articles[index];
  if (!article) return null;

  return (
    <div className="relative isolate flex min-h-[44rem] items-center justify-center px-4 py-16 sm:min-h-[52rem]">
      <BrandMark className="absolute top-[calc(60%-min(26rem,56vw))] left-[calc(50%-2rem-min(29rem,63vw))] h-[min(26rem,56vw)] w-[min(29rem,63vw)] -rotate-6 text-ink" />
      <BrandMark className="absolute top-[78%] left-[calc(50%+4rem)] h-[min(22rem,48vw)] w-[min(25rem,54vw)] rotate-6 text-surface" />
      <BrandMark className="absolute top-[8%] left-[calc(50%+16rem)] hidden h-28 w-32 rotate-12 text-primary-tint md:block" />

      <article
        aria-roledescription="Karte"
        aria-label={`Artikel ${index + 1} von ${articles.length}`}
        className="relative flex w-[min(100%,26rem)] flex-col rounded-[3rem] border border-glass-line bg-glass p-3 text-surface backdrop-blur-2xl"
      >
        <div aria-live="polite">
          <div key={article.href} className="motion-safe:animate-glass-in">
            <Link href={article.href} tabIndex={-1} aria-hidden="true" className="block">
              <ArticleThumbnail
                thumbnail={article.thumbnail}
                tags={article.tags}
                logos={article.logos}
                className="rounded-[2.25rem]"
              />
            </Link>
            <div className="flex flex-col items-center px-5 sm:px-7">
              <DotDate date={article.published} className="mt-9 block" />
              <blockquote className="mt-7 w-full">
                <p className="-indent-[0.45em] text-[1.2rem] leading-[1.38] tracking-[-0.01em] [text-wrap:wrap]">
                  „{article.description}“
                </p>
                <footer className="mt-4 text-small text-primary-tint">{article.title}</footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 px-5 pt-9 pb-5">
          {articles.length > 1 ? (
            <ul className="flex items-center" aria-label="Artikel wählen">
              {articles.map((a, i) => (
                <li key={a.href}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={i === index ? "true" : undefined}
                    className="group grid size-6 place-items-center"
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-pill transition-colors",
                        i === index ? "bg-surface" : "bg-glass-soft group-hover:bg-surface",
                      )}
                    />
                    <span className="sr-only">
                      Artikel {i + 1}: {a.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href={article.href}
            className="group inline-flex h-14 items-center gap-6 rounded-pill bg-glass-ink pr-2 pl-8 text-body text-surface transition-colors hover:bg-glass-ink-strong"
          >
            Lesen<span className="sr-only">: {article.title}</span>
            <span className="grid size-10 place-items-center rounded-pill bg-glass-ink-strong transition-transform duration-300 group-hover:rotate-90">
              <Plus aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
