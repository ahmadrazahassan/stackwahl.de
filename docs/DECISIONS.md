# Decisions

Format: date, decision, reason, alternatives, when to revisit.

## 24.10.2026: Stack versions (verified live with `npm view` that day)

| Package                             | Version                             | Note                                   |
| ----------------------------------- | ----------------------------------- | -------------------------------------- |
| Node.js                             | 24.x (Active LTS 24.22.1 "Krypton") | `.nvmrc` 24.22.1, `engines` 24.x       |
| pnpm                                | 12.15.0                             | `packageManager`                       |
| next                                | 16.4.2                              | see exception below                    |
| react, react-dom                    | 19.3.1                              |                                        |
| typescript                          | 6.0.3                               | see exception below                    |
| tailwindcss, @tailwindcss/turbopack | 4.3.3                               |                                        |
| eslint                              | 9.39.5                              | see exception below                    |
| eslint-config-next                  | 16.4.2                              | matches next                           |
| zod                                 | 4.6.7                               |                                        |
| vitest / vite                       | 5.0.5 / 8.3.5                       |                                        |
| @playwright/test                    | 1.64.1                              |                                        |
| @axe-core/playwright                | 4.14.0                              |                                        |
| prettier                            | 3.9.10                              | with prettier-plugin-tailwindcss 0.8.1 |
| clsx / tailwind-merge               | 2.1.1 / 3.7.0                       |                                        |

### Exception: next 16.4.2 instead of 16.4.3

- **Reason:** 16.4.3 was published on 23.10.2026 at 13:40 UTC, inside pnpm's minimum release age window. pnpm tried to add `minimumReleaseAgeExclude` entries, and I removed them, because the build prompt (Section 4.8) forbids weakening the policy.
- **Alternatives:** exclude the package from the policy (rejected).
- **Revisit:** at the end of Phase 1, when 16.4.3 is outside the window.

### Exception: TypeScript 6.0.3 instead of 7.0.2

- **Reason:** typescript-eslint 8.72.0 (used by eslint-config-next) supports `typescript >=4.8.4 <6.1.0`. 6.0.3 is the newest version the lint stack supports, as Section 4.1 requires.
- **Revisit:** when typescript-eslint supports TypeScript 7.

### Exception: ESLint 9.39.5 instead of 10.13.0

- **Reason:** eslint-config-next 16.4.2 pulls in eslint-plugin-react 7.37.5, eslint-plugin-jsx-a11y 6.10.2 and eslint-plugin-import 2.32.0, which all declare peers up to ESLint 9. `pnpm peers check` is clean with 9.39.5.
- **Revisit:** when those plugins support ESLint 10.

### Kept defaults from create-next-app 16.4

Cache Components, Partial Prefetching, React Compiler, Turbopack with the `@tailwindcss/turbopack` loader (instead of PostCSS), `src/` directory, `@/*` alias, AGENTS.md.

## 24.10.2026: Fonts self hosted from Fontsource WOFF2 files

- **Decision:** use the Latin `wght` variable subsets from `@fontsource-variable/google-sans-flex` 5.3.2 and `@fontsource-variable/inter` 5.3.0, copied to `src/fonts/` and loaded with `next/font/local`. The OFL license texts come from the google/fonts repository.
- **Reason:** there was no Python or fonttools on this machine to subset the original TTFs. The Fontsource files are the same OFL fonts, already subset.
- **Coverage:** the Latin range includes ä ö ü ß, €, „ " and – (U+0000-00FF, U+2000-206F, U+20AC). It does **not** include the arrow → (U+2192). UI arrows are icons, never text characters.
- **Alternatives:** next/font/google (rejected, pitfall 4.2 and privacy); subsetting the TTF ourselves (possible later with fonttools for the opsz axis).
- **Revisit:** if we need the `opsz` or `ROND` axes of Google Sans Flex for display sizes.

## 24.10.2026: Fallback faces in compiled CSS

- **Decision:** keep next/font's automatic metric-adjusted fallback faces (`googleSansFlex Fallback`, `inter Fallback`, `src: local(Arial)` with size adjust). `check:css` allows exactly these and nothing else.
- **Reason:** without them the text shifts when the fonts swap in, which breaks the CLS budget of 0.05. They are invisible once the WOFF2 files load.
- **Alternative:** `adjustFontFallback: false` (rejected: worse CLS, and browser default fonts would show during loading).

## 24.10.2026: Preflight copied, no monospace font

- **Decision:** `src/styles/preflight.css` is a copy of the Tailwind 4.3.3 preflight with the system font stacks replaced: the body uses `var(--font-body)` and `code`/`pre` use `inherit`.
- **Reason:** the design brief allows only two fonts, and the reference images' mono labels are replaced by Inter uppercase labels (13.4).
- **Revisit:** re-copy on every Tailwind upgrade.

## 24.10.2026: Tailwind theme reset

- **Decision:** `--color-*`, `--font-*`, `--text-*`, `--shadow-*` and `--radius-*` are reset to `initial`. Only the brief's tokens exist, so `bg-red-500`, `shadow-lg` and similar classes don't compile.
- **Revisit:** never without a design brief change.

## 24.10.2026: Color tokens and contrast

These values are checked by `src/lib/contrast.test.ts` (WCAG 2.2 AA, 4.5:1 for text).

| Token         | Value     | Use                                                                                 |
| ------------- | --------- | ----------------------------------------------------------------------------------- |
| primary       | `#2F2FC1` | given by owner                                                                      |
| primary-hover | `#2424A0` | derived, darker                                                                     |
| primary-tint  | `#E6E6F8` | derived, light                                                                      |
| ink           | `#191919` | given by owner                                                                      |
| bg            | `#F1F1F1` | given by owner                                                                      |
| surface       | `#FFFFFF` |                                                                                     |
| muted         | `#5F5F5F` | chosen darker than the brief's example `#6B6B6B` to keep a safe margin on `#F1F1F1` |
| line          | `#DCDCDC` | decorative hairlines only, never the only signal                                    |
| positive      | `#1D6F3A` | pros/cons marks and validation only                                                 |
| negative      | `#B3261E` | pros/cons marks and validation only                                                 |

## 24.10.2026: 21st.dev components

- **Decision:** the owner asked to use the 21st.dev skill for UI components. Components from the catalog are used only as a structural starting point in Phase 1, and are fully restyled to Section 13: no gradients, no glow, no icon containers, tokens only.
- **Status:** the 21st MCP server is not connected in this environment yet. It needs an API key (`API_KEY_21ST`, free at https://21st.dev/mcp) in the plugin configuration.

## 24.10.2026: @types/node 24 instead of 26

- **Decision:** `@types/node` stays on the 24.x line.
- **Reason:** the types must match the runtime, which is Node 24 Active LTS (locally and on Vercel). Node 26 is not LTS yet.
- **Revisit:** when Node 26 becomes Active LTS and the runtime moves.

## 24.10.2026: Phase 1 UI dependencies

| Package                  | Version | Reason                                                                           |
| ------------------------ | ------- | -------------------------------------------------------------------------------- |
| radix-ui                 | 1.8.1   | Accessible primitives (Dialog, NavigationMenu, Tabs, Checkbox, Switch), unstyled |
| cmdk                     | 1.1.1   | Command palette with keyboard navigation (Section 8, search)                     |
| lucide-react             | 1.61.0  | The only icon set allowed by the brief (13.9)                                    |
| class-variance-authority | 0.7.1   | Button variants                                                                  |

`motion` is not installed. The only animations so far (arrow nudge, tab underline, switch, marquee) are plain CSS, so the library isn't needed yet.

## 24.10.2026: Components built without 21st.dev

- **Decision:** the 21st.dev MCP server still isn't connected (no `API_KEY_21ST`), so every component is written in-house on Radix primitives and styled to Section 13.
- **Revisit:** once the key is set. Catalog components may then serve as structural starting points, restyled to the tokens.

## 24.10.2026: Arrow segment and icon containers

- **Decision:** the split button keeps the arrow in a second segment of the button itself (reference 1). Everywhere else, icons have no background: the "Weiterlesen" arrows on the guide cards are plain icons, not squares.
- **Reason:** the owner banned backgrounds behind icons. The button segment is part of the button shape and reads as one control.
- **Revisit:** if the owner prefers plain buttons. That would be a one-line change in `src/components/ui/button.tsx`.

## 24.10.2026: Scroll containers are positioned

- **Decision:** every `overflow-x-auto` container also gets `position: relative`, and scrollable regions without their own focusable content get `role="region"`, an `aria-label` and `tabIndex={0}`.
- **Reason:** visually hidden text (`sr-only`) inside horizontally scrolling tables escaped the scroll container and widened the page on phones (531 px on a 390 px screen). axe also requires scrollable regions to be reachable with the keyboard.

## 24.10.2026: ESLint 9 deprecation notice

pnpm now marks eslint 9.39.5 as deprecated in favor of 10.x. We stay on 9 for the same peer reason as above (eslint-plugin-react, jsx-a11y and import support only up to 9). Revisit at the end of Phase 2.

## 24.10.2026: Content Collections 0.15.3 for file-based content

- **Decision:** `@content-collections/core` 0.15.3 and `@content-collections/next` 0.2.11, with YAML for structured records. The schemas live in `src/content` as plain Zod (Standard Schema) and are shared by the config, the guards and the tests. Each file name must equal its slug.
- **Reason:** this is the build prompt's default (4.1). The validation script covers the pitfall that schema errors only show up as events.
- **esbuild:** Content Collections depends on esbuild. Its install script stays blocked (`allowBuilds: esbuild: false`) because the binary comes from the platform package and works without it. This was verified with a transform call.
- **MDX:** `@content-collections/mdx` isn't installed yet. It will be added in Phase 3 or 5, when the first long-form content exists.

## 24.10.2026: Price policy for promotions

- **Decision:** `monthlyCents` and `yearlyMonthlyCents` store the vendor's list price. A promotion that applies on the check date goes into the plan `note` with its terms ("Zum Prüfdatum …").
- **Reason:** promotions change weekly, and a list price with a date is the honest comparison basis. Shoppers see the promotion on the vendor site anyway.

## 24.10.2026: No scores without a hands-on test

- **Decision:** `rating` stays `null` for every profile until a named editor has tested the product in a real account. `ratingSchema` requires a test (date, tester, plan, notes).
- **Reason:** Section 3.2 and 3.3. A "Bedienung" (usability) score cannot be derived from vendor pages.

## 24.10.2026: Unknown is a value

- **Decision:** facts may be `unbekannt` (no source needed), app platforms may be `null`, and a vendor city may be `null`. Every other value needs a source.
- **Reason:** absence of a statement on a vendor page is not proof that a feature doesn't exist. Writing "Nein" would be a claim without evidence.

## 24.10.2026: Products left out of batch 1

See docs/CONTENT_STATUS.md: QuickBooks (no German site, no euro prices), FreshBooks (USD only) and Odoo (euro prices could not be verified from this location). Papierkram, easybill and Billomat were researched instead, bringing the batch to 10.

## 24.10.2026: Incident: YAML flow style split values at commas

- **What happened:** content files used inline YAML (`{ status: ja, note: Für 12,90 € im Monat }`). In YAML flow style an unquoted comma ends the value, so the note was stored as "Für 12" plus a stray key "90 € im Monat". Zod `object` silently dropped the stray key, and the Content Collections cache hid the schema change. Prettier's reformatting made it visible.
- **Fix:** every schema is now `strictObject` (unknown keys fail). All content files were converted to block style and the split texts were rejoined, then checked (12,90 € and 19,90 € restored, and two split list items merged). `content:validate` rejects flow style in content YAML and always clears the Content Collections cache first. Unit tests reproduce the bug and prove both protections.
- **Rule:** write content YAML in block style only. Quote a value if it starts with a special character.

## 24.10.2026: Phase 3 template decisions

- **Navigation reflects what exists.** `buildNavigation(getAvailability())` adds links for the Finder, the comparison tool, the cost calculator, guides, the glossary, the editorial team and the review policy only when they exist (feature flags or content). An E2E test opens every header and footer link and expects status 200.
- **Real 404 status.** With Cache Components, a dynamic page that calls `notFound()` after streaming has begun keeps status 200 (Next.js docs, "Status codes"). `src/proxy.ts` checks software, category and glossary slugs against the visible content and rewrites unknown ones to `/nicht-gefunden`. That route calls `notFound()` while being prerendered, so it returns 404.
- **`instant = false` on the dynamic content routes.** Every known slug is prerendered, so a navigation loads a static page. Streaming skeletons would add complexity without a visible gain. Revisit if pages gain request-time data.
- **Preview build.** `pnpm build:preview` inlines `STACKWAHL_SHOW_DRAFTS=1`, so the E2E tests can exercise the templates with draft content. The normal build never shows drafts. Never deploy a preview build.
- **Free plans.** "ab … €" always means the cheapest paid plan. A free plan is shown separately as "Kostenloser Tarif verfügbar".
- **Wording without a test.** "im Test", "Testbericht" and "Tests" appear only when a documented test exists. Otherwise the copy says "im Überblick", "Zum Profil" and "Vergleiche".
- **Alternatives pages are `noindex`.** They are generated from data without editorial text, so they stay out of the index (Section 11, no thin programmatic pages) until the editors write a comparison.
- **Legal placeholders.** The legal pages read from `site.config.ts` and show missing values as "Angabe fehlt: NAME". Unverified hosting facts (Vercel DPA, log retention) are placeholders too, not claims. A visible notice says that the lawyer review is still pending (`features.legalReviewed`).
- **Mobile overflow.** Grid children get `min-w-0`, and headings use `hyphens: auto` so that long German compounds wrap.

## 25.10.2026: Real data pass

- **Facts.** 30 of 55 open facts and two trial periods in the ten profiles were filled from the vendors' own pages, each with a source and access date. Facts that no vendor page states stay `unbekannt` ("Keine Angabe"). Cons that the new facts made wrong were replaced (FastBill ELSTER, Papierkram ELSTER and DATEV, Billomat server location and e-invoice receiving, BuchhaltungsButler trial). Each new con repeats a sourced plan or vendor fact.
- **Access dates use UTC.** The content guard compares dates with today's date in UTC, so research done in the first hours of 26.10. local time is stored as 25.10.2026.
- **Responsible editor and score name.** The responsible editor under § 18 Abs. 2 MStV defaults to Dietmar Riedel, as the build prompt states. The score name is the proposed "Stackwahl-Wertung". The owner can change either in `site.config.ts`.
- **Vercel region.** `vercel.json` pins functions to `fra1`, so the hosting statement in `site.config.ts` ("Region Frankfurt (fra1)") is true for the deployment and not just a plan.
- **Log retention stays open.** Vercel's retention depends on the plan (Hobby 1 hour, Pro 1 day) and covers runtime logs only. The privacy text needs the owner's plan and a check of Vercel's DPA, so `{{HOSTING_LOG_RETENTION}}` stays a visible placeholder.
- **The styleguide keeps fictitious data.** Section 5.6 asks for labeled fictitious demo data on `/intern/styleguide`. Real brands there would need sample scores and "Affiliate-Link" labels, which would be false statements about real vendors. All public pages read real content only.

## 26.10.2026: Batch 2 and long reviews

- **Long reviews.** Profiles get an optional `review` with at least four sections. Each section lists its own sources, and the page shows them directly under the section ("Grundlage dieses Abschnitts"), so a reader can check every paragraph. The guards treat review text like every other text (copy rules, Sie-Form, test claims) and review sources like fact sources (future dates, 180-day freshness). Reviews describe what the vendor states and what that means in practice, with worked cost examples; they never claim a hands-on test.
- **Prices without tariffs.** Haufe X360 and Scopevisio publish only example configurations. Haufe X360 is stored with its minimum of 449 € a month as the plan; Scopevisio with its three published examples for service companies, each marked "Beispiel". Sage X3 publishes no price and is not listed.
- **Xentral prices.** The price page shows yearly prices by default; the monthly prices come from the page's own data and are stored as `monthlyCents`.
- **Payroll deferred.** Sage HR & Payroll and Sage HR Suite have public prices, but the accounting compliance block does not fit payroll software. They wait for a payroll checklist and category.
- **ERP category.** New draft category `erp-software` with six profiles, above the threshold of five.
- **Logos for new vendors.** Not downloaded yet. The owner's approval covered the logos of the first ten vendors; the seven new vendors show their names as text until approved.
- **Finder race fixed.** After the last step, "Ergebnis anzeigen" could be clicked before nuqs had written the step to the URL; the late write then pushed the Finder URL over the result page (seen as a flaky E2E test, 1 in 8 runs). The link now waits for the pending URL write and then navigates. Without JavaScript the plain link still works.

## 26.10.2026: Long reviews for the first ten profiles

- **Same structure everywhere.** All 20 profiles now have the same eight review sections (Einordnung, Funktionen, Preise mit Rechenbeispielen, Rechtssicherheit, Datenschutz, Einstieg und Support, Grenzen, Zusammenfassung), each with its sources.
- **Refetch before writing.** The reviews are based on pages fetched on 26.10.2026, not on the notes from 24.10. Where a page now says something else, the facts, plans, pros and cons were updated in the same change (see CONTENT_STATUS). Where a page could no longer be fetched (FastBill help center, 403), the earlier access date stays.
- **Contradictions on vendor pages are named, not resolved.** If a vendor shows two different prices on the same page (sevdesk, orgaMAX, BuchhaltungsButler), the review says so and recommends checking the price in the order process. We store the price from the tariff cards.
- **Sage Active terms.** The FAQ distinguishes subscriptions before and after 01.02.2026. The profile uses the current terms and mentions the old ones.
