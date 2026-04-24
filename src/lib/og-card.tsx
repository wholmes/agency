interface OgCardProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function OgCard({ title, description, eyebrow }: OgCardProps) {
  return (
    <div
      style={{
        background: "#0e0e0e",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "72px 80px",
        fontFamily: "serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -100,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,165,90,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {eyebrow && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            fontSize: 15,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          {eyebrow}
        </div>
      )}
      <div style={{ width: 48, height: 2, background: "#c9a55a", marginBottom: 28 }} />
      <div
        style={{
          fontSize: 58,
          fontWeight: 300,
          color: "#ffffff",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          maxWidth: 820,
          marginBottom: description ? 20 : 0,
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "monospace",
            letterSpacing: "0.02em",
            maxWidth: 760,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
