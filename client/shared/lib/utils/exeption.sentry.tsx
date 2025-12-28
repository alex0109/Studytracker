import * as Sentry from "@sentry/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logExceptionError(err: unknown, context?: Record<string, any>) {
  Sentry.captureException(err, {
    tags: { appSection: context?.section ?? "unknown" },
    extra: context,
  });
}
