"use client";

import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import type { SearchEntry } from "@/components/layout/command-palette";
import { Field, Input } from "@/components/ui/form";
import { germanFilter } from "@/lib/search";

/** Full search results page (noindex), same index and matching as the command palette. */
export function SearchPage({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace", throttleMs: 200 }),
  );
  const query = q.trim();
  const results = query
    ? entries.filter(
        (e) => germanFilter(`${e.label} ${e.group}`, query, e.hint ? [e.hint] : undefined) === 1,
      )
    : [];
  const groups = [...new Set(results.map((r) => r.group))];

  return (
    <div className="flex flex-col gap-10">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-xl">
        <Field label="Suchbegriff">
          {({ id }) => (
            <Input
              id={id}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="z. B. DATEV, E-Rechnung, sevdesk"
              autoComplete="off"
            />
          )}
        </Field>
      </form>
      <div aria-live="polite">
        {query ? (
          <p className="text-small text-muted">
            {results.length} {results.length === 1 ? "Treffer" : "Treffer"} für „{query}“
          </p>
        ) : null}
        {groups.map((group) => (
          <section key={group} className="mt-8" aria-label={group}>
            <h2 className="eyebrow text-muted">{group}</h2>
            <ul className="mt-3">
              {results
                .filter((r) => r.group === group)
                .map((r) => (
                  <li key={r.href} className="border-t border-line">
                    <Link
                      href={r.href}
                      className="flex min-h-12 items-center justify-between gap-4 py-2 text-body hover:text-primary"
                    >
                      <span>{r.label}</span>
                      {r.hint ? <span className="text-small text-muted">{r.hint}</span> : null}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
