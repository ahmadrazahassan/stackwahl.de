import Image from "next/image";
import Link from "next/link";
import type { ScreenshotTeaser } from "@/lib/content/home";
import { formatDate } from "@/lib/format";

/**
 * Real screenshots on the home page (press material of the vendors). Same frame for every card,
 * each image shown whole, never cropped. Every image names its source.
 */
export function ScreenshotGallery({ items }: { items: ScreenshotTeaser[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
      {items.map(({ name, vendor, href, shot }) => (
        <li key={shot.file} className="min-w-0">
          <figure className="flex flex-col">
            <Link
              href={href}
              className="group block overflow-hidden rounded-card border border-line bg-surface"
            >
              <Image
                src={shot.file}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[16/10] h-auto w-full object-contain"
              />
              <span className="sr-only">Bilder und Videos im Profil von {name}</span>
            </Link>
            <figcaption className="mt-4 flex flex-col gap-1">
              <Link href={href} className="text-h3 underline-offset-4 hover:underline">
                {name}
              </Link>
              <span className="text-small text-muted">{shot.caption}</span>
              <span className="text-small text-muted">
                {shot.origin === "presse" ? `Pressematerial von ${vendor}` : "Eigener Screenshot"},{" "}
                <a
                  href={shot.source.url}
                  target="_blank"
                  rel="noopener"
                  className="underline decoration-1 underline-offset-4 hover:text-ink"
                >
                  Quelle<span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
                , abgerufen am {formatDate(shot.source.accessed)}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
