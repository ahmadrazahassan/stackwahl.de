"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState, useQueryStates } from "nuqs";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Must, Need } from "@/lib/finder";
import { routes } from "@/lib/routes";
import { finderParsers, serializeFinder, stepParser } from "./params";

type Option<T extends string> = { value: T; label: string; hint?: string };

const needOptions: Option<Need>[] = [
  { value: "rechnungen", label: "Rechnungen und Angebote schreiben" },
  {
    value: "buchhaltung",
    label: "Buchhaltung selbst erledigen",
    hint: "Einnahmen, Ausgaben, Umsatzsteuer",
  },
  {
    value: "belege",
    label: "Belege digital erfassen",
    hint: "Fotos und PDFs für die Steuerberatung",
  },
  { value: "lohn", label: "Lohnabrechnung" },
  { value: "lager", label: "Lager und Warenwirtschaft" },
];

const mustOptions: Option<Must>[] = [
  { value: "eRechnungEmpfang", label: "E-Rechnungen empfangen und auslesen" },
  { value: "elster", label: "Umsatzsteuer-Voranmeldung per ELSTER" },
  { value: "serverDe", label: "Server in Deutschland oder der EU" },
  { value: "freePlan", label: "Kostenloser Tarif" },
  { value: "trial", label: "Kostenlose Testphase" },
  { value: "mobileApp", label: "Mobile App" },
];

function ChoiceList<T extends string>({
  name,
  options,
  multiple,
  selected,
  onChange,
}: {
  name: string;
  options: Option<T>[];
  multiple: boolean;
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const checked = selected.includes(o.value);
        return (
          <label
            key={o.value}
            className={cn(
              "flex min-h-16 cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors",
              checked
                ? "border-primary bg-primary-tint"
                : "border-line bg-surface hover:border-ink",
            )}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={o.value}
              checked={checked}
              onChange={() =>
                onChange(
                  multiple
                    ? checked
                      ? selected.filter((v) => v !== o.value)
                      : [...selected, o.value]
                    : [o.value],
                )
              }
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                multiple ? "rounded-[0.375rem]" : "rounded-pill",
                checked ? "border-primary bg-primary text-surface" : "border-muted bg-surface",
              )}
            >
              {checked ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
            </span>
            <span>
              <span className="block text-body font-medium">{o.label}</span>
              {o.hint ? <span className="mt-1 block text-small text-muted">{o.hint}</span> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function Step({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-h3">{legend}</legend>
      {hint ? <p className="mt-2 text-small text-muted">{hint}</p> : null}
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

const yesNo: Option<"ja" | "nein">[] = [
  { value: "ja", label: "Ja" },
  { value: "nein", label: "Nein" },
];

/** Six short steps; every answer lives in the URL, so the result can be shared. */
export function Finder() {
  const [state, setState] = useQueryStates(finderParsers, { history: "replace" });
  const [step, setStep] = useQueryState("schritt", stepParser.withOptions({ history: "push" }));
  const router = useRouter();

  const steps = [
    <Step
      key="bedarf"
      legend="Was soll die Software für Sie erledigen?"
      hint="Mehrfachauswahl möglich."
    >
      <ChoiceList
        name="bedarf"
        options={needOptions}
        multiple
        selected={state.bedarf}
        onChange={(v) => setState({ bedarf: v })}
      />
    </Step>,
    <Step
      key="gewinn"
      legend="Wie ermitteln Sie Ihren Gewinn?"
      hint="Freiberufler und kleine Gewerbe nutzen meist die EÜR."
    >
      <ChoiceList
        name="gewinn"
        multiple={false}
        options={[
          { value: "euer", label: "Einnahmen-Überschuss-Rechnung (EÜR)" },
          { value: "bilanz", label: "Bilanz und doppelte Buchführung" },
          { value: "unklar", label: "Weiß ich nicht" },
        ]}
        selected={[state.gewinn]}
        onChange={([v]) => setState({ gewinn: v })}
      />
    </Step>,
    <Step
      key="klein"
      legend="Nutzen Sie die Kleinunternehmerregelung?"
      hint="Nach § 19 UStG ohne Umsatzsteuer auf Rechnungen."
    >
      <ChoiceList
        name="klein"
        multiple={false}
        options={yesNo}
        selected={[state.klein ? "ja" : "nein"]}
        onChange={([v]) => setState({ klein: v === "ja" })}
      />
    </Step>,
    <Step
      key="datev"
      legend="Arbeitet Ihre Steuerberatung mit DATEV?"
      hint="Dann ist ein DATEV-Export Pflicht."
    >
      <ChoiceList
        name="datev"
        multiple={false}
        options={yesNo}
        selected={[state.datev ? "ja" : "nein"]}
        onChange={([v]) => setState({ datev: v === "ja" })}
      />
    </Step>,
    <Step
      key="budget"
      legend="Wie viel darf der Einstieg pro Monat kosten?"
      hint="Netto, also zuzüglich Umsatzsteuer."
    >
      <ChoiceList
        name="budget"
        multiple={false}
        options={[
          { value: "10", label: "Bis 10 €" },
          { value: "25", label: "Bis 25 €" },
          { value: "50", label: "Bis 50 €" },
          { value: "egal", label: "Spielt keine Rolle" },
        ]}
        selected={[state.budget]}
        onChange={([v]) => setState({ budget: v })}
      />
    </Step>,
    <Step
      key="muss"
      legend="Was ist für Sie unverzichtbar?"
      hint="Programme, die das nachweislich nicht können, fallen aus der Auswahl."
    >
      <ChoiceList
        name="muss"
        options={mustOptions}
        multiple
        selected={state.muss}
        onChange={(v) => setState({ muss: v })}
      />
    </Step>,
  ];

  const total = steps.length;
  const current = Math.min(Math.max(step, 1), total);
  const resultHref = `${routes.finderResults()}${serializeFinder(state)}`;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-small font-medium tabular" aria-live="polite">
          Schritt {current} von {total}
        </p>
        <div className="flex gap-1" aria-hidden="true">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn("h-1 w-8 rounded-pill", i < current ? "bg-primary" : "bg-line")}
            />
          ))}
        </div>
      </div>
      <div className="mt-10">{steps[current - 1]}</div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <Button variant="outline" onClick={() => setStep(current - 1)} disabled={current === 1}>
          Zurück
        </Button>
        {current < total ? (
          <Button onClick={() => setStep(current + 1)}>Weiter</Button>
        ) : (
          <ButtonLink
            href={resultHref}
            onClick={async (event) => {
              // nuqs writes the URL shortly after a step change. Navigating before that write
              // lands would let it push the Finder URL back on top of the result page.
              event.preventDefault();
              await setStep(current);
              router.push(resultHref);
            }}
          >
            Ergebnis anzeigen
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
