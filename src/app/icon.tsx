import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#0e0e0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(201,165,90,0.35)",
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#c9a55a",
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          B
        </span>
      </div>
    ),
    { ...size },
  );
}
