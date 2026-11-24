"use client";

import { FC, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { billingKeys, useBillingStatus, useCreditWallet } from "@/entities/billing";
import { aiKeys } from "@/entities/ai";

const POLL_MS = 2_000;
const WAIT_MS = 60_000;

// Back from Stripe's checkout (?checkout=success or cancelled). The plan switches on when Stripe's
// webhook reaches the server, usually within seconds, so the status is asked again until it does
export const CheckoutReturn: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const result = params?.get("checkout");
  const credits = params?.get("credits");
  const [slow, setSlow] = useState(false);
  const waiting = result === "success" && !slow;
  const { billingData } = useBillingStatus({ pollEvery: waiting ? POLL_MS : undefined });
  // One message per return, also when effects run twice in development
  const announced = useRef(false);

  // A bought pack arrives with the webhook too: the balance is asked again until it grows
  const waitingCredits = credits === "success" && !slow;
  const { creditWallet } = useCreditWallet({ pollEvery: waitingCredits ? POLL_MS : undefined });
  const [startBalance, setStartBalance] = useState<number | null>(null);
  if (credits === "success" && startBalance === null && creditWallet) setStartBalance(creditWallet.balance);
  const creditsArrived = credits === "success" && !!creditWallet && startBalance !== null && creditWallet.balance > startBalance;

  useEffect(() => {
    if (announced.current || !credits) return;
    if (credits === "cancelled") {
      announced.current = true;
      toast({ title: t("credits.cancelled") });
    } else if (creditsArrived) {
      announced.current = true;
      toast({ title: `✨${t("credits.added")}`, variant: "success" });
      queryClient.invalidateQueries({ queryKey: billingKeys.creditHistory(1) });
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    } else {
      return;
    }
    router.replace(pathname ?? "/limits", { scroll: false });
  }, [credits, creditsArrived, queryClient, router, pathname, t]);

  // The provider's customer appears with the webhook, a hand-made plan doesn't count
  const activated = result === "success" && !!billingData?.canManage && billingData.tier !== "Free";
  const activatedTier = activated ? billingData.tier : null;

  useEffect(() => {
    if (announced.current) return;

    if (result === "cancelled") {
      announced.current = true;
      toast({ title: t("billing.checkoutCancelled") });
    } else if (activatedTier) {
      announced.current = true;
      toast({ title: t("billing.activated", { plan: activatedTier }), variant: "success" });
      // The new plan brings its own AI quotas
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    } else {
      return;
    }

    // The address loses ?checkout=, so a reload doesn't repeat the message
    router.replace(pathname ?? "/limits", { scroll: false });
  }, [result, activatedTier, queryClient, router, pathname, t]);

  useEffect(() => {
    if (!waiting && !waitingCredits) return;
    const timer = setTimeout(() => setSlow(true), WAIT_MS);
    return () => clearTimeout(timer);
  }, [waiting, waitingCredits]);

  // After a minute the banner goes: the balance shows the credits once they are there
  const pendingCredits = credits === "success" && !creditsArrived && !slow;
  if ((result !== "success" || activated) && !pendingCredits) return null;

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
    >
      {!slow && <LuLoaderCircle aria-hidden className="size-4 shrink-0 animate-spin" />}
      <p>{pendingCredits ? t("credits.arriving") : t(slow ? "billing.activationSlow" : "billing.activating")}</p>
    </motion.div>
  );
};
