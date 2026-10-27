"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

// Click-to-load video (Section 3.6): until the visitor clicks, nothing is requested from
// YouTube or Vimeo, not even a thumbnail. The click is the consent for this one video.

export type VideoProvider = "youtube" | "vimeo";

const PROVIDERS: Record<
  VideoProvider,
  { name: string; company: string; embed: (id: string) => string; watch: (id: string) => string }
> = {
  youtube: {
    name: "YouTube",
    company: "Google Ireland Limited",
    // Privacy-enhanced mode: no cookies until playback starts.
    embed: (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    watch: (id) => `https://www.youtube.com/watch?v=${id}`,
  },
  vimeo: {
    name: "Vimeo",
    company: "Vimeo.com, Inc. (USA)",
    // dnt=1: Vimeo does not track the session.
    embed: (id) => `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1`,
    watch: (id) => `https://vimeo.com/${id}`,
  },
};

export function VideoEmbed({
  provider,
  id,
  title,
  channel,
  className,
}: {
  provider: VideoProvider;
  id: string;
  /** The vendor's own title, shown as a quote. */
  title: string;
  channel: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const p = PROVIDERS[provider];
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      {/* The player keeps 16:9; the placeholder grows with its text on narrow screens. */}
      <div
        className={cn(
          "relative overflow-hidden rounded-card bg-ink text-surface",
          loaded ? "aspect-video" : "grid min-h-56",
        )}
      >
        {loaded ? (
          <iframe
            src={p.embed(id)}
            title={`Video: ${title}`}
            className="absolute inset-0 size-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex aspect-video flex-col justify-between gap-4 p-5 sm:p-6">
            <p className="eyebrow text-line">Video von {channel}</p>
            <div className="flex flex-col gap-4">
              <p className="max-w-[40ch] font-display text-h3 text-balance">„{title}“</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Button variant="light" onClick={() => setLoaded(true)}>
                  Video laden<span className="sr-only">: {title}</span>
                </Button>
                <p className="text-small text-line">
                  Lädt Inhalte von {p.name} ({p.company}).{" "}
                  <Link
                    href={`${routes.privacy()}#videos`}
                    className="underline decoration-1 underline-offset-4 hover:text-surface"
                  >
                    Datenschutz
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-small text-muted">
        <span>Video des Anbieters, Kanal {channel}</span>
        <a
          href={p.watch(id)}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center gap-1 underline decoration-1 underline-offset-4 hover:text-ink"
        >
          Auf {p.name} ansehen
          <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          <span className="sr-only"> (öffnet in neuem Tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
