import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home screen icon: the "Stapel-S" mark on the page background (iOS fills transparent areas
// with black). Same 32-unit geometry as src/app/icon.svg, scaled by 4 and centered.
const bar = (left: number, top: number, width: number, color: string) => (
  <div
    style={{
      position: "absolute",
      left: 26 + left * 4,
      top: 26 + top * 4,
      width: width * 4,
      height: 30,
      borderRadius: 8,
      backgroundColor: color,
    }}
  />
);

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#f1f1f1",
      }}
    >
      {bar(2, 3, 19, "#191919")}
      {bar(2, 12.25, 28, "#2f2fc1")}
      {bar(11, 21.5, 19, "#191919")}
    </div>,
    size,
  );
}
