import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const mono =
  'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", Consolas, monospace';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          background: "#0c0c0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid rgba(201, 168, 76, 0.45)",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 10,
            fontWeight: 600,
            color: "#c9a55a",
            letterSpacing: "-0.06em",
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
