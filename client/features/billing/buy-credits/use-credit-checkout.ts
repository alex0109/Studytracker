"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/shared/radix-ui";
import { useSession } from "@/shared/context";
import { logExceptionError, trackEvent } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { createCreditCheckout } from "@/entities/billing";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";

// Opens Stripe's page for a credit pack; the credits arrive with its webhook
export const useCreditCheckout = () => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSession();
  const { leaving, leave } = useLeavingPage<string>();

  const checkout = useMutation({
    mutationFn: (packId: string) => createCreditCheckout(token, packId, i18n.language),
    onSuccess: ({ url }, packId) => {
      trackEvent("begin_checkout", { plan: `credits-${packId}` });
      if (url.startsWith("https://")) leave(url, packId);
    },
    onError: (error) => {
      logExceptionError(error, { section: "billing/credits-checkout", userID: user?.id });
      toast({ title: `❌${t("credits.checkoutError")}`, variant: "error" });
    },
  });

  return {
    buyPack: checkout.mutate,
    // The pack that waits for Stripe shows a spinner, the others are locked
    buyingPack: checkout.isPending ? checkout.variables : leaving,
  };
};
