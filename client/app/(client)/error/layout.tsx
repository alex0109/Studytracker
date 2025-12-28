import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Error",
  description: "Error",
};

const ErrorLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export default ErrorLayout;
