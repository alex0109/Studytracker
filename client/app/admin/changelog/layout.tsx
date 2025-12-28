import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Admin - Changelog",
  description: "Cool app",
};

const ChangelogPanelLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default ChangelogPanelLayout;
