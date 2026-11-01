import * as Sentry from "@sentry/react";
import { isAxiosError } from "axios";

// Answers the app expects and explains to the user: not signed in, no access, not found, a conflict,
// nothing to generate, a limit or quota. Reporting them buried real failures in Sentry
const EXPECTED_STATUSES = new Set([401, 403, 404, 409, 422, 429]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logExceptionError(err: unknown, context?: Record<string, any>) {
  if (isAxiosError(err) && err.response && EXPECTED_STATUSES.has(err.response.status)) return;

  Sentry.captureException(err, {
    tags: { appSection: context?.section ?? "unknown" },
    extra: context,
  });
}
