import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MediaFrame, type RealImage } from "@/components/ui/media";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

export type GuideTeaser = {
  href: string;
  topic: string;
  title: string;
  excerpt?: string;
  date: string;
  image?: RealImage;
};

function Meta({ topic, date, inverted }: { topic: string; date: string; inverted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-2 eyebrow">
        <span
          aria-hidden="true"
          className={cn("size-1.5", inverted ? "bg-current" : "bg-primary")}
        />
        {topic}
      </p>
      <time dateTime={date} className={cn("text-small tabular", inverted ? "" : "text-muted")}>
        {formatDate(date)}
      </time>
    </div>
  );
}

function ReadMore({ inverted }: { inverted?: boolean }) {
  return (
    <span className="flex min-h-11 items-center justify-between gap-4 text-small font-medium">
      Weiterlesen
      <ArrowRight
        aria-hidden="true"
        className={cn(
          "size-5 transition-transform duration-200 group-hover:translate-x-1",
          inverted ? "" : "text-primary",
        )}
        strokeWidth={1.5}
      />
    </span>
  );
}

/** Newsroom layout from reference 1: one featured card, then up to three small cards. */
export function GuideCards({ guides, className }: { guides: GuideTeaser[]; className?: string }) {
  const [featured, ...rest] = guides;
  if (!featured) return null;
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Link
        href={featured.href}
        className="group grid gap-6 rounded-card bg-surface p-3 sm:p-4 md:grid-cols-2 md:gap-10"
      >
        <MediaFrame image={featured.image} className="aspect-[16/10] h-full" />
        <div className="flex flex-col justify-between gap-10 p-3 md:py-6 md:pr-6">
          <Meta topic={featured.topic} date={featured.date} />
          <div>
            <h3 className="text-h3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
              {featured.title}
            </h3>
            {featured.excerpt ? (
              <p className="mt-4 text-small text-muted">{featured.excerpt}</p>
            ) : null}
          </div>
          <ReadMore />
        </div>
      </Link>
      {rest.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-3">
          {rest.slice(0, 3).map((guide, index) => {
            const inverted = index > 0;
            return (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  className={cn(
                    "group flex h-full min-h-56 flex-col justify-between gap-8 rounded-card p-6",
                    index === 0 && "bg-surface text-ink",
                    index === 1 && "bg-primary text-surface",
                    index === 2 && "bg-ink text-surface",
                  )}
                >
                  <Meta topic={guide.topic} date={guide.date} inverted={inverted} />
                  <h3 className="text-body font-medium group-hover:underline group-hover:underline-offset-4">
                    {guide.title}
                  </h3>
                  <ReadMore inverted={inverted} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
