// Social preview card drawn with next/og (Satori): flat brand colors, the stack mark and text
// only. Satori cannot read WOFF2, so the card uses the built-in sans serif.

export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({
  kicker,
  title,
  detail,
}: {
  kicker: string;
  title: string;
  detail?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f1f1f1",
        padding: 56,
        color: "#191919",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ width: 44, height: 9, borderRadius: 3, backgroundColor: "#191919" }} />
          <div style={{ width: 44, height: 9, borderRadius: 3, backgroundColor: "#2f2fc1" }} />
          <div style={{ width: 44, height: 9, borderRadius: 3, backgroundColor: "#191919" }} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}>Stackwahl</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          backgroundColor: "#ffffff",
          borderRadius: 28,
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#2f2fc1",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {kicker}
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>
          {title}
        </div>
        {detail ? <div style={{ fontSize: 28, color: "#5f5f5f" }}>{detail}</div> : null}
      </div>
    </div>
  );
}
