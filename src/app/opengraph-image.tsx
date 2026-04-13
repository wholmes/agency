import { ImageResponse } from "next/og";

export const alt = "BrandMeetsCode — Premium Web Development Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      title="Premium Web Development Agency"
      description="Where brand strategy meets technical execution."
      eyebrow="BrandMeetsCode"
    />,
    { ...size },
  );
}

export function OgCard({
  title,
  description,
  eyebrow = "BrandMeetsCode",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div
      style={{
        background: "#141413",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#c9a55a",
          }}
        />
        <span
          style={{
            fontSize: "13px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#c9a55a",
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#f0ede6",
            margin: 0,
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "24px",
              fontWeight: 300,
              color: "#8a8780",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", color: "#555452" }}>
          brandmeetscode.com
        </span>
        <div
          style={{
            height: "1px",
            width: "60px",
            background: "#c9a55a",
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
}
