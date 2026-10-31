import type * as Sentry from "@sentry/nextjs";

type SentryOptions = NonNullable<Parameters<typeof Sentry.init>[0]>;

// No personal data in Sentry: cookies and headers carry the Supabase session, query strings
// can hold the sign-in code, IPs and bodies identify people. SDK 11 collects all of it by
// default, so every category is switched off here and shared by the client and server configs
export const dataCollection: SentryOptions["dataCollection"] = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  stackFrameVariables: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false },
  mcp: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
};
