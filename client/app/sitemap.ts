import type { MetadataRoute } from "next";
import { fetchAllLibraryItems } from "@/entities/library/api/server";
import { SITE_URL } from "@/shared/config/site";

// New library materials reach search engines within the hour
export const revalidate = 3600;

// Public pages only; everything else is behind sign-in
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await fetchAllLibraryItems();

  return [
    { url: `${SITE_URL}/home`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/library`, changeFrequency: "weekly", priority: 0.9 },
    ...items.map((item) => ({
      url: `${SITE_URL}/library/${item.id}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/sign-up`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/sign-in`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
