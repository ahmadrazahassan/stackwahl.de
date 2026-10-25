// Consent (§ 25 TDDDG, DSGVO; docs/BUILD_PROMPT.md, Section 9). Driven by a list of services:
// adding a service that needs consent shows the banner automatically. While the list is empty
// there is no banner, but /cookie-einstellungen stays. Pure functions, unit tested.

export type ConsentService = {
  id: string;
  name: string;
  provider: string;
  purpose: string;
  /** Link to the provider's privacy policy. */
  privacyUrl: string;
};

/**
 * Services that need consent. Currently none: no analytics, no embeds, no marketing tags.
 * Every entry here must also be described in the privacy policy in the same commit.
 */
export const CONSENT_SERVICES: readonly ConsentService[] = [];

export const CONSENT_COOKIE = "stackwahl_einwilligung";

/** Bump when the list or the wording changes, so everyone is asked again. */
export const CONSENT_VERSION = 1;

export type ConsentState = { version: number; granted: string[] };

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as ConsentState;
    if (typeof value.version !== "number" || !Array.isArray(value.granted)) return null;
    return { version: value.version, granted: value.granted.filter((g) => typeof g === "string") };
  } catch {
    return null;
  }
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

/** The banner shows only when services exist and no decision for the current version is stored. */
export function needsDecision(
  services: readonly ConsentService[],
  stored: ConsentState | null,
): boolean {
  return services.length > 0 && (stored === null || stored.version !== CONSENT_VERSION);
}

export function isGranted(serviceId: string, stored: ConsentState | null): boolean {
  return (
    stored !== null && stored.version === CONSENT_VERSION && stored.granted.includes(serviceId)
  );
}

export function decide(
  services: readonly ConsentService[],
  accepted: readonly string[],
): ConsentState {
  const known = new Set(services.map((s) => s.id));
  return { version: CONSENT_VERSION, granted: accepted.filter((id) => known.has(id)) };
}
