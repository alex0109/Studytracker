"use client";

import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle, LuSettings2 } from "react-icons/lu";
import { Button, toast } from "@/shared/radix-ui";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { useTranslation } from "@/shared/i18n";
import { createPortal } from "@/entities/billing";
import { useLeavingPage } from "@/shared/lib/use-leaving-page";

// Stripe's own page: card, invoices, switching between Plus and Duo, cancelling
export const useSubscriptionPortal = () => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSession();
  const { leaving, leave } = useLeavingPage();

  const portal = useMutation({
    mutationFn: () => createPortal(token, i18n.language),
    onSuccess: ({ url }) => {
      if (url.startsWith("https://")) leave(url, true);
    },
    onError: (error) => {
      logExceptionError(error, { section: "billing/portal", userID: user?.id });
      toast({ title: `❌${t("billing.portalError")}`, variant: "error" });
    },
  });

  return { openPortal: () => portal.mutate(), portalPending: portal.isPending || !!leaving };
};

export const ManageSubscriptionButton: FC = () => {
  const { t } = useTranslation();
  const { openPortal, portalPending } = useSubscriptionPortal();

  return (
    <Button variant="outline" size="lg" onClick={openPortal} disabled={portalPending}>
      {portalPending ? <LuLoaderCircle aria-hidden className="animate-spin" /> : <LuSettings2 aria-hidden />}
      {t("billing.manage")}
    </Button>
  );
};
