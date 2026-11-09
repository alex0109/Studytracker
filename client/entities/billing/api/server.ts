import { IBillingPlans } from "../model";

const API = process.env.NEXT_PUBLIC_API_HTTP;
// Prices change rarely, and the API keeps them for an hour too
const REVALIDATE_SECONDS = 3600;
const TIMEOUT_MS = 5_000;

// Public plans and prices for pages rendered on the server; null when the API can't be reached
export const fetchBillingPlans = async (): Promise<IBillingPlans | null> => {
  try {
    const res = await fetch(`${API}/billing/plans`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return res.ok ? ((await res.json()) as IBillingPlans) : null;
  } catch {
    return null;
  }
};
