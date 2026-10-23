import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Share",
  description: "Cool app",
};

const ShareLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default ShareLayout;
