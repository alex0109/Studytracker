"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { getBillingPlans, getBillingStatus, getCreditHistory, getCreditPricing, getCreditWallet, getDuoStatus } from "../api";
import { IBillingPlans, IBillingStatus, ICreditHistory, ICreditPricing, ICreditWallet, IDuoStatus } from "../model";

export const billingKeys = {
  status: () => ["billing", "status"] as const,
  plans: () => ["billing", "plans"] as const,
  duo: () => ["billing", "duo"] as const,
  creditPricing: () => ["billing", "credits", "pricing"] as const,
  creditWallet: () => ["billing", "credits", "wallet"] as const,
  creditHistory: (page: number) => ["billing", "credits", "history", page] as const,
};

// pollEvery: asked again on a timer, while a paid plan is being switched on
export const useBillingStatus = ({ pollEvery }: { pollEvery?: number } = {}) => {
  const { token, user } = useSession();

  const status = useQuery<IBillingStatus, Error>({
    queryKey: billingKeys.status(),
    queryFn: () => getBillingStatus(token),
    enabled: !!token,
    staleTime: 60_000,
    refetchInterval: pollEvery ?? false,
  });

  useEffect(() => {
    if (status.error) logExceptionError(status.error, { section: "billing/status", userID: user?.id });
  }, [status.error, user?.id]);

  return { billingData: status.data };
};

export const useDuoStatus = () => {
  const { token, user } = useSession();

  const duo = useQuery<IDuoStatus, Error>({
    queryKey: billingKeys.duo(),
    queryFn: () => getDuoStatus(token),
    enabled: !!token,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (duo.error) logExceptionError(duo.error, { section: "billing/duo", userID: user?.id });
  }, [duo.error, user?.id]);

  return { duoData: duo.data };
};

// Prices change rarely and the server keeps them for an hour too
export const useBillingPlans = (enabled = true) => {
  const { user } = useSession();

  const plans = useQuery<IBillingPlans, Error>({
    queryKey: billingKeys.plans(),
    queryFn: getBillingPlans,
    enabled,
    staleTime: 60 * 60_000,
  });

  useEffect(() => {
    if (plans.error) logExceptionError(plans.error, { section: "billing/plans", userID: user?.id });
  }, [plans.error, user?.id]);

  return { plansData: plans.data };
};

// Packs and credit prices change with a deploy only
export const useCreditPricing = () => {
  const pricing = useQuery<ICreditPricing, Error>({
    queryKey: billingKeys.creditPricing(),
    queryFn: getCreditPricing,
    staleTime: 60 * 60_000,
  });
  return { creditPricing: pricing.data };
};

// pollEvery: asked again on a timer, while a bought pack is on its way from Stripe
export const useCreditWallet = ({ pollEvery }: { pollEvery?: number } = {}) => {
  const { token } = useSession();
  const wallet = useQuery<ICreditWallet, Error>({
    queryKey: billingKeys.creditWallet(),
    queryFn: () => getCreditWallet(token),
    enabled: !!token,
    staleTime: 30_000,
    refetchInterval: pollEvery ?? false,
  });
  return { creditWallet: wallet.data };
};

export const useCreditHistory = (page: number, enabled = true) => {
  const { token } = useSession();
  const history = useQuery<ICreditHistory, Error>({
    queryKey: billingKeys.creditHistory(page),
    queryFn: () => getCreditHistory(token, page),
    enabled: !!token && enabled,
    staleTime: 30_000,
  });
  return { creditHistory: history.data, creditHistoryIsPending: history.isPending };
};
