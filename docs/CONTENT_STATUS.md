# Content status

Updated 26.10.2026, after batch 2 (ten more profiles with long reviews).

## Overview

| Area              | Status                          | Note                                                                                                                                                                                                |
| ----------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Software profiles | 20 drafts, researched           | Batch 1 and batch 2 below. All `status: draft`, `verification: unverified`. Batch 2 has long reviews.                                                                                               |
| Vendors           | 17 records from Impressum pages | Lexware seat (Freiburg) confirmed via the Haufe X360 Impressum of the same company.                                                                                                                 |
| Categories        | 3 drafts                        | Buchhaltungssoftware (13), Rechnungsprogramme (12), ERP-Software (6)                                                                                                                                |
| Authors           | missing                         | Needs real people (name, role, photo, bio) from the owner                                                                                                                                           |
| Guides            | missing                         | Phase 5                                                                                                                                                                                             |
| Legal pages       | missing                         | Drafted in Phase 3, lawyer review before launch                                                                                                                                                     |
| Vendor logos      | 9 vendors                       | Sources in LOGOS.md. Sage logo also on the three new Sage profiles. Not yet requested: weclapp, Xentral, Haufe, Scopevisio, Candis, Collmex, Norman. WISO MeinBüro: only a white logo is published. |
| Screenshots       | missing                         | Need real trial accounts                                                                                                                                                                            |

## Why everything is still a draft

1. **No author.** Production pages need a real named author (Section 3.7 and the `missing-author` guard). The owner has not named one yet.
2. **No hands-on test.** No product has been tested in a real account, so no product has an editorial score (`rating: null`, shown as "Noch nicht bewertet"). The text says "recherchiert", never "getestet". The `test-claim` guard enforces this.
3. **Editorial sign-off.** Every fact was read on the vendor's own page on 24.10.2026 or 25.10.2026, and its source is stored in the content file. A named editor should re-check the facts and set `verification: verified`.

## First batch (accessed 24.10.2026, completed 25.10.2026)

On 25.10.2026, 30 of 55 open facts and two trial periods were filled from vendor pages (AVV, ELSTER, DATEV, Kleinunternehmer, support, trial, apps, e-invoices, server location). The rest stay `unbekannt` until a vendor page or a test account shows them. "Unbekannt" is shown as "Keine Angabe", never as "Nein".

| Software           | Still `unbekannt`                                     | Other open items before publishing                                                                                                                 |
| ------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| sevdesk            | GoBD (only GoBD-compliant quotes are mentioned)       | A second price block on the pricing page shows different 24-month values (12,90 / 25,90 / 34,90 € struck through).                                 |
| Lexware Office     | Kleinunternehmer                                      | Users per version, vendor city.                                                                                                                    |
| BuchhaltungsButler | Kleinunternehmer                                      | The home page says "ab 24,95 €", the pricing page starts lower. Check which price applies before publishing.                                       |
| FastBill           | App platforms                                         | None.                                                                                                                                              |
| orgaMAX            | Web, iOS and Android apps                             | The comparison table on the pricing page shows 39,00 / 49,00 / 69,00 €. Browser or installed app? Bilanz.                                          |
| WISO MeinBüro      | GoBD (only marketing wording, no vendor statement)    | None.                                                                                                                                              |
| Sage Active        | Kleinunternehmer, server location, AVV, app platforms | Not listed among "Sage Cloud Services" in the Sage privacy notice. Ask Sage for server location and AVV. E-invoice sending is announced, not live. |
| Papierkram         | App platforms                                         | None.                                                                                                                                              |
| easybill           | ELSTER, Kleinunternehmer, bank connection, apps       | None.                                                                                                                                              |
| Billomat           | GoBD, ELSTER, Kleinunternehmer, German support        | Server location is stated only on the English banking page. Confirm it on a German page.                                                           |

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
