import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV !== "production";

const originOf = (value: string | undefined) => {
  try {
    return value ? new URL(value).origin : "";
  } catch {
    return "";
  }
};

const apiOrigin = originOf(process.env.NEXT_PUBLIC_API_HTTP);
const supabaseOrigin = originOf(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Next renders inline scripts for hydration, so scripts can't be nonce-only without making
// every page dynamic. The policy still blocks foreign scripts, plugins, framing, <base> tricks
// and sending data anywhere except our API, Supabase and Sentry (tunnelled through /monitoring)
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Notes can hold images from any https site; avatars come from Google
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    apiOrigin,
    supabaseOrigin,
    supabaseOrigin.replace(/^http/, "ws"),
    "https://va.vercel-scripts.com",
    // Google Analytics, loaded only after consent
    "https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    isDev ? "ws://localhost:* http://localhost:*" : "",
  ]
    .filter(Boolean)
    .join(" "),
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

// The app folder is the root: a lockfile higher up (yarn.lock in the home folder) made Next guess
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "reybey-org",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // The proxy's matcher leaves this route out (see proxy.ts), so error reports skip the session check
  tunnelRoute: "/monitoring",

  // Production builds use webpack (next build --webpack), these options apply there
  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
});
