import axios from "axios";
import { BillingIntervalName, BillingPlanName, IBillingPlans, IBillingStatus } from "../model";

const base = () => `${process.env.NEXT_PUBLIC_API_HTTP}/billing`;
const auth = (token: string | undefined) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getBillingStatus = async (token: string | undefined): Promise<IBillingStatus> =>
  (await axios.get(`${base()}/status`, auth(token))).data;

// Public: prices and what each plan gives, nothing about the user
export const getBillingPlans = async (): Promise<IBillingPlans> =>
  (await axios.get(`${base()}/plans`)).data;

// The server tells the provider who pays; the browser only follows the link
export const createCheckout = async (
  token: string | undefined,
  plan: BillingPlanName,
  interval: BillingIntervalName,
  language: string,
): Promise<{ url: string }> =>
  (await axios.post(`${base()}/checkout`, { plan, interval, language }, auth(token))).data;

export const createPortal = async (token: string | undefined, language: string): Promise<{ url: string }> =>
  (await axios.post(`${base()}/portal`, { language }, auth(token))).data;
