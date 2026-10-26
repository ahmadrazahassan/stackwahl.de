// Order of software on category pages (§ 5b Abs. 2 UWG: main ranking parameters are disclosed
// on the page and on /methodik). Commercial relationships are not an input.

export type Rankable = { name: string; score: number | null; research?: number | null };

export type RankingResult<T> = {
  items: T[];
  /** Plain German explanation shown above the list. */
  explanation: string;
  basis: "score" | "research" | "alphabetical";
};

export function rankSoftware<T extends Rankable>(list: readonly T[]): RankingResult<T> {
  const byName = (a: T, b: T) => a.name.localeCompare(b.name, "de");
  const byValue = (value: (s: T) => number | null | undefined) => {
    const withValue = list.filter((s) => value(s) != null);
    const without = list.filter((s) => value(s) == null).sort(byName);
    const ranked = [...withValue].sort((a, b) => (value(b) ?? 0) - (value(a) ?? 0) || byName(a, b));
    return [...ranked, ...without];
  };

  if (list.some((s) => s.score !== null)) {
    return {
      items: byValue((s) => s.score),
      basis: "score",
      explanation:
        "Sortiert nach unserer Wertung, bei gleicher Wertung nach Name. Programme ohne Praxistest stehen alphabetisch am Ende. Provisionen haben keinen Einfluss.",
    };
  }
  if (list.some((s) => s.research != null)) {
    return {
      items: byValue((s) => s.research),
      basis: "research",
      explanation:
        "Sortiert nach der Recherche-Wertung, bei gleicher Wertung nach Name. Sie entsteht nach fester Formel aus den belegten Angaben und Preisen, ohne Praxistest. Provisionen haben keinen Einfluss.",
    };
  }
  return {
    items: [...list].sort(byName),
    basis: "alphabetical",
    explanation:
      "Sortiert nach Name. Eine Wertung vergeben wir erst nach einem Praxistest, bisher ist keines dieser Programme getestet. Provisionen haben keinen Einfluss.",
  };
}
