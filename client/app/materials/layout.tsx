import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker",
  description: "Cool app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex flex-col items-center pt-10">{children}</div>;
}
