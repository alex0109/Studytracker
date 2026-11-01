import { replayIntegration } from "@sentry/nextjs";

// Its own module, imported on demand: Replay and rrweb stay out of the first scripts of a page
// Replays never show what people typed or wrote in their notes
export const replay = () => replayIntegration({ maskAllText: true, maskAllInputs: true, blockAllMedia: true });
