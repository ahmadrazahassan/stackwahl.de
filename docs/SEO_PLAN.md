# SEO plan

As of 30.10.2026. Keywords come from Google autocomplete (hl=de, gl=de) for 25 seed terms. Autocomplete shows what people type, not how often: no search volumes or difficulty scores here. Check them in Search Console once data arrives, or in a keyword tool (Ahrefs, Sistrix).

## 1. Done on the site (30.10.2026)

- **Canonical domain.** `siteConfig.brand.url` is `https://www.stackwahl.de`, the host Vercel serves. Canonicals, Open Graph URLs, sitemap and robots.txt no longer point to the apex, which answers 308.
- **Titles with the search terms.**

| Page             | Old title                                                           | New title                                                                                 |
| ---------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Home             | Stackwahl: Business-Software unabhängig verglichen                  | Stackwahl: Buchhaltungssoftware, Rechnungsprogramme und ERP im Vergleich                  |
| Categories       | Buchhaltungssoftware im Vergleich: 13 Programme mit Preisen         | Buchhaltungssoftware Vergleich 2026: 13 Programme mit Preisen (year = latest price check) |
| /kategorien      | Kategorien                                                          | Software-Kategorien: Buchhaltung, Rechnungen und ERP                                      |
| /glossar         | Glossar                                                             | Glossar: Buchhaltung, Steuern und E-Rechnung erklärt                                      |
| Glossary terms   | E-Rechnung: Erklärung                                               | E-Rechnung: Definition und Erklärung                                                      |
| Freiberufler     | Software für Freiberufler: …                                        | Buchhaltungssoftware für Freiberufler: …                                                  |
| Handwerk         | Software für Handwerksbetriebe: …                                   | Handwerkersoftware: Programme für Angebote, Rechnungen und Buchhaltung                    |
| Lohn             | Buchhaltung mit Lohnabrechnung: …                                   | Buchhaltungssoftware mit Lohnabrechnung: …                                                |
| E-Rechnung guide | E-Rechnungspflicht 2025 bis 2028: Was Ihr Unternehmen jetzt braucht | E-Rechnungspflicht 2025 bis 2028: Fristen und passende E-Rechnung-Software                |

Already in place before: one H1 per page, unique descriptions, BreadcrumbList, ItemList, SoftwareApplication with AggregateOffer (no fake ratings), Article with author, DefinedTerm, Organization with address, sitemap without noindex pages, fast pages on Vercel Frankfurt.

## 2. Keyword map (existing pages)

| Search terms (autocomplete)                                                             | Page                                            |
| --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| buchhaltungssoftware vergleich (2026), beste buchhaltungssoftware, buchhaltungsprogramm | /kategorien/buchhaltungssoftware                |
| rechnungsprogramm, rechnungsprogramm für kleinunternehmer, rechnungsprogramm e rechnung | /kategorien/rechnungsprogramme                  |
| erp software für kleine unternehmen, erp system kleine unternehmen                      | /kategorien/erp-software                        |
| erp system für kleine unternehmen kosten                                                | /ratgeber/erp-kleine-unternehmen-kosten         |
| buchhaltungssoftware kostenlos, buchhaltungssoftware für kleinunternehmer kostenlos     | /ratgeber/kostenlose-buchhaltungssoftware       |
| buchhaltungssoftware für kleinunternehmer                                               | /ratgeber/buchhaltungssoftware-kleinunternehmer |
| buchhaltungssoftware datev, buchhaltungsprogramm datev                                  | /ratgeber/steuerberater-datev-zusammenarbeit    |
| e-rechnung software, e-rechnung programm, e-rechnung software kleinunternehmer          | /ratgeber/e-rechnungspflicht-software           |
| buchhaltungssoftware gmbh (bilanz), beste buchhaltungssoftware für ug                   | /software-fuer/gmbh-ug                          |
| buchhaltungssoftware für selbstständige / freiberufler                                  | /software-fuer/freiberufler                     |
| handwerkersoftware, software für handwerker (rechnungen)                                | /software-fuer/handwerk                         |
| lohnabrechnung software (vergleich)                                                     | /software-fuer/lohnabrechnung                   |
| lexware office alternative                                                              | /ratgeber/lexware-office-alternativen           |
| sage 50 kosten, sage active essentials                                                  | /software/sage-50/preise, /software/sage-active |

## 3. New pages with the best chances (content gaps)

Ordered by buying intent. Each needs the usual research with sources; no page without at least three sourced programs.

1. **sevdesk Alternativen** (sevdesk alternative, sevdesk alternative kostenlos). Same format as the Lexware guide.
2. **Kostenloses Rechnungsprogramm** (rechnungsprogramm kostenlos, rechnungsprogramm kostenlos kleinunternehmer, e-rechnung software kostenlos). Free plans of sevdesk, Collmex, Norman, Papierkram, easybill with their limits.
3. **Buchhaltungssoftware ohne Abo / einmalig kaufen** (buchhaltungssoftware einmalig kaufen, rechnungsprogramm einmalig kaufen, e-rechnung software ohne abo). Needs desktop products and their licence terms.
4. **DATEV-Alternativen für Unternehmen** (datev alternative für unternehmen, alternative datev unternehmen online).
5. **Buchhaltungssoftware für Vereine** (buchhaltungssoftware für vereine, buchhaltungsprogramm für vereine). Needs new programs; Collmex names Vereine.
6. **Buchhaltungssoftware für Mac** (buchhaltungssoftware mac kleinunternehmer). Browser programs plus native apps.
7. **Handwerkersoftware für Kleinbetriebe** (handwerkersoftware für kleinbetriebe, handwerkersoftware vergleich). Needs more handwerk programs than Sage 50 Handwerk and orgaMAX.

Avoid: "Test" and "Testsieger" in titles until there is a hands-on test (copy rules), "Erfahrungen" pages without own experience, and city pages ("Buchhaltungssoftware Aachen"), which Google treats as doorway pages.

## 4. Backlinks

Only links a real editor or owner gives. No bought links, link packages, PBNs, comment or forum spam, or automated directory blasts: Google's spam policies devalue or penalise them, and affiliate programs (Sage, impact.com) check backlink profiles too.

**Profiles and listings (week 1, about 10 links, low weight but they make the brand real):**

- Google Search Console and Bing Webmaster Tools: verify, submit `https://www.stackwahl.de/sitemap.xml`.
- LinkedIn company page for Stackwahl; then add the URL to `siteConfig.social.linkedinCompany` (becomes `sameAs` in the Organization data).
- Crunchbase and startbase.de company profiles.
- Milan Schultheis' own LinkedIn profile: website field and an "Experience" entry.

**Local, Aachen (weeks 2 to 4):**

- IHK Aachen: the UG is a member; ask which member directories or "Neugründungen" features exist.
- digitalHUB Aachen and the RWTH and FH Aachen founder networks: member listings, events, blog contributions.
- Aachener Zeitung / Aachener Nachrichten business desk: a short story "Aachener Gründung vergleicht Buchhaltungssoftware zur E-Rechnungspflicht" works when it comes with data (see linkable assets).

**Editorial links (ongoing, the ones that move rankings):**

- **Steuerberater and Buchhaltungsbüros.** Their clients ask "which software?" every week. Offer the E-Rechnung guide and the category comparison as a free reference for their client pages or newsletters.
- **Founder and freelancer sites** (für-gründer.de, freelancermap, Gründer blogs, Coworking spaces): guest articles on E-Rechnungspflicht, Kleinunternehmerregelung or "Buchhaltung im ersten Jahr", with one link to the matching guide.
- **Journalist requests.** Answer press queries on E-Rechnung, Buchhaltung and Gründung as the editor (for example on Qwoted or in LinkedIn journalist posts).
- **Vendors.** Some vendors link press and review coverage; send a short note to the press contacts of reviewed programs when a profile or comparison goes live.
- **Unlinked mentions.** Once the brand appears anywhere, ask for the link.

**Linkable assets to build (they earn links on their own):**

- **Preisindex Buchhaltungssoftware 2026:** median entry price, price changes over the year, free plans; from the price data we already store with dates. Journalists and Steuerberater cite numbers.
- **E-Rechnungspflicht-Check:** three questions (B2B? Umsatz? Kleinunternehmer?) → which deadline applies, with the law as source.
- The **Kostenrechner** and **Software-Finder** exist already; mention them in every outreach.

**Outreach mail (template, German):**

> Betreff: E-Rechnungspflicht: Übersicht für Ihre Mandanten
>
> Guten Tag Frau/Herr …,
>
> viele Unternehmen fragen gerade, welche Software E-Rechnungen schon kann. Wir haben 20 Programme mit Preisen, DATEV-Export und ELSTER verglichen, jede Angabe mit Quelle: https://www.stackwahl.de/ratgeber/e-rechnungspflicht-software
>
> Falls die Übersicht für Ihre Mandanten-Infos hilfreich ist, freuen wir uns über eine Erwähnung. Kosten entstehen keine.
>
> Viele Grüße
> Milan Schultheis, Stackwahl UG (haftungsbeschränkt), Aachen

## 5. Local SEO

Stackwahl is an online publisher without customer visits. Google Business Profile is only for businesses with in-person contact, so it is not an option, and a profile at the registered address would risk suspension. Local strength comes from:

- the address in Impressum and Organization data (in place),
- the Aachen listings and local press above,
- consistent name, address and e-mail everywhere (Stackwahl UG (haftungsbeschränkt), Charlottenstr. 14, 52070 Aachen, info@stackwahl.de).

## 6. Monthly routine

- Search Console: queries with impressions but position 8 to 20 → improve that page's title, intro and FAQ section first.
- Re-check prices (the build blocks stale prices anyway) and keep `updated` honest; fresh "Aktualisiert" dates help rankings for "2026" queries.
- One new guide from section 3 every one to two weeks.
- Five outreach mails a week; log replies here.
