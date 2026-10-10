import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anoka Advisors",
    short_name: "Anoka",
    description: "Operations consulting for healthcare, telehealth and pharmacy.",
    start_url: "/",
    display: "browser",
    background_color: "#f6f7f5",
    theme_color: "#1e3b33",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
