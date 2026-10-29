import { ImageResponse } from "next/og";
import { MARK_CROSS, MARK_CROSS_WIDTH, MARK_SHAPE } from "@/components/brand/wordmark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home screen icon: the mark on the page background (iOS fills transparent areas with black).
// Same geometry as src/app/icon.svg; the cross is drawn in the background colour instead of a
// mask, because the background here is fixed.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1f1f1",
      }}
    >
      <svg width="117" height="104" viewBox="0 0 36 32">
        <path d={MARK_SHAPE} fill="#191919" />
        <path
          d={MARK_CROSS}
          stroke="#f1f1f1"
          strokeWidth={MARK_CROSS_WIDTH}
          strokeLinecap="round"
        />
      </svg>
    </div>,
    size,
  );
}
