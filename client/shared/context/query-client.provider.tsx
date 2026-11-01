"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// A 4xx answer is the same on a second try (not found, no access, a limit): only network errors,
// server failures, timeouts and rate limits are tried again, once
const retryOnce = (failureCount: number, error: unknown) => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status !== undefined && status >= 400 && status < 500 && status !== 408 && status !== 429) return false;
  return failureCount < 1;
};

const ReactQueryClientProvider = ({ children }: { children: ReactNode }) => {
  // One client for the whole visit: created in render, it was rebuilt with an empty cache
  // every time the provider re-rendered
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: retryOnce,
            // Changes invalidate their queries, so data is fresh for a while: switching
            // tabs or windows doesn't refetch everything on the page
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryClientProvider;
