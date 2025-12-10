import type { Metadata } from "next";
import "./globals.css";
import ActiveSectionContextProvider from "@/shared/context/active-section.context";
import Footer from "@/shared/components/footer";
import ReactQueryClientProvider from "@/shared/context/query-client-provider.context";
import { getUser } from "@/shared/queries/user";
import { SessionProvider } from "@/shared/context/session-provider.context";

export const metadata: Metadata = {
  title: "Studytracker",
  description: "Cool app",
};

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user, token } = await getUser();
  console.log(token);
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className="relative bg-gray-50">
          <div
            className="bg-[#cde7ff] absolute top-[-6rem] 
          -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] 
          rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"
          ></div>
          <div
            className="bg-[#c6c4ff] absolute top-[-1rem] 
          -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full 
          blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] 
          lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"
          ></div>
          <SessionProvider user={user} token={token}>
            <ActiveSectionContextProvider>
              {children}
              <Footer />
            </ActiveSectionContextProvider>
          </SessionProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
};

export default RootLayout;
