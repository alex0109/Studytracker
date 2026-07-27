import type { Metadata } from "next";
import "./globals.css";
import ActiveSectionContextProvider from "@/shared/context/active-section.provider";
import { Footer } from "@/shared/ui";
import ReactQueryClientProvider from "@/shared/context/query-client.provider";
import { SessionProvider } from "@/shared/context/session.provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BackgroundBlobs } from "./(client)/(home)";
import { getUser } from "@/entities/auth";

export const metadata: Metadata = {
  title: "Studytracker",
  description: "Cool app",
};

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user, token } = await getUser();
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col bg-gray-50 relative">
          <BackgroundBlobs />
          <SessionProvider user={user} token={token}>
            <ActiveSectionContextProvider>
              <main className="min-h-[100vh]">{children}</main>
              <Footer />
            </ActiveSectionContextProvider>
          </SessionProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
};

export default RootLayout;
