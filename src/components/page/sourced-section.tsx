import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Prose } from "@/components/ui/typography";
import type { Source } from "@/content/schemas";
import { formatDate } from "@/lib/format";

/** External source link that says it opens a new tab. */
export function SourceLink({ source }: { source: Source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener"
      className="inline-flex items-center gap-1 underline decoration-1 underline-offset-4 hover:text-primary"
    >
      {source.title}
      <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}

/** Every source once, with its access date. */
export function SourceList({ sources }: { sources: Source[] }) {
  const unique = sources.filter((s, i, list) => list.findIndex((o) => o.url === s.url) === i);
  return (
    <ul className="flex flex-col">
      {unique.map((source) => (
        <li
          key={source.url}
          className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-line py-2 text-small"
        >
          <SourceLink source={source} />
          <span className="text-muted">abgerufen am {formatDate(source.accessed)}</span>
        </li>
      ))}
    </ul>
  );
}

/** A text section with paragraphs, optional points and the sources it is based on. */
export function SourcedSection({
  section,
  children,
}: {
  section: {
    id: string;
    title: string;
    paragraphs: string[];
    points?: string[];
    sources: Source[];
  };
  children?: ReactNode;
}) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-titel`}
      className="scroll-mt-24 border-b border-line py-12 last:border-b-0"
    >
      <h2 id={`${section.id}-titel`} className="max-w-[30ch] text-h2 text-balance">
        {section.title}
      </h2>
      <Prose className="mt-6">
        {section.paragraphs.map((paragraph, i) => (
          <p key={`${section.id}-${i}`}>{paragraph}</p>
        ))}
      </Prose>
      {section.points ? (
        <ul className="mt-6 flex max-w-[68ch] flex-col gap-3 text-body">
          {section.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-primary" />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      {children}
      <div className="mt-8 text-small text-muted">
        <p>Grundlage dieses Abschnitts:</p>
        <ul className="mt-1 flex flex-col">
          {section.sources.map((source) => (
            <li key={source.url}>
              <SourceLink source={source} />
              <span>, abgerufen am {formatDate(source.accessed)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
