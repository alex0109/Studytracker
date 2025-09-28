import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Auth",
  description: "Cool app",
};

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center pt-10">{children}</div>;
};

export default AuthLayout;
