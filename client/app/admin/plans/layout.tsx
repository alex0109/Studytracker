import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Admin - Plans",
  description: "Cool app",
};

const PlansPanelLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default PlansPanelLayout;
