import { Navigation } from "@/widgets/Navigation";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {/* The root layout already has the one <main> of the page */}
      <div className="pt-30">{children}</div>
    </>
  );
}
