import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studytracker | Callback",
  description: "Callback",
};

export default function CallbackLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex flex-col items-center pt-10">{children}</div>;
}
