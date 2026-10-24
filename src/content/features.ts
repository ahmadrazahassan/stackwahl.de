// Controlled feature vocabulary (docs/BUILD_PROMPT.md, Section 6). Software files may only use
// these keys, so comparisons and the Software-Finder work on the same terms.

export const FEATURES = {
  angebote: { label: "Angebote", group: "Rechnungen" },
  rechnungen: { label: "Rechnungen", group: "Rechnungen" },
  wiederkehrendeRechnungen: { label: "Wiederkehrende Rechnungen", group: "Rechnungen" },
  mahnwesen: { label: "Mahnwesen", group: "Rechnungen" },
  belegerfassungOcr: { label: "Belegerfassung per OCR", group: "Buchhaltung" },
  bankabgleich: { label: "Bankabgleich", group: "Buchhaltung" },
  kassenbuch: { label: "Kassenbuch", group: "Buchhaltung" },
  euer: { label: "Einnahmen-Überschuss-Rechnung (EÜR)", group: "Buchhaltung" },
  bilanz: { label: "Bilanz und doppelte Buchführung", group: "Buchhaltung" },
  lohn: { label: "Lohnabrechnung", group: "Erweiterungen" },
  lager: { label: "Lager und Warenwirtschaft", group: "Erweiterungen" },
  projektzeiten: { label: "Projekte und Zeiterfassung", group: "Erweiterungen" },
  mehrwaehrung: { label: "Mehrwährung", group: "Erweiterungen" },
  api: { label: "Programmierschnittstelle (API)", group: "Technik" },
  steuerberaterzugang: { label: "Zugang für Steuerberater", group: "Zusammenarbeit" },
  mobileApp: { label: "Mobile App", group: "Technik" },
} as const;

export type FeatureKey = keyof typeof FEATURES;
export const FEATURE_KEYS = Object.keys(FEATURES) as [FeatureKey, ...FeatureKey[]];

/** German compliance block (Section 6 and 10). Every accounting profile answers these. */
export const COMPLIANCE = {
  gobd: { label: "GoBD-konforme Archivierung" },
  eRechnungEmpfang: { label: "E-Rechnung empfangen (XRechnung, ZUGFeRD)" },
  eRechnungVersand: { label: "E-Rechnung erstellen und senden" },
  datevExport: { label: "DATEV-Export oder -Schnittstelle" },
  elster: { label: "Umsatzsteuer-Voranmeldung per ELSTER" },
  kleinunternehmer: { label: "Kleinunternehmerregelung (§ 19 UStG)" },
  bankanbindung: { label: "Bankanbindung" },
  serverstandort: { label: "Serverstandort Deutschland oder EU" },
  avv: { label: "Auftragsverarbeitungsvertrag (AVV)" },
  deutscherSupport: { label: "Deutschsprachiger Support" },
} as const;

export type ComplianceKey = keyof typeof COMPLIANCE;
export const COMPLIANCE_KEYS = Object.keys(COMPLIANCE) as [ComplianceKey, ...ComplianceKey[]];
