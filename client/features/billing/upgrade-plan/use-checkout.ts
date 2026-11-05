"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "@/shared/radix-ui";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { useTranslation } from "@/shared/i18n";
import { BillingIntervalName, BillingPlanName, createCheckout } from "@/entities/billing";
import { trackEvent } from "@/shared/lib";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";

// Opens the provider's checkout; the plan changes when its webhook arrives
export const useCheckout = () => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSession();
  const { leaving, leave } = useLeavingPage<BillingPlanName>();

  const checkout = useMutation({
    mutationFn: ({ plan, interval }: { plan: BillingPlanName; interval: BillingIntervalName }) =>
      createCheckout(token, plan, interval, i18n.language),
    onSuccess: ({ url }, { plan, interval }) => {
      trackEvent("begin_checkout", { plan, interval });
      // Only the provider's secure page, never a link of another kind
      if (url.startsWith("https://")) leave(url, plan);
    },
    onError: (error) => {
      // A plan is running already: it is changed in the portal, not bought twice
      if (isAxiosError(error) && error.response?.status === 409) {
        toast({ title: t("billing.alreadyPaid"), variant: "error" });
        return;
      }
      logExceptionError(error, { section: "billing/checkout", userID: user?.id });
      toast({ title: `❌${t("billing.checkoutError")}`, variant: "error" });
    },
  });

  return {
    startCheckout: checkout.mutate,
    // The card that waits for Stripe shows a spinner, the others are locked
    checkoutPlan: checkout.isPending ? checkout.variables?.plan : leaving,
    checkoutIsPending: checkout.isPending || !!leaving,
  };
};
