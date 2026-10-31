"use client";

import { FC, useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LuCookie } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import {
  AnalyticsConsent,
  analyticsPath,
  clearAnalyticsCookies,
  GA_MEASUREMENT_ID,
  onConsentChange,
  OPEN_CONSENT_EVENT,
  readConsent,
  writeConsent,
} from "@/shared/lib/analytics";

// Where the visitor came from, without query strings; our own pages lose their share tokens
const cleanReferrer = (origin: string) => {
  try {
    if (!document.referrer) return undefined;
    const referrer = new URL(document.referrer);
    return referrer.origin === origin
      ? `${origin}${analyticsPath(referrer.pathname)}`
      : `${referrer.origin}${referrer.pathname}`;
  } catch {
    return undefined;
  }
};

// Loads Google Analytics after consent, sends a page view per route and asks once.
// Without NEXT_PUBLIC_GA_MEASUREMENT_ID it renders nothing at all
// The saved choice lives in the browser: unknown (undefined) on the server and while hydrating,
// null when the visitor hasn't chosen yet
const subscribeToConsent = (onChange: () => void) => onConsentChange(onChange);
const serverConsent = () => undefined;

export const Analytics: FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const consent = useSyncExternalStore<AnalyticsConsent | null | undefined>(
    subscribeToConsent,
    readConsent,
    serverConsent,
  );
  // Opened again from the footer after a choice was made
  const [reopened, setReopened] = useState(false);
  const asking = consent === null || reopened;

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    // Leftovers from a time the visitor still allowed it
    if (readConsent() === "denied") clearAnalyticsCookies();

    const open = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  // Page views by hand: the automatic ones would carry query strings and share tokens. "set" makes
  // the clean address the default for every later hit too (engagement, scrolls), not only this one
  useEffect(() => {
    if (consent !== "granted" || !pathname) return;
    const origin = window.location.origin;
    const path = analyticsPath(pathname);

    window.gtag?.("set", {
      page_path: path,
      page_location: `${origin}${path}`,
      page_title: path.startsWith("/share/") ? "Studytracker | Shared material" : document.title,
      page_referrer: cleanReferrer(origin),
    });
    window.gtag?.("event", "page_view");
  }, [consent, pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  const choose = (choice: AnalyticsConsent) => {
    const wasGranted = consent === "granted";
    writeConsent(choice);
    setReopened(false);
    // A loaded script can't be taken back: it is told to stop writing first (it would set its
    // cookie again while the page closes), then its cookies go and the page starts clean
    if (choice === "denied" && wasGranted) {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      clearAnalyticsCookies();
      window.location.reload();
    }
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="ga-setup" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());
gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
          <Script
            id="ga-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
        </>
      )}

      <AnimatePresence>
        {asking && (
          <motion.div
            role="dialog"
            aria-label={t("consent.title")}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl sm:inset-x-6 sm:bottom-6 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <LuCookie aria-hidden />
              </span>
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-semibold">{t("consent.title")}</p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {t("consent.text")}{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white">
                    {t("consent.more")}
                  </Link>
                </p>
              </div>
            </div>
            {/* Saying no is as easy as saying yes */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                {t("consent.decline")}
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {t("consent.accept")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
