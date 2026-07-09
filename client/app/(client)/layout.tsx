import { Navigation } from "@/shared/ui";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="pt-30">{children}</main>
    </>
  );
}
