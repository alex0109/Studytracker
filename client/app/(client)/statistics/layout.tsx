import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Stats",
  description: "Cool app",
};

const StatisticsLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default StatisticsLayout;
