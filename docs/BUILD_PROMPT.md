# Build Prompt: German Business Software Review and Comparison Site

This is the complete A to Z prompt for Claude Code. It is based on `GENERAL_BUILD_PROMPT.md` and filled in for this one project. Sections 3, 4 and 13 are hard rules.

Start Claude Code with:

> Read docs/BUILD_PROMPT.md completely. Execute Phase 0. At the end of the phase stop, report what you built, list every open placeholder and every question, and wait for my go.

---

## 0. Project brief

| Field                      | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concept                    | An independent German review and comparison site for cloud business software that is sold in Germany: accounting and invoicing first (for example sevdesk, Lexware Office, BuchhaltungsButler, Sage, Odoo, FastBill, orgaMAX, WISO MeinBüro, QuickBooks, FreshBooks), then ERP, CRM, inventory, payroll and related categories. Every product gets an in-depth profile with features, prices, pros, cons, German compliance facts, alternatives and verified user reviews. A Software-Finder recommends the best fit for a visitor's business and requirements. |
| Purpose                    | Generate qualified clicks and sign-ups for software vendors through affiliate programs (the owner applies to the programs; links come later), and later optional consultation leads. Success = affiliate conversions, Software-Finder completions, newsletter subscribers, organic rankings for German software keywords.                                                                                                                                                                                                                                       |
| Audience                   | Founders, freelancers (Selbstständige, Freiberufler), small and medium businesses (KMU), office managers and accountants in Germany. They want to know which software fits their legal form, size, industry, budget and their Steuerberater workflow, and they decide which tool to try or buy.                                                                                                                                                                                                                                                                 |
| Core question              | "Welche Software passt wirklich zu meinem Unternehmen, und was kostet sie mich?"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Business model             | Affiliate commissions (CPL, CPA, recurring), later optional sponsored placements that are always labeled and never change rankings, newsletter.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Market and language        | Germany only. German language, formal "Sie" register, friendly and clear tone. Currency only euro (`1.234,56 €`), German number and date formats (`24.10.2026`), German legal region (DDG, MStV, TDDDG, GDPR/DSGVO, UWG, PAngV). Prices are shown net plus VAT ("zzgl. MwSt.") unless a vendor only publishes gross prices, and this is always stated.                                                                                                                                                                                                          |
| Content types              | Software profiles, category pages with ranked lists, head-to-head comparisons, "Alternativen" pages, pricing pages, guides (Ratgeber) on German topics such as E-Rechnung, GoBD, DATEV export, Kleinunternehmerregelung, glossary, verified user reviews, Software-Finder results, author pages.                                                                                                                                                                                                                                                                |
| Wanted functions           | All modules from Section 8: editorial ratings, user reviews with verification, comparison tool, Software-Finder (requirement based recommendation), price and cost calculator, search with command palette, filters, affiliate redirect system, contact form, newsletter with double opt in, optional consultation request form (feature flag, off until a partner exists), blog/guides. Accounts and payments are out of scope for launch (see below).                                                                                                         |
| Brand                      | Name: **Stackwahl** (always written as one word, capital S, no camel case). Domain: `stackwahl.de` (DENIC status "free" on 24.10.2026, to be registered at IONOS by the owner). Meaning: "die Wahl Ihres Software-Stacks", choosing the right set of business tools. Logo: none yet, Claude designs a wordmark in Phase 1 (Section 13.10). Tone: calm, expert, honest, friendly, no hype.                                                                                                                                                                       |
| Legal owner                | Dietmar Riedel, Neue Kräme 32, 60314 Frankfurt am Main, Germany. Email `{{CONTACT_EMAIL}}`, phone `{{CONTACT_PHONE}}`, VAT ID `{{VAT_ID}}` (only if one exists), responsible editor under § 18 Abs. 2 MStV `{{RESPONSIBLE_EDITOR}}` (default: Dietmar Riedel, same address). Stored only in `site.config.ts`.                                                                                                                                                                                                                                                   |
| Third parties              | Hosting: Vercel (region Frankfurt `fra1`). Domain and DNS: IONOS. Email provider: `{{MAIL_PROVIDER}}` (owner decides later; build behind a provider interface with a local outbox). Analytics: cookieless (Vercel Web Analytics by default, owner may switch to Plausible EU). Affiliate networks: `{{AFFILIATE_NETWORKS}}` (vendor programs, Awin, financeAds, PartnerStack or others, decided after approval). Payment provider: none.                                                                                                                        |
| Competitors and references | Study for structure and standards, never copy text or design: OMR Reviews (omr.com/de/reviews), Capterra.de, GetApp.de, SoftwareAdvice.de, G2, Trusted.de, Appvizer, SoftwareSuggest. Visual references: the owner's reference images (Section 13.2).                                                                                                                                                                                                                                                                                                           |
| Out of scope               | User accounts with login, payments, a vendor self-service dashboard, paid placements disguised as rankings, AI chatbot, fake or purchased reviews, "AI-style" design (Section 13.12), any language other than German in the UI, any currency other than euro.                                                                                                                                                                                                                                                                                                   |

Every brand, legal and feature flag value lives in ONE file, `site.config.ts`. Open placeholders are written as `"{{NAME}}"` and a helper script lists them until they are filled. Claude never invents business, legal or contact facts.

---

## 1. Your role and working method

You are four senior people in one and you switch hats on purpose:

1. **Senior full stack engineer.** Typed, tested, accessible, fast production code. Read the current official docs of every framework before using an API, because the installed version can differ from your memory.
2. **Senior design engineer.** Implement the design brief in Section 13 exactly. Do not invent a different look and do not fall back to generic template or "AI" styling.
3. **Senior native German content lead** for B2B software. You write like an experienced German Fachredakteur for accounting and business software (ten years in the field, knows GoBD, E-Rechnung, DATEV, ELSTER, Kleinunternehmerregelung), never like a marketing bot.
4. **Senior growth and trust strategist.** SEO, conversion and credibility, with honest disclosure of every commercial interest.

Working agreements:

- **Understand first.** Study this brief and the references, then propose the information architecture (Section 7) and wait for approval.
- **Plan before coding.** Write a short plan into `docs/PLAN.md` at the start of each phase.
- **Log decisions** in `docs/DECISIONS.md`: date, decision, reason, alternatives, when to revisit.
- **Track content status** (verified, draft, missing) in `docs/CONTENT_STATUS.md`.
- **Placeholders, never inventions.** Missing legal data, links, photos or facts get a named placeholder and a line in the phase report.
- **Small commits.** Initialise git in Phase 0. Never push to a remote unless the owner asks. Fetch the remote first when you do.
- **Stop after every phase**, report, list open placeholders and questions, wait for approval.

---

## 2. Mission

Write this section yourself in `docs/PLAN.md` (five to ten lines), based on this direction:

Stackwahl helps German businesses choose cloud business software with confidence. It answers "Which software really fits my company, and what will it cost me?" with independent, sourced reviews, transparent scoring, German compliance checks (GoBD, E-Rechnung, DATEV, ELSTER, server location) and a Software-Finder that turns requirements into a short, explained recommendation. It earns money through clearly labeled affiliate links that never influence scores. It beats the existing portals by being calmer, faster, more transparent and more German-specific: no lead-form traps, no self-awarded badges, no invented numbers, a visible date and source on every price and fact.

---

## 3. Non negotiable rules (they override everything else)

1. **Language and locale.** Every user facing string is German in the formal "Sie" register. Euro only, German formats (`1.234,56 €`, `24.10.2026`, `19 %`). No English leftovers in the UI, alt texts, meta data, error messages or emails. Product names stay as the vendor writes them.
2. **No fabrication.** Never invent reviews, testimonials, quotes, user counts, awards, test results, statistics, prices, features, team members or credentials. Vendor marketing claims (for example "über 250.000 Nutzer") appear only as attributed quotes with source and date, never as our fact.
3. **Honest wording.** Do not claim "getestet" unless a real hands-on test with a real account happened and is documented (date, plan, tester). Otherwise say "recherchiert" and explain the basis. A section without real data is hidden, never filled with filler, zeros or "demnächst".
4. **Disclosure.** Every affiliate or sponsored link is labeled next to the content it affects ("Anzeige" or "Affiliate-Link" with a short explanation link to `/transparenz`), and carries `rel="sponsored nofollow noopener"`. Commercial interest never changes a score, a ranking, a Finder result or an award.
5. **German market availability.** Only list a product as recommended if it is actually sold to German businesses and its German compliance status is verified. Verify every product's current availability and name before writing (for example: lexoffice is now called Lexware Office; check whether QuickBooks and FreshBooks currently serve German businesses and whether they meet GoBD, E-Rechnung and DATEV needs). Products that are not suitable get an honest "Für Deutschland nur eingeschränkt geeignet" note or are left out.
6. **Privacy by default.** No request to any third party before consent where the law requires consent. Fonts and logos are self hosted. Analytics cookieless. No embedded YouTube, maps or social widgets without a click-to-load consent placeholder. Collect the minimum data for a stated purpose.
7. **Accessibility.** WCAG 2.2 AA on every template.
8. **Real assets only.** No lorem ipsum, no fake logos, no AI generated people or images presented as real, no AI generated product screenshots. Vendor logos only from official press kits or websites, with source in `docs/LOGOS.md`.
9. **Secrets.** Never commit keys, tokens or `.env` files (only `.env.example` without values). Check every staged diff for secrets before committing.
10. **Docs match code.** When a change adds a processor, a cookie, a form or a partner, the privacy text and the disclosure texts change in the same commit.
11. **Verify before you claim.** Run the checks (Section 12) and say plainly what passed, what failed and what you could not check.

---

## 4. Technology policy: always the latest stable

**Use the very latest stable version of every package, tool and runtime, verified live on the day you install it. Never copy versions from this file, from an older project or from your memory.**

1. **Look up each version live** with `npm view <package> version` and `npm view <package> dist-tags`. Use the `latest` tag only. Never canary, beta, RC, `next` or `experimental`. Check the Node.js Active LTS and the newest stable pnpm the same way.
2. **Scaffold with the official latest tooling** (`pnpm create next-app@latest`, then `pnpm dlx shadcn@latest` if used). Accept the newest defaults.
3. **Read the bundled docs** in `node_modules/next/dist/docs/` and the changelog before writing code. Heed deprecations. Follow any `AGENTS.md` block the framework ships.
4. **Check compatibility** after installing: peer check, typecheck, lint, production build.
5. **Resolve conflicts the right way.** If the very latest version breaks something, use the newest version that works, never an old one out of habit, and never weaken a security policy. Log the reason and a "revisit when" note in `docs/DECISIONS.md`.
6. **Pin exact versions** in `package.json`, commit the lockfile, pin `packageManager` and `engines`.
7. **Re-check at the end of every phase** with `pnpm outdated` and report.
8. **Minimum release age.** If a package is blocked by the package manager's release age policy, do not disable the policy; use the newest version outside the window and note it.
9. **Prefer built-in platform features** over extra dependencies. Every added package needs a one-line reason.

### 4.1 Capability map

Core:

| Capability                  | Choice                                                                        |
| --------------------------- | ----------------------------------------------------------------------------- |
| Runtime and package manager | Node.js Active LTS, pnpm                                                      |
| Framework                   | Next.js App Router, Turbopack, React Server Components, React, React Compiler |
| Language                    | TypeScript strict                                                             |
| Styling                     | Tailwind CSS with CSS first theme tokens (Section 13.4)                       |
| Validation                  | Zod for every input, content file and environment value                       |
| Lint, format                | ESLint flat config, Prettier                                                  |
| Tests                       | Vitest, Playwright, axe                                                       |
| Fonts and images            | `next/font/local` with self hosted WOFF2 files, `next/image`                  |
| SEO                         | Metadata API, `sitemap`, `robots`, `manifest`, Open Graph images              |

Needed by this brief:

| Need               | Choice                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| UI primitives      | Radix UI or shadcn/ui, fully restyled to Section 13                                                |
| Class variants     | class-variance-authority, clsx, tailwind-merge (teach `cn()` the custom utilities)                 |
| Animation          | the `motion` library, loaded lazily, only for the motions in Section 13.8                          |
| Charts             | hand made SVG (score bars, price comparison), always with a table alternative                      |
| Icons              | lucide-react, rules in Section 13.9                                                                |
| File based content | Content Collections with MDX and Zod schemas (profiles, guides, authors)                           |
| Dynamic data       | user reviews and newsletter consent: Postgres through an ORM (owner picks the provider, EU region) |
| Forms              | react-hook-form with Zod resolvers, server actions                                                 |
| URL state          | nuqs (filters, comparison, Software-Finder)                                                        |
| Search             | Fuse.js with a build time index, cmdk command palette                                              |
| Email              | provider interface; concrete provider `{{MAIL_PROVIDER}}` added later                              |
| Analytics          | Vercel Web Analytics (cookieless) or Plausible EU                                                  |
| Server only code   | `server-only`                                                                                      |

### 4.2 Known pitfalls (re-test, newer versions may have fixed them)

- `next/font/google` under Turbopack emitted system fallback faces. Use `next/font/local` with your own WOFF2 subsets.
- The Tailwind preflight writes system font stacks. Copy it into the project, remove them, and add a `check:css` script that fails on any font family other than Google Sans Flex and Inter and on any color outside the tokens.
- `tailwind-merge` can drop a line-height class placed before a custom size class. Teach `cn()` your custom utility names.
- A server component cannot pass functions to a client component.
- With Cache Components, an empty `generateStaticParams` fails the build. Return a placeholder param and call `notFound()` for it.
- Content Collections can skip documents with schema errors silently. Write a validation script that turns every event into a failure and run it before `next build`.
- Scripts and app code that share modules import with explicit `.ts` extensions and no path alias.
- Build-time values that change rendered content must be inlined at build time to avoid hydration errors.
- `next/og` cannot read variable fonts. Generate static instances for share images.
- A forgotten `noindex` from Phase 0 blocks the whole site. "Switch indexing on" is on the launch checklist.

---

## 5. Architecture principles

1. **Content first.** Content lives in typed MDX/JSON files or the database behind `lib/content`. Pages call `getSoftware(slug)`, `getCategory(slug)`, `getAlternatives(slug)` and never read files directly.
2. **Server by default.** Client components only for interactive islands (Finder, comparison picker, filters, search palette, forms, review form, tabs).
3. **One config file.** `site.config.ts` holds brand, legal data, contact data and feature flags (`newsletter`, `userReviews`, `consultationRequest`, `affiliateLinks`, `analytics`).
4. **Pure logic in plain modules** with unit tests: price formatting, score calculation, Finder matching, filter logic, affiliate URL resolution, slug and URL building.
5. **One URL builder** (`lib/routes.ts`) builds every internal link.
6. **Route groups.** Public pages share one shell layout. The internal styleguide (`/intern/styleguide`) uses labeled fictitious demo data, sits outside the shell and is `noindex`.
7. **Validation at the edges.** Zod at build time, on client and server for forms, and for environment variables at start.
8. **Docs folder.** `BUILD_PROMPT.md`, `PLAN.md`, `DECISIONS.md`, `CONTENT_STATUS.md`, `SEO.md`, `LOGOS.md`, `SOURCES.md`.

---

## 6. Content model

Entities (Zod schema for each, build fails on any error):

- **Vendor**: legal name, HQ country, website, data center locations, privacy page URL, AVV/DPA available (yes/no + source).
- **Software**: slug, name, vendor ref, categories (refs), short summary (max 160 chars), long review (MDX), target groups (enum: Freiberufler, Kleinunternehmer, KMU, Mittelstand, Agenturen, Handwerk, E-Commerce, Vereine and others), deployment (Cloud, Desktop, Hybrid), apps (Web, iOS, Android), German compliance block (GoBD, XRechnung/ZUGFeRD send and receive, DATEV export, ELSTER/UStVA, Kleinunternehmer support, bank connection, server location EU/DE, ISO 27001 or similar), each with value, source URL and access date, free trial (days or none), free plan (yes/no), pros (3 to 6, specific), cons (3 to 6, specific), editorial verdict, ideal for / not ideal for, logo path, real screenshots, status, verification flag, last reviewed date, author ref, reviewer ref.
- **Plan**: software ref, plan name, price in integer cents, billing (monthly, yearly), net or gross, per user or flat, included limits, source URL, access date. A price older than 90 days fails the production build until it is re-verified.
- **Feature**: a controlled vocabulary per category (for example Angebote, Rechnungen, wiederkehrende Rechnungen, Mahnwesen, Belegerfassung per OCR, Bankabgleich, Kassenbuch, EÜR, Bilanz, Lohn, Lager, Projektzeiten, Mehrwährung, API, Steuerberaterzugang). Software lists features with `yes`, `no`, `partly` (with note) or `paid add-on`, each with source.
- **Category**: slug, name, intro, buying guide (MDX), ranking criteria shown on the page, related categories, launch order.
- **Rating** (editorial): criterion scores per software, computed total with one decimal, method version.
- **UserReview** (database): software ref, ratings per criterion, pros text, cons text, company size, industry, role, usage duration, verification method, moderation status, incentive flag. Never mixed with the editorial score.
- **Comparison**: two or three software refs, central question, editorial verdict, only published if it has real editorial value.
- **Article** (Ratgeber): slug, title, central question, topic, MDX body, sources, author, reviewer, dates.
- **Author**: real person only (`realPerson: true`), name, role, bio, photo (real), expertise, links.
- **AffiliateLink**: software ref, network, target URL, sub id parameter name, active flag, added date, checked date. Lives only in content data.

Rules:

- Every item has `status` (`draft` / `published`) and, where facts matter, `verification` plus sources with access dates. Production shows only published and verified content; dev shows drafts with a visible "Entwurf" marker.
- Money is integer cents in euro, dates are ISO dates.
- References resolve by slug; an unresolved reference fails the build.
- Build guards: stale prices (90 days), stale compliance facts (180 days), missing sources, future dates (UTC clock), duplicate slugs, banned wording, claims without evidence, "getestet" without a documented test, a software page with fewer than three pros or cons.
- Copy lint (`scripts/lint-copy.ts`) checks content and UI strings through the TypeScript AST: banned phrases (Section 10), English leftovers, "Du" instead of "Sie", wrong number or currency format.
- Categories, sections and pages with no content are hidden.

MDX components: `KeyFigure` (with source), `SourceTable` (caption and source), `Note`, `ProsCons`, `FeatureMatrix`, `PriceTable`, `ScoreBreakdown`, `ComplianceChecklist`, `Steps`. Charts read only the site's own data.

---

## 7. Information architecture (starting proposal; Claude refines it in Phase 0 and the owner approves)

German slugs, lowercase, no trailing slash, umlauts transliterated (`ue`, `oe`, `ae`, `ss`), one canonical URL per page.

| Page type          | URL                                                                        | Question it answers                                       |
| ------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| Home               | `/`                                                                        | Where do I start, what can this site do for me?           |
| Category hub       | `/kategorien`                                                              | Which software categories exist?                          |
| Category page      | `/kategorien/buchhaltungssoftware`                                         | Which accounting tools are best for which business?       |
| Software profile   | `/software/sevdesk`                                                        | Is this tool right for me? Features, prices, pros, cons   |
| Pricing page       | `/software/sevdesk/preise`                                                 | What does it really cost me per year?                     |
| Alternatives       | `/software/sevdesk/alternativen`                                           | What else should I consider and why?                      |
| User reviews       | `/software/sevdesk/bewertungen`                                            | What do real users say?                                   |
| Comparison         | `/vergleich/sevdesk-vs-lexware-office`                                     | Which of these two fits me better?                        |
| Comparison tool    | `/vergleich`                                                               | Compare any 2 to 3 tools side by side                     |
| Software-Finder    | `/software-finder`                                                         | Which tool fits my requirements?                          |
| Cost calculator    | `/kostenrechner`                                                           | What will my setup cost over 12 and 36 months?            |
| Guides hub         | `/ratgeber`                                                                | What must I know before choosing?                         |
| Guide article      | `/ratgeber/e-rechnung-pflicht`                                             | One central question per article                          |
| Glossary           | `/glossar`, `/glossar/gobd`                                                | What does this term mean?                                 |
| Write a review     | `/bewertung-schreiben`                                                     | How do I share my experience?                             |
| Methodology        | `/methodik`                                                                | How are scores and rankings calculated? (§ 5b Abs. 2 UWG) |
| Review policy      | `/bewertungsrichtlinien`                                                   | How are user reviews verified? (§ 5b Abs. 3 UWG)          |
| Transparency       | `/transparenz`                                                             | How is the site financed, who are the partners?           |
| Editorial team     | `/redaktion`, `/redaktion/[author]`                                        | Who writes and checks this?                               |
| About, contact     | `/ueber-uns`, `/kontakt`                                                   |                                                           |
| Newsletter         | `/newsletter`, `/newsletter/bestaetigen`                                   |                                                           |
| Legal              | `/impressum`, `/datenschutz`, `/barrierefreiheit`, `/cookie-einstellungen` |                                                           |
| Search results     | `/suche` (noindex)                                                         |                                                           |
| Affiliate redirect | `/go/[slug]` (noindex, disallowed in robots)                               |                                                           |

Navigation proposal:

- **Header:** logo, Kategorien (mega menu with the launch categories), Vergleich, Software-Finder, Ratgeber, search (opens command palette with `Strg K` / `⌘ K`), primary button "Software finden".
- **Footer:** short mission line, column Kategorien, column Werkzeuge (Finder, Vergleich, Kostenrechner), column Über uns (Methodik, Bewertungsrichtlinien, Transparenz, Redaktion, Kontakt), legal row, giant wordmark (Section 13.7).
- **Mobile:** full screen menu, search first, categories as a list, sticky bottom "Software finden" only on profile and category pages.

Launch order of categories: 1. Buchhaltungssoftware, 2. Rechnungsprogramme, 3. ERP-Software, 4. CRM-Software, 5. Warenwirtschaft, 6. Lohnabrechnung, 7. Projektmanagement. Only categories with at least five published profiles go live.

Conversion path: search or guide → category page → profile (verdict, price, pros/cons) → "Zum Anbieter" (affiliate, labeled) or → Software-Finder → shortlist → profile or comparison → affiliate. Secondary: newsletter, later consultation request.

Deliver the proposal as a short table plus a sitemap diagram (Mermaid) in `docs/PLAN.md`.

---

## 8. Feature modules

- **Editorial ratings.** Score name: `{{SCORE_NAME}}` (proposal: "Stackwahl-Wertung"), 0.0 to 10.0 with one decimal. Proposed criteria and weights, shown on `/methodik` and in each `ScoreBreakdown`: Funktionsumfang 25 %, Bedienung 20 %, Preis-Leistung 20 %, Rechtssicherheit in Deutschland (GoBD, E-Rechnung, DATEV, ELSTER) 20 %, Support und Datenschutz (Serverstandort, AVV, deutschsprachiger Support) 15 %. Owner approves the weights. Awards ("Empfehlung der Redaktion", "Preis-Leistungs-Tipp") are computed from data with published thresholds and are never sold. A method version and date appear on every score.
- **User reviews.** Form with ratings per criterion, pros, cons, company size, role and usage duration. Verification by confirmed email plus one proof (screenshot of the account or invoice, deleted after check) and a moderation queue. Critical reviews are never suppressed. Incentivized reviews are labeled. The site states on every review block, linked to `/bewertungsrichtlinien`, whether and how reviews are verified (§ 5b Abs. 3 UWG). User averages are shown separately from the editorial score and only from a minimum of five verified reviews.
- **Software-Finder.** 6 to 9 short steps: business type and legal form, team size, industry, main needs (multi select from the feature vocabulary), Steuerberater with DATEV (yes/no), E-Rechnung needs, budget per month, preferred deployment, must-haves. A pure, unit tested matching function scores every published software, then shows a shortlist of three with a plain German explanation per match ("passt, weil …", "beachten Sie …"). State lives in the URL (nuqs), no personal data is stored, results page is `noindex`. Commercial status never affects the matching, and the result page says so.
- **Comparison.** Pick 2 to 3 tools, side by side feature matrix, prices, compliance block and scores, sticky header with product names, URL state, "Unterschiede hervorheben" toggle, table alternative for every chart. Editorial comparison pages only for real demand pairs.
- **Cost calculator.** Users, plan, billing period, add-ons → cost over 12 and 36 months net and gross, explained in words, with price dates.
- **Filters and sorting** on category pages: target group, price range, free plan, trial, DATEV, E-Rechnung, server in Germany, features. Default sort is the editorial score; sort options are explained (§ 5b Abs. 2 UWG).
- **Affiliate system.** Affiliate URLs only in content data. Pages link to `/go/[slug]?from=<place>&pos=<n>` with whitelisted values and no personal data. The route resolves the target with a pure function, appends the network's sub id, answers 307 with `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, `Referrer-Policy: strict-origin-when-cross-origin`, counts the click anonymously, and falls back to the profile for inactive or unknown slugs. `robots.txt` disallows `/go/`. Before the owner has approved programs, the button links to the vendor's website without tracking and without the label. Partner blocks are labeled, alphabetical and say that they are not a ranking.
- **Forms and email.** Contact form and (flagged) consultation request: shared Zod schema, honeypot, rate limit per form and client, German messages linked with `aria-describedby`, success only after the mail provider accepted the message, provider interface with a local outbox for tests. The consultation request names the exact recipient of the data before submit and needs explicit consent; it stays off until the owner names a partner.
- **Newsletter.** Double opt in: create the contact unsubscribed, send a sealed token link (authenticated encryption, expiry, no address inside), the link opens a page and a button click confirms, consent is logged without personal data beyond what the law needs.
- **Search.** Build time index over software, categories, guides and glossary, German normalization (umlauts, ß, compound words where feasible), command palette, `noindex` results page.

---

## 9. Legal, privacy and trust (Germany)

Claude drafts structure and texts, and every phase report states that a lawyer must review them before launch.

- **Impressum** under § 5 DDG with the owner data from Section 0, and the responsible person under § 18 Abs. 2 MStV. Optional blocks (VAT ID, register entry) hidden while their value is null.
- **Datenschutzerklärung** naming every processor with address and transfer basis: Vercel (hosting, USA, EU-US Data Privacy Framework and SCCs), IONOS (domain, DNS), the mail provider, the database provider, the analytics provider. Purpose, legal basis and retention per data flow. Explain the affiliate redirect, that the vendor or network may set cookies after the visitor leaves the site, review verification and newsletter consent. It never contradicts itself.
- **Consent** under § 25 TDDDG and GDPR: driven by a service list, no banner while the list is empty, settings page always available, equal "Ablehnen" and "Akzeptieren" buttons, no dark patterns.
- **Transparenz** page: how the site is financed, current partners, what commercial interest can and cannot influence.
- **Methodik** page: criteria, weights, data sources, update cycle, ranking parameters and their weighting (§ 5b Abs. 2 UWG).
- **Bewertungsrichtlinien**: whether and how reviews are verified, moderation rules, what gets removed and why, no suppression of negative reviews (§ 5b Abs. 3 UWG, UWG Annex no. 23b and 23c).
- **Redaktion** page with real named people only.
- **Erklärung zur Barrierefreiheit** (check whether the BFSG applies and say so; build to WCAG 2.2 AA in any case).
- **Trademark note**: product names and logos belong to their owners, used for identification only.
- Advertising labels follow UWG § 5a Abs. 4 ("Anzeige" / "Werbung" where content is paid).

---

## 10. Content writing system

- **Persona.** Senior German Fachredakteur for business and accounting software, formal "Sie", calm, concrete, helpful. Mix short and long sentences. Use clearly framed example scenarios ("Eine Freiberuflerin mit 15 Rechnungen pro Monat …").
- **Accuracy.** Every fact has a source (vendor pricing page, help center, documentation, law, BMF letter) stored with its access date in the content file and in `docs/SOURCES.md`. Research with live web access and read the original page. Read pricing pages in the German version and in euro. Verify current product and plan names. Leave out what you cannot verify.
- **German compliance focus.** Every accounting profile answers: GoBD, E-Rechnung send and receive (XRechnung, ZUGFeRD), DATEV export or interface, ELSTER/UStVA, Kleinunternehmerregelung, bank connection, server location, AVV. Context such as the E-Rechnung timeline (receiving mandatory since 1 January 2025, sending phased in 2027 and 2028 depending on turnover) is taken from the BMF primary source, with date.
- **Never templated.** Each profile and guide has its own central question, opening, headings and structure. Before writing a new page, scan existing pages in the same area and rewrite when openings, headings or five word sequences repeat.
- **Honest weaknesses.** Real, specific cons in every profile ("Keine Lohnabrechnung, dafür ist ein Zusatztool nötig"), never "kann für Anfänger komplex sein" without specifics.
- **Banned phrases** (enforced by the copy lint): "revolutionär", "bahnbrechend", "Game-Changer", "nahtlos", "im heutigen digitalen Zeitalter", "Tauchen wir ein", "ultimativ", "einer der führenden" (unless attributed), "die beste Software" without qualifier, "100 % rechtssicher", "garantiert", "Entfesseln Sie", exclamation marks in headings, emoji in UI and content.
- **Length by purpose.** Never pad. If a target is missed, say so and why.
- **Internal links.** Each long page links to its category, two or three related profiles or comparisons, a relevant guide and a next step (Finder or comparison).

---

## 11. SEO, performance, accessibility

- `generateMetadata` on every route, canonical URLs, `de-DE` locale, title template "… | Stackwahl", meta descriptions of at most 155 characters, German keyword phrasing taken from ranking pages and logged in `docs/SEO.md`.
- OG images per page type (software, category, comparison, guide) with the framework's OG API in the site design.
- Structured data that truly applies: Organization and WebSite (with SearchAction) on home, BreadcrumbList everywhere, SoftwareApplication with Review (editorial) and AggregateRating (only from real verified user reviews) on profiles, ItemList on category pages, Article on guides, FAQPage only where a visible FAQ exists.
- `sitemap` with `lastModified` from content; noindex pages stay out. `robots` disallows `/go/`, `/intern/`, `/suche`. Indexing is switched on only when launch content is published.
- No thin programmatic pages: no "X vs Y" or "Alternativen" page without unique editorial value.
- **Budgets (mobile p75):** LCP 2,0 s, INP 200 ms, CLS 0,05; Lighthouse performance 90+, accessibility 100, best practices 100, SEO 100; small first load JavaScript on content pages, heavy widgets loaded lazily.
- **Accessibility:** landmarks, skip link ("Zum Inhalt springen"), visible focus ring in the primary color, keyboard support for every widget (tabs, menus, Finder, comparison, palette), 44 px touch targets, color never the only signal (pros and cons use text and plus/minus marks), reduced motion respected.
- **Security headers:** nonce based CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, set in Phase 6 and tested against analytics, forms and OG images.

---

## 12. Hosting, environments and quality gates

- Vercel, function region `fra1`, sign the Vercel DPA. Domain at IONOS pointed to Vercel. Pin the package manager.
- `.env.example` lists every variable without values. Real values live in `.env.local` (git ignored) and in Vercel.
- Scripts: `dev`, `build` (validate content, build search index, framework build), `lint`, `lint:copy`, `format:check`, `typecheck`, `test`, `test:e2e`, `content:validate`, `check:css`, `placeholders`.
- CI on every push: frozen lockfile install, format check, lint, copy lint, typecheck, unit tests, build, compiled CSS check, E2E with axe at 390 px and 1440 px width.
- Before every push: all of the above pass, fetch the remote first, check the staged diff for secrets.
- Report honestly: failed or skipped checks are named with output.

---

## 13. Design brief

### 13.1 Personality

Clean, cool, modern, premium. Think of a calm Swiss editorial magazine crossed with a precise fintech product: lots of air, large confident typography, few colors, flat surfaces, sharp hierarchy. It should feel trustworthy and expensive, never loud, never playful, never "AI generated".

### 13.2 What to take from the reference images

These are references for layout, rhythm and components only. Do not copy their content, colors outside our palette or their imagery.

**Reference 1 (biotech landing page):**

- Content sits in large rounded panels that float on the light page background with a small gutter (the hero and the footer are inset panels, not full bleed).
- Huge display headline, light weight, tight letter spacing, two or three lines.
- Small uppercase eyebrow labels with a small square marker ("■ UNSERE METHODIK") placed in the left column while the heading sits in the right columns (asymmetric 12 column grid: label in columns 1 to 3, content in columns 5 to 12).
- A headline where the last words are set in a muted tone ("… in eine **klare Entscheidung.**" with the last part in gray) for emphasis without color.
- A three tile band, edge to edge inside the container, each tile a different flat fill (primary, ink, white), number top right ("01."), fine line illustration top left, title and one short line at the bottom.
- One oversized single line statement that scrolls slowly horizontally (marquee), used once on the home page.
- A two column text block next to a real photo with rounded corners.
- News cards: large featured card with image left and text right, then three smaller cards in a row with tag, date, title and a "Weiterlesen" link with an attached arrow button.
- Dark footer panel with navigation columns and a giant wordmark across the full width at the bottom.
- Buttons: dark rounded button with small uppercase label plus a separate square segment that holds the arrow.

**Reference 2 (testimonial card):**

- A white rounded card overlapping a large real photo, large quote text with tight tracking, small pill button, name and company below a hairline, outline arrow controls.
- Use this pattern for **"Fazit der Redaktion"** (real author photo, real editorial verdict) and for **verified user review excerpts**. Never for invented testimonials.

**Reference 3 (dark journey section):**

- Segmented pill control with numbered steps ("01 Anforderungen", "02 Vergleich", "03 Kosten", "04 Entscheidung") that switches large cards.
- Large rounded cards with a flat solid color field on the left and a real image on the right, small uppercase step label above a bold uppercase heading.
- Use for "So finden Sie die passende Software" on the home page and as the visual language of the Software-Finder. Replace the yellow and lavender of the reference with our palette (primary and its solid tint, ink, white).

**References 4 to 6 (SoftwareSuggest, Appvizer):** take the information architecture only:

- Breadcrumbs, product header with logo, name, score and two actions, a sticky tab bar (Überblick, Funktionen, Preise, Vor- und Nachteile, Alternativen, Bewertungen), a right sidebar with an alternatives list and a CTA card, an alternatives grid with logo, name, price and action.
- Do better than them: one primary action color only, no repeated "Free Demo" buttons on every card, no self-awarded badges, no default lead form in the sidebar, no foreign country codes in forms (default `+49`), no cartoon stock illustrations, no unsourced claims, no cluttered nav with five competing buttons.

### 13.3 Color tokens (flat only)

| Token                                  | Value                                                                                                 | Use                                                            |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `--color-primary`                      | `#2F2FC1`                                                                                             | primary buttons, links, focus ring, key accents, one tile      |
| `--color-primary-ink`                  | darker solid shade of primary computed for hover and pressed (for example `#2424A0`), verify contrast | hover, pressed                                                 |
| `--color-primary-tint`                 | light solid tint of primary (for example `#E6E6F8`), verify contrast                                  | selected states, subtle highlights, tile fill                  |
| `--color-ink`                          | `#191919`                                                                                             | text, dark panels, footer, dark buttons                        |
| `--color-bg`                           | `#F1F1F1`                                                                                             | global page background                                         |
| `--color-surface`                      | `#FFFFFF`                                                                                             | cards and panels on the background                             |
| `--color-muted`                        | gray derived from ink (for example `#6B6B6B`), at least 4.5:1 on bg and surface                       | secondary text, muted headline part                            |
| `--color-line`                         | hairline gray (for example `#DCDCDC`)                                                                 | dividers, card borders                                         |
| `--color-positive`, `--color-negative` | one restrained green and one restrained red, AA compliant                                             | only for pros/cons marks and form validation, always with text |

Rules: no gradients anywhere (backgrounds, text, buttons, images overlays, borders), no glow, no colored shadows, no glassmorphism or blur panels, no extra accent colors. Shadows at most one very soft neutral shadow for floating elements (menus, palette); cards use the surface color and a hairline instead. White text on primary and on ink must pass AA. Verify every pair with a contrast check and record the results in `docs/DECISIONS.md`.

### 13.4 Typography

- **Display and headings:** Google Sans Flex (open source under the SIL Open Font License since November 2025; download the official files, subset to Latin plus German characters, self host as WOFF2, keep the license file). Weights 400 to 500 for large display, 500 to 600 for small headings. Letter spacing about `-0.03em` at display sizes, `-0.01em` for headings.
- **Body and UI:** Inter (self hosted WOFF2, OFL), 400 and 500, 600 for emphasis. Use tabular numbers (`font-variant-numeric: tabular-nums`) for prices, scores and tables.
- **Eyebrow labels:** Inter 500, 11 to 12 px, uppercase, letter spacing `0.08em`, preceded by a 6 px square marker in primary. No monospace font (the references use one; we replace it with this label style).
- **Fluid scale** with `clamp()`: display 56 to 112 px, h1 40 to 72 px, h2 32 to 48 px, h3 22 to 28 px, body 16 to 18 px, small 14 px. Line height 1.0 to 1.05 for display, 1.15 for headings, 1.6 for body. Measure 60 to 72 characters for body text.
- No other font may appear in the compiled CSS (enforced by `check:css`).

### 13.5 Layout and grid

- Max content width 1360 px, 12 columns, 24 px gutters desktop, 16 px side gutter mobile.
- Page panels: large sections sit in rounded panels (`radius 28 px` desktop, `20 px` mobile) inset 12 to 16 px from the viewport edge, alternating `--color-bg` and `--color-surface`, with the hero and footer as panels.
- Radii: panels 28 px, cards 20 px, inputs and buttons 12 px, pills full.
- Vertical rhythm: section padding 96 to 160 px desktop, 64 to 96 px mobile. Generous white space is part of the premium feel.
- Hairline dividers between list rows instead of boxes where possible.

### 13.6 Signature components

1. **Split button**: ink or primary rounded body with a label (Inter 500, 14 px, sentence case or small uppercase), joined to a square segment of the same button that holds a thin arrow. The square segment is part of the button shape, not a badge behind an icon. Variants: primary (blue), dark (ink), outline. Hover: the arrow moves 2 px, the colors shift to the ink/hover token. Only one primary button per view.
2. **Eyebrow label** with square marker.
3. **Muted tail headline** (last words in `--color-muted`).
4. **Feature tile band** with numbers and line illustrations (home: the three pillars "Unabhängig bewertet", "Deutsche Rechtslage im Blick", "Passend zu Ihrem Bedarf").
5. **Software card**: real logo on white (no colored circle behind it), name, category, editorial score with one decimal, "ab 9,90 € / Monat zzgl. MwSt." with price date tooltip, two or three key facts (DATEV, E-Rechnung, Server in DE), one action. Label "Affiliate-Link" when applicable.
6. **Score display**: large number with one decimal in Google Sans Flex, score name, a thin horizontal bar per criterion, method version link.
7. **Pros and cons**: two columns, plus and minus marks in text color plus the positive/negative token, never color alone.
8. **Compliance checklist**: rows with criterion, status (Ja / Nein / Teilweise / Gegen Aufpreis), note and source link.
9. **Sticky profile header and tab bar** on software pages (tabs follow the WAI-ARIA tabs or in-page navigation pattern with scroll spy).
10. **Comparison table** with sticky first column and sticky product headers, "Unterschiede hervorheben" switch.
11. **Step cards with segmented control** (from reference 3) for the Finder and the home process section.
12. **Editorial verdict card** overlapping a real author photo (from reference 2).
13. **Guide cards** in the newsroom layout from reference 1 (tag, date, title, "Weiterlesen").
14. **Command palette** for search (`Strg K`), flat, white, hairline, no blur.
15. **Giant footer wordmark** on the ink panel.

### 13.7 Home page composition (proposal)

1. Inset hero panel: real photo (German office or team working on invoices, licensed) or a calm real product screenshot collage on flat color, display headline (for example "Die richtige Software für Ihr Unternehmen. **Unabhängig verglichen.**"), one line of subtext, primary split button "Software finden" and secondary "Kategorien ansehen", search field.
2. Row of real vendor logos in grayscale, labeled "Bewertete Software" (not "Partner", not "Bekannt aus").
3. Eyebrow + muted tail heading + short paragraph about the method, link to `/methodik`.
4. Feature tile band (3 tiles, numbered).
5. Categories grid (only live categories) with count of reviewed tools.
6. Process section with segmented control (01 to 04) and large step cards, leading into the Finder.
7. "Beliebte Vergleiche" list with hairline rows.
8. Editorial verdict card with real author photo.
9. One marquee line ("Klar vergleichen. Sicher entscheiden.") respecting reduced motion.
10. Ratgeber section in the newsroom layout.
11. Newsletter panel.
12. Footer panel with giant wordmark.

### 13.8 Motion

Subtle and purposeful: fade and 8 to 16 px rise on scroll for section headings, arrow nudge on button hover, tab underline slide, segmented control indicator slide, marquee at slow speed. Durations 150 to 400 ms, ease out. No parallax, no bouncing, no animated gradients, no typewriter effects, no particle or glow effects. Everything stops under `prefers-reduced-motion`.

### 13.9 Icons

- lucide-react only, stroke 1.5 px, size 16 to 24 px, color `currentColor` (ink, muted or primary).
- **No background behind icons**: no circles, squares, blobs or tinted containers behind icons.
- **No "AI" icons**: no sparkles, stars-with-sparkles, magic wands, robot heads, brains, lightning bolts as decoration, no emoji.
- Icons only where they help understanding (search, arrow, check, minus, external link, info, menu, close, filter). No decorative icon rows.

### 13.10 Logo and wordmark

Claude proposes a wordmark "Stackwahl" in Google Sans Flex (medium weight, tight tracking) with an optional simple geometric mark: three stacked horizontal bars (the stack) where one bar is set in primary (the choice). Flat, no gradient, no container behind it. Delivered as SVG, works in ink on light and white on ink, favicon and app icon derived from it. Three options in the styleguide; the owner chooses.

### 13.11 Imagery

- **Real product screenshots** taken by the editors in trial accounts are the main imagery on profiles (dated, cropped, sensitive data removed, stored in `public/screenshots/<slug>/`).
- **Real vendor logos** from official press kits, SVG preferred, original colors on profiles, grayscale in logo rows. Sources in `docs/LOGOS.md`.
- **Real photos**: real author portraits, and licensed photos of real people and offices (source and license in `docs/SOURCES.md`). No AI generated images, no cartoon stock illustrations like reference 5.
- **Illustrations**: custom fine line geometric SVGs drawn in code (1.5 px strokes in ink or primary, like the line art in reference 1), one per category and pillar. No 3D blobs, no isometric clip art, no gradient art.
- Images get rounded corners matching the card radius, real alt texts in German, `next/image` with sizes and priority only for the LCP image.

### 13.12 Anti-template list (banned)

Gradients of any kind, glassmorphism, glowing borders, neon accents, purple-to-blue hero blobs, sparkle icons, "AI powered" badges, icons in colored circles, emoji, generic three-card feature rows with icons on top, fake stats counters ("10.000+ zufriedene Kunden"), fake testimonial sliders, star ratings without a source, "Trusted by" logo walls, cookie walls, popups on entry, exit intent modals, autoplay video, chat bubbles, stock 3D illustrations, drop shadows on every card, more than one accent color, centered everything layouts.

---

## 14. Build phases (stop after each one)

| Phase           | Scope                                                                                                                                                                                                                                                      | Done when                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 0 Foundation    | git init, latest stack (Section 4), strict TypeScript, design tokens (13.3 to 13.5), self hosted Google Sans Flex and Inter, lint, format, tests, CI, `site.config.ts`, docs files, `noindex` everywhere, the IA proposal (Section 7) with sitemap diagram | proposal approved; install, build, lint, tests pass                      |
| 1 Design system | Every component from 13.6 and every state on `/intern/styleguide` with labeled fictitious demo data, three wordmark options, contrast table                                                                                                                | visual review approved, axe clean                                        |
| 2 Content layer | Schemas (Section 6), loaders, build guards with tests, copy lint, search index, first batch: 10 accounting and invoicing profiles with verified prices, features, compliance facts and sources                                                             | validation passes, every guard proven by a test                          |
| 3 Templates     | Home, category, profile (with tabs), pricing, alternatives, comparison, guide, glossary, author, methodology, transparency, review policy, legal pages with real first batch data                                                                          | every template renders, no visible placeholders except marked legal ones |
| 4 Interactivity | Software-Finder, comparison tool, cost calculator, filters, search palette, user reviews with moderation, contact form, newsletter, affiliate redirect, consent (Section 8)                                                                                | E2E flows pass                                                           |
| 5 Content       | Editorial batches with sources: remaining accounting tools, then ERP and CRM; launch guides (E-Rechnung, GoBD, DATEV, Kleinunternehmer, Buchhaltungssoftware wählen)                                                                                       | copy lint, similarity check and verification pass                        |
| 6 Hardening     | SEO, structured data, OG images, performance budgets, accessibility, security headers                                                                                                                                                                      | budgets met                                                              |
| 7 Launch        | Final QA, lawyer review, real assets, analytics, affiliate links from approved programs, DNS at IONOS to Vercel, redirects, indexing switched on                                                                                                           | checklist complete                                                       |

---

## 15. Final QA checklist

- [ ] Every visible string is German in the "Sie" register; no English leftovers.
- [ ] Euro only, German formats; every price has net/gross note, date and source.
- [ ] Only Google Sans Flex and Inter and only the color tokens appear in compiled CSS and computed styles; no gradients.
- [ ] No icon has a background container; no sparkle or "AI" icons; no emoji.
- [ ] No invented reviews, quotes, statistics, awards, people or tests; empty sections hidden.
- [ ] Every product is verified as available for German businesses; compliance facts are sourced and dated.
- [ ] Every affiliate link is labeled and has `rel="sponsored nofollow noopener"`; partner blocks labeled and not ranked; scores unaffected by partners.
- [ ] Methodology states ranking parameters and weights; review policy states how reviews are verified.
- [ ] No third party request before consent (network tab on a fresh profile).
- [ ] Impressum, Datenschutz, Barrierefreiheit complete and reviewed by a lawyer; privacy text names every processor.
- [ ] Forms and newsletter work end to end with the real provider; sender domain verified (SPF, DKIM, DMARC at IONOS DNS).
- [ ] Lighthouse and Core Web Vitals budgets met; axe zero violations; keyboard only walkthrough succeeds at 390 px and 1440 px.
- [ ] Sitemap, robots, canonicals, structured data validated; indexing switched on; unknown URLs give a real 404.
- [ ] 404 and error pages designed and tested in German; no secrets in the repository; production environment variables set in Vercel.
- [ ] `pnpm outdated` clean or every deviation explained in `docs/DECISIONS.md`.

---

## 16. First message to the owner

After reading this file, list the open placeholders (`{{CONTACT_EMAIL}}`, `{{CONTACT_PHONE}}`, `{{VAT_ID}}`, `{{RESPONSIBLE_EDITOR}}`, `{{MAIL_PROVIDER}}`, `{{AFFILIATE_NETWORKS}}`, `{{SCORE_NAME}}`, database provider) and ask only for those that block Phase 0. Then do Phase 0, including the information architecture proposal, and stop for approval.
