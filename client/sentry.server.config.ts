// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://df8a197f3764b2cce4848c4012bcd832@o4510302881775616.ingest.de.sentry.io/4510302884069456",

  // Only the deployed app reports. Local runs used to flood the real project with traces and
  // replays, and in dev every browser report went through the /monitoring tunnel, which made
  // Next 16 log MaxListenersExceededWarning. NEXT_PUBLIC_SENTRY_ENABLED=true turns it on locally
  enabled:
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // No PII: request cookies and headers carry the Supabase session, IPs identify people
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
