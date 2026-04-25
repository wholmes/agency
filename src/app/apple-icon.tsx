import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mono =
  'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", Consolas, monospace';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#0c0c0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(201, 168, 76, 0.35)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            left: 20,
            top: 20,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 68%)",
          }}
        />
        <span
          style={{
            position: "relative",
            fontFamily: mono,
            fontSize: 56,
            fontWeight: 600,
            color: "#c9a55a",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          B/C
        </span>
      </div>
    ),
    { ...size },
  );
}
