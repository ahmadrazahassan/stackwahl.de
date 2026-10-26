import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home screen icon: the stack mark on the page background. */
export default function AppleIcon() {
  const bar = (color: string) => (
    <div style={{ width: 120, height: 24, borderRadius: 7, backgroundColor: color }} />
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        backgroundColor: "#f1f1f1",
      }}
    >
      {bar("#191919")}
      {bar("#2f2fc1")}
      {bar("#191919")}
    </div>,
    size,
  );
}
