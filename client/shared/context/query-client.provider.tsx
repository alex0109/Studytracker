"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryClientProvider = ({ children }: { children: ReactNode }) => {
  // One client for the whole visit: created in render, it was rebuilt with an empty cache
  // every time the provider re-rendered
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
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
