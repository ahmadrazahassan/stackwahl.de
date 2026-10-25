// Affiliate redirect logic for /go/[slug] (docs/BUILD_PROMPT.md, Section 8). Pure, unit tested.
// The request carries only whitelisted, non-personal values: where the link sat and its position.

export const PLACEMENTS = [
  "start",
  "kategorie",
  "profil",
  "preise",
  "alternativen",
  "vergleich",
  "finder",
] as const;
export type Placement = (typeof PLACEMENTS)[number];

export type RedirectLink = {
  software: string;
  targetUrl: string;
  subIdParam: string;
  active: boolean;
};

export type RedirectInput = {
  slug: string;
  from: string | null;
  pos: string | null;
  enabled: boolean;
  links: readonly RedirectLink[];
  knownSoftware: ReadonlySet<string>;
};

export type RedirectResult =
  | {
      kind: "partner";
      location: string;
      click: { slug: string; from: Placement | null; pos: number | null };
    }
  | { kind: "profile"; location: string }
  | { kind: "home"; location: string };

export function parsePlacement(value: string | null): Placement | null {
  return PLACEMENTS.includes(value as Placement) ? (value as Placement) : null;
}

export function parsePosition(value: string | null): number | null {
  if (value === null || !/^\d{1,2}$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 && n <= 50 ? n : null;
}

export function resolveRedirect(input: RedirectInput): RedirectResult {
  const { slug, enabled, links, knownSoftware } = input;
  const link = enabled ? links.find((l) => l.software === slug && l.active) : undefined;
  if (link) {
    const from = parsePlacement(input.from);
    const pos = parsePosition(input.pos);
    const url = new URL(link.targetUrl);
    url.searchParams.set(link.subIdParam, [from ?? "unbekannt", pos ?? 0].join("-"));
    return { kind: "partner", location: url.toString(), click: { slug, from, pos } };
  }
  // Inactive or unknown partner: back to our own profile, or home for an unknown slug.
  if (knownSoftware.has(slug)) return { kind: "profile", location: `/software/${slug}` };
  return { kind: "home", location: "/" };
}

/** Headers for every redirect response: never indexed, never cached, no full referrer. */
export const REDIRECT_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
  "Referrer-Policy": "strict-origin-when-cross-origin",
} as const;
