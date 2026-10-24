import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatPercent, formatScore } from "@/lib/format";
import { isPlaceholder } from "@/lib/placeholders";
import { routes } from "@/lib/routes";
import { weightedScore } from "@/lib/scoring";
import { siteConfig } from "@/site.config";
import type { ScoreCriterion } from "./types";

export const METHOD_VERSION = "1.0";

/** The public score name, or a neutral fallback while `{{SCORE_NAME}}` is open. */
export function scoreName(): string {
  const name = siteConfig.score.name;
  return isPlaceholder(name) ? "Redaktionswertung" : name;
}

/** Large score with one decimal, the score name and the method link (Section 13.6.6). */
export function ScoreDisplay({
  value,
  size = "lg",
  className,
}: {
  value: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      <p
        className={cn(
          "font-display leading-none font-medium tracking-[-0.03em] tabular",
          size === "lg" ? "text-[4rem] sm:text-[5rem]" : "text-[2.25rem]",
        )}
      >
        {formatScore(value)}
        <span className="sr-only"> von 10</span>
      </p>
      <div className="pb-1.5">
        <p className="text-small font-medium">{scoreName()}</p>
        <p className="text-small text-muted">
          von 10 ·{" "}
          <Link
            href={routes.methodology()}
            className="underline decoration-1 underline-offset-4 hover:text-ink"
          >
            Methode {METHOD_VERSION}
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Compact score for cards and tables. */
export function ScoreBadge({ value, className }: { value: number | null; className?: string }) {
  if (value === null) {
    return <span className={cn("text-small text-muted", className)}>Noch nicht bewertet</span>;
  }
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="font-display text-h3 leading-none font-medium tabular">
        {formatScore(value)}
      </span>
      <span className="text-small text-muted">/ 10</span>
    </span>
  );
}

/** Thin bar per criterion with value and weight, plus a table for assistive technology. */
export function ScoreBreakdown({
  criteria,
  className,
}: {
  criteria: ScoreCriterion[];
  className?: string;
}) {
  const total = weightedScore(criteria);
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <ScoreDisplay value={total} />
      <table className="w-full border-collapse text-small">
        <caption className="sr-only">
          Teilwertungen und Gewichtung der {scoreName()}, Gesamt {formatScore(total)} von 10
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Kriterium</th>
            <th scope="col">Gewichtung</th>
            <th scope="col">Wertung</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.label} className="border-t border-line">
              <th scope="row" className="py-4 pr-4 text-left font-normal">
                <span className="block font-medium text-ink">{c.label}</span>
                <span className="mt-2 block h-1 w-full rounded-pill bg-bg" aria-hidden="true">
                  <span
                    className="block h-1 rounded-pill bg-primary"
                    style={{ width: `${c.value * 10}%` }}
                  />
                </span>
              </th>
              <td className="w-20 py-4 text-right align-top text-muted tabular">
                {formatPercent(c.weight)}
              </td>
              <td className="w-14 py-4 text-right align-top font-medium tabular">
                {formatScore(c.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
