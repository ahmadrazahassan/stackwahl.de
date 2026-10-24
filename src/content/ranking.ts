// Order of software on category pages (§ 5b Abs. 2 UWG: main ranking parameters are disclosed
// on the page and on /methodik). Commercial relationships are not an input.

export type Rankable = { name: string; score: number | null };

export type RankingResult<T> = {
  items: T[];
  /** Plain German explanation shown above the list. */
  explanation: string;
  basis: "score" | "alphabetical";
};

export function rankSoftware<T extends Rankable>(list: readonly T[]): RankingResult<T> {
  const byName = (a: T, b: T) => a.name.localeCompare(b.name, "de");
  const scored = list.filter((s) => s.score !== null);
  if (scored.length === 0) {
    return {
      items: [...list].sort(byName),
      basis: "alphabetical",
      explanation:
        "Sortiert nach Name. Eine Wertung vergeben wir erst nach einem Praxistest, bisher ist keines dieser Programme getestet.",
    };
  }
  const unscored = list.filter((s) => s.score === null).sort(byName);
  const ranked = [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || byName(a, b));
  return {
    items: [...ranked, ...unscored],
    basis: "score",
    explanation:
      "Sortiert nach unserer Wertung, bei gleicher Wertung nach Name. Programme ohne Praxistest stehen alphabetisch am Ende.",
  };
}
