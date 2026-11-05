import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryBackdrop, LibraryReader } from "@/widgets/Library";
import type { ILibraryItem } from "@/entities/library";
import { fetchLibraryItem } from "@/entities/library/api/server";
import { excerpt, richTextToPlainText } from "@/shared/lib/rich-text";
import { getServerT } from "@/shared/i18n/server";
import { OG_LOCALES, SITE_NAME, SITE_URL } from "@/shared/config/site";

type LibraryItemPageProps = { params: Promise<{ id: string }> };

// Too little text says nothing in a search result: then a sentence about the material itself
const MIN_SNIPPET = 50;

const describe = (item: ILibraryItem, fallback: string) => {
  const text = richTextToPlainText(item.content.content);
  return text.length >= MIN_SNIPPET ? excerpt(text) : fallback;
};

export const generateMetadata = async ({ params }: LibraryItemPageProps): Promise<Metadata> => {
  const { id } = await params;
  const { t, language } = await getServerT();
  const { data: item } = await fetchLibraryItem(id);

  if (!item) return { title: `${SITE_NAME} | ${t("meta.titles.library")}`, description: t("meta.libraryDescription") };

  const description = describe(item, t("meta.libraryItemDescription", { title: item.title }));
  const url = `/library/${item.id}`;

  return {
    title: { absolute: `${item.title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: OG_LOCALES[language],
      url,
      title: item.title,
      description,
      publishedTime: item.publishedAt,
      modifiedTime: item.updatedAt,
      authors: [item.authorNickname],
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title: item.title, description, images: ["/opengraph-image"] },
  };
};

const LibraryItemPage = async ({ params }: LibraryItemPageProps) => {
  const { id } = await params;
  const { t } = await getServerT();
  const { status, data: item } = await fetchLibraryItem(id);

  if (status === 404) notFound();

  const url = `${SITE_URL}/library/${id}`;
  // "<" is escaped so text in the data can never close the script tag
  const json =
    item &&
    JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LearningResource",
          "@id": `${url}#material`,
          name: item.title,
          description: describe(item, t("meta.libraryItemDescription", { title: item.title })),
          url,
          isAccessibleForFree: true,
          author: { "@type": "Person", name: item.authorNickname },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          datePublished: item.publishedAt,
          dateModified: item.updatedAt,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t("meta.titles.library"), item: `${SITE_URL}/library` },
            { "@type": "ListItem", position: 2, name: item.title, item: url },
          ],
        },
      ],
    }).replace(/</g, "\\u003c");

  return (
    <>
      {json && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />}
      <LibraryBackdrop />
      <LibraryReader itemId={id} initialItem={item} />
    </>
  );
};

export default LibraryItemPage;
