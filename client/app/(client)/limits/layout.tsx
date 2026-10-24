import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Limits",
  description: "What you use of your limits",
};

const LimitsLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default LimitsLayout;
