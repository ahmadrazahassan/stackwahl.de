import Link from "next/link";
import { MediaFrame, type RealImage } from "@/components/ui/media";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

/**
 * "Fazit der Redaktion" (reference 2): a white card overlapping a real author photo.
 * Only for real editorial verdicts or verified review excerpts, never invented testimonials.
 */
export function VerdictCard({
  quote,
  author,
  role,
  authorHref,
  date,
  photo,
  kind = "editorial",
  className,
}: {
  quote: string;
  author: string;
  role: string;
  authorHref?: string;
  date: string;
  photo?: RealImage;
  kind?: "editorial" | "verifiedReview";
  className?: string;
}) {
  return (
    <figure className={cn("relative grid lg:grid-cols-12 lg:items-center", className)}>
      <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
        <MediaFrame
          image={photo}
          className="aspect-[4/3] lg:aspect-[4/5]"
          missingLabel="Platz für ein echtes Foto der Autorin oder des Autors"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>
      <div className="relative z-10 -mt-16 px-3 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:px-0">
        <div className="rounded-card bg-surface p-6 sm:p-10">
          <p className="eyebrow text-muted">
            {kind === "editorial" ? "Fazit der Redaktion" : "Verifizierte Bewertung"}
          </p>
          <blockquote className="mt-6 font-display text-h3 leading-snug font-normal tracking-[-0.02em] sm:text-h2">
            <p>„{quote}“</p>
          </blockquote>
          <figcaption className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
            <div>
              <p className="text-body font-medium">
                {authorHref ? (
                  <Link href={authorHref} className="underline-offset-4 hover:underline">
                    {author}
                  </Link>
                ) : (
                  author
                )}
              </p>
              <p className="text-small text-muted">{role}</p>
            </div>
            <p className="text-small text-muted">
              <time dateTime={date}>{formatDate(date)}</time>
            </p>
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
