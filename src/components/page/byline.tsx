import Link from "next/link";
import { getAuthor } from "@/lib/content";
import { routes } from "@/lib/routes";

/** "Verantwortlich: Name" with a link to the editor's page, or nothing without an author. */
export function Byline({ author, className }: { author: string | null; className?: string }) {
  const person = getAuthor(author);
  if (!person) return null;
  return (
    <span className={className}>
      Verantwortlich:{" "}
      <Link
        href={routes.author(person.slug)}
        className="underline decoration-1 underline-offset-4 hover:text-ink"
      >
        {person.name}
      </Link>
    </span>
  );
}
