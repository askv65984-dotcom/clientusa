import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anoka Advisors",
    short_name: "Anoka",
    description: "Operations consulting for healthcare, telehealth and pharmacy.",
    start_url: "/",
    display: "browser",
    background_color: "#faf7f0",
    theme_color: "#faf7f0",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
