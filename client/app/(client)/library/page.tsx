import type { Metadata } from "next";
import { LibraryCatalog } from "@/widgets/Library";
import { LIBRARY_PAGE_SIZE } from "@/entities/library";
import { fetchLibraryPage } from "@/entities/library/api/server";
import { getServerT } from "@/shared/i18n/server";
import { OG_LOCALES, SITE_NAME, SITE_URL } from "@/shared/config/site";

type LibraryPageProps = { searchParams: Promise<{ page?: string }> };

const pageNumber = async (searchParams: LibraryPageProps["searchParams"]) =>
  Math.max(1, Number((await searchParams).page) || 1);

export const generateMetadata = async ({ searchParams }: LibraryPageProps): Promise<Metadata> => {
  const { t, language } = await getServerT();
  const page = await pageNumber(searchParams);
  const title = t("meta.libraryTitle");
  const description = t("meta.libraryDescription");
  const url = page > 1 ? `/library?page=${page}` : "/library";

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[language],
      url,
      title,
      description,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
};

const LibraryPage = async ({ searchParams }: LibraryPageProps) => {
  const { t, language } = await getServerT();
  const initialPage = await fetchLibraryPage(await pageNumber(searchParams), LIBRARY_PAGE_SIZE);

  // "<" is escaped so text in the data can never close the script tag
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("meta.libraryTitle"),
    description: t("meta.libraryDescription"),
    url: `${SITE_URL}/library`,
    inLanguage: language,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: initialPage?.total ?? 0,
      itemListElement: (initialPage?.items ?? []).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/library/${item.id}`,
        name: item.title,
      })),
    },
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      <LibraryCatalog initialPage={initialPage} />
    </>
  );
};

export default LibraryPage;
