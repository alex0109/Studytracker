import type { Metadata } from "next";
import { getServerT } from "@/shared/i18n/server";
import { NO_INDEX } from "@/shared/config/site";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("meta.titles.today")}`,
    description: t("meta.description"),
    robots: NO_INDEX,
  };
};

const TodayLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default TodayLayout;
