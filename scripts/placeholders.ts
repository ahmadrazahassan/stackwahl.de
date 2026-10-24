// Lists every open "{{NAME}}" value in site.config.ts.
import { findPlaceholders } from "../src/lib/placeholders.ts";
import { siteConfig } from "../src/site.config.ts";

const open = findPlaceholders(siteConfig);

if (open.length === 0) {
  console.log("Keine offenen Platzhalter.");
} else {
  console.log(`${open.length} offene Platzhalter in src/site.config.ts:`);
  for (const { path, name } of open) console.log(`  {{${name}}}  ->  ${path}`);
}
