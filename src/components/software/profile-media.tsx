import Image from "next/image";
import type { Screenshot, Video } from "@/content/schemas";
import { formatDate } from "@/lib/format";
import { VideoEmbed } from "./video-embed";

/**
 * Screenshots and videos on a profile. Everything here comes from the vendor (press material,
 * official channels), so the section says so and names the source of every image.
 */
export function ProfileMedia({
  name,
  screenshots,
  videos,
}: {
  name: string;
  screenshots: Screenshot[];
  videos: Video[];
}) {
  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-[62ch] rounded-card bg-bg p-5 text-small text-muted">
        Bilder und Videos stammen von {name}. Sie zeigen das Programm so, wie der Anbieter es
        darstellt, und ersetzen keinen eigenen Test. Videos laden erst nach einem Klick.
      </p>

      {screenshots.length > 0 ? (
        <div>
          <h3 className="eyebrow text-muted">Screenshots</h3>
          <ul className="mt-4 grid gap-6 md:grid-cols-2">
            {screenshots.map((shot) => (
              <li key={shot.file} className="min-w-0">
                <figure className="flex flex-col gap-3">
                  <a
                    href={shot.file}
                    target="_blank"
                    rel="noopener"
                    className="block overflow-hidden rounded-card border border-line bg-surface"
                  >
                    <Image
                      src={shot.file}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-auto w-full"
                    />
                    <span className="sr-only"> (Bild in voller Größe, öffnet in neuem Tab)</span>
                  </a>
                  <figcaption className="text-small text-muted">
                    {shot.caption}{" "}
                    <a
                      href={shot.source.url}
                      target="_blank"
                      rel="noopener"
                      className="underline decoration-1 underline-offset-4 hover:text-ink"
                    >
                      {shot.origin === "presse" ? "Quelle: Pressematerial" : "Quelle"}
                      <span className="sr-only"> (öffnet in neuem Tab)</span>
                    </a>
                    , abgerufen am {formatDate(shot.source.accessed)}.
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {videos.length > 0 ? (
        <div>
          <h3 className="eyebrow text-muted">Videos des Anbieters</h3>
          <ul className="mt-4 grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <li key={video.id} className="min-w-0">
                <VideoEmbed
                  provider={video.provider}
                  id={video.id}
                  title={video.originalTitle}
                  channel={video.channel}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
