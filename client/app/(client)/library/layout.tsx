import type { Metadata } from "next";
import { getServerT } from "@/shared/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("meta.titles.library")}`,
    description: t("meta.description"),
  };
};

const LibraryLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center pb-10">{children}</div>;
};

export default LibraryLayout;
