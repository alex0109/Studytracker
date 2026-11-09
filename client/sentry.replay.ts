import { replayIntegration } from "@sentry/nextjs";

// Its own module, imported on demand: Replay and rrweb stay out of the first scripts of a page
// Replays never show what people typed or wrote in their notes. A page that changes thousands of
// times (an extension rewriting it, a long list re-rendering) stops the recording instead of the page
export const replay = () =>
  replayIntegration({
    maskAllText: true,
    maskAllInputs: true,
    blockAllMedia: true,
    mutationBreadcrumbLimit: 500,
    mutationLimit: 2000,
  });
