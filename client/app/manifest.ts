import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/shared/config/site";

// Lets the site be installed from the browser and gives it a proper name and colours
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Turn study materials into notes, questions and flashcards, and keep what you learn.",
    start_url: "/app",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#fafafa",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
