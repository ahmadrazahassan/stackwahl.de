// Editorial score (docs/PLAN.md, approved weights). Pure functions, unit tested.

export type WeightedValue = { value: number; weight: number };

export const SCORE_CRITERIA = [
  { key: "funktionen", label: "Funktionsumfang", weight: 0.25 },
  { key: "bedienung", label: "Bedienung", weight: 0.2 },
  { key: "preisLeistung", label: "Preis-Leistung", weight: 0.2 },
  { key: "rechtssicherheit", label: "Rechtssicherheit in Deutschland", weight: 0.2 },
  { key: "supportDatenschutz", label: "Support und Datenschutz", weight: 0.15 },
] as const;

/** Weighted total on the 0 to 10 scale. Throws when weights do not add up to 100 %. */
export function weightedScore(criteria: readonly WeightedValue[]): number {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  if (Math.abs(totalWeight - 1) > 1e-9) {
    throw new Error(`Gewichte müssen 100 % ergeben, sind aber ${Math.round(totalWeight * 100)} %.`);
  }
  for (const c of criteria) {
    if (c.value < 0 || c.value > 10)
      throw new Error(`Teilwertung außerhalb von 0 bis 10: ${c.value}`);
  }
  return criteria.reduce((sum, c) => sum + c.value * c.weight, 0);
}
