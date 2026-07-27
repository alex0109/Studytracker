import { Navigation } from "@/widgets/Navigation";

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
