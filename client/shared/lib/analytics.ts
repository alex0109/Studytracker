// Google Analytics, only after the visitor agreed. Nothing personal is sent: no user ids, emails or
// titles, and addresses lose their query strings and secret parts (share tokens)

const CONSENT_KEY = "analytics-consent";
const CONSENT_EVENT = "analytics-consent-change";
export const OPEN_CONSENT_EVENT = "analytics-consent-open";

export type AnalyticsConsent = "granted" | "denied";

// The id goes into an inline script, so it must look exactly like a GA4 measurement id
const rawId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]{4,20}$/.test(rawId) ? rawId : null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const readConsent = (): AnalyticsConsent | null => {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
};

export const writeConsent = (consent: AnalyticsConsent) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Private mode: the choice lasts for this page only
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
};

export const onConsentChange = (handler: (consent: AnalyticsConsent) => void) => {
  const listener = (event: Event) => handler((event as CustomEvent<AnalyticsConsent>).detail);
  window.addEventListener(CONSENT_EVENT, listener);
  return () => window.removeEventListener(CONSENT_EVENT, listener);
};

// Google's cookies go when the visitor changes their mind
export const clearAnalyticsCookies = () => {
  const domain = window.location.hostname.split(".").slice(-2).join(".");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const scope of ["", `; domain=${domain}`, `; domain=.${domain}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${scope}`;
    }
  }
};

// Shared links carry a secret token in the path; it must never reach a third party
export const analyticsPath = (pathname: string) =>
  pathname.replace(/^\/share\/[^/]+/, "/share/:token");

export const trackEvent = (name: string, params?: Record<string, string | number | boolean>) => {
  if (!GA_MEASUREMENT_ID || readConsent() !== "granted") return;
  window.gtag?.("event", name, params ?? {});
};
