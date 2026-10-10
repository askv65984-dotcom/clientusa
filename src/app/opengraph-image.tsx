import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brandColors as c, MarkSvg } from "@/lib/brand-image";

// Fonts never change between requests, so they are read once when the module loads.
const serif = await readFile(join(process.cwd(), "src/assets/newsreader-500.woff"));
const sans = await readFile(join(process.cwd(), "src/assets/public-sans-500.woff"));

export const alt = "Anoka Advisors: operations consulting for healthcare, telehealth and pharmacy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bars = [
  { from: 0, to: 2, color: c.evergreen, label: "Healthcare" },
  { from: 1, to: 3, color: c.teal, label: "Telehealth" },
  { from: 3, to: 5, color: c.brass, label: "Pharmacy" },
];

export default async function OpengraphImage() {
  const left = 80;
  const step = 200;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: c.paper,
          padding: `64px ${left}px`,
          fontFamily: "Public Sans",
          color: c.ink,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <MarkSvg size={52} stroke={c.evergreen} accent={c.brass} />
          <span style={{ fontFamily: "Newsreader", fontSize: 38, color: c.evergreen }}>Anoka Advisors</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontFamily: "Newsreader",
            fontSize: 70,
            lineHeight: 1.06,
            letterSpacing: -1,
            maxWidth: 940,
          }}
        >
          Operations consulting for healthcare, telehealth and pharmacy.
        </div>

        {/* A compressed version of the care pathway from the home page */}
        <div style={{ position: "absolute", left, right: left, bottom: 64, height: 90, display: "flex" }}>
          <div style={{ position: "absolute", left: 6, top: 6, width: step * 5, height: 2, background: c.ink }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * step,
                top: 0,
                width: 14,
                height: 14,
                borderRadius: 14,
                border: `3px solid ${c.ink}`,
                background: c.paper,
              }}
            />
          ))}
          {bars.map((bar, i) => (
            <div
              key={bar.label}
              style={{
                position: "absolute",
                left: bar.from * step + 6,
                top: 36 + i * 18,
                width: (bar.to - bar.from) * step,
                height: 5,
                background: bar.color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 500 },
        { name: "Public Sans", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
