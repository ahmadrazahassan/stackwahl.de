// Client-safe types for the home page comparison (src/lib/content/home.ts is server-only).

import type { FactStatus } from "@/content/schemas";

export type CompareRowKey =
  | "eRechnungVersand"
  | "eRechnungEmpfang"
  | "datevExport"
  | "elster"
  | "gobd"
  | "serverstandort"
  | "angebote"
  | "mahnwesen"
  | "belegerfassungOcr"
  | "bankabgleich"
  | "euer"
  | "bilanz"
  | "lohn"
  | "lager"
  | "steuerberaterzugang"
  | "mobileApp";

export type CompareProduct = {
  slug: string;
  name: string;
  category: string;
  logo?: { src: string; alt: string; width: number; height: number };
  /** Recherche-Wertung against the main category, or null. */
  research: number | null;
  /** Cheapest paid plan per month, net, for the minimum number of seats. */
  entry: { cents: number; perUser: boolean; seats: number; plan: string } | null;
  freePlan: boolean;
  freeTrialDays: number | null;
  facts: Record<CompareRowKey, FactStatus>;
  profileHref: string;
  pricingHref: string;
  vendor: { href: string; affiliate: boolean; host: string };
};

export type ComparePreset = { label: string; slugs: string[] };
