import Link from "next/link";
import { getAuthor } from "@/lib/content";
import { routes } from "@/lib/routes";

const link = "underline decoration-1 underline-offset-4 hover:text-ink";

/**
 * "Redaktion Stackwahl · Verantwortlich: Name": the editorial team writes, the managing director
 * is the person responsible for the content (§ 18 Abs. 2 MStV). Nothing without a responsible person.
 */
export function Byline({ author, className }: { author: string | null; className?: string }) {
  const person = getAuthor(author);
  if (!person) return null;
  return (
    <span className={className}>
      <Link href={routes.editorial()} className={link}>
        Redaktion Stackwahl
      </Link>
      {" · Verantwortlich: "}
      <Link href={routes.author(person.slug)} className={link}>
        {person.name}
      </Link>
    </span>
  );
}
