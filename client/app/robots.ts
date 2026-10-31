import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

// The landing page is for search engines. Personal pages need an account, and shared
// materials are private links: none of them belong in results
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/materials",
        "/library",
        "/statistics",
        "/limits",
        "/today",
        "/account",
        "/share/",
        "/error",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
