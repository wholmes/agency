import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#0e0e0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(201,165,90,0.3)",
        }}
      >
        {/* Gold radial glow behind the B */}
        <div
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,165,90,0.18) 0%, transparent 70%)",
          }}
        />
        <span
          style={{
            fontFamily: "serif",
            fontSize: 96,
            fontWeight: 700,
            color: "#c9a55a",
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          B
        </span>
      </div>
    ),
    { ...size },
  );
}
