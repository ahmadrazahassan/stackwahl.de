import { ExternalLink } from "lucide-react";
import { Prose } from "@/components/ui/typography";
import type { Review } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

/**
 * Long-form profile text. Each section lists the pages it is based on directly below it, so a
 * reader can check every paragraph without scrolling to the source list.
 */
export function ProfileReview({ review, className }: { review: Review; className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <nav aria-label="Abschnitte im Detail" className="mb-10">
        <ol className="flex flex-col gap-1 text-small">
          {review.sections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#detail-${section.id}`}
                className="inline-flex min-h-11 items-center gap-3 underline-offset-4 hover:text-primary hover:underline"
              >
                <span className="w-6 text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {review.sections.map((section) => (
        <section
          key={section.id}
          id={`detail-${section.id}`}
          aria-labelledby={`detail-${section.id}-titel`}
          className="scroll-mt-20 border-t border-line py-10 first-of-type:pt-10"
        >
          <h3 id={`detail-${section.id}-titel`} className="text-h3">
            {section.title}
          </h3>
          <Prose className="mt-5">
            {section.paragraphs.map((paragraph, i) => (
              <p key={`${section.id}-${i}`}>{paragraph}</p>
            ))}
          </Prose>
          <div className="mt-6 text-small text-muted">
            <p>Grundlage dieses Abschnitts:</p>
            <ul className="mt-1 flex flex-col">
              {section.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-1 underline decoration-1 underline-offset-4 hover:text-primary"
                  >
                    {source.title}
                    <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                    <span className="sr-only"> (öffnet in neuem Tab)</span>
                  </a>
                  <span>, abgerufen am {formatDate(source.accessed)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
