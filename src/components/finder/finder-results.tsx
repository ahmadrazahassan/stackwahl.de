"use client";

import { Check, CircleHelp, Minus, X } from "lucide-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { ArrowLink, ButtonLink } from "@/components/ui/button";
import type { FactStatus } from "@/content/schemas";
import { cn } from "@/lib/cn";
import {
  matchSoftware,
  shortlist,
  type Check as FinderCheck,
  type FinderProduct,
} from "@/lib/finder";
import { formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/routes";
import { finderParsers, serializeFinder, toAnswers } from "./params";

const statusText: Record<FactStatus, string> = {
  ja: "erfüllt",
  aufpreis: "gegen Aufpreis",
  teilweise: "teilweise",
  unbekannt: "laut Anbieter nicht belegt",
  nein: "nicht erfüllt",
};

function Icon({ status }: { status: FactStatus }) {
  const cls = "mt-0.5 size-4 shrink-0";
  if (status === "ja")
    return <Check aria-hidden="true" strokeWidth={1.75} className={cn(cls, "text-positive")} />;
  if (status === "nein")
    return <X aria-hidden="true" strokeWidth={1.75} className={cn(cls, "text-negative")} />;
  if (status === "unbekannt")
    return <CircleHelp aria-hidden="true" strokeWidth={1.75} className={cn(cls, "text-muted")} />;
  return <Minus aria-hidden="true" strokeWidth={1.75} className={cls} />;
}

function CheckList({ checks }: { checks: FinderCheck[] }) {
  return (
    <ul className="flex flex-col">
      {checks.map((c) => (
        <li key={c.id} className="flex gap-3 border-t border-line py-3 text-small">
          <Icon status={c.status} />
          <span>
            <span className="font-medium">{c.label}</span>
            <span className="text-muted">: {statusText[c.status]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Results of the Software-Finder, computed in the browser from the URL. Nothing is stored. */
export function FinderResults({ products }: { products: FinderProduct[] }) {
  const [state] = useQueryStates(finderParsers);
  const answers = toAnswers(state);
  const editHref = `${routes.finder()}${serializeFinder(state)}`;

  const asked =
    answers.needs.length +
    answers.musts.length +
    Number(answers.datev) +
    Number(answers.kleinunternehmer) +
    Number(answers.budget !== "egal");
  if (asked === 0) {
    return (
      <div>
        <p className="text-lead text-muted">Sie haben noch keine Anforderungen ausgewählt.</p>
        <ButtonLink href={routes.finder()} className="mt-8">
          Zum Software-Finder
        </ButtonLink>
      </div>
    );
  }

  const matches = matchSoftware(products, answers);
  const top = shortlist(matches);
  const others = matches.filter((m) => !top.includes(m));

  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-[62ch] text-small text-muted">
        Die Auswahl beruht nur auf Ihren Antworten und den recherchierten Angaben der Anbieter.
        Provisionen spielen keine Rolle. „Nicht belegt“ heißt: Der Anbieter nennt es auf den
        geprüften Seiten nicht. Prüfen Sie diese Punkte in der Testphase.{" "}
        <Link href={editHref} className="underline decoration-1 underline-offset-4 hover:text-ink">
          Antworten ändern
        </Link>
      </p>

      {top.length > 0 ? (
        <ol className="grid gap-4 lg:grid-cols-3">
          {top.map((m, i) => {
            const fits = m.checks.filter((c) => c.status === "ja");
            const notes = m.checks.filter((c) => c.status !== "ja");
            return (
              <li
                key={m.product.slug}
                className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6"
              >
                <div>
                  <p className="eyebrow text-muted">Platz {i + 1}</p>
                  <h2 className="mt-3 text-h3">
                    <Link
                      href={routes.software(m.product.slug)}
                      className="underline-offset-4 hover:underline"
                    >
                      {m.product.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-small text-muted">{m.product.category}</p>
                  <p className="mt-3 text-small tabular">
                    {m.product.freePlan ? "Kostenloser Tarif verfügbar · " : ""}
                    {m.product.entryPriceCents !== null
                      ? formatPriceFrom(m.product.entryPriceCents)
                      : ""}
                  </p>
                </div>
                <p className="text-small font-medium tabular">
                  {fits.length} von {m.checks.length} Anforderungen erfüllt
                </p>
                {fits.length > 0 ? (
                  <div>
                    <h3 className="eyebrow text-muted">Passt, weil</h3>
                    <CheckList checks={fits} />
                  </div>
                ) : null}
                {notes.length > 0 ? (
                  <div>
                    <h3 className="eyebrow text-muted">Beachten Sie</h3>
                    <CheckList checks={notes} />
                  </div>
                ) : null}
                <ArrowLink href={routes.software(m.product.slug)} className="mt-auto">
                  Zum Profil
                </ArrowLink>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-lead text-muted">
          Kein Programm erfüllt alle unverzichtbaren Punkte nachweislich. Lockern Sie eine
          Anforderung oder prüfen Sie die Programme unten mit „nicht belegt“.
        </p>
      )}

      {others.length > 0 ? (
        <div>
          <h2 className="text-h3">Weitere Programme</h2>
          <ul className="mt-4">
            {others.map((m) => {
              const failed = m.checks.filter((c) => c.must && c.status === "nein");
              return (
                <li
                  key={m.product.slug}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line py-3 text-small"
                >
                  <Link
                    href={routes.software(m.product.slug)}
                    className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline"
                  >
                    {m.product.name}
                  </Link>
                  <span className="text-muted">
                    {failed.length > 0
                      ? `Fällt aus: ${failed.map((c) => c.label).join(", ")}`
                      : `${m.checks.filter((c) => c.status === "ja").length} von ${m.checks.length} erfüllt`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
