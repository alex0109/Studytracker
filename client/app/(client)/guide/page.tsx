import type { Metadata } from "next";
import { getServerT } from "@/shared/i18n/server";
import { OG_LOCALES, SITE_NAME } from "@/shared/config/site";
import { pickSampleWordIds } from "../(home)/lib/sample-words";
import { SampleWordsProvider } from "../(home)/lib/sample-entries";
import { GuideView } from "./ui/guide-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t, language } = await getServerT();
  const title = t("guide.meta.title");
  const description = t("guide.meta.description");

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: "/guide" },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: OG_LOCALES[language],
      url: "/guide",
      title,
      description,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
};

// The demos use the same sample words as the landing page, picked on the server
const GuidePage = () => (
  <SampleWordsProvider ids={pickSampleWordIds()}>
    <GuideView />
  </SampleWordsProvider>
);

export default GuidePage;
