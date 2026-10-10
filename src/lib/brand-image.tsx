import "server-only";

export const brandColors = {
  paper: "#f6f7f5",
  ink: "#17241f",
  slate: "#4d5b55",
  evergreen: "#1e3b33",
  teal: "#4f7f72",
  brass: "#a8834a",
  brassLight: "#d6b880",
  sage: "#d5dfd9",
};

/** The logo mark as plain SVG for next/og (no CSS variables available there). */
export function MarkSvg({ size, stroke, accent }: { size: number; stroke: string; accent: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M7 35 L18.3 5.5" stroke={stroke} strokeWidth="4.25" strokeLinecap="square" fill="none" />
      <path d="M21.7 5.5 L33 35" stroke={accent} strokeWidth="4.25" strokeLinecap="square" fill="none" />
      <path d="M12.6 24.5 H27.4" stroke={stroke} strokeWidth="3.25" fill="none" />
    </svg>
  );
}

/** Square brand tile used for the Apple touch icon and the schema.org logo. */
export function BrandTile({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brandColors.evergreen,
      }}
    >
      <MarkSvg size={Math.round(size * 0.62)} stroke={brandColors.paper} accent={brandColors.brassLight} />
    </div>
  );
}
