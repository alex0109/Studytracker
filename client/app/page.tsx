import type { Metadata } from "next";
import {
  FeedbackSection,
  FinalCta,
  Glossary,
  Hero,
  HowItWorks,
  KnowledgeLoop,
  ScrollTint,
  WordsThatStick,
} from "./(client)/(home)";
import { Suspense } from "react";
import { Navigation } from "@/widgets/Navigation";
import { AccountDeletedNotice } from "@/features/account/delete-account";
import { getServerT } from "@/shared/i18n/server";
import { OG_LOCALES, SITE_NAME, SITE_URL } from "@/shared/config/site";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t, language } = await getServerT();
  const title = t("meta.landingTitle");
  const description = t("meta.landingDescription");

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[language],
      url: "/",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
};

// What the site is, for search engines: a free web app for studying
const structuredData = (language: string, description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: language,
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description,
      inLanguage: language,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "Oleksii Slipokurov" },
    },
  ],
});

const Page = async () => {
  const { t, language } = await getServerT();
  // "<" is escaped so text in the data can never close the script tag
  const json = JSON.stringify(
    structuredData(language, t("meta.landingDescription")),
  ).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
      <Navigation />
      <Suspense>
        <AccountDeletedNotice />
      </Suspense>
      <ScrollTint />
      <div className="flex flex-col items-center gap-28 overflow-x-clip pt-36 pb-24 md:gap-36 md:pt-44">
        <Hero />
        <KnowledgeLoop />
        <HowItWorks />
        <WordsThatStick />
        <Glossary />
        <FinalCta />
        <FeedbackSection />
      </div>
    </>
  );
};

export default Page;
