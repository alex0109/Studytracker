import type { Metadata } from "next";
import { getServerT } from "@/shared/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("meta.titles.auth")}`,
    description: t("meta.description"),
  };
};

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col justify-center items-center">{children}</div>
  );
};

export default AuthLayout;
