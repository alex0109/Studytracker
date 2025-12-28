import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Admin - Traffic",
  description: "Cool app",
};

const TrafficPanelLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default TrafficPanelLayout;
