// Search normalization for German (Section 8, search): case, umlauts, ß and accents.

export function normalizeGerman(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

/** cmdk filter: 1 when every search term occurs in the value or keywords, else 0. */
export function germanFilter(value: string, search: string, keywords?: string[]): number {
  const haystack = normalizeGerman([value, ...(keywords ?? [])].join(" "));
  const terms = normalizeGerman(search).split(/s+/).filter(Boolean);
  return terms.every((t) => haystack.includes(t)) ? 1 : 0;
}
