import type { Metadata } from "next";
import { getServerT } from "@/shared/i18n/server";
import { NO_INDEX } from "@/shared/config/site";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("meta.titles.statistics")}`,
    description: t("meta.description"),
    robots: NO_INDEX,
  };
};

const StatisticsLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default StatisticsLayout;
