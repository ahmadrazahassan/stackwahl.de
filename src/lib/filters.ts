// Category filters (Section 8). A filter matches only facts that are documented as "ja":
// "Keine Angabe" never passes a filter, so the list never overstates what a product can do.

export const FILTERS = {
  kostenlos: "Kostenloser Tarif",
  test: "Kostenlose Testphase",
  datev: "DATEV-Export",
  erechnung: "E-Rechnung empfangen",
  elster: "UStVA per ELSTER",
  server: "Server in Deutschland oder EU",
} as const;

export type FilterKey = keyof typeof FILTERS;
export const FILTER_KEYS = Object.keys(FILTERS) as FilterKey[];

export type Filterable = { slug: string; flags: Record<FilterKey, boolean> };

export function applyFilters<T extends Filterable>(
  items: readonly T[],
  active: readonly FilterKey[],
): T[] {
  return items.filter((item) => active.every((key) => item.flags[key]));
}
