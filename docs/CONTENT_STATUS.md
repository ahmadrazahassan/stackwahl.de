# Content status

Updated 24.10.2026, end of Phase 2.

## Overview

| Area              | Status                          | Note                                                                    |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------- |
| Software profiles | 10 drafts, researched           | See the table below. All `status: draft`, `verification: unverified`.   |
| Vendors           | 10 records from Impressum pages | Lexware: city not confirmed on the Impressum page, so stored as `null`. |
| Categories        | 2 drafts                        | Buchhaltungssoftware, Rechnungsprogramme                                |
| Authors           | missing                         | Needs real people (name, role, photo, bio) from the owner               |
| Guides            | missing                         | Phase 5                                                                 |
| Legal pages       | missing                         | Drafted in Phase 3, lawyer review before launch                         |
| Vendor logos      | missing                         | Official press kits only, sources in LOGOS.md                           |
| Screenshots       | missing                         | Need real trial accounts                                                |

## Why everything is still a draft

1. **No author.** Production pages need a real named author (Section 3.7 and the `missing-author` guard). The owner has not named one yet.
2. **No hands-on test.** No product has been tested in a real account, so no product has an editorial score (`rating: null`, shown as "Noch nicht bewertet"). The text says "recherchiert", never "getestet". The `test-claim` guard enforces this.
3. **Editorial sign-off.** Every fact below was read on the vendor's own page on 24.10.2026, and its source is stored in the content file. A named editor should re-check the facts and set `verification: verified`.

## First batch (accessed 24.10.2026)

| Software           | Categories              | Prices                         | Open items before publishing                                                                                                                      |
| ------------------ | ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| sevdesk            | Buchhaltung, Rechnungen | List prices; promo noted       | A second price block on the same page shows different 24-month values (12,90 / 25,90 / 34,90 € struck through). GoBD statement, Kleinunternehmer. |
| Lexware Office     | Buchhaltung, Rechnungen | Monthly only on the page       | Users per version, explicit DATEV export, AVV, support. Vendor city.                                                                              |
| BuchhaltungsButler | Buchhaltung             | Monthly and yearly term        | UStVA via ELSTER not stated on the pricing page. Trial (only a discount and a money-back guarantee).                                              |
| FastBill           | Rechnungen, Buchhaltung | Monthly and yearly             | ELSTER transmission, AVV, app platforms.                                                                                                          |
| orgaMAX            | Buchhaltung, Rechnungen | From the price cards           | The comparison table on the same page shows 39,00 / 49,00 / 69,00 €. Browser or installed app? Bilanz.                                            |
| WISO MeinBüro      | Buchhaltung, Rechnungen | Yearly subscription only       | GoBD statement, trial length, AVV, app platforms.                                                                                                 |
| Sage Active        | Buchhaltung, Rechnungen | Monthly price, term not stated | Not listed among "Sage Cloud Services" in the Sage privacy notice; ask Sage for server location and AVV. E-invoice sending.                       |
| Papierkram         | Buchhaltung, Rechnungen | Monthly and yearly             | DATEV export, ELSTER transmission, AVV.                                                                                                           |
| easybill           | Rechnungen              | Monthly and yearly             | GoBD, e-invoice receiving, AVV, Kleinunternehmer.                                                                                                 |
| Billomat           | Rechnungen              | "ab" prices                    | Server location (only a 2018 article found), e-invoice receiving, GoBD.                                                                           |

## Researched and left out of batch 1

| Product    | Finding on 24.10.2026                                                                                                                                                                               | Decision                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| QuickBooks | `quickbooks.intuit.com/de/` returns 404. There is only a "global" edition with German as an interface language and no prices in euro, and no information on DATEV, ELSTER or XRechnung on the page. | Not listed as a recommendation (Section 3.5). A later guide can explain why QuickBooks suits German businesses only to a limited extent, with sources. |
| FreshBooks | The pricing page shows US dollars only and mentions no German VAT, DATEV, ELSTER or e-invoicing.                                                                                                    | Not listed (Section 3.5).                                                                                                                              |
| Odoo       | The pricing page shows prices by visitor location; from this machine it showed US dollars, so euro prices could not be verified.                                                                    | Planned for batch 2: read the euro prices from a German connection (or the owner checks them) before writing the profile.                              |
