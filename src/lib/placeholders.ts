const PLACEHOLDER = /^\{\{([A-Z0-9_]+)\}\}$/;

export type OpenPlaceholder = { path: string; name: string };

/** Walks any config object and returns every value still written as "{{NAME}}". */
export function findPlaceholders(value: unknown, path = ""): OpenPlaceholder[] {
  if (typeof value === "string") {
    const match = PLACEHOLDER.exec(value);
    return match ? [{ path, name: match[1] }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      findPlaceholders(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

export function isPlaceholder(value: unknown): boolean {
  return typeof value === "string" && PLACEHOLDER.test(value);
}
