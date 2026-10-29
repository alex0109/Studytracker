import type { Metadata, Viewport } from "next";
import "./globals.css";
import ActiveSectionContextProvider from "@/shared/context/active-section.provider";
import { Footer } from "@/shared/ui";
import ReactQueryClientProvider from "@/shared/context/query-client.provider";
import { SessionProvider } from "@/shared/context/session.provider";
import { MotionProvider } from "@/shared/context/motion.provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BackgroundBlobs } from "./(client)/(home)";
import { getUser } from "@/entities/auth";
import { ToastProvider } from "@/shared/radix-ui";
import { Geist } from "next/font/google";
import { cn } from "@/shared/lib/utils";
import { I18nProvider } from "@/shared/i18n";
import { getServerT } from "@/shared/i18n/server";
import { ThemeProvider } from "@/shared/theme";
import { getServerTheme } from "@/shared/theme/server";
import { OG_LOCALES, SITE_NAME, SITE_URL } from "@/shared/config/site";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

// Defaults for every page; pages set their own title, the landing page its own description
export const generateMetadata = async (): Promise<Metadata> => {
  const { t, language } = await getServerT();

  return {
    metadataBase: new URL(SITE_URL),
    title: SITE_NAME,
    description: t("meta.description"),
    applicationName: SITE_NAME,
    authors: [{ name: "Oleksii Slipokurov" }],
    creator: "Oleksii Slipokurov",
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[language],
      title: SITE_NAME,
      description: t("meta.description"),
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
};

// Browser chrome matches the page background in both themes
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user, token } = await getUser();
  const { language } = await getServerT();
  const theme = await getServerTheme();

  return (
    <html
      lang={language}
      className={cn("font-sans", geist.variable, theme === "dark" && "dark")}
      style={{ colorScheme: theme }}
    >
      <body className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 relative">
        <ThemeProvider initialTheme={theme}>
          <MotionProvider>
            <I18nProvider language={language}>
              <ReactQueryClientProvider>
                <BackgroundBlobs />
                <SessionProvider user={user} token={token}>
                  <ActiveSectionContextProvider>
                    <main className="min-h-[100vh]">{children}</main>
                    <Footer />
                  </ActiveSectionContextProvider>
                </SessionProvider>
                <ToastProvider />
                <SpeedInsights />
              </ReactQueryClientProvider>
            </I18nProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
