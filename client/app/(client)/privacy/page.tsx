import type { Metadata } from "next";
import { getServerT } from "@/shared/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("privacy.title")}`,
    description: t("privacy.intro"),
    alternates: { canonical: "/privacy" },
  };
};

const SECTIONS = ["data", "analytics", "errors", "ai", "services", "rights", "contact"] as const;

// Plain words about what the site keeps and who helps run it; analytics need it shown before consent
const Privacy = async () => {
  const { t } = await getServerT();

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t("privacy.title")}</h1>
        <p className="text-sm text-neutral-500">{t("privacy.updated")}</p>
        <p className="text-neutral-700 dark:text-neutral-300">{t("privacy.intro")}</p>
      </header>
      {SECTIONS.map((key) => (
        <section key={key} className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t(`privacy.${key}.title`)}</h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{t(`privacy.${key}.text`)}</p>
        </section>
      ))}
    </article>
  );
};

export default Privacy;
