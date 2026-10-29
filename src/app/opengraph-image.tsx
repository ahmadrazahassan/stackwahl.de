import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/seo/og-card";

export const alt = "Stackwahl: Buchhaltungssoftware, Rechnungsprogramme und ERP im Vergleich";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <OgCard
      kicker="Business-Software für Deutschland"
      title="Die passende Software für Ihr Unternehmen."
      detail="Preise, Funktionen und Rechtssicherheit, jede Angabe mit Quelle."
    />,
    size,
  );
}
