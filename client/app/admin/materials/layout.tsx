import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Admin",
  description: "Cool app",
};

const MaterialsPanelLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default MaterialsPanelLayout;
