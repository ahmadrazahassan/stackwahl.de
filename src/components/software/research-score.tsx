import { Check, CircleHelp, Minus, X } from "lucide-react";
import Link from "next/link";
import type { FactStatus } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { formatEuro, formatPercent, formatScore } from "@/lib/format";
import {
  FREE_PLAN_BONUS,
  POINTS_PER_DOUBLING,
  RESEARCH_METHOD_VERSION,
  RESEARCH_SCORE_NAME,
  type ResearchScore,
} from "@/lib/research-score";
import { routes } from "@/lib/routes";
import { ScoreDisplay } from "./score";

export const researchMethodLink = {
  label: `Methode ${RESEARCH_METHOD_VERSION}`,
  href: `${routes.methodology()}#recherche-wertung`,
};

const statusText: Record<FactStatus, string> = {
  ja: "Ja",
  nein: "Nein",
  teilweise: "Teilweise",
  aufpreis: "Gegen Aufpreis",
  unbekannt: "Keine Angabe",
};

const points = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

function StatusIcon({ status }: { status: FactStatus }) {
  const props = { "aria-hidden": true, strokeWidth: 1.75, className: "mt-0.5 size-4 shrink-0" };
  if (status === "ja") return <Check {...props} className={cn(props.className, "text-positive")} />;
  if (status === "nein") return <X {...props} className={cn(props.className, "text-negative")} />;
  if (status === "unbekannt")
    return <CircleHelp {...props} className={cn(props.className, "text-muted")} />;
  return <Minus {...props} />;
}

function Bar({ value }: { value: number }) {
  return (
    <span className="mt-2 block h-1 w-full rounded-pill bg-bg" aria-hidden="true">
      <span className="block h-1 rounded-pill bg-primary" style={{ width: `${value * 10}%` }} />
    </span>
  );
}

/** Large Recherche-Wertung with name and method link, for headers and cards. */
export function ResearchScoreDisplay({
  value,
  size = "lg",
  className,
}: {
  value: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <ScoreDisplay
      value={value}
      size={size}
      name={RESEARCH_SCORE_NAME}
      method={researchMethodLink}
      className={className}
    />
  );
}

/**
 * Full breakdown: total, every criterion with its weight, the usability criterion that needs a
 * test, and every fact and price the score was computed from.
 */
export function ResearchScoreBreakdown({
  score,
  categoryName,
  className,
}: {
  score: ResearchScore;
  categoryName: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <ResearchScoreDisplay value={score.total} />
          <p className="rounded-card bg-bg p-5 text-small text-muted">
            Berechnet nach fester Formel aus den belegten Angaben und Preisen in diesem Profil,
            gemessen an den Anforderungen der Kategorie {categoryName}. Ohne Praxistest, deshalb
            fehlt die Bedienung. Provisionen haben keinen Einfluss.{" "}
            <Link
              href={researchMethodLink.href}
              className="underline decoration-1 underline-offset-4 hover:text-ink"
            >
              So rechnen wir
            </Link>
          </p>
        </div>
        <table className="w-full border-collapse text-small lg:col-span-7">
          <caption className="sr-only">
            Teilwertungen und Gewichtung der {RESEARCH_SCORE_NAME}, Gesamt{" "}
            {formatScore(score.total)} von 10
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Kriterium</th>
              <th scope="col">Gewichtung</th>
              <th scope="col">Wertung</th>
            </tr>
          </thead>
          <tbody>
            {score.criteria.map((c) => (
              <tr key={c.key} className="border-t border-line">
                <th scope="row" className="py-4 pr-4 text-left font-normal">
                  <span className="block font-medium text-ink">{c.label}</span>
                  <Bar value={c.value} />
                </th>
                <td className="w-20 py-4 text-right align-top text-muted tabular">
                  {formatPercent(c.weight)}
                </td>
                <td className="w-14 py-4 text-right align-top font-medium tabular">
                  {formatScore(c.value)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-line">
              <th scope="row" className="py-4 pr-4 text-left font-normal">
                <span className="block font-medium text-ink">Bedienung</span>
                <span className="mt-1 block text-muted">Erst nach einem Praxistest</span>
              </th>
              <td className="w-20 py-4 text-right align-top text-muted">–</td>
              <td className="w-14 py-4 text-right align-top text-muted">–</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        {score.criteria.map((c) => (
          <section key={c.key} aria-labelledby={`wertung-${c.key}`}>
            <h3 id={`wertung-${c.key}`} className="flex items-baseline justify-between gap-4">
              <span className="eyebrow text-muted">{c.label}</span>
              <span className="text-small font-medium tabular">{formatScore(c.value)} von 10</span>
            </h3>
            {c.key === "preis" ? (
              <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4 text-small">
                <p>
                  {score.entry ? (
                    <>
                      Günstigster bezahlter Tarif:{" "}
                      <span className="font-medium">{score.entry.planName}</span>,{" "}
                      <span className="tabular">
                        {formatEuro(score.entry.monthlyNetCents)} netto im Monat
                      </span>
                      {score.entry.seats > 1
                        ? ` für die Mindestabnahme von ${score.entry.seats} Nutzern`
                        : ""}
                      , bei jährlicher Zahlung, wo angeboten.
                    </>
                  ) : (
                    "Kein bezahlter Tarif mit veröffentlichtem Preis."
                  )}
                </p>
                <p className="text-muted">
                  Volle Punktzahl bis {formatEuro(score.referenceCents)} netto im Monat, jede
                  Verdopplung des Preises kostet {POINTS_PER_DOUBLING} Punkte.
                  {score.freePlan
                    ? ` Für den kostenlosen Tarif gibt es ${FREE_PLAN_BONUS} Punkt dazu, höchstens 10.`
                    : " Einen kostenlosen Tarif gibt es nicht."}
                </p>
              </div>
            ) : (
              <ul className="mt-3">
                {c.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start justify-between gap-4 border-t border-line py-3 text-small"
                  >
                    <span className="flex gap-3">
                      <StatusIcon status={item.status} />
                      <span>
                        {item.label}
                        <span className="text-muted">: {statusText[item.status]}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-muted tabular">
                      {points.format(item.points)} {item.points === 1 ? "Punkt" : "Punkte"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
