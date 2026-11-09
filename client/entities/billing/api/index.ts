import axios from "axios";
import {
  BillingIntervalName,
  BillingPlanName,
  IBillingPlans,
  IBillingStatus,
  IDuoInvite,
  IDuoInvitePreview,
  IDuoStatus,
} from "../model";

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

export const getDuoStatus = async (token: string | undefined): Promise<IDuoStatus> =>
  (await axios.get(`${base()}/duo`, auth(token))).data;

export const createDuoInvite = async (token: string | undefined): Promise<IDuoInvite> =>
  (await axios.post(`${base()}/duo/invite`, null, auth(token))).data;

export const cancelDuoInvite = async (token: string | undefined) => {
  await axios.delete(`${base()}/duo/invite`, auth(token));
};

export const removeDuoMember = async (token: string | undefined) => {
  await axios.delete(`${base()}/duo/member`, auth(token));
};

// The invite's token goes in the body, never in a request address
export const previewDuoInvite = async (token: string | undefined, invite: string): Promise<IDuoInvitePreview> =>
  (await axios.post(`${base()}/duo/preview`, { token: invite }, auth(token))).data;

export const joinDuo = async (token: string | undefined, invite: string) => {
  await axios.post(`${base()}/duo/join`, { token: invite }, auth(token));
};

export const leaveDuo = async (token: string | undefined) => {
  await axios.post(`${base()}/duo/leave`, null, auth(token));
};
