import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/shared/config/site";

// Lets the site be installed from the browser and gives it a proper name and colours
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Turn study materials into notes, questions and flashcards, and keep what you learn.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#fafafa",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
