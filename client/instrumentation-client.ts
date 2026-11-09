// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { dataCollection } from "./sentry.data-collection";

Sentry.init({
  dsn: "https://df8a197f3764b2cce4848c4012bcd832@o4510302881775616.ingest.de.sentry.io/4510302884069456",

  // Only the deployed app reports. Local runs used to flood the real project with traces and
  // replays, and in dev every browser report went through the /monitoring tunnel, which made
  // Next 16 log MaxListenersExceededWarning. NEXT_PUBLIC_SENTRY_ENABLED=true turns it on locally
  enabled:
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",

  // A fifth of page loads is enough to see trends; every trace costs the browser work and quota
  tracesSampleRate: 0.2,

  // Which sessions are recorded is decided before Replay is even downloaded, see loadReplay
  replaysSessionSampleRate: 1.0,

  // No replays "on error": they need the recorder running in the background of every session,
  // watching every change of the page. Translation extensions change it on each selected word,
  // and the page froze for seconds while the recorder caught up
  replaysOnErrorSampleRate: 0,

  // No PII, see sentry.data-collection.ts
  dataCollection,
});

// Replay is the heaviest part of the SDK: rrweb snapshots the page and watches every change. Only a
// small share of desktop sessions get it at all, the rest never download it. On phones it held the
// first seconds of each page, so they go without it; desktops load it once the page is idle
const REPLAY_SHARE = 0.05;

const loadReplay = () => {
  if (window.matchMedia("(pointer: coarse)").matches || Math.random() >= REPLAY_SHARE) return;

  const whenIdle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 3000));
  whenIdle(() => {
    import("./sentry.replay")
      .then(({ replay }) => Sentry.addIntegration(replay()))
      .catch(() => {
        // Without replays errors are still reported
      });
  });
};

// Only when Sentry reports at all (the deployed site), never in local development
if (typeof window !== "undefined" && Sentry.getClient()?.getOptions().enabled) loadReplay();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;