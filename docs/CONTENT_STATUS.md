# Content status

Updated 26.10.2026: everything published.

## Overview

| Area              | Status                          | Note                                                                                                                                                                                                                             |
| ----------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Software profiles | 20 published, verified          | `verification: verified` means every fact was read on the cited vendor page on its access date. Responsible: Dietmar Riedel.                                                                                                     |
| Vendors           | 17 records from Impressum pages | Lexware seat (Freiburg) confirmed via the Haufe X360 Impressum of the same company.                                                                                                                                              |
| Categories        | 3 published                     | Buchhaltungssoftware (13), Rechnungsprogramme (12), ERP-Software (6)                                                                                                                                                             |
| Authors           | 1                               | Dietmar Riedel, Herausgeber and responsible under § 18 Abs. 2 MStV. Bio uses only facts from the Impressum. No photo yet.                                                                                                        |
| Guides            | 10 published                    | Responsible: Dietmar Riedel.                                                                                                                                                                                                     |
| Glossary          | 5 published                     | Responsible: Dietmar Riedel.                                                                                                                                                                                                     |
| Legal pages       | live, lawyer review open        | kontakt@ in Impressum and Datenschutz; Kontakt lists kontakt@, redaktion@ and partner@. Phone and VAT ID optional, hidden until provided. Hosting DPA and log retention from Vercel's pages.                                     |
| Vendor logos      | 16 vendors                      | Sources in LOGOS.md. Sage logo also on Sage 50, Sage 50 Handwerk and Sage 100. Collmex only as a small PNG. WISO MeinBüro: only a white logo is published.                                                                       |
| Screenshots       | 9 press images, 4 vendors       | Lexware Office, Papierkram, FastBill (older UI), easybill. 22 official videos for 16 programs. Sources in MEDIA.md, requests in PRESS_REQUESTS.md.                                                                               |
| SEO               | indexable                       | robots.txt allows the site and names the sitemap (74 URLs). Canonical, Open Graph and social image on every page, JSON-LD for organization, website, breadcrumbs, software, item lists, articles, glossary terms and the editor. |

## Still open before or after launch

1. **Mail sending.** The addresses exist, but the contact form and newsletter stay hidden until a mail provider (`MAIL_PROVIDER`, `MAIL_TRANSPORT`, `MAIL_FROM`) is configured and named in the Datenschutz.
2. **Lawyer review.** The legal texts are live; the internal draft notice now shows only in development and preview builds.
3. **The editor's sign-off.** Dietmar Riedel is named as responsible for all content. He should read every profile and article; the facts and sources are in the content files.
4. **No hands-on test.** The editorial score (`rating`) still needs a documented test. Until then the Recherche-Wertung is shown, and the text says "recherchiert", never "getestet".

## First batch (accessed 24.10.2026, reviewed again 26.10.2026)

On 25.10.2026, 30 of 55 open facts and two trial periods were filled from vendor pages. On 26.10.2026 every profile got a long review (8 sections) from freshly fetched vendor pages, and the facts were checked against those pages again. "Unbekannt" is shown as "Keine Angabe", never as "Nein".

Changes found on 26.10.2026: BuchhaltungsButler UStVA per Elster and Kleinunternehmer confirmed; Lexware DATEV integration confirmed on the Kernfakten page; Papierkram apps for iOS and Android, GoBD certification of all paid versions and a second data center in Hamburg; Sage Active new terms since 01.02.2026 (5 and 10 users, invoice limits, 14 or 30 days trial, monthly cancellation); easybill new plan Premium, 7-day trial, archive fees, bank connection, and the dead source `/produkte/invoice/` replaced; Billomat limit of 30 invoices in Professional and ticket support.

| Software           | Still `unbekannt`                                       | Other open items before publishing                                                                                       |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| sevdesk            | GoBD (only GoBD-compliant quotes are mentioned)         | A second price block shows 12,90 / 25,90 / 34,90 € for 24 months, the tariff table 8,90 / 19,90 / 27,90 €.               |
| Lexware Office     | Kleinunternehmer                                        | Users per version (the page refers to a Fair Usage Policy).                                                              |
| BuchhaltungsButler | None                                                    | A second add-on table names other prices and a package "Premium & Teams" that is not in the tariff table.                |
| FastBill           | App platforms                                           | UStVA is filled in automatically for Soll-Versteuerung; check Ist-Versteuerung.                                          |
| orgaMAX            | Web, iOS and Android apps                               | Comparison table shows 39 / 49 / 69 €, the plan cards 49 / 69 / 99 €. Browser or installed app?                          |
| WISO MeinBüro      | GoBD (only a paid GoBD webinar)                         | None.                                                                                                                    |
| Sage Active        | Kleinunternehmer, server location, AVV, app platforms   | Not listed among "Sage Cloud Services". E-invoice sending is announced, not live.                                        |
| Papierkram         | None                                                    | Plan limits (bank connections, AI extraction) only shown as table columns.                                               |
| easybill           | ELSTER (not an accounting tool), Kleinunternehmer, apps | Total cost needs archive fees and the Flex option.                                                                       |
| Billomat           | GoBD, ELSTER, Kleinunternehmer                          | Infrastructure details only in a 2018 magazine article (AWS Frankfurt); server location in German only via that article. |

## Batch 2 (accessed 25.10.2026)

Each profile has a long review (`review`, 8 sections) with the sources of every section listed under it. The text says "recherchiert", never "getestet"; the review guards (copy rules, test claims, source dates) cover it.

| Software         | Categories              | Prices                                                         | Still `unbekannt` and other open items                                                                    |
| ---------------- | ----------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Sage 50          | Buchhaltung, ERP        | Per workplace, yearly billing, minimum 2 or 3 workplaces       | ELSTER transmission path, Kleinunternehmer, AVV, apps.                                                    |
| Sage 50 Handwerk | Rechnungen              | Yearly billing; many modules on request                        | DATEV, ELSTER, Kleinunternehmer, bank, AVV. The FAQ names other editions (Start, Basic, Professional).    |
| Sage 100         | ERP                     | Per module and user, yearly billing; cloud on request          | Kleinunternehmer, AVV, apps, trial.                                                                       |
| weclapp          | ERP                     | Per user, monthly and yearly                                   | Kleinunternehmer, general apps. Support package prices: billing period not stated.                        |
| Xentral          | ERP                     | Flat per plan, monthly and yearly (yearly is the default view) | Server location, AVV, Kleinunternehmer, trial length. No UStVA by design (vendor statement).              |
| Haufe X360       | ERP                     | Minimum 449 € a month, example configurations only             | GoBD statement, DATEV, Kleinunternehmer, AVV, support, cost of the e-invoice connector.                   |
| Scopevisio       | ERP, Buchhaltung        | Example configurations only                                    | E-invoice output, ELSTER, Kleinunternehmer, AVV, support. GoBD page names two audit firms (HKKG and PwC). |
| Candis           | Buchhaltung             | From 389 € a month by invoice volume                           | Net or gross and term not stated; E-invoice output (not the product's purpose), ELSTER, bank.             |
| Collmex          | Buchhaltung, Rechnungen | Monthly, cancel to month end                                   | Apps. Pages are ISO-8859-1; quotes were converted.                                                        |
| Norman           | Buchhaltung, Rechnungen | Monthly and yearly, separate plans for UG and GmbH             | GoBD statement, e-invoice receiving.                                                                      |

## Researched and left out of batch 2

| Product                                | Finding on 25.10.2026                                                                                               | Decision                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Sage X3, Sage Intacct, Sage Operations | No public prices on sage.com/de-de (X3), product pages not reachable under the expected URLs (Intacct, Operations). | Not listed. A profile needs at least one sourced price.                                                                  |
| Sage HR & Payroll, Sage HR Suite       | Public prices exist (from 40 € for 5 employees; modules from 19 € in packs of 25 employees).                        | Deferred. Payroll needs its own checklist (SV-Meldungen, ELStAM, Lohnsteuer) instead of the accounting compliance block. |

## Researched and left out of batch 1

| Product    | Finding on 24.10.2026                                                                                                                                                                               | Decision                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| QuickBooks | `quickbooks.intuit.com/de/` returns 404. There is only a "global" edition with German as an interface language and no prices in euro, and no information on DATEV, ELSTER or XRechnung on the page. | Not listed as a recommendation (Section 3.5). A later guide can explain why QuickBooks suits German businesses only to a limited extent, with sources. |
| FreshBooks | The pricing page shows US dollars only and mentions no German VAT, DATEV, ELSTER or e-invoicing.                                                                                                    | Not listed (Section 3.5).                                                                                                                              |
| Odoo       | The pricing page shows prices by visitor location; from this machine it showed US dollars, so euro prices could not be verified.                                                                    | Planned for batch 2: read the euro prices from a German connection (or the owner checks them) before writing the profile.                              |
