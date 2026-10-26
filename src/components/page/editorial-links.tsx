import Link from "next/link";
import { cn } from "@/lib/cn";

export type EditorialLink = { href: string; label: string; hint?: string };

/** Hairline list of editorial pages (comparisons, "Software für …"), two columns from sm. */
export function EditorialLinks({
  title,
  links,
  className,
}: {
  title: string;
  links: EditorialLink[];
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className={className}>
      <h3 className="eyebrow text-muted">{title}</h3>
      <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href} className="border-t border-line">
            <Link
              href={link.href}
              className={cn(
                "flex min-h-11 flex-col justify-center py-2 text-small font-medium underline-offset-4 hover:underline",
              )}
            >
              {link.label}
              {link.hint ? <span className="font-normal text-muted">{link.hint}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
