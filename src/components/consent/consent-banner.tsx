"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/form";
import {
  CONSENT_COOKIE,
  decide,
  needsDecision,
  parseConsent,
  serializeConsent,
  type ConsentService,
  type ConsentState,
} from "@/lib/consent";
import { routes } from "@/lib/routes";

function readCookie(): ConsentState | null {
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(entry?.slice(CONSENT_COOKIE.length + 1));
}

function writeCookie(state: ConsentState) {
  // Storing the decision itself is technically necessary (§ 25 Abs. 2 Nr. 2 TDDDG).
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(state)}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax; Secure`;
  window.dispatchEvent(new CustomEvent("stackwahl:consent", { detail: state }));
}

/**
 * Banner with equal choices: "Ablehnen" and "Akzeptieren" are the same size and weight, no
 * pre-ticked boxes, no cookie wall (Section 9). Renders nothing while no service needs consent.
 */
export function ConsentBanner({
  services,
  preview = false,
}: {
  services: readonly ConsentService[];
  preview?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);

  useEffect(() => {
    // Reading the cookie is only possible in the browser, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(preview || needsDecision(services, readCookie()));
  }, [services, preview]);

  if (!open || services.length === 0) return null;

  const save = (accepted: string[]) => {
    if (!preview) writeCookie(decide(services, accepted));
    setOpen(false);
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="einwilligung-titel"
      className={
        preview
          ? "rounded-card border border-line bg-surface p-6"
          : "fixed inset-x-3 bottom-3 z-50 rounded-card border border-line bg-surface p-6 shadow-float sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-lg"
      }
    >
      <h2 id="einwilligung-titel" className="text-h3">
        Ihre Einwilligung
      </h2>
      <p className="mt-3 text-small text-muted">
        Wir möchten folgende Dienste nutzen. Sie entscheiden frei; die Website funktioniert auch
        ohne. Ihre Wahl können Sie jederzeit unter{" "}
        <Link
          href={routes.cookieSettings()}
          className="underline decoration-1 underline-offset-4 hover:text-ink"
        >
          Cookie-Einstellungen
        </Link>{" "}
        ändern.
      </p>
      {details ? (
        <ul className="mt-4 flex flex-col gap-3">
          {services.map((s) => (
            <li key={s.id} className="border-t border-line pt-3">
              <Switch
                label={`${s.name} (${s.provider})`}
                checked={chosen.includes(s.id)}
                onCheckedChange={(on) =>
                  setChosen(on ? [...chosen, s.id] : chosen.filter((c) => c !== s.id))
                }
              />
              <p className="text-small text-muted">{s.purpose}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button variant="outline" arrow="none" onClick={() => save([])} className="justify-center">
          Ablehnen
        </Button>
        <Button
          variant="outline"
          arrow="none"
          onClick={() => save(services.map((s) => s.id))}
          className="justify-center"
        >
          Akzeptieren
        </Button>
      </div>
      <div className="mt-2">
        {details ? (
          <Button
            variant="light"
            arrow="none"
            onClick={() => save(chosen)}
            className="w-full justify-center"
          >
            Auswahl speichern
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setDetails(true)}
            className="inline-flex min-h-11 items-center text-small underline decoration-1 underline-offset-4"
          >
            Einzeln auswählen
          </button>
        )}
      </div>
    </section>
  );
}
