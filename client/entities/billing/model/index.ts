// Pro is no longer sold, only granted by hand
export type SubscriptionTierName = "Free" | "Plus" | "Pro" | "Duo";
export type SubscriptionStatusName = "Active" | "Trialing" | "PastDue" | "Canceled" | "Expired";
export type BillingPlanName = "Plus" | "Duo";
export type BillingIntervalName = "Month" | "Year";

// The plan as the server sees it; `tier` is what is in force right now
export interface IBillingStatus {
  tier: SubscriptionTierName;
  planTier: SubscriptionTierName | null;
  status: SubscriptionStatusName | null;
  provider: "Manual" | "Paddle" | "LemonSqueezy" | "Stripe" | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  // A payment provider is set up, so an upgrade can be offered
  checkoutAvailable: boolean;
  // A paid plan the provider's portal can manage: card, invoices, cancelling
  canManage: boolean;
}

// Amount is in the smallest unit of the currency (øre, cents), as Stripe keeps it
export interface IBillingPrice {
  interval: BillingIntervalName;
  amount: number;
  currency: string;
  // The same price in every currency set on it in Stripe, its own included
  amounts?: Record<string, number>;
}

// null means no limit
export interface ITierLimits {
  materials: number | null;
  tags: number | null;
  questionsPerMaterial: number | null;
  notesPerMaterial: number | null;
  dictionariesPerMaterial: number | null;
  entriesPerDictionary: number | null;
  libraryImports: number | null;
}

export interface IBillingPlan {
  tier: SubscriptionTierName;
  prices: IBillingPrice[];
  limits: ITierLimits;
  aiPerMonth: Record<string, number>;
}

export type DuoRoleName = "None" | "Owner" | "Member";

// active: the payer's Duo is in force, so the member has the plan now.
// Each side sees the other person's email
export interface IDuoStatus {
  role: DuoRoleName;
  active: boolean;
  canInvite: boolean;
  inviteExpiresAt: string | null;
  memberEmail: string | null;
  joinedAt: string | null;
  ownerEmail: string | null;
}

// The token is shown this once; the link is built from it here
export interface IDuoInvite {
  token: string;
  expiresAt: string;
}

export interface IDuoInvitePreview {
  ownerEmail: string | null;
  isOwn: boolean;
}

export interface IBillingPlans {
  // Prices came from the provider, so a plan can be bought
  checkoutAvailable: boolean;
  plans: IBillingPlan[];
}
