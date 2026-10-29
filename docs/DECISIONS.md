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

## 26.10.2026: Ratgeber

- **Guides as YAML, not MDX.** Articles are structured data (intro, sections with paragraphs, points, named programs and their own sources), so the same guards as for profiles apply: copy rules, test claims, future dates and software references. Each section shows its sources directly beneath it.
- **Thumbnails drawn in code.** The cards use flat brand colors (primary, ink, tint), the line art from the illustrations and up to three real vendor logos. No stock photos and no AI images (Sections 3.8 and 13.11). The thumbnail is decorative (`aria-hidden`); the title is the accessible name.
- **Topics from buying questions.** The ten articles answer the questions people search before buying (E-Rechnungspflicht, UStVA per ELSTER, Kleinunternehmer, free plans, hidden costs, Lexware Office alternatives, sevdesk vs. Lexware Office, Sage 50/100/Active, ERP costs, DATEV). Every figure comes from a vendor page or a law text with a date.
- **No author yet.** All articles are drafts with `author: null`. The guard blocks publishing without a real author.
- **Home page.** A Ratgeber section shows the six newest articles and links to the index.

## 26.10.2026: Recherche-Wertung and "Im Fokus"

- **Score from facts, approved by the owner.** Until a hands-on test exists, every program gets a Recherche-Wertung (method R1.0), computed in `src/lib/research-score.ts` from the sourced facts and prices. It is never entered by hand. Four criteria: Funktionsumfang 30 %, Rechtssicherheit 25 %, Einstiegspreis 25 %, Support und Datenschutz 20 %. These are the approved weights without "Bedienung", rounded to whole percent. "Bedienung" is shown as "Erst nach einem Praxistest". A tested `rating` replaces the Recherche-Wertung.
- **Only evidence counts.** "Ja" 1 point, "Gegen Aufpreis" 0.75, "Teilweise" 0.5, "Nein" and "Keine Angabe" 0. Each program is measured against the item list of its main (first) category, so an invoicing program is not marked down for missing ELSTER.
- **Price.** Cheapest paid plan, net per month, yearly billing where offered, times the vendor's minimum seats (new optional `minUsers` on plans; Sage 50 Comfort 2, Professional 3, also used by the cost calculator). 10 points up to 5 € (invoicing, accounting) or 25 € (ERP), minus 2 per doubling, plus 1 for a free plan.
- **Pros and cons are not counted.** They are free text written from the same facts; counting them would double-count facts and reward long lists. The score uses the facts directly.
- **Known limits, stated on /methodik.** The score does not judge usability, and it counts a feature regardless of the plan it is in.
- **Display.** Every profile shows the full derivation (each fact with its points, the price rule). Cards show the value labeled "Recherche-Wertung". Category pages sort by it, with the explanation above the list.
- **"Im Fokus" on the home page.** The four programs with the highest Recherche-Wertung across all categories, ties by name, with the rule next to the section. Affiliate placement `fokus`.

## 26.10.2026: Screenshots and videos on profiles

- **Only official material.** Screenshots come from vendor press pages that offer them for reporting (Lexware, Papierkram, FastBill); videos only from channels the vendor links on its own site or videos the vendor embeds itself. Title and channel of every video were checked with the oEmbed endpoint. Everything is listed in `docs/MEDIA.md`; the content guard fails when a file or video id is missing there, or a screenshot file is missing in `public/`.
- **Labeled as vendor material.** The profile section "Bilder und Videos" says that the material comes from the vendor and replaces no test. Each image names its press page and access date. FastBill's press screenshots show an older interface (the VAT example says May 2021), and the captions say so.
- **Click-to-load (Section 3.6).** No request goes to YouTube or Vimeo before the click, not even a thumbnail. YouTube loads in privacy-enhanced mode (youtube-nocookie.com), Vimeo with `dnt=1`. The click counts as consent for that one video and is not stored, so the consent banner list stays empty. The privacy policy has a new section "Videos der Anbieter" and the cookie page mentions the embeds (Section 3.10). The lawyer review is still pending.
- **Gaps stay visible.** Profiles without verified material have no media section; nothing is filled with stock or generated images. Missing: videos for Billomat, WISO MeinBüro, Collmex, Norman (only Polish and English videos), Sage 50 Handwerk; screenshots for 17 vendors.
- **Video titles are quotes.** `originalTitle` keeps the vendor's wording (some use "du") and is exempt from the copy lint; it is always shown in quotation marks.
- **Second pass (same day).** Norman added (two German videos; YouTube had shown machine-translated English titles, oEmbed returns the German originals). easybill screenshots come from its online style guide, which its press page links as "Presse-Downloads". Channels for Collmex, Billomat and Sage 50 Handwerk (`@SageSupport`) link to the vendor, but the vendor does not link back, so they stay out. Requests to 13 vendors are drafted in `docs/PRESS_REQUESTS.md` and not sent: sending is the owner's decision and needs the contact address.

## 26.10.2026: Publication and SEO

- **Everything published.** On the owner's instruction all 20 profiles, 3 categories, 10 guides and 5 glossary terms are `published` and `verified`. "Verified" here means what the schema says: every fact was read on the cited page on its access date. Nothing claims a hands-on test.
- **Responsible editor, not invented author.** The publish guard needs a real author. The only real person known is the owner, Dietmar Riedel, who is the responsible person under § 18 Abs. 2 MStV. He is the author record, labeled "Herausgeber, verantwortlich für den Inhalt"; the byline reads "Verantwortlich", not "Autor". His bio contains only that role. No photo or credentials were added.
- **Redaktion pages.** /redaktion and /redaktion/[slug] list the editor and everything he is responsible for. Navigation already linked /redaktion, which was a 404 until now.
- **No legal notice, no phone, address only in the Impressum.** The "noch nicht anwaltlich geprüft" notice is removed entirely (the review itself stays open). No phone number is published. The postal address appears only in the Impressum, where § 5 DDG ("ladungsfähige Anschrift") and § 18 Abs. 2 MStV require it; Datenschutz, Kontakt, Über uns, the press template and the Organization JSON-LD no longer repeat it. Removing it from the Impressum as well would make the site non-compliant and look exactly like the anonymous sites affiliate programs (e.g. Sage) reject.
- **LinkedIn as proof of identity.** `siteConfig.social.linkedinCompany` (footer link + Organization `sameAs`) and the founder's `links` in `content/authors/dietmar-riedel.yaml` (author page + Person `sameAs`). Both stay hidden until real URLs are set.
- **Impressum.** Phone and VAT ID are optional under § 5 DDG and hidden until the owner provides them; the e-mail stays visible as missing because it is required. A row links to the contact page.
- **Hosting facts filled from the source.** The Vercel DPA becomes binding with the Vercel agreement and includes the 2021 SCCs (vercel.com/legal/dpa, 17.03.2026). Log retention ranges from one hour to 30 days by plan (Vercel docs); the policy names the range instead of one plan.
- **Consistent score copy.** Home page, Über uns and the category notes no longer say that there is no score without a test. Category pages score every program against that category's requirements (`researchScore(software, category)`); the score breakdown shows the vendor's note for each fact.
- **SEO.** `features.indexing` is on. robots.txt allows everything except redirects, internal pages, search, Finder results, the newsletter confirmation and the 404 page, and names the sitemap. Every page has canonical, Open Graph and Twitter data; profiles and guides get their own social image. JSON-LD describes only what the page shows: no `aggregateRating` or `Review`, because the Recherche-Wertung is not a user or test rating. A favicon and Apple touch icon were added.
- **Internal styleguide** returns 404 in production; it keeps its fictitious demo data for development and preview.

## 26.10.2026: Comparison on the home page

- **Direktvergleich section.** Two or three programs side by side: entry price (net, minimum seats included), free plan, trial, Recherche-Wertung, six compliance facts and ten features, with "Website besuchen" and "Profil lesen" per program and links to /vergleich and the cost calculator. Presets cover the pairings people search for (sevdesk vs. Lexware Office, the Sage products, free start, invoicing, ERP).
- **Highlights only from data.** "Günstigster Einstieg", "Längste Testphase" and "Höchste Recherche-Wertung" are computed from the stored values. When per-user and flat prices meet, the summary says that it compares one user; programs without a stated price or trial are named as such, never counted as cheapest or longest.
- **Two layouts.** From md a table with equal columns; below md each row is a label with the values side by side, so phones need no sideways scrolling.

## 26.10.2026: Contact addresses and footer fix

- **Addresses from the owner.** kontakt@stackwahl.de is the legal address (Impressum, Datenschutz, structured data). redaktion@stackwahl.de takes corrections and press, partner@stackwahl.de vendors and affiliate networks. Kontakt lists all three; Methodik, Redaktion and Transparenz name the matching one. All are `mailto:` links.
- **Footer links blocked by the wordmark.** The giant "Stackwahl" wordmark uses `leading-[0.78]`, so its glyph box reached over the legal links and took the clicks on desktop. The decorative block is now `pointer-events-none`, and the link row sits above it (`relative z-10`). An E2E test clicks the footer links.

## 26.10.2026: New mark "Stapel-S"

- **Why.** The old mark (three equal bars, middle in primary) read as a menu icon, right next to the real menu button in the header.
- **The mark.** Three stacked bars on a 32-unit grid: top bar left-aligned, full-width middle bar in primary, bottom bar right-aligned. Together they read as an S for Stackwahl and as a stack of layers; the primary bar is the choice ("Wahl"). Flat, no gradient, no container. Every edge sits on whole pixels at 16 and 32 px.
- **Where.** `StackMark` in `src/components/brand/wordmark.tsx` (header, mobile menu, footer wordmark, styleguide option B), `src/app/icon.svg` (switches the ink bars to white in dark mode), `src/app/favicon.ico` (16, 32, 48 px for older browsers), `src/app/apple-icon.tsx` (180 px on the page background), the social cards, and the Organization logo in structured data.
- **Files for other uses.** `public/brand/stackwahl-mark.svg` (ink), `stackwahl-mark-white.svg` (for dark backgrounds), `stackwahl-mark-mono.svg` (one color, e.g. stamps or fax). The wordmark text stays live text in Google Sans Flex; an outlined lockup needs a design tool that can read the font.

## 26.10.2026: Comparisons, use-case pages and check dates

- **"X vs. Y" pages** under /vergleich/[slug]: sevdesk vs. Papierkram, Lexware Office vs. WISO MeinBüro, Sage Active vs. Lexware Office, FastBill vs. easybill, weclapp vs. Xentral. The facts table is the home page comparison, computed from the profiles; the text explains differences with worked yearly costs from the stored plans, every section with its sources. sevdesk vs. Lexware Office already exists as a Ratgeber article and was not duplicated.
- **"Software für …" pages** under /software-fuer/[slug]: GmbH und UG (Bilanz), Handwerk, Freiberufler, Onlinehandel, Lohnabrechnung. The list is not hand-picked: a rule in the content file (target groups, categories, facts) selects the programs, sorted by Recherche-Wertung; the rule is shown above the list. Each page cites the law it explains (§ 13 GmbHG, § 242 HGB, § 5b EStG, § 13b and § 14 UStG, § 35a EStG, § 3c and § 18j UStG, § 4 and § 18 EStG, § 41 and § 41a EStG, § 28a SGB IV), all read on gesetze-im-internet.de on 26.10.2026. Vereine (two programs) and Kleinunternehmer (existing guide) have no page.
- **Same guards as guides**: sources with past dates, resolvable references, copy rules, no test claims, a responsible person for published pages.
- **Links**: /vergleich and the home page list all comparisons and use cases, profiles link to the ones that include them, the footer has a "Software für" column, sitemap and search include them.
- **Check dates.** The owner asked to stop showing check dates. Cards, teasers, list pages and the profile header no longer show them. They stay where prices and facts are shown in full (price table, pricing page, cost calculator, compliance table) and on every source ("abgerufen am"): a price without a date can mislead once it changes.
- **Not done, on purpose.** Backdating articles over three months was requested; publication dates stay the real ones, because false `datePublished` values mislead readers, search engines and affiliate reviewers.

## 26.10.2026: Byline "Redaktion Stackwahl"

- **Team byline.** The owner decided that the editors write as a team. Bylines read "Redaktion Stackwahl · Verantwortlich: Dietmar Riedel"; individual editor names are not shown. Dietmar Riedel is the founder and Herausgeber and the person responsible under § 18 Abs. 2 MStV.
- **Structured data.** Articles, comparisons and use-case pages name the team as `author` (Organization "Redaktion Stackwahl", /redaktion) and the founder as `accountablePerson`.
- **Redaktion page.** Leads with the team and names the founder as Gründer und Herausgeber.

## 28.10.2026: No postal address, rectangular buttons, fewer template patterns

- **No postal address.** The owner's manager asked to remove phone number and address from the whole site. The phone was already gone; the address is now removed from the Impressum (operator and § 18 Abs. 2 MStV block) and from `site.config.ts`. The Impressum names the operator, the e-mail and the contact page.
- **Legal risk, accepted by the owner.** § 5 Abs. 1 Nr. 1 DDG requires a postal address where the provider can be served ("ladungsfähige Anschrift"), and § 18 Abs. 2 MStV requires the address of the responsible person. Without it the Impressum is incomplete and can be warned off (Abmahnung). The usual way to keep a private home address off the site is a business or c/o service address. Revisit before launch with the lawyer review.
- **Buttons.** All buttons are plain rectangles with square corners and a centered label. The split button with its separate arrow segment (Section 13.6.1) is gone. `--radius-control` is 0, so inputs, header items, segmented controls, filter chips and carousel controls are rectangles too. Radio dots, the switch and non-clickable tags stay round.
- **Fewer repeated patterns.** The muted second line ("Nach Aufgabe sortiert.", "Offen gesagt." …) under every heading read like a template. It stays only in the home hero, on category pages ("im Vergleich") and on author, 404 and error pages, where it carries information. The marquee slogan and the three pillar tiles (they repeated the method section) are removed from the home page. The commission note appears once on the home page instead of three times, the footer no longer repeats "Software finden", and the newsletter copy drops "Kein Spam".

## 28.10.2026: Home page redesign after a look at the large portals

- **What the portals share.** Reviewed on 28.10.2026: OMR Reviews, Trusted.de, G2, Trustpilot (de) and Appvizer (Capterra.de blocked automated access). All five open with one short headline, one line of text and a large search field, then software by category (tabs or a list), then the top-rated items, guides and a short "who we are and how we earn" block. Trusted.de states its business model on the home page ("Wir finanzieren uns über Provisionen") and above every list ("Für Links auf dieser Seite erhält trusted ggf. eine Provision").
- **New home page.** Hero with search field (GET /suche), category links and the Finder link; logo row; "Software nach Kategorie" (tabs); "So sehen die Programme aus" (one real press screenshot per program with source); "Am besten bewertet" (top four by Recherche-Wertung); comparison and use-case links; three latest guides; "So arbeitet Stackwahl"; newsletter. Removed from the home page: the interactive comparison (still on /vergleich and the comparison pages), situation shortcuts, the overview list, the fact board and the four-step panel. Their unused components and data functions are deleted.
- **Commission notice.** `AffiliateNote` says that Stackwahl can receive a commission, that the price does not change and that score and order do not either, with a link to /transparenz. It sits above the top four on the home page, in the profile header, on comparison, use-case and guide pages, and in the footer of every page. The per-link "Affiliate-Link" label stays for active affiliate links.
- **Paid top placements (owner question).** Legal in Germany only when each paid entry is visibly labeled "Anzeige" at the entry itself (§ 5a Abs. 4 UWG), paid placement in rankings is disclosed (UWG Anhang Nr. 11a, § 5b Abs. 2 UWG), and it is not presented as a test result or as the "Am besten bewertet" order. Trusted.de solves it with a labeled "Gesponsert" sort order. Not built yet; Section 0 of the brief allows labeled sponsored placements that never change rankings.
- **Search field.** One bordered rectangle; field and button share the height (56 px), no gap, no radius. The global focus style no longer sets `border-radius`, which had rounded every focused control.
- **Radius token removed.** `--radius-control` (0 since today) is gone; controls carry no radius class and stay square by default.

## 29.10.2026: Operator is Stackwahl UG (haftungsbeschränkt)

- **Company data from the owner.** The owner states that Stackwahl UG (haftungsbeschränkt), Charlottenstr. 14, 52070 Aachen, Amtsgericht Aachen HRB 24686, USt-IdNr. DE342188146, operates the site and that its managing director Milan Schultheis agreed to be named. A web search found no public register entry yet; the owner should confirm the details against the Handelsregister printout before launch, since affiliate programs compare them.
- **Impressum (§ 5 DDG).** Company with legal form and address, "Vertreten durch" the managing director, register court and number, VAT ID with § 27a UStG. § 18 Abs. 2 MStV: Milan Schultheis with the company address. The Steuernummer is not published (not required).
- **Elsewhere only where needed.** Datenschutz names the company as controller (Art. 13 DSGVO); the footer reads "© year Stackwahl UG (haftungsbeschränkt)"; the Organization JSON-LD carries legalName, address and vatID. Kontakt stays e-mail only.
- **Managing director replaces founder.** Dietmar Riedel is removed everywhere. The author record is now `content/authors/milan-schultheis.yaml` (role Geschäftsführer, bio only that role), bylines read "Redaktion Stackwahl · Verantwortlich: Milan Schultheis". This supersedes the 28.10.2026 "No postal address" entry.

## 29.10.2026: New mark, header like the Atacama reference, glass Ratgeber card

- **Mark.** After the owner's references (Brown&Company, monas, ascent, Centre Impression Bavière): a solid block of two offset slabs that reads as an "S" and as a stack, with the ballot cross ("Wahl") cut out where the slabs meet. Geometry in `src/components/brand/wordmark.tsx` (36 x 32 grid); `icon.svg`, `favicon.ico`, `apple-icon.tsx` and `public/brand/*.svg` use the same paths. The wordmark is lowercase "stackwahl" in Google Sans Flex semibold. Replaces the "Stapel-S".
- **Header.** Grey pills on the left (Start, Vergleich, Software-Finder), the wordmark in the centre, Kategorien and Wissen as dropdown pills, search and Kontakt on the right. Sticky frosted bar (`frost` token, backdrop blur) with a shadow once scrolled. The current page is an inverted ink pill with a light blue dot; a dropdown is inverted when one of its pages is open.
- **Light blue CTAs.** `accent` #a8c8ff (hover #8cb5ff) for primary buttons and the home search button, always with ink text (contrast tested in `src/lib/contrast.test.ts`).
- **Glass Ratgeber card.** The home page Ratgeber section is a primary panel with the mark at panel scale behind one frosted glass card: article thumbnail, date in a dot matrix (SVG, no third font), the description as a quote, dots to switch between the four newest articles, "Lesen". Glass tokens are used only here and in the header; the owner asked for glass explicitly, which overrides the earlier "no glass" preference.

## 29.10.2026: White minimal footer, German flag

- **Footer.** One white card instead of the ink panel with the giant wordmark (owner's reference): a question with one underlined link (Software-Finder) on the left, the link columns on the right with a small grey heading and larger links, a hairline, then the company line and the legal links. The commission notice stays in the footer on every page.
- **German flag.** Drawn as SVG in the official colours (Schwarz, Rot 221/0/0, Gold 255/206/0) in `src/components/ui/german-flag.tsx`. The colours are SVG attributes, so the token-only CSS check is unaffected. Used three times, always next to text that names Germany or the place: the home hero eyebrow, "Recherchiert für den deutschen Markt" and "Aachen, Deutschland" in the footer.

## 29.10.2026: Blue mark, mango yellow selection

- **Mark in brand blue.** The mark is set in primary #2f2fc1 in header, mobile menu, favicon, apple icon and `public/brand/stackwahl-mark.svg` (light blue `accent` in the dark-mode favicon); the name stays ink. White and mono variants stay for dark and one-colour use.
- **Mango yellow selection.** The selected header pill is `mango` #ffc142 with ink text and an ink dot (contrast tested).
- **Dot always rendered.** The selection dot is always in the DOM and only shown via `group-data-[current=true]`. Mounting it on navigation crashed React ("insertBefore … not a child") when a browser translation had wrapped the label text.

## 29.10.2026: First affiliate partner (Lexware), labeled banner

- **Link.** `content/affiliate/lexware-office.yaml` holds the partner link from the owner. `features.affiliateLinks` is on. Every "Website besuchen" link to Lexware Office now goes through `/go/lexware-office?from=<placement>&pos=<n>`, which answers 307 with `noindex, nofollow` and `no-store` and appends `utm_content=<placement>-<n>`. No personal data is passed or stored; the Datenschutz page says so.
- **Disclosure.** "Affiliate-Link" stands next to every partner link (as before); on the home page cards it moves to the top right of the card. Partner links never change rank or score: Lexware Office stays fourth in "Am besten bewertet".
- **Banner.** One partner banner on the home page after "Am besten bewertet", labeled "Anzeige" and "Affiliate-Link" before anything else, with the partner's own image (`docs/MEDIA.md`, "Partner banners"), facts from the sourced profile (trial, entry price) and a link to our profile. A banner only renders while its affiliate link is active (`partnerBanner()` in `src/lib/content/home.ts`). New placement `banner`.
- **Not used.** The partner banner with a 2020 "Testsieger" seal (old third-party claim), the tax-adviser badge and the tax-adviser PDFs.

## 29.10.2026: Second affiliate partner (FastBill)

- **Link.** `content/affiliate/fastbill.yaml` with the owner's FastBill link; `/go/fastbill` appends `utm_content=<placement>-<n>` like Lexware.
- **Banner.** A second slot on the home page before the Ratgeber, mirrored (image left) so the two ads do not repeat one layout. Image: FastBill's own dashboard screenshot from the material the owner placed in `public/fastbll` (not tracked by Git; only the converted `public/partner/fastbill/dashboard.webp` is). `partnerBanners()` numbers the slots, so the clicks arrive as `banner-1` (Lexware) and `banner-2` (FastBill).

## 29.10.2026: Third affiliate partner (sevdesk), no banner yet

- **Link.** `content/affiliate/sevdesk.yaml` with the owner's sevdesk link; `/go/sevdesk` appends `utm_content=<placement>-<n>`. All sevdesk vendor links (profile, cards, comparisons, Ratgeber) now carry "Affiliate-Link" and `rel="sponsored nofollow noopener"`.
- **No banner.** The sevdesk images the owner placed in `public/sevdesk` are 240 px wide thumbnails; enlarged to banner size they blur. The banner waits for files of at least 1600 px width. The folder is not tracked by Git.
- **Tests.** The "inactive partner falls back to the profile" test now uses Papierkram, which has no partner link.

## 30.10.2026: Corrections after a review from the view of an affiliate manager

- **Sage facts.** Sage Active: server location "Ja" (Microsoft Azure with processing in Germany, Sage's list of processors on the Customer Due Diligence page) and AVV "Ja" (Sage's AVV page: part of the terms of use for every purchase from 01.05.2025). The AVV is also "Ja" for Sage 50, Sage 50 Handwerk and Sage 100. Both sources accessed 29.10.2026. The con "nicht dokumentiert", the open questions and the comparison with Lexware Office now say what Sage documents. Sage Active's Recherche-Wertung rises from 6,2 to 7,5 by the unchanged formula R1.0.
- **Score sentence.** Every profile ended with "Eine Wertung vergeben wir erst nach einem eigenen Praxistest", next to a visible Recherche-Wertung. Removed from all 20 profiles. The fallback "Noch nicht bewertet" for a profile without any score keeps its sentence.
- **"Keine Angabe".** The formula stays: an unknown fact earns no point, because only what is documented counts. The category page and Methodik now say so next to "Das ist kein Nein".
- **Datenschutz.** The supervisory authority for a company in Aachen is the LDI NRW in Düsseldorf, not the Hessian authority.
- **Transparenz.** Present tense instead of "Künftig wollen wir": the page names the active partner programs and the home-page ads from the content data (`getAffiliatePartners()`, `partnerBanners()`) and says that partners pay only the commission.

## 30.10.2026: Real mailboxes, domain live

- **Addresses.** The domain is live (www.stackwahl.de, mail at IONOS). The owner uses two mailboxes: info@stackwahl.de is the legal and general address (Impressum, Datenschutz, contact), milan.schultheis@stackwahl.de takes corrections and partner requests. kontakt@, redaktion@ and partner@ are gone.

## 30.10.2026: Publish dates set by the owner

- **Dates.** On the owner's instruction, the publish dates of the 10 guides, 5 comparisons and 5 "Software für" pages are spread over 02.09.–22.10.2026. `updated`, `lastReviewed` and every source's `accessed` date stay the real research dates (24.–29.10.2026).
