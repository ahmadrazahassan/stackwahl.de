import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

// Shortcuts into the Software-Finder: each situation sets the answers a reader in that
// situation would give, and the result page explains every match. Keys match
// src/components/finder/params.ts.

type Situation = {
  id: string;
  title: string;
  text: string;
  query: Record<string, string>;
};

export const SITUATIONS: Situation[] = [
  {
    id: "kleinunternehmer",
    title: "Ich bin Kleinunternehmer",
    text: "Rechnungen ohne Umsatzsteuer nach § 19 UStG, EÜR und ein kleines Budget.",
    query: { bedarf: "rechnungen", gewinn: "euer", klein: "true", budget: "10" },
  },
  {
    id: "datev",
    title: "Meine Kanzlei arbeitet mit DATEV",
    text: "Belege und Buchungen sollen ohne Umwege bei der Steuerberatung ankommen.",
    query: { bedarf: "rechnungen,belege", datev: "true" },
  },
  {
    id: "elster",
    title: "Ich melde die Umsatzsteuer selbst",
    text: "Buchhaltung mit Umsatzsteuer-Voranmeldung, die direkt per ELSTER übertragen wird.",
    query: { bedarf: "buchhaltung", muss: "elster" },
  },
  {
    id: "bilanz",
    title: "Wir bilanzieren",
    text: "Doppelte Buchführung mit Bilanz und GuV, etwa für GmbH und UG.",
    query: { bedarf: "buchhaltung", gewinn: "bilanz" },
  },
  {
    id: "lager",
    title: "Wir verkaufen Waren",
    text: "Rechnungen, Lager und Bestände in einem System, auch für den Onlinehandel.",
    query: { bedarf: "rechnungen,lager" },
  },
  {
    id: "server",
    title: "Daten müssen in Deutschland liegen",
    text: "Nur Anbieter, die einen Serverstandort in Deutschland oder der EU angeben.",
    query: { bedarf: "rechnungen", muss: "serverDe" },
  },
];

export function situationHref(situation: Situation) {
  return `${routes.finderResults()}?${new URLSearchParams(situation.query).toString()}`;
}

export function SituationLinks() {
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {SITUATIONS.map((situation) => (
        <li key={situation.id}>
          <Link
            href={situationHref(situation)}
            className="group flex h-full items-start justify-between gap-6 rounded-card border border-line bg-surface p-6 transition-colors duration-200 hover:border-ink"
          >
            <span>
              <span className="block text-h3">{situation.title}</span>
              <span className="mt-2 block max-w-[44ch] text-small text-muted">
                {situation.text}
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-1 size-5 shrink-0 text-primary transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
