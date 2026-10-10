import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Fonts and the logo never change between requests, so they are read once when the module loads.
const serif = await readFile(join(process.cwd(), "src/assets/newsreader-500.woff"));
const sans = await readFile(join(process.cwd(), "src/assets/public-sans-500.woff"));
const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "src/assets/brand/anoka-advisors-logo.png"))).toString("base64")}`;

export const alt = "Anoka Advisors: operations consulting for healthcare, telehealth and pharmacy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site's dark palette.
const c = { night: "#0a1310", panel: "#13211c", line: "#34503f", fg: "#ebf1ed", muted: "#a9b8b1", gold: "#d8b77e", mint: "#86bfae" };

const bars = [
  { from: 0, to: 2, color: c.mint, label: "Healthcare" },
  { from: 1, to: 3, color: c.fg, label: "Telehealth" },
  { from: 3, to: 5, color: c.gold, label: "Pharmacy" },
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
          background: c.night,
          backgroundImage: `radial-gradient(circle at 85% 10%, ${c.panel} 0%, ${c.night} 55%)`,
          padding: `56px ${left}px`,
          fontFamily: "Public Sans",
          color: c.fg,
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain img elements */}
        <img src={logo} width={218} height={84} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 52,
            fontFamily: "Newsreader",
            fontSize: 70,
            lineHeight: 1.06,
            letterSpacing: -1,
            maxWidth: 960,
          }}
        >
          Operations consulting for healthcare, telehealth and pharmacy.
        </div>

        {/* A compressed version of the care pathway from the home page */}
        <div style={{ position: "absolute", left, right: left, bottom: 64, height: 90, display: "flex" }}>
          <div style={{ position: "absolute", left: 6, top: 6, width: step * 5, height: 2, background: c.line }} />
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
                border: `3px solid ${c.gold}`,
                background: c.night,
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
