import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

// Public pages only; everything else is behind sign-in
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/home`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/library`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/sign-up`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/sign-in`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
