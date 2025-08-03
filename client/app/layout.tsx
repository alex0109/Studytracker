import type { Metadata } from "next";
import "./globals.css";
import ActiveSectionContextProvider from "@/shared/context/active-section.context";
import Navigation from "@/shared/components/navigation";
import Footer from "@/shared/components/footer";
import ReactQueryClientProvider from "@/shared/context/query-client-provider.context";

export const metadata: Metadata = {
  title: "Studytracker",
  description: "Cool app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className="relative bg-gray-50 pt-20">
          <div
            className="bg-[#f6e2fb] absolute top-[-6rem] 
          -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] 
          rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"
          ></div>
          <div
            className="bg-[#e8d7fb] absolute top-[-1rem] 
          -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full 
          blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] 
          lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"
          ></div>

          <ActiveSectionContextProvider>
            <Navigation />
            {children}
            <Footer />
          </ActiveSectionContextProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
