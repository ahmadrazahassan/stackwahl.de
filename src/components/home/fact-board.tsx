import Link from "next/link";
import type { FactList } from "@/lib/content/home";
import { routes } from "@/lib/routes";

/** Three short answers from the data, each item linked to its profile (hairline rows). */
export function FactBoard({ lists }: { lists: FactList[] }) {
  if (lists.length === 0) return null;
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-6">
      {lists.map((list) => (
        <section key={list.id} aria-labelledby={`fakt-${list.id}`} className="min-w-0">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
            <h3 id={`fakt-${list.id}`} className="text-h3">
              {list.title}
            </h3>
            <span className="text-small text-muted tabular">{list.items.length}</span>
          </div>
          <p className="mt-3 text-small text-muted">{list.text}</p>
          <ul className="mt-4">
            {list.items.map((item) => (
              <li key={item.slug} className="border-t border-line first:border-t-0">
                <Link
                  href={routes.software(item.slug)}
                  className="flex min-h-11 items-center justify-between gap-4 py-2 text-body underline-offset-4 hover:underline"
                >
                  <span>{item.name}</span>
                  {item.detail ? (
                    <span className="text-small text-muted tabular">{item.detail}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
