import type { Metadata } from "next";
import "./globals.css";
import ActiveSectionContextProvider from "@/shared/context/active-section.context";
import Footer from "@/shared/components/footer";
import ReactQueryClientProvider from "@/shared/context/query-client-provider.context";
import { getUser } from "@/shared/queries/user";
import { SessionProvider } from "@/shared/context/session-provider.context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import BackgroundBlobs from "./(client)/(home)/components/background-blobs.component";

export const metadata: Metadata = {
  title: "Studytracker",
  description: "Cool app",
};

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user, token } = await getUser();
  console.log("TOKEN: \n", token);
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
