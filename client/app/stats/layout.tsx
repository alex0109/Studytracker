import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Stats",
  description: "Cool app",
};

const StatsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center pt-10">{children}</div>;
};

export default StatsLayout;
