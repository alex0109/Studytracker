"use client";

import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { LuArrowLeftRight, LuLoaderCircle, LuSettings2 } from "react-icons/lu";
import { Button, toast } from "@/shared/radix-ui";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { createPortal } from "@/entities/billing";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";

// Stripe's own page: card, invoices, cancelling; with changePlan it opens on switching between Plus and Duo
export const useSubscriptionPortal = () => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSession();
  const { leaving, leave } = useLeavingPage();

  const portal = useMutation({
    mutationFn: (changePlan: boolean) => createPortal(token, i18n.language, changePlan),
    onSuccess: ({ url }) => {
      if (url.startsWith("https://")) leave(url, true);
    },
    onError: (error) => {
      logExceptionError(error, { section: "billing/portal", userID: user?.id });
      toast({ title: `❌${t("billing.portalError")}`, variant: "error" });
    },
  });

  return {
    openPortal: (changePlan = false) => portal.mutate(changePlan),
    portalPending: portal.isPending || !!leaving,
    // Which of the two buttons is waiting
    pendingChangePlan: portal.variables === true,
  };
};

interface ManageSubscriptionButtonsProps {
  // A plan that ends with its period is renewed in the portal before it can be switched
  canChangePlan: boolean;
}

export const ManageSubscriptionButtons: FC<ManageSubscriptionButtonsProps> = ({ canChangePlan }) => {
  const { t } = useTranslation();
  const { openPortal, portalPending, pendingChangePlan } = useSubscriptionPortal();
  const spinner = <LuLoaderCircle aria-hidden className="animate-spin" />;

  return (
    <>
      {canChangePlan && (
        <Button size="lg" onClick={() => openPortal(true)} disabled={portalPending}>
          {portalPending && pendingChangePlan ? spinner : <LuArrowLeftRight aria-hidden />}
          {t("billing.changePlan")}
        </Button>
      )}
      <Button variant="outline" size="lg" onClick={() => openPortal()} disabled={portalPending}>
        {portalPending && !pendingChangePlan ? spinner : <LuSettings2 aria-hidden />}
        {t("billing.manage")}
      </Button>
    </>
  );
};
