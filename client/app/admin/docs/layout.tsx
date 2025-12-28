import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Admin - Docs",
  description: "Cool app",
};

const DocsPanelLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default DocsPanelLayout;
