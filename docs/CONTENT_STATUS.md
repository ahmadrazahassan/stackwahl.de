# Content status

Updated 25.10.2026, after the second research pass in Phase 4.

## Overview

| Area              | Status                          | Note                                                                    |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------- |
| Software profiles | 10 drafts, researched           | See the table below. All `status: draft`, `verification: unverified`.   |
| Vendors           | 10 records from Impressum pages | Lexware: city not confirmed on the Impressum page, so stored as `null`. |
| Categories        | 2 drafts                        | Buchhaltungssoftware, Rechnungsprogramme                                |
| Authors           | missing                         | Needs real people (name, role, photo, bio) from the owner               |
| Guides            | missing                         | Phase 5                                                                 |
| Legal pages       | missing                         | Drafted in Phase 3, lawyer review before launch                         |
| Vendor logos      | 9 of 10                         | Sources in LOGOS.md. WISO MeinBüro: only a white logo is published.     |
| Screenshots       | missing                         | Need real trial accounts                                                |

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

## Researched and left out of batch 1

| Product    | Finding on 24.10.2026                                                                                                                                                                               | Decision                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| QuickBooks | `quickbooks.intuit.com/de/` returns 404. There is only a "global" edition with German as an interface language and no prices in euro, and no information on DATEV, ELSTER or XRechnung on the page. | Not listed as a recommendation (Section 3.5). A later guide can explain why QuickBooks suits German businesses only to a limited extent, with sources. |
| FreshBooks | The pricing page shows US dollars only and mentions no German VAT, DATEV, ELSTER or e-invoicing.                                                                                                    | Not listed (Section 3.5).                                                                                                                              |
| Odoo       | The pricing page shows prices by visitor location; from this machine it showed US dollars, so euro prices could not be verified.                                                                    | Planned for batch 2: read the euro prices from a German connection (or the owner checks them) before writing the profile.                              |
